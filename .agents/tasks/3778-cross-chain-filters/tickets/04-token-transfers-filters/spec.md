# 04 — Column filters and tags row on every cross-chain token-transfers surface

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3778 |
| Blocked by | T01, T02, T03 |

## What to build

On the cross-chain token-transfers table a user opens a filter from the **Source tx**, **Dest tx** or
**Protocol** column header, picks chains (multi-select with "All chains") or bridges ("All" + one checkbox per
bridge, always rendered), presses Filter, and the list reloads from page 1 with the selection in the URL. A
non-sticky row above the table lists the active filters as closable tags with "Reset all"; with no rows the
active-filters empty state shows instead of the plain empty text. This works on every token-transfers
surface: the index page, the address Token transfers cross-chain tab (single-chain and multichain) and the
tx-details cross-chain transfers tab. Filters are desktop only; mobile is unchanged.

The filter components live in `src/features/cross-chain-txs/components/filters/` and serve both tables
(ticket 05 reuses them on the transactions table): one chain filter with a direction prop (source /
destination) whose body is the shared `ChainSelect` in `multiple` mode with the all-option, fed by
`interchainIndexer:chains` queried inside the popover with `refetchOnMount: false`; one protocol filter
shaped like the advanced-filter `TypeFilter` (checkbox group, "All" reset value), fed by
`interchainIndexer:bridges` the same way and listing only bridges that are `enabled` and in the feature
config's `bridgeIds`; and a column switch like `FilterByColumn` wrapping each in `ColumnFilter`. The table
header takes an "is filterable" switch (filters + `onFilterChange` present → triggers render) so lists
without them render plain headers.

## Acceptance criteria

How to verify: `pnpm dev:preset gnosis`, open `/token-transfers?tab=token_transfers_cross_chain`; an address
page Token transfers → Cross-chain tab; a tx with cross-chain transfers → its cross-chain tab.
`pnpm dev:preset multichain` for the multichain address page.

- [ ] Source tx, Dest tx and Protocol headers of `TokenTransfersCrossChainTable` render a `ColumnFilter`
      trigger only when the table receives filters; no other column has one
- [ ] Chain popover: `ChainSelect` multi-select with "All chains", title + Reset + Filter per
      `ColumnFilterContent`; applies as comma-joined `src_chain_ids` / `dst_chain_ids`
- [ ] Protocol popover: "All" + one checkbox per bridge in the intersection of enabled indexer bridges and
      `config.features.crossChainTxs.bridgeIds`; rendered even with one bridge; applies as `bridge_ids`
- [ ] Filter state is read from `useApiPaginatedQuery().filters` on every surface and written through its
      `onFilterChange`; the surfaces hold no copy of it; a change lands on page 1 and survives reload
- [ ] `DataList` gets `hasActiveFilters` on every token-transfers surface
- [ ] The shared tags row from ticket 02 renders above the table when a filter is active: one tag per filter
      with chain names / bridge names joined, closing a tag clears that filter, "Reset all" clears all
- [ ] Unit tests cover the protocol option intersection and the URL-value ↔ tag-label mapping
- [ ] Search (`q`), pagination and the Protocol column behave as before on each surface
- [ ] `(human)` The column-filter popovers match the mockup at every breakpoint
- [ ] `(human)` The empty state with the tags row matches the mockup at every breakpoint

## Details

- Figma: Source tx popover `9120-120563`, Destination tx popover `9120-120521`, Protocol popover
  `9120-120033`; empty state + tags row `9136-48611` (row node `9138-91679`). Agreed deviations: no tx-hash
  input in the chain popovers, protocol body is a checkbox group, chain selector is multi-select.
- Surfaces and their query owners: `TokenTransfersCrossChain` (`transfers`); `AddressTokenTransfers` and
  `MultichainAddressTokenTransfers` (`address_transfers`); `useTxCrossChainTransfersQuery` →
  `TxTokenTransferCrossChain` (`tx_transfers`). `TxCrossChainTransfers` on the cross-chain tx details page
  renders the message's own transfers with no API call; it stays filter-less.
- `TokenTransfersCrossChainContent` is the one place to thread `filters` / `onFilterChange` and the tags
  row through; `TxTokenTransferCrossChain` renders the table directly and needs the same wiring.
- Chain options: map `GetChainsResponse` items to `ChainSelect`'s `chainsConfig` the way
  `ChainStatsDetailsCrossChainTxs` does.
- Visual tests: extend `TokenTransfersCrossChain.pw.tsx` with the header triggers in the existing packed
  case; an open popover is an overlay, so one extra screenshot per popover only if the developer wants a
  baseline for it.

## Leaf worklist

- [x] 1 `[agent]` Build the chain filter, the protocol filter and the column switch in
      `cross-chain-txs/components/filters/`, with their unit tests
- [x] 2 `[agent]` Add the filterable header switch to `TokenTransfersCrossChainTable`; thread filters,
      `onFilterChange`, `hasActiveFilters` and the tags row through every token-transfers surface
- [x] 3 `[agent]` Style the popovers and the tags row to the mockup —
      [Source tx](https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9120-120563) ·
      [Dest tx](https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9120-120521) ·
      [Protocol](https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9120-120033) ·
      [Empty state + tags](https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9136-48611)
- [x] 4 `[human]` Regenerate affected Playwright baselines with `--docker` once the look is approved
