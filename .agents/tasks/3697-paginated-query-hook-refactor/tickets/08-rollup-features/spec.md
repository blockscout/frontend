# 08 — Migrate the rollup features

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 08 of #3697 |
| Blocked by | T04 |

## What to build

The Arbitrum, Optimism, Scroll, zkSync and Shibarium list pages (batches, deposits, withdrawals,
output roots, dispute games, L2 messages) follow the T03 pattern. These pages have no filters or
sorting, so the work is wiring `isInitialLoading` / `isTransitioning` and the row keys.

## Acceptance criteria

How to verify: `pnpm dev:preset <an optimism-based and an arbitrum-based alias from
tools/dev-server/registry.json>`, open the batches and deposits pages.

- [x] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [x] Existing Playwright specs pass; lint, tsc green.
- [x] `(human)` Batches page on one rollup: next / prev / first are one request each; prev onto a
      cached page shows no skeleton.

## Details

Files: everything under `src/features/rollup/` that calls the hook except the four `*TxnBatch.tsx`
batch-details pages (T05): `arbitrum/{components/ArbitrumL2Messages,pages/batches/ArbitrumL2TxnBatches}`,
`optimism/pages/{batches,deposits,dispute-games,output-roots,withdrawals}/*`,
`scroll/pages/{batches,deposits,withdrawals}/*`, `shibarium/pages/{deposits,withdrawals}/*`,
`zk-sync/pages/batches/*`, plus the table/list components they render.

## Leaf worklist

- [x] 1 `[agent]` Migrate the files in Details
- [x] 2 `[human]` Verify per the `(human)` criterion
