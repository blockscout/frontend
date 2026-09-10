# 06 — Migrate token transfers, internal transactions and logs

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 06 of #3697 |
| Blocked by | T04 |

## What to build

The token-transfer, internal-transaction and log lists (on address, transaction, token and block pages)
follow the T03 pattern. The notable removal is `useAddressTokenTransfersQuery`'s `useEffect` that
re-reads filters from the URL when `enabled` flips: with the hook reading the URL each render, the
effect and the state it fed are gone. Type-filter values keep their validation against the chain's
token types as a pure derivation.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open an address's Token transfers, Internal txns and Logs tabs,
a transaction's Token transfers / Internal txns / Logs tabs, a token's Transfers tab.

- [ ] None of the files in Details holds `useState` for a filter value the URL carries, nor a
      URL-resync effect, nor passes `filters` to `useQueryWithPages`.
- [ ] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [ ] Existing unit and Playwright specs pass; lint, tsc green.
- [ ] `(human)` Address token transfers: type filter and from/to filter reset to page 1 and survive
      reload; switching tabs clears them; one request per action.

## Details

Files: `src/slices/address/pages/details/token-transfers/{AddressTokenTransfers,AddressTokenTransfersLocal,useAddressTokenTransfersQuery}.*`,
`src/slices/address/pages/details/internal-txs/useAddressInternalTxsQuery.ts` and its page,
`src/slices/address/pages/details/logs/AddressLogs.tsx`,
`src/slices/token-transfer/{hooks/useTokenTransfersQuery.ts,pages/token/TokenTransfer.tsx,pages/tx/TxTokenTransfer.tsx,pages/tx/TxTokenTransferLocal.tsx}`,
`src/slices/internal-tx/{hooks/useInternalTxsQuery.ts,pages/tx/TxInternals.tsx}`,
`src/slices/block/{hooks/useBlockInternalTxsQuery.ts,pages/details/BlockInternalTxs.tsx}`,
`src/slices/tx/pages/details/logs/TxLogs.tsx`, `src/slices/tx/pages/details/state/TxState.tsx`,
plus the shared list components they render (token-transfer, internal-tx and log tables/lists).

## Leaf worklist

- [ ] 1 `[agent]` Migrate the files in Details
- [ ] 2 `[human]` Verify per the `(human)` criterion
