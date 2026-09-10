# 07 — Migrate blocks, tokens, holders, NFTs, contracts, search and accounts

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #3697 |
| Blocked by | T04 |

## What to build

The remaining `src/slices/` callers follow the T03 pattern. `useTokensQuery` and
`useVerifiedContractsQuery` drop their sort state; `useSearchQuery`, `useAddressNftQuery`,
`useAddressFungibleTokensQuery` and `TokenInventory` drop their filter state; `TokenHolders` keeps
choosing its resource from the path param (the composed hook supports that already).

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/blocks`, `/tokens`, a token's Holders and Inventory
tabs, an address's Tokens (NFTs) tab, `/verified-contracts`, `/search-results?q=…`, `/accounts`.

- [ ] None of the files in Details holds `useState` for a filter or sort value the URL carries, nor
      passes `filters` / `sorting` to `useQueryWithPages`.
- [ ] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [ ] Existing unit and Playwright specs pass; lint, tsc green.
- [ ] `(human)` `/tokens`: type filter, search and sort each reset to page 1 and survive reload; one
      request per action; `/blocks` tab switch clears the page.

## Details

Files: `src/slices/block/pages/index/{Blocks,BlocksContent}.tsx`,
`src/slices/address/pages/details/{blocks-validated/AddressBlocksValidated,coin-balance/AddressCoinBalance}.tsx`,
`src/slices/address/pages/index/Accounts.tsx`,
`src/slices/token/{hooks/useTokensQuery.ts,pages/index/TokensList.tsx,pages/details/holders/TokenHolders.tsx,pages/details/inventory/TokenInventory.tsx,pages/address/useAddressFungibleTokensQuery.ts,pages/address/useAddressNftQuery.ts,pages/address/nfts/AddressNfts.tsx,pages/address/nfts/AddressNftsCollections.tsx}`,
`src/slices/contract/hooks/useVerifiedContractsQuery.ts` and its page,
`src/slices/search/hooks/useSearchQuery.ts` and its page, plus the shared list components they render.

## Leaf worklist

- [ ] 1 `[agent]` Migrate the files in Details
- [ ] 2 `[human]` Verify per the `(human)` criterion
