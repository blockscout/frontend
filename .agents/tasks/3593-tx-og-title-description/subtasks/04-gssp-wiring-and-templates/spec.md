# Wire the bot-gated fetch and add the `/tx/[hash]` OG templates

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 4 of #3593 |
| Status | `ready` |
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
      'default': <the route's own metadata description>,
      enhanced: '%tx_status% · %tx_action% · %tx_timestamp%',
    },
  }
  ```

  The separator is a middle dot `·` (U+00B7) with a space either side. The `default` description is the
  explicit fallback the parent spec calls for; the ` | Blockscout` postfix is added by `generate()`, not
  written into the template.
- `ApiData<'/tx/[hash]'>` is `{ tx_status: string; tx_action: string; tx_timestamp: string }`.
- `getServerSideProps` populates `apiData` only when **all** of these hold:
  `config.metadata.og.enhancedDataEnabled`, `detectBotRequest(ctx.req)?.type === 'social_preview'`,
  `!config.features.multichain.isEnabled`, and `'props' in baseResponse`.
- The two requests run in parallel, **1 s** timeout each; `core:tx_interpretation` is not requested at all
  when `config.features.txInterpretation.isEnabled` is false.
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

- [ ] 1 `[agent]` Add the `ApiData<'/tx/[hash]'>` branch in `src/shell/metadata/types.ts`
  - inputs:
    - Insert into the existing conditional chain, keeping its `/* eslint-disable @stylistic/indent */` style.
- [ ] 2 `[agent]` Add the OG templates to the `/tx/[hash]` entry
  - inputs:
    - Templates exactly as above. The `default` description duplicates the route's existing
      `metadata.description.default` string — reference the same constant rather than retyping it if that
      reads cleanly, otherwise duplicate it verbatim.
    - Check `cspell.jsonc` doesn't trip on the middle dot; add nothing to the dictionary unless it does.
- [ ] 3 `[agent]` Add `getServerSideProps` to `src/pages/tx/[hash].tsx`
  - inputs:
    - Model it on `src/pages/token/[hash]/index.tsx:30` — `const baseResponse = await gSSP.tx<typeof pathname>(ctx)`,
      then the guard, then `(await baseResponse.props).apiData = …`.
    - Gate is `config.metadata.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview'`.
      Do **not** add a `config.metadata.seo.enhancedDataEnabled` arm — the SEO tags don't use API data here,
      so fetching for search-engine bots would buy nothing.
    - `Promise.all` over the two `fetchApi` calls; hash via `getQueryParamString(ctx.query.hash)`;
      `timeout: SECOND` from `src/toolkit/utils/consts`.
    - Pass the results to `getOgDescriptionParams` and assign its result (object or `null`) straight to
      `apiData`.
    - Introduce the `pathname` const and the `Props<typeof pathname>` generic the way the token page does,
      and pass `apiData={ props.apiData }` to `PageNextJs`.
- [ ] 4 `[agent]` Verify locally
  - inputs:
    - `pnpm dev:preset robinhood`, then `curl -A Twitterbot 'http://localhost:3000/tx/<hash>'` and grep the
      `og:` / `twitter:` / `description` meta tags. First load takes ~45 s while Turbopack compiles.
    - Confirm: `og:title` has the short hash, `og:description` has the three-part line, `<title>` and
      `<meta name="description">` are unchanged, and a request **without** a bot UA shows no
      `og:description` beyond the fallback.
    - Also check a pending transaction and a bad hash both yield the fallback description rather than a
      malformed line.
- [ ] 5 `[agent]` Run `pnpm lint` and `pnpm test` (see `.agents/rules/code-quality.mdc` for the exact commands)

## Open questions

None. (Parent Q1 affects subtask 3's internals only.)
