# 09 — Migrate the chain-variant features

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 09 of #3697 |
| Blocked by | T04 |

## What to build

The chain-variant list pages (beacon-chain deposits and withdrawals on chain, block and address;
Zeta-chain CCTX tab; Celo epochs and epoch rewards; TAC operations; Zilliqa, Stability and Blackfort
validators) follow the T03 pattern. `useBlockWithdrawalsQuery`, `ValidatorsStability`,
`ValidatorsBlackfort`, `ZetaChainCCTXsTab` and `TacOperations` drop their filter / sort state. (`useBlockWithdrawalsQuery`
turned out to hold only its RPC-fallback refetch flag, no URL-mirrored value; it was left as is.)

## Acceptance criteria

How to verify: `pnpm dev:preset <a beacon-chain alias and a zeta-chain alias from
tools/dev-server/registry.json>`, open the withdrawals page and the cross-chain transactions tab.

- [x] None of the files in Details holds `useState` for a filter or sort value the URL carries, nor
      passes `filters` / `sorting` to `useQueryWithPages`.
- [x] Every list component in the family passes `isTransitioning` to `DataList` and `isInitialLoading`
      to rows; row keys use the index only while `isLoading`.
- [x] Existing unit and Playwright specs pass; lint, tsc green.
- [x] `(human)` Zeta-chain CCTX tab: status filter resets to page 1 and survives reload; validators
      page sort is one request per toggle.

## Details

Files: `src/features/chain-variants/beacon-chain/pages/{address/*,block/*,deposits/*,withdrawals/*}`,
`zeta-chain/pages/cctx-index/ZetaChainCCTXsTab.tsx` (the two EVM transaction lists there are T05),
`celo/pages/{address/AddressEpochRewards,epoch-index/Epochs}.tsx`, `tac/pages/operations/TacOperations.tsx`,
`zilliqa/pages/validator-index/ValidatorsZilliqa.tsx`, `stability/pages/validator-index/ValidatorsStability.tsx`,
`blackfort/pages/validator-index/ValidatorsBlackfort.tsx`, plus the table/list components they render.
`KettleTxs` is T05.

## Leaf worklist

- [x] 1 `[agent]` Migrate the files in Details
- [x] 2 `[human]` Verify per the `(human)` criterion
