# Wire the bot-gated fetch and add the `/tx/[hash]` OG templates

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 4 of #3593 |
| Status | `done` |
| Size | `medium` |
| Sub-branch | — (single commit on `issue-3593`) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |
| Depends on | subtasks 1 and 3 |

## Context & goal

The step that makes the feature visible: `/tx/[hash]` gets a `getServerSideProps` that fetches transaction
data for social-preview bots, and the route gets its two OG templates. Crawlers don't run JS and
`metadata.update()` only touches `<title>` and `<meta description>`, so this data has to arrive at SSR time
or not at all.

## Functional requirements

- `/tx/[hash]` gains OG templates:

  ```ts
  og: {
    title: { 'default': '%chain_name% transaction %hash_short%' },
    description: {
      enhanced: '%tx_status% · %tx_action% · %tx_timestamp%',
    },
  }
  ```

  The separator is a middle dot `·` (U+00B7) with a space either side. The OG description declares no
  `default` — it inherits the route's metadata one, which is the explicit fallback the parent spec calls
  for. The ` | Blockscout` postfix is added by `generate()`, not written into the template.
- `ApiData<'/tx/[hash]'>` is `{ tx_status: string; tx_action: string; tx_timestamp: string }`.
- `getServerSideProps` populates `apiData` only when **all** of these hold:
  `config.metadata.og.enhancedDataEnabled`, `detectBotRequest(ctx.req)?.type === 'social_preview'`,
  `!config.features.multichain.isEnabled`, and `'props' in baseResponse`.
- The two requests run in parallel, **2 s** timeout each (see the parent spec's fetch plan for the
  measurements behind the number), and neither is made unless the interpretation provider is `blockscout`
  (tightened in subtask 7, which is where the reasoning lives).
- The page passes `apiData` through `PageNextJs` so `PageMetadata` can reach it.
- Unchanged for everyone who isn't a social-preview bot: same SEO tags, no extra requests, no added latency.
- `og:title` carries the short hash for **all** requests including search engines — it needs no API data, so
  it is a `default` template.

## Data & API

Per the parent spec. Nothing new to add to the resource registry.

Note `baseResponse.props` is a promise in this pattern — the existing routes write
`(await baseResponse.props).apiData = …`.

## UI inventory

- `src/pages/tx/[hash].tsx` — currently re-exports `tx as getServerSideProps` from
  `src/server/getServerSideProps/main`; becomes a local `getServerSideProps` that calls `gSSP.tx` first,
  exactly as `src/pages/token/[hash]/index.tsx:30` does.
- `src/shell/metadata/templates/index.ts:82` — the `/tx/[hash]` entry.
- `src/shell/metadata/types.ts` — the `ApiData` conditional type.

## Out of scope

- Multichain, `/cc/tx/[hash]`, `/cross-chain-tx/[id]`, `og:image` — see the parent spec.
- Changing the route's `metadata.title` / `metadata.description`.

## Task breakdown

- [x] 1 `[agent]` Add the `ApiData<'/tx/[hash]'>` branch in `src/shell/metadata/types.ts`
  - inputs:
    - Insert into the existing conditional chain, keeping its `/* eslint-disable @stylistic/indent */` style.
- [x] 2 `[agent]` Add the OG templates to the `/tx/[hash]` entry
  - inputs:
    - Templates exactly as above.
    - Check `cspell.jsonc` doesn't trip on the middle dot; add nothing to the dictionary unless it does.
- [x] 3 `[agent]` Add `getServerSideProps` to `src/pages/tx/[hash].tsx`
  - inputs:
    - Model it on `src/pages/token/[hash]/index.tsx:30` — `const baseResponse = await gSSP.tx<typeof pathname>(ctx)`,
      then the guard, then `(await baseResponse.props).apiData = …`.
    - Gate is `config.metadata.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview'`.
      Do **not** add a `config.metadata.seo.enhancedDataEnabled` arm — the SEO tags don't use API data here,
      so fetching for search-engine bots would buy nothing.
    - `Promise.all` over the two `fetchApi` calls; hash via `getQueryParamString(ctx.query.hash)`;
      `timeout: 2 * SECOND` composed from `src/toolkit/utils/consts`.
    - Pass the results to `getOgDescriptionParams` and assign its result (object or `null`) straight to
      `apiData`.
    - Introduce the `pathname` const and the `Props<typeof pathname>` generic the way the token page does,
      and pass `apiData={ props.apiData }` to `PageNextJs`.
- [x] 4 `[agent]` Verify locally
  — all four cases confirmed on the `staging` preset; see the note below.
  - inputs:
    - `pnpm dev:preset staging`, then `curl -A Twitterbot 'http://localhost:3000/tx/<hash>'` and grep the
      `og:` / `twitter:` / `description` meta tags. First load takes ~45 s while Turbopack compiles.
    - Confirm: `og:title` has the short hash, `og:description` has the three-part line, `<title>` and
      `<meta name="description">` are unchanged, and a request **without** a bot UA shows no
      `og:description` beyond the fallback.
    - Also check a pending transaction and a bad hash both yield the fallback description rather than a
      malformed line.
- [x] 5 `[agent]` Run `pnpm lint` and `pnpm test` (see `.agents/rules/code-quality.mdc` for the exact commands)

## Verification result

Confirmed against the `staging` preset with a `Twitterbot` user agent: `og:title` carries the short hash,
`og:description` reads `Success · Swap 0.21 UNI for 0.000015 NLP · Jul 28, 2026 18:10 UTC`, while `<title>`
keeps the full hash and `<meta name="description">` is untouched. Without a bot UA the server logs no API
request at all and the description falls back. A pending transaction and a bad hash both fall back cleanly.

On the very first bot request the `/summary` call aborted at what was then a 1 s timeout (logged as `504`)
while the tx call succeeded, so the preview fell back to the `called` line; every later request resolved the
summary in ~400 ms. Measuring that properly on eth mainnet showed it is the backend's cold-response cost,
not the network, which is why both timeouts are now 2 s — the reasoning is in the parent spec's fetch plan.
What remains for subtask 5 is confirming from `api_request_duration_seconds` that 2 s holds in production.

## Open questions

None. (Parent Q1 affects subtask 3's internals only.)
