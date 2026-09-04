# 04 — The bridge travels in the message-details URL

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 04 of #3650 |
| Blocked by | T01 |

## What to build

A cross-chain message's details page states which bridge the message belongs to, in its URL. The route
becomes `/bridge/[bridgeId]/cross-chain-tx/[id]`, and the details request carries `bridge_id` — so the
page resolves identically on a fresh load, a reload and a deep link pasted into a new tab, with no
component state involved. On the shared instance the same `message_id` can exist on more than one bridge;
an unqualified lookup is a guess, and the route removes the guess.

Reaching the page is unchanged from the user's side: every link to it is built from a row or a message
object that already carries `bridge.id`, so no call site needs new data. The old `/cross-chain-tx/[id]`
is deleted outright with no redirect — the predecessor explorers never had a single-message page, so
there is nothing to stay compatible with (Q02).

The failure modes stop lying. A malformed message identifier answers `400`, which today has no case at
all and falls through to the 500 copy — "Oops! Something went wrong" for what is plainly a bad URL. It
is re-thrown as `422`, landing on the invalid-input page the app already has — no new error screen and no
change to how any other `400` renders. A wrong `bridge_id` answers `404` and reads as not found. Nothing
retries an ambiguous lookup: the qualified route makes that response unreachable, and a wrong guess is
worse than no guess.

## Acceptance criteria

- [ ] `src/pages/bridge/[bridgeId]/cross-chain-tx/[id].tsx` exists, `src/pages/cross-chain-tx/` is gone,
      and `src/shared/router/nextjs-routes.d.ts` is regenerated
- [ ] The metadata template and the `PAGE_TYPE_DICT` entry are keyed by the new pathname; no reference to
      `/cross-chain-tx/[id]` remains anywhere in `src/`
- [ ] Every request to `interchainIndexer:message` carries `bridge_id`, taken from the route param
- [ ] `CrossChainMessageEntity`'s default href points at the new route, and the two `tab: 'transfers'`
      links carry the bridge
- [ ] When a row's `bridge.id` is absent the message entity renders unlinked — no route is built from a
      guessed or defaulted bridge id
- [ ] A `400` from the message-details request is re-thrown as `422`, so it lands on the invalid-input
      page the app already has. `src/shared/errors/AppError.tsx` and `AppErrorIcon.tsx` are **not**
      touched: no new error-page copy, no new sprite, and every other `400` in the app renders exactly as
      it does today
- [ ] A unit test covers the remap — `400` in, `422` out; any other status passes through unchanged
- [ ] Nothing retries a message-details request on `400`
- [ ] `pnpm test:vitest`, `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:cspell` pass, and
      `pnpm test:code-complexity --changed` is within thresholds. The Playwright specs are **not** a gate
      on this branch — the interchain mocks are knowingly red pending a dedicated ticket — but the specs
      and mocks still have to be updated for the new route
- [ ] `(human)` From the cross-chain transactions list, clicking a row opens the details page with the
      bridge in the URL; a reload and a fresh paste of that URL both resolve; the transfers tab links
      keep the bridge; editing the URL to a wrong bridge id shows not-found, and mangling the message id
      shows the invalid-input page

How to verify: `pnpm dev:preset numine`, open `/cross-chain-tx` and click through to a message

## Details

**`bridge.id` is optional in `1.8.1`** (`BridgeInfo.id?: number`) although the service always sends it;
Q03 tracks making it required. Until then, treat absence as "not linkable" and render the entity without
a link — do not fall back to an unqualified route, since on the shared instance that is exactly the
ambiguous lookup this ticket removes.

**Link touch points** — `CrossChainMessageEntity`'s default href, the `tab: 'transfers'` link in
`TransactionsCrossChainTableItem`, the one in `TxCrossChainDetailsTransfers`, plus the entity's consumers
that must now pass the bridge alongside `id`: the two txs list items, the two token-transfers list items,
`LatestCrossChainTxsItemDesktop`, `TxDetailsCrossChainMessage` and `TxCrossChain`'s own page title.
`CrossChainBridgeLink` is unrelated — it links out to the bridge's own UI and stays as it is.

**Verified against the live instance**: a correct `bridge_id` resolves; omitting it resolves only while
no collision exists; a wrong value returns `404` with `code: 5` — not the `400 code: 9` the issue
documents, which is the cross-bridge-collision case and is unreachable with the current bridge set.

**The guard is unchanged** — reuse the existing `crossChainTxs` export from
`src/server/getServerSideProps/main.ts`; no new guard.

## Skill inputs

### `add-new-page`

This is a route move, not a new page: the page shell and both tab bodies already exist under
`src/features/cross-chain-txs/pages/tx/`. Only the route-plumbing steps apply — Step 3 item 2 (route
file), Step 4 (route types), Step 6 (metadata), Step 7 (page-type analytics). Skip Steps 0–2, 5, 8, 10.

- **Layout**: unchanged — tabbed page, `Details` first (id `index`), then `Token transfers`. No
  scaffolding, no templates copied.
- **Route & path params**: `/bridge/[bridgeId]/cross-chain-tx/[id]`. `bridgeId` is the interchain
  indexer's numeric bridge id; `id` is the interchain `message_id`. Both read with
  `getQueryParamString`.
- **Gated or core?**: config-gated feature `crossChainTxs`, area `features`. Guard already exists —
  reuse `crossChainTxs` from `main.ts`, create nothing.
- **Title and navigation placement**: page title stays `Cross-chain tx details`. No nav item — it is a
  detail page and the old route had none.
- **Metadata**: move the existing entry verbatim to the new key —
  title `%chain_name% cross-chain transaction %id% details`, description
  `View cross-chain transaction %id%, including source, destination, and status.`, `default` only, no
  `og` field (detail page).
- **Page-type analytics**: keep `Cross-chain transaction details`, re-keyed to the new pathname.
- **Data**: already wired. `interchainIndexer:message` is an existing resource; this ticket adds the
  `bridge_id` query param to its call in `TxCrossChain`. No `add-api-resource` run.
- **Sitemap**: skipped — dynamic route.

## Leaf worklist

- [ ] 1 `[agent]` Move the route and its plumbing to `/bridge/[bridgeId]/cross-chain-tx/[id]` — skill:
      `add-new-page` (route-plumbing steps only, per Skill inputs)
- [ ] 2 `[agent]` Send `bridge_id` on the details request and carry `bridge.id` through every link site,
      omitting the link when it is absent
- [ ] 3 `[agent]` Re-throw a `400` from the message-details request as `422`, and unit-test the remap
- [ ] 4 `[agent]` Update the cross-chain Playwright specs and mocks for the new route
