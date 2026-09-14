# 05 — Address surfaces: token balances, net worth, token select

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #3671 |
| Blocked by | T02 |

## What to build

An address page agrees with the holder's wallet. The Tokens tab's fungible table and list show scaled
quantities with the tag and tooltip; the USD column and the page's net worth are computed from the scaled
amounts; the token-select dropdown in the address header shows the scaled balance. All read the balance's
`token.ui_multiplier` (the current factor — these are balances, not historical events), so no Q01 dependency.

Three of these sites bypass the shared primitive today; this ticket routes them through it so the scaling
decision stays in one place.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open the address
`0x242ba6d68FfEb4a098B591B32d370F973FF882B7` (holds the live token), Tokens tab and the header dropdown

- [x] `AddressFungibleTokensTableItem` / `ListItem` compute quantity and USD through `calculateUsdValue`
      with the multiplier, and render the tag beside the quantity.
- [x] The net-worth aggregation in `src/slices/token/pages/address/utils.ts` uses the shared
      `calculateUsdValue` with the multiplier instead of its own copy; `AddressNetWorth` therefore reflects
      scaled amounts with no change of its own.
- [x] `TokenSelectItem` replaces its inline `BigNumber(...).dividedBy(10 ** decimals)` for fungible tokens
      with the shared helper (scaled), keeping its NFT branches as they are.
- [x] Playwright scaffolds: `AddressTokens.pw.tsx` and `TokenSelect.pw.tsx` gain an ERC-8056 balance using
      the existing `ZRC-2` env-override pattern.
- [x] `(human)` The holder's balance reads `1.69 ×` the raw value in the table, the list, and the dropdown,
      each with the tag; the net worth is unchanged for this token (no exchange rate) but the USD column
      logic is verified on a mock with a rate in the Playwright case.

## Details

No dedicated mockup; reuse T02's amount treatment. Multichain portfolio pages are out of the spec's UI
inventory and are left alone.

## Leaf worklist

- [x] 1 `[agent]` Route the three bypass sites through the shared helper with the multiplier; render the tag
- [x] 2 `[agent]` Playwright scaffolds
- [x] 3 `[human]` Verify placement of the tag in the balance cells against T02's styling; generate baselines
