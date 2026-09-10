# 05 — Migrate the transactions-lists family

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #3697 |
| Blocked by | T04 |

## What to build

Every remaining page that renders through `TxsContent` follows the T03 pattern: no caller-side filter
or sort state, typed values read from the hook, `isInitialLoading` / `isTransitioning` wired, row keys
suffixed only while rendering the stub, and the transitional `filters` / `sorting` params no longer
passed to the hook.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/txs` (all tabs), a block's transactions tab, and the
watchlist transactions page when signed in.

- [ ] None of the files in Details holds `useState` for a filter or sort value that the URL already
      carries, nor passes `filters` / `sorting` to `useQueryWithPages`.
- [ ] `TxsWithFrontendSorting` keeps its client-side sort state (that is not a URL value) and takes the
      new flags.
- [ ] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [ ] Existing unit and Playwright specs pass; lint, tsc green.
- [ ] `(human)` `/txs`: switching between Validated / Pending / Blob tabs clears page and filters;
      pagination on each tab is one request per action; block transactions tab paginates and its RPC
      fallback still renders.

## Details

Files: `src/slices/tx/pages/index/list/{TxsTabs,TxsWithFrontendSorting}.tsx`,
`src/slices/block/pages/details/Block.tsx` + `src/slices/block/hooks/useBlockTxsQuery.ts`,
`src/features/chain-variants/suave/pages/kettle/KettleTxs.tsx`,
`src/features/chain-variants/zeta-chain/pages/cctx-index/{TransactionsZetaChain,ZetaChainEvmTransactions}.tsx`,
`src/features/rollup/{optimism,scroll,arbitrum,zk-sync}/pages/batch-details/*TxnBatch.tsx`,
`src/features/account/pages/tx-index-watchlist/TxsWatchlist.tsx`,
`src/features/multichain/pages/home/LatestTxsLocal.tsx`.

## Leaf worklist

- [ ] 1 `[agent]` Migrate the files in Details
- [ ] 2 `[human]` Verify per the `(human)` criterion
