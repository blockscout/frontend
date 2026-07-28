# Link the API nav item to the Dev Portal on Pro API instances

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3569 |
| Status | `done` |
| Size | `small` |
| Feature branch | `issue-3569` (set on first `implement-task` run) |
| PM | Nikita S. (issue author) |
| Designer | — |
| Backend | — |
| Slack channel | — (default routing per `to-spec`) |

## Context & goal

Follow-up to [#3476](https://github.com/blockscout/frontend/pull/3476), which added a `pro_api` promo tab to
the API documentation page. Hosted Pro-API instances are configured with `NEXT_PUBLIC_API_DOCS_TABS=['pro_api']`
(set in the common helm template of `deployment-values`), so `/api-docs` is a single promo screen whose only
action is a link to the dev portal — an extra hop between the user and the portal.

Target state: those instances pass **no** API-docs env vars at all, and the app derives the behavior from the
auto-detected `NEXT_PUBLIC_PRO_API_SUPPORTED` flag — the "API" nav item links straight to the dev portal and
the internal page is gone. The promo tab is removed along with it: one funnel to the dev portal instead of two
keeps the mental model simple, and chains outside the Pro API keep their regular set of documentation tabs by
default. The same principle applies to the API-keys deprecation notice, injected today per
instance through env vars: it becomes a built-in default that the existing env var can still override, and the
"Add API key" button visibility stops being env-driven.

## Functional requirements

1. `NEXT_PUBLIC_PRO_API_SUPPORTED` is exposed once as `config.chain.isProApiSupported` (chain capability,
   parallel to the existing `isTestnet`); the api-docs config, the account config and the navigation all read
   that, and no other module reads the env var directly.
2. The `pro_api` tab is gone — the promo screen it held existed only to funnel users to the dev portal, which
   the nav link now does directly. `API_DOCS_TABS` lists only the four real documentation tabs, and chains
   outside the Pro API get all of them by default.
3. The API docs feature resolves to one of three states:

   | Pro API supported | `NEXT_PUBLIC_API_DOCS_TABS` | Nav "API" item | `/api-docs` |
   | --- | --- | --- | --- |
   | `true` | unset | external link → dev portal | 404 |
   | `true` | non-empty | internal, tabs as configured | renders |
   | `true` | `[]` | none | 404 |
   | `false` | unset | internal (all four tabs) | renders |
   | `false` | `[]` | none | 404 |

   An explicitly set `NEXT_PUBLIC_API_DOCS_TABS` always wins — the flag only changes the default. An explicit
   empty array keeps its documented meaning ("disable the feature"), so it produces no nav item at all.
   A leftover `['pro_api']` value (what the common helm template ships today) fails schema validation at
   startup — `NEXT_PUBLIC_API_DOCS_TABS[0] must be one of the following values: rest_api, eth_rpc_api,
   rpc_api, graphql_api` — so the misconfiguration is loud rather than a silently missing nav item, and no
   extra guard is needed.
4. The external nav item keeps the text "API" and the `navigation/api_docs` icon; the external arrow comes from
   `NavLink`'s `external` prop. URL: `https://dev.blockscout.com/?utm_source=blockscout&utm_medium=navigation`
   (confirmed by the PM — see **Q1**).
5. The API docs page no longer renders a custom alert; `NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE` stops having any
   effect.
6. On the API keys page, the "Add API key" button and the page description are driven by
   `config.chain.isProApiSupported`:

   | Pro API supported | Button | Description |
   | --- | --- | --- |
   | `true` | none | "Blockscout APIs require a key. Create a **free PRO API key**…" (existing copy) |
   | `false` | "Add API key" (modal, existing 3-key limit) | existing RPC/EthRPC copy |

   The URL-string mode of the button (link instead of modal) is dropped — no hosted instance uses it, and the
   dev-portal funnel is covered by the description link and the alert.
7. The API keys page alert resolves as `NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE ?? (isProApiSupported ? DEFAULT : undefined)`
   — the flag supplies the default text, an explicit env value always wins and still works on any chain. The
   default is the string DevOps ships today
   ([deployment-values#603](https://github.com/blockscout/deployment-values/pull/603)), kept verbatim as an HTML
   constant so both paths render through `AlertWithExternalHtml`:

   ```html
   <b>Deprecation Notice:</b> Chain-specific API keys are deprecated.<br>Please migrate to the <a href="https://dev.blockscout.com/?utm_source=blockscout_account" target="_blank">Blockscout PRO API</a> for multichain access.
   ```

## Data & API

No API changes. Env vars:

| Variable | Change |
| --- | --- |
| `NEXT_PUBLIC_PRO_API_SUPPORTED` | Unchanged (auto-set by `deploy/scripts/export_pro_api_flag.sh`); now also gates the nav link, the API-keys button and the API-keys alert default. |
| `NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON` | **Removed immediately** (`deprecate-env-var` Branch A) — behavior derived from the Pro API flag. |
| `NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE` | **Accepted but inert** — app stops reading it now; it stays in the schema and in `docs/ENVS.md` with a deprecation note plus a non-fatal startup warning, and is removed for good in a later release. It lives in the *common* helm template, so an immediate removal would break every hosted instance's startup before DevOps merges. |
| `NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE` | Kept; docs row rewritten as an override of the built-in Pro-API notice. |
| `NEXT_PUBLIC_API_DOCS_TABS` | Kept, but the `pro_api` tab id is gone from the accepted values, so a leftover `['pro_api']` fails schema validation at startup; docs row rewritten for the new default behavior. Also added to `deprecatedEnvs` in `tools/dev-server/envs-rules.json` so local and preset runs exercise the default path instead of the fetched instance's `['pro_api']`. |

**DevOps coordination** — the target state requires `deployment-values` to stop passing these. Tracked in
[a comment on the issue](https://github.com/blockscout/frontend/issues/3569#issuecomment-5094611356):

- `NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON` — set per instance (44 files at spec time); must be dropped **before
  this release ships**, or those instances fail container startup.
- `NEXT_PUBLIC_API_DOCS_TABS` — common template (`['pro_api']`); must be dropped **before this release ships**:
  the `pro_api` value is no longer accepted, so instances still passing it fail container startup.
- `NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE` — common template; before the follow-up release that removes it for good.
- `NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE` — now duplicates the built-in default.

## UI inventory

- Main navigation ([`src/shell/navigation/useNavItems.tsx:317`](../../../src/shell/navigation/useNavItems.tsx)) —
  the "API" item becomes an external link in external mode. `NavItemExternal`
  ([`src/shell/navigation/types.ts:23`](../../../src/shell/navigation/types.ts)) has no icon field today and
  must accept one; `NavLink` already renders external items with the external arrow.
- `/api-docs` route — guarded by `features.apiDocs.isEnabled`
  ([`src/server/getServerSideProps/guards.ts:74`](../../../src/server/getServerSideProps/guards.ts)); the guard
  must also 404 in external mode. The alert at
  [`src/features/api-docs/pages/index/ApiDocs.tsx:36`](../../../src/features/api-docs/pages/index/ApiDocs.tsx)
  is deleted.
- Sitemap ([`deploy/tools/sitemap-generator/next-sitemap.config.js`](../../../deploy/tools/sitemap-generator/next-sitemap.config.js))
  — the `/api-docs` exclusion must match the guard, so it also drops the route in external mode.
- `/account/api-key` ([`src/features/account/pages/api-keys/ApiKeys.tsx`](../../../src/features/account/pages/api-keys/ApiKeys.tsx))
  — description (`:69`), alert (`:113`) and button (`:117`) stop reading `feature.apiKeys.button`.
- No mockups: no new visual surface — the nav item reuses `NavLink`, the alert reuses `AlertWithExternalHtml`.
  A top-level external item is new in the main nav, though, so its presentation needs a styling pass (step 7).
- No screenshot baselines change: `playwright/envs.js` sets none of these variables, so component tests run the
  non-Pro-API path.

## Out of scope

- Aligning the UTM params of the other hardcoded dev-portal links (footer, API-keys alert) — per-placement UTM
  sources are intentional.
- The final removal of `NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE` (schema, docs row, startup warning) — a later
  release, after DevOps cleans the common template.
- Analytics: no Mixpanel event for the external nav item (no nav link emits one today; UTM covers attribution).
- Unit tests for the config modules: they read env at import time and there is no precedent for testing them.
- Demo deploy.

## Task breakdown

- [x] 1 `[agent]` Add `isProApiSupported` to `src/slices/chain/config.ts` and make it the only reader of
  `NEXT_PUBLIC_PRO_API_SUPPORTED`. — Done: flag added next to `isTestnet`; `src/features/api-docs/config.ts`
  now reads `chain.isProApiSupported`.
- [x] 2 `[agent]` Rework the api-docs feature config to the discriminated payload
  `{ mode: 'internal'; tabs } | { mode: 'external'; url }` (external iff `isProApiSupported` and the tabs env is
  unset), 404 `/api-docs` in external mode in `guards.apiDocs`, and delete the alert render plus the
  `alertMessage` config field. — Done: `src/features/api-docs/config.ts`, `guards.ts`, `ApiDocs.tsx`.
- [x] 3 `[agent]` Render the external "API" nav item from the new payload — widen `NavItemExternal` with the
  icon field, keep text "API" and the `navigation/api_docs` icon. — questions: Q1 (`resolved`) — Done:
  `useNavItems.tsx`, `types.ts`; verified on the staging
  preset (external link with icon, `/api-docs` → 404).
- [x] 4 `[agent]` Drive the API keys page from `isProApiSupported`: button visibility, description variant, and
  the alert default text as an HTML constant overridable by `NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE`; drop the
  `apiKeys.button` config field. — Done: `src/features/account/config.ts`, `ApiKeys.tsx`.
- [x] 5 `[agent]` Env paperwork — skill: `deprecate-env-var`
  - inputs:
    - `NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON`: not previously deprecated → **Branch A (immediate removal)**; no
      replacement variable; `DEPRECATED_ENVS.md` comment: "Replaced with automatic behavior based on
      NEXT_PUBLIC_PRO_API_SUPPORTED."; delete the rule from
      `deploy/tools/envs-validator/schemas/features/account.ts` and the entries in `test/.env.base` and
      `test/.env.alt`; add to `deprecatedEnvs` in `tools/dev-server/envs-rules.json`; no
      `checkDeprecatedEnvs()` guard (no replacement to point at).
    - `NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE`: **grace period, phase 1, inert variant** — keep the schema rule and
      the `docs/ENVS.md` row, append "Deprecated — no longer has any effect and will be removed in the next
      release." to its description, add a non-fatal entry to `printDeprecationWarning()` in
      `deploy/tools/envs-validator/index.ts`; no throw in `checkDeprecatedEnvs()`. App-side removal happens in
      step 2.
    - Also in this step: rewrite the `docs/ENVS.md` rows for `NEXT_PUBLIC_API_DOCS_TABS` (new default behavior —
      unset on a Pro-API chain means no page and an external nav link) and `NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE`
      (override of the built-in Pro-API notice); add `NEXT_PUBLIC_API_DOCS_TABS` to `deprecatedEnvs` in
      `tools/dev-server/envs-rules.json`; label the PR `ENVs`; run `pnpm --filter envs-validator test`.
  - Done: docs rows moved/rewritten, schema rule and presets cleaned, warning added to
    `printDeprecationWarning()`, `envs-rules.json` + `tools/dev-server/CONTEXT.md` updated; all validator
    presets pass, and the two negative paths were checked by hand (leftover `ACCOUNT_API_KEYS_BUTTON` fails
    the congruity check, `API_DOCS_ALERT_MESSAGE` only warns).
- [x] 6 `[agent]` Drop the `pro_api` tab: remove the id from `API_DOCS_TABS`, delete `ProApi.tsx` and its
  `public/static/api-docs/pro_api_*.svg` assets, and default to all four tabs — the schema enum rejects a
  leftover `['pro_api']` on its own. Also point the llms.txt generator at
  `config.chain.isProApiSupported`. — Done: scope simplification agreed with the PM on 2026-07-28.
- [x] 7 `[human]` Style the top-level external nav item — the first-level "API" link's presentation is off with
  the external arrow; adjust in `src/shell/navigation/{vertical,horizontal,mobile}` as needed.
- [x] 8 `[human]` Before the release: confirm DevOps dropped the variables listed under "DevOps coordination"
  from `deployment-values` — `NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON` and `NEXT_PUBLIC_API_DOCS_TABS` are hard
  startup failures otherwise.

## Open questions

### Q1 — Dev-portal URL and UTM params for the "API" nav link

Which UTM params should the external nav item carry? Proposed to the PM:
`?utm_source=blockscout&utm_medium=navigation`, mirroring the Pro API tab's
`?utm_source=blockscout&utm_medium=api-docs`. Per-placement UTM sources are fine — no unification of the other
dev-portal links (footer, API-keys alert) is being requested.

- Owner: PM (Nikita S.)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785173435214949
- Answer: 2026-07-28 — approved as proposed: `https://dev.blockscout.com/?utm_source=blockscout&utm_medium=navigation`.
  The other dev-portal links keep their own UTM sources.
