# 05 — Column filters and tags row on every cross-chain transactions surface

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3778 |
| Blocked by | T04 |

## What to build

The cross-chain transactions table gets the same three column filters (Source tx, Dest tx, Protocol), the
same tags row and the same active-filters empty state as the token-transfers table, reusing the filter
components from ticket 04 unchanged. Surfaces: the transactions index page and the address Transactions
cross-chain tab (single-chain and multichain). The home-page latest cross-chain list renders the same table
without filters and must stay filter-less. There is no mockup for this table; it mirrors the
token-transfers one on the same column names.

## Acceptance criteria

How to verify: `pnpm dev:preset gnosis`, open `/txs?tab=txs_cross_chain` and an address page Transactions →
Cross-chain tab; `pnpm dev:preset multichain` for the multichain address page and the home page.

- [ ] Source tx, Dest tx and Protocol headers of `TransactionsCrossChainTable` render a `ColumnFilter`
      trigger only when the table receives filters; `LatestTxsCrossChain` renders no trigger
- [ ] Filter state comes from `useApiPaginatedQuery().filters` / `onFilterChange` on `TransactionsCrossChain`,
      `AddressTxs` and `MultichainAddressTxs`; no local copy; a change lands on page 1 and survives reload
- [ ] `TransactionsCrossChainContent` threads `filters`, `onFilterChange`, `hasActiveFilters` and the tags row;
      `AddressTxsCrossChain` passes them through
- [ ] Closing a tag clears that filter; "Reset all" clears all; the active-filters empty state shows with a
      filter and no rows
- [ ] Search (`q`), pagination, the Protocol column and the home-page list behave as before
- [ ] `(human)` Filters and tags row on the transactions table look consistent with the token-transfers
      table at every breakpoint

## Details

- Query owners: `TransactionsCrossChain` (`messages`); `AddressTxs` → `AddressTxsCrossChain`
  (`address_messages`); `MultichainAddressTxs` (`address_messages`). `TxDetailsCrossChainMessages` is a
  details-row summary over `tx_messages`, not a table, and is untouched.
- Visual tests: extend `TransactionsCrossChain.pw.tsx` only if the header triggers are not already covered
  by the token-transfers baseline from ticket 04; the components are shared, so one baseline is usually enough.

## Leaf worklist

- [x] 1 `[agent]` Add the filterable header switch to `TransactionsCrossChainTable` and thread filters,
      `onFilterChange`, `hasActiveFilters` and the tags row through the three transactions surfaces
- [x] 2 `[human]` Regenerate affected Playwright baselines with `--docker` if any changed
