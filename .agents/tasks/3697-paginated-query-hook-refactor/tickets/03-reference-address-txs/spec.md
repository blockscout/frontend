# 03 — Reference integration: address transactions tab reads list state from the hook

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3697 |
| Blocked by | T02 |

## What to build

The address details transactions tab (single chain) becomes the pattern every later migration copies.
`useAddressTxsQuery` drops its `useState` for filter and sort and instead exposes the hook's typed
`filters` / `sorting`, validated with the existing `getFilterValueFromQuery` / `getSortValueFromQuery`
helpers as pure derivations; it no longer passes `filters` / `sorting` into the hook. `AddressTxs`
stops calling `setFilterValue` on tab change (the URL strip does it). The transactions list chain,
`TxsWithApiSorting` → `TxsContent` → `TxsTable` / `TxsList`, takes `isInitialLoading` for row skeletons
and `isTransitioning` for the body, and row keys carry the index suffix only while rendering the stub.
`DataList` gains the `isTransitioning` prop, wired but inert until T13 flips the hook's placeholder.

`MultichainAddressTxs` and the `TxsWithFrontendSorting` callers are touched only as far as needed to
keep compiling against the changed `useAddressTxsQuery` return and `TxsContent` props.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open an address with many transactions, Transactions tab.

- [ ] `useAddressTxsQuery` has no `useState`; `filterValue` and `sort` are derived from
      `query.filters` / `query.sorting`; `setFilterValue` / `setSort` are gone from its return and from
      `TxsWithApiSorting` props.
- [ ] `AddressTxs` no longer has an `onValueChange` handler on `RoutedTabs` for resetting the filter.
- [ ] `DataList` accepts `isTransitioning?: boolean` and, when true, renders its body with the app's
      existing disabled-content look, `pointer-events: none` and `aria-busy`, leaving `actionBar`
      outside; marked `TODO (design):` for T13. A Playwright scaffold shows the state.
- [ ] `TxsContent` takes `isInitialLoading` and `isTransitioning` instead of `isPlaceholderData`;
      rows get `isLoading={ isInitialLoading }`, `DataList` gets `isTransitioning`.
- [ ] Row keys in `TxsTable` and `TxsList` append the index only when `isLoading` is true.
- [ ] All `TxsContent` / `TxsWithApiSorting` / `TxsWithFrontendSorting` callers compile with
      pass-through edits only (their own state removal is T05).
- [ ] Existing unit and Playwright specs for the touched components pass.
- [ ] `(human)` On the tab: filter and sort changes reset to page 1 and show in the URL; switching to
      "Cross-chain txns" and back clears filter and sort; reload with
      `?filter=to&sort=value&order=desc` restores both; CSV export receives the current filter.

## Leaf worklist

- [ ] 1 `[agent]` `DataList` `isTransitioning` prop with interim look, `TODO (design):`, Playwright scaffold
- [ ] 2 `[agent]` `useAddressTxsQuery` and `AddressTxs` read filter/sort from the hook; drop local state
- [ ] 3 `[agent]` `TxsWithApiSorting`, `TxsWithFrontendSorting`, `TxsContent`, `TxsTable`, `TxsList`: new
      flags, row keys; pass-through edits in their callers
- [ ] 4 `[human]` Verify per the `(human)` criterion
