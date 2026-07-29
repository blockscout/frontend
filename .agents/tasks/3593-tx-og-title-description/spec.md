# Generate transaction OG title and description from transaction details

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3593 |
| PR | https://github.com/blockscout/frontend/pull/3596 (draft) |
| Status | `in progress` |
| Size | `medium` |
| Feature branch | `issue-3593` |
| PM | Ulyana (task author) |
| Designer | — (no mockups; the deliverable is two text templates) |
| Backend | — (both endpoints already deployed to production) |
| Slack channel | — (default routing per `to-spec`) |

## Context & goal

A shared link to a transaction page currently produces a near-useless social preview: the OG title carries
the **full** 66-character hash and there is no `og:description` at all, so Telegram/X fall back to the
generic page description ("… detailed transaction info. View transaction status, block confirmation, gas
fee …"). Verified live with a `Twitterbot` user agent against a production instance — the `/tx/[hash]`
entry in `src/shell/metadata/templates/index.ts` has no `og` key, so `generate()` emits `og:title` = the
page title and nothing else.

The task makes the preview describe the actual transaction:

```text
{chain_name} transaction {tx_hash_short} | Blockscout
{status} · {tx_action} · {timestamp}
```

The action must read the same as the transaction details page subheading, including its fallback chain and
its amount rounding. Reaching that requires two structural changes: the `og` block in the template map
becomes a real template layer with `default`/`enhanced` variants (today `og.description` is passed through
raw, never compiled), and `/tx/[hash]`'s `getServerSideProps` gains a bot-gated server-side fetch, since
crawlers don't run JS and `metadata.update()` only ever touches `<title>` and `<meta description>`.

## Functional requirements

- **OG title** — `%chain_name% transaction %hash_short%` plus the ` | Blockscout` postfix (still gated by
  `promoteBlockscoutInTitle`). Needs no API data, so it is served to every crawler including search engines.
  `hash_short` is `shortenString(hash, 8)` → `0xda...671a`.
- **OG description** — `%tx_status% · %tx_action% · %tx_timestamp%`, populated only for social-preview bots.
  When any part is missing it falls back to the page's `<meta description>` value.
- **The SEO tags are unchanged.** `<title>` keeps the full hash; `<meta name="description">` keeps the
  generic copy. OG title and OG description resolve independently of each other, and `generate()` receives
  no notion of bot type — the presence of `apiData` is the only signal, and `apiData` is only populated for
  social-preview bots.
- **Status** — `ok` → `Success`, `error` → `Failed`, `null` → `Pending`, `undefined` → nothing.
  `Failed` is the bare word; no revert reason is appended (the UI keeps it in a tooltip and a collapsible).
- **Timestamp** — `MMM D, YYYY H:mm UTC`, always UTC (a server-rendered tag has no user timezone).
- **Action** — mirrors `TxSubHeading`'s chain exactly:

  | condition | action text |
  | --- | --- |
  | interpretation feature off | none → fallback OG values (and `/summary` is not requested at all) |
  | feature on, summary passes `checkSummary` | the summary rendered as plain text |
  | feature on, no usable summary, has `method` + `from` + `to` | `0xab...cd called\|failed to call M on 0xef...12` |
  | feature on, no usable summary, missing any of those | none → fallback OG values |

- **All-or-nothing**, per the existing `compileValue` contract: the `enhanced` template is used only when
  every placeholder in it is truthy. Accepted loss cases — a **pending** transaction (its `timestamp` is
  `null`), an **unresolvable action**, and any **failed, timed-out, or 404** request.
- No behavior change for any other route: after the template-layer refactor, every existing route's
  `title` / `description` / `og:title` / `og:image` output is byte-identical. One deliberate exception —
  routes with no OG description template now emit `og:description` explicitly with the same text crawlers
  already inferred from `<meta name="description">`; see subtask 1's spec.

### Verification

- `curl -A Twitterbot http://localhost:3000/tx/<hash>` shows the new `og:title` / `og:description`; the same
  URL without a bot UA shows the unchanged SEO tags.
- `src/shell/metadata/__snapshots__/generate.spec.ts.snap` — existing entries unchanged, except the
  `opengraph.description` fallback introduced in subtask 1.
- Metrics need no work **in this task**, but they also don't currently work: `logRequestFromBot` and
  `fetchApi` do increment `social_preview_bot_requests_total` and `api_request_duration_seconds`, yet those
  writes happen in the SSR bundle while `/api/metrics` serves the API-route bundle's registry, so nothing is
  ever exported. Proven on the demo — see subtask 5's findings. Fixing that is its own task; this task's
  verification falls back to external sampling.
- On the demo: paste the link into Telegram and see the card. The 2 s timeouts were checked by sampling the
  instance's API directly, since `api_request_duration_seconds` never leaves the process (above) — see
  subtask 5's findings for the numbers and the ruling.

## Data & API

Both resources already exist in the registry and are deployed to production (sampled with `curl` during
grilling — no backend release to wait on, nothing to add via `add-api-resource`).

- **`core:tx`** → `/api/v2/transactions/:hash` — supplies `status` (`"ok" | "error" | null`), `timestamp`
  (`TimestampNullable` — **null on pending transactions**), and, for the fallback action branch, `method`
  (`MethodNameNullable`), `from`, `to` (`Address | null`). One request covers both needs.
- **`core:tx_interpretation`** → `/api/v2/transactions/:hash/summary` — supplies the action summary.
  Sampled shape for the issue's example transaction:

  <!-- cspell:ignore SPERPS -->

  ```json
  { "data": { "summaries": [ {
    "summary_template": "{action_type} {outgoing_amount} {outgoing_token} for {incoming_amount} {incoming_token}",
    "summary_template_variables": {
      "action_type": { "type": "string", "value": "Swap" },
      "outgoing_amount": { "type": "currency", "value": "2918443.532640630294962772" },
      "outgoing_token": { "type": "token", "value": { "symbol": "SPERPS", "…": "…" } },
      "incoming_amount": { "type": "currency", "value": "0.015575428823202624" },
      "incoming_token": { "type": "token", "value": { "symbol": "WETH", "…": "…" } }
    } } ] }, "success": true }
  ```

  Replaying the UI's rounding over that gives `Swap 2.92M SPERPS for 0.016 WETH` — matching the issue.
- Note that a plain native transfer (`method: null`) still gets a usable summary from `/summary`, so on
  instances with the interpretation feature on the action resolves nearly always.

**Fetch plan** — in `/tx/[hash]`'s `getServerSideProps`, gated on
`config.metadata.og.enhancedDataEnabled && detectBotRequest(req)?.type === 'social_preview'` **and**
`!config.features.multichain.isEnabled`. The two requests run in parallel with a **2 s** timeout each
(social-bot traffic is low per Grafana history); `/summary` is skipped entirely when
`config.features.txInterpretation.isEnabled` is false.

Why 2 s rather than the 500 ms–1 s the other routes use: both endpoints compute on the first request for a
given transaction and cache the result, and a crawler is always that first request. Measured on eth mainnet
(10 transactions × 5 calls), the cold `/summary` call averages 0.95 s and exceeds 1 s in 4 of 10 cases,
against 0.30 s for every warm repeat; `/transactions/:hash` shows the same shape with a fatter tail. The
ceiling is the crawler's own fetch timeout — unpublished, but practically single-digit seconds — and since
the two calls are parallel the worst case adds ~2 s, well inside it. Overshooting the crawler would lose the
whole card, whereas aborting only loses the enhanced description, so the budget stays deliberately short of
what the envelope allows.

**Trap to code against:** `fetchApi` returns the parsed body **regardless of HTTP status** — it logs
non-200s but still `return await response.json()`. So a bad hash yields `{ message: "Not found" }` typed as
a `TransactionResponse`. Requiring `tx_timestamp` handles that for free (an error body has no `timestamp`),
but the status mapping must distinguish `undefined` from `null`, or a 404 reads as `Pending`.

**Env var** — reuses `NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED` unchanged. It defaults to **on**
(`!== 'false'`), so this ships enabled on every instance. No new env var, so `add-env-var` is not part of
this task.

## UI inventory

No visual output — this task produces `<meta>` tags only, so the usual scaffold → style split does not
apply. Subtasks 1–4 are fully `[agent]`; subtask 5 is mixed — the agent deploys the demo, and the human
verifies that the preview genuinely works in a real social client.

- Route in scope: `/tx/[hash]` — `src/pages/tx/[hash].tsx`, template at
  `src/shell/metadata/templates/index.ts:82`.
- The action's source of truth for text and fallback order is
  `src/slices/tx/pages/details/TxSubHeading.tsx` and
  `src/features/tx-interpretation/common/components/TxInterpretation.tsx`.

## Out of scope

- **`og:image`** — text only. Its current absence is deliberate: `OG_ROOT_PAGE` is attached to list/root
  pages, and every entity detail route (address, token, block, tx) has no `og` entry. On a
  `summary_large_image` card a generic banner would push the new description below itself.
- **Multichain** `/chain/[chain_slug_or_id]/tx/[hash]` — excluded by the same `!multichain.isEnabled` guard
  the token page already uses; multichain routes resolve their API base per-chain through
  `factoryMultichain`, and the server-side `fetchApi`/`buildUrl` path isn't wired for that.
- **`/cc/tx/[hash]` and `/cross-chain-tx/[id]`** — different entities with different statuses and no
  interpretation summary; they'd need their own product decision.
- Changing the SEO `<title>` or `<meta description>` for `/tx/[hash]`.
- New env vars, Mixpanel events, design work.

## Task breakdown

- [x] 1 `[agent]` Turn the `og` block into a `default`/`enhanced` template layer → `subtasks/01-og-template-layer/`
- [x] 2 `[agent]` Share the currency rounding and render interpretation summaries as plain text → `subtasks/02-interpretation-plain-text/`
- [x] 3 `[agent]` Derive the three OG description params for a transaction → `subtasks/03-tx-og-description-params/`
- [x] 4 `[agent]` Wire the bot-gated fetch and add the `/tx/[hash]` OG templates → `subtasks/04-gssp-wiring-and-templates/`
- [ ] 5 `[agent]` + `[human]` Deploy a demo, then verify the preview manually → `subtasks/05-demo-deploy/`
  — the agent deploys and checks the tags over `curl`; the human confirms the real card in Telegram and
  rules on whether the 1 s timeouts hold (Grafana isn't agent-reachable).

## Open questions

### Q1 — What should the OG description show on Noves-provider instances?

`TxSubHeading` branches on `config.features.txInterpretation.provider === 'noves'` and renders
`core:noves_transaction`'s prose instead of the Blockscout summary. Three options:

1. **Fetch the Noves text** — matches the page. `classificationData.description` is already a finished
   sentence, so it's one extra `fetchApi` plus a trailing-dot strip; none of `createNovesSummaryObject`'s
   template machinery is needed, since that exists only so the UI can linkify tokens and addresses.
2. **Always use the `called {method} on {to}` fallback** on these instances — cheap, but the preview then
   disagrees with the page it links to.
3. **Emit no enhanced description at all** on these instances — the preview keeps the generic metadata
   description.

Weighing against option 1 in practice: **the Noves API is usually slow**, so a large share of requests would
hit the 1 s timeout anyway and land on whichever fallback we pick — meaning option 1 mostly buys option 2's
or 3's behavior at the cost of an extra request per bot hit.

- Owner: PM (Ulyana)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785255479554469 (sent 2026-07-28)
- Answer: <decision + date, once resolved>
- **Does not block any subtask.** The answer adds one branch at the front of the action chain and changes
  nothing about its structure, the status word, the timestamp, the template shape, or the gSSP gate.
  Subtask 3 is built for the Blockscout provider; Noves folds in as an additive commit whenever the
  answer arrives.

### Q2 — Why do the transaction endpoints take seconds on some instances, and can that change?

Sampling one instance's API (numbers and method in subtask 5's findings) puts `/api/v2/transactions/:hash`
at a p50 of 2.84 s with every single call over a second, and `/api/v2/transactions/:hash/summary` at a p50
of 0.84 s with a tail to 10 s — against 0.56 s and 0.95 s for the same endpoints on eth mainnet. Since the
status and the timestamp both come from the transaction endpoint, the enhanced description resolves on
roughly one bot request in three there. Raising the timeout is not a fix: crawlers wait single-digit
seconds, and a card that fails to render is worse than one with the generic description.

- Owner: Backend (Core API)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1785325326478759 (sent 2026-07-29)
- Answer: <decision + date, once resolved>
- **Blocks nothing to build, but gates the release decision.** The code is complete and degrades correctly:
  where the API is fast the preview enhances, where it isn't the card keeps today's generic description. The
  question is whether shipping in that state is acceptable or whether the endpoint latency is fixed first —
  a call for the PM once the backend team answers.
