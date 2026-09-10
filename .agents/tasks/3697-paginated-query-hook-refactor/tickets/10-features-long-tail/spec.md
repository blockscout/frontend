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
`AdvancedFilter` and `AddressAccountHistory` drop their filter / sort state.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/ops`, `/advanced-filter`, `/name-domains`, and a
multichain alias for the multichain list pages.

- [ ] None of the files in Details holds `useState` for a filter or sort value the URL carries, nor
      passes `filters` / `sorting` to `useQueryWithPages`.
- [ ] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [ ] `grep -rn "filters:\|sorting:" src` over hook call sites finds none outside
      `src/shared/pagination/` (the check T11 turns into a type error).
- [ ] Existing unit and Playwright specs pass; lint, tsc green.
- [ ] `(human)` Advanced filter: changing any filter resets to page 1 with one request; name domains:
      sort and search survive reload; a multichain list page paginates with one request per action.

## Details

Files: `src/features/{user-ops,account,name-services,cross-chain-txs,dex-pools,hot-contracts,advanced-filter,
address-metadata,data-availability,bridged-tokens,op-interop,tx-interpretation}/**` hook callers, and
under `src/features/multichain/pages/` the list wiring of the pages T04 migrated for chain only. If
the set proves too large for one context window, split `src/features/multichain/pages/` off as a
sibling ticket appended to `progress.md`.

## Leaf worklist

- [ ] 1 `[agent]` Migrate the files in Details
- [ ] 2 `[human]` Verify per the `(human)` criterion
