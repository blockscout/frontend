# 10 — Migrate the remaining features

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 10 of #3697 |
| Blocked by | T04 |

## What to build

Every caller not covered by T03–T09 follows the T03 pattern: user ops, account pages (watchlist,
private tags), name-service domains, cross-chain transactions and bridged tokens, DEX pools, hot
contracts, advanced filter, address-metadata tag search, data-availability blob transactions, OP
interop messages, Noves account history, and the multichain pages whose list wiring T04 left untouched.
`useBridgedTokensQuery` (both copies), `NameDomains`, `HotContracts`, `IcttUsers`, `Pools`,
`AdvancedFilter` and `AddressAccountHistory` drop their filter / sort state. (`AddressAccountHistory`'s
filter is applied client-side and its resource declares no filter fields, so it reads `filter` from the
URL and pushes it with a shallow `router.push` instead of the hook's handler. The portfolio tokens tab
now pushes the selected chain itself; the `onChainChange` callback that made the parent push a second
time is gone.)

The debounced search push (`useMemo(debounce(onFilterChange…))` plus a cancel-on-unmount effect) is
already copied in five hooks (`useTokensQuery`, `useVerifiedContractsQuery`, `useInternalTxsQuery`,
`useSearchQuery`, `TacOperations`) and this ticket adds at least five more (`Pools`, `NameDomains`, both
`useBridgedTokensQuery` copies, the multichain search and tokens pages). Before migrating those, lift it
into `src/shared/pagination/` as a `useDebouncedFilterChange(onFilterChange)` helper: one
`SEARCH_DEBOUNCE` constant, the cancel effect inside, a stable identity like the other callbacks (FR6).
The caller keeps the merge of the other filters (`{ q: value, filter: type }`) since that varies per
resource; the input stays uncontrolled with `initialValue`, the URL remains the truth. The local UI
debounces with no URL push (`CodeEditorSearch`, advanced-filter `AssetFilter` / `MethodFilter`,
`useQuickSearchQuery`) are out of scope.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/ops`, `/advanced-filter`, `/name-domains`, and a
multichain alias for the multichain list pages.

- [x] None of the files in Details holds `useState` for a filter or sort value the URL carries, nor
      passes `filters` / `sorting` to `useQueryWithPages`.
- [x] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [x] `grep -rn "filters:\|sorting:" src` over hook call sites finds none outside
      `src/shared/pagination/` (the check T11 turns into a type error).
- [x] `useDebouncedFilterChange` lives in `src/shared/pagination/` with a unit spec (debounce, cancel on
      unmount, stable identity); `grep -rn "debounce(" src` finds no search-to-URL debounce outside it.
- [x] Existing unit and Playwright specs pass; lint, tsc green.
- [x] `(human)` Advanced filter: changing any filter resets to page 1 with one request; name domains:
      sort and search survive reload; a multichain list page paginates with one request per action.

## Details

Files: `src/features/{user-ops,account,name-services,cross-chain-txs,dex-pools,hot-contracts,advanced-filter,
address-metadata,data-availability,bridged-tokens,op-interop,tx-interpretation}/**` hook callers, and
under `src/features/multichain/pages/` the list wiring of the pages T04 migrated for chain only. If
the set proves too large for one context window, split `src/features/multichain/pages/` off as a
sibling ticket appended to `progress.md`.

## Leaf worklist

- [x] 1 `[agent]` `useDebouncedFilterChange` in `src/shared/pagination/` with spec; move the five existing
      debounced search sites onto it
- [x] 2 `[agent]` Migrate the files in Details
- [x] 3 `[human]` Verify per the `(human)` criterion
