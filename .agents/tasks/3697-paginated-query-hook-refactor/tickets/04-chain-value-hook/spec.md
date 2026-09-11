# 04 — `useChainValue` as the opt-in multichain piece

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3697 |
| Blocked by | T03 |

## What to build

The selected-chain value and its change handler leave the composed hook and become `useChainValue`,
composed by multichain callers only. `chainValue` / `onChainValueChange` / `isMultichain` / `chainIds`
disappear from `useQueryWithPages`'s params and result; the composed hook accepts an optional `chain`
(the resolved `ExternalChainExtended`) so the query key and fetch target it, which is what
`useChainValue` hands back. Single-chain callers neither receive nor pay for the multichain context
lookup (FR11).

The 13 multichain pages, `useAddressTxsQuery`'s multichain path used by `MultichainAddressTxs`,
`useChainSelectErc20`, and `useBlockTxsQuery`'s hand-built result are migrated. `onChainValueChange`
always pushes `chain_id` and strips page params (decision from the breakdown session).

## Acceptance criteria

How to verify: `pnpm dev:preset <multichain alias from tools/dev-server/registry.json>`, open an
address page, switch chains in the local transactions / token transfers / logs tabs.

- [ ] `useChainValue({ chainIds?, withAllOption? })` under `src/features/multichain/hooks/` returns
      `{ chainValue, chain, onChainValueChange }` derived from the URL each render, no state, stable
      handler; unit spec covers URL derivation, fallback to the first available chain, and the push.
- [ ] `useQueryWithPages` no longer imports the multichain context, `multichainConfig` or
      `getChainValueFromQuery`; its result type has no `chainValue` / `onChainValueChange`.
- [ ] Every file in Details compiles and passes its existing specs; `grep -r onChainValueChange src`
      finds only `useChainValue` and its consumers.
- [ ] `pnpm lint`, tsc, unit tests green.
- [ ] `(human)` On a multichain instance: chain switch on page 3 lands on page 1 of the new chain with
      one request; the chain select on the portfolio tab (query-disabled case) still works; reload
      keeps the selected chain from `chain_id`.

## Details

Files: `src/features/multichain/pages/{blocks/MultichainBlocks, token-transfers/MultichainTokenTransfers,
token-transfers/MultichainTokenTransfersLocal, contracts/MultichainVerifiedContracts,
user-ops/MultichainUserOps, addresses/MultichainAccounts, tokens/MultichainTokens,
internal-txs/MultichainInternalTxs, address/MultichainAddressLogs, address/MultichainAddressTxs,
address/MultichainAddressTokenTransfers, address/MultichainAddressInternalTxs,
address/MultichainAddressPortfolio, address/portfolio/MultichainAddressPortfolioTokens,
address/useChainSelectErc20}`, `src/slices/address/pages/details/txs/useAddressTxsQuery.ts` (multichain
props), `src/slices/address/pages/details/token-transfers/useAddressTokenTransfersQuery.ts` (multichain
props only; its filter state is T06), `src/slices/block/hooks/useBlockTxsQuery.ts`.

The parent spec allows a caller to compose the pieces itself; the multichain address tabs are the first
such callers.

## Leaf worklist

- [x] 1 `[agent]` `useChainValue` hook with spec
- [x] 2 `[agent]` Remove chain handling from `useQueryWithPages`; add the `chain` param
- [x] 3 `[agent]` Migrate the files in Details
- [x] 4 `[human]` Verify per the `(human)` criterion
