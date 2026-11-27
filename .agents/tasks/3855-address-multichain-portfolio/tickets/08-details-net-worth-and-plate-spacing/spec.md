# 08 — Multichain net worth on the Details tab, and the net-worth plate's spacing

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 08 of #3855 |
| Blocked by | none |

## What to build

With the multichain portfolio feature on, the address Details tab gets a "Multichain net worth" row
directly below "Net worth". It shows the address's total across all chains, then the multichain-button
providers; the "Net worth" row keeps the current chain's value and loses the providers. The new row is
shown for every address, contracts included. With the feature off the Details tab is as today and makes no
request to the aggregator (FR14, FR15).

The shared net-worth plate is taken to its amended mockups: the gaps between its elements and its dividers.
The change shows on the Multichain portfolio sub-tab, the Tokens sub-tab and the Multichain explorer's
address page (FR16).

## Acceptance criteria

How to verify: `pnpm dev:preset eth` with the two aggregator variables set, open `/address/<hash>` for an
EOA and for a contract, then `?tab=tokens` and `?tab=tokens_erc20`

- [ ] Feature on: the "Multichain net worth" row renders below "Net worth" for every address, contracts
      included.
- [ ] The row's total is the `multichainAggregator:address_portfolio` total, requested with the same
      poor-reputation-tokens setting as the Multichain portfolio sub-tab.
- [ ] The providers follow the total under today's rule: shown for an EOA and an EIP-7702 address, hidden
      for any other contract. The total shows either way.
- [ ] When the aggregator request fails or returns no total, the row stays, its value reads "N/A" and the
      providers still show.
- [ ] Feature on: the "Net worth" row carries no providers and shows only when the chain has an exchange
      rate and the address has tokens.
- [ ] Feature off: the Details tab renders as today, providers on the "Net worth" row, and no aggregator
      request is made.
- [ ] The new row's label hint reads "Total net worth in USD of all tokens for the address across all
      chains".
- [ ] The rules above (gating, provider rule, "N/A", "Net worth" row visibility) are covered by unit tests.
- [ ] On mobile the plate keeps today's stacking; only its gaps change.
- [ ] No new `*.pw.tsx` file and no new visual test case; see Details.
- [ ] `(human)` The multichain total on the Details tab equals the total on the Multichain portfolio
      sub-tab.
- [ ] `(human)` The Details net worth rows match the mockup at every breakpoint.
- [ ] `(human)` The plate on the Multichain portfolio sub-tab matches the mockup at every breakpoint.
- [ ] `(human)` The plate on the Tokens sub-tab matches the mockup at every breakpoint.

## Details

- Today's sources: `AddressNetWorth` and its row in `AddressDetails`; the plate is
  `AddressPortfolioNetWorth`, fed by `AddressFungibleTokensNetWorth` on the Tokens sub-tab and by
  `MultichainAddressPortfolioTokens` on the portfolio. The portfolio request to match is the one in
  `MultichainAddressPortfolioTokens`.
- The feature's UI plugs into the Details tab at the page level, per "Compose at the page level" in
  `.agents/rules/architecture.md`.
- Mockups are desktop only. The Multichain portfolio node draws no ad banner; the banner slot of FR10
  stays.
- Visual tests, per `.agents/rules/tests-visual.md`:
  - Plate: nothing added. `AddressPortfolioNetWorth.pw.tsx` already shoots the plate with providers and
    banner on desktop, small desktop and mobile; `AddressTokens.pw.tsx` "fungible tokens" already shoots
    the Tokens variant with its dividers. The restyle only regenerates baselines.
  - Details: pack, do not add. Turn the feature and the providers on in the existing `AddressDetails.pw.tsx`
    "validator" case, an EOA, with the aggregator total mocked, so one shot holds both rows and the
    buttons. `AddressNetWorth.pw.tsx` stays as the feature-off look.
  - Baselines expected to change: `AddressPortfolioNetWorth`, `AddressTokens`, `AddressDetails`,
    `MultichainAddressPortfolioTokens`, `MultichainAddress`.

## Leaf worklist

- [ ] 1 `[agent]` Add the "Multichain net worth" row to the Details tab: the aggregator total, the providers moved from "Net worth", the feature gate, with unit tests
- [ ] 2 `[agent]` Style the Details net worth rows to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6435-6649)
- [ ] 3 `[agent]` Style the plate on the Multichain portfolio sub-tab to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6435-4620)
- [ ] 4 `[agent]` Style the plate on the Tokens sub-tab to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6363-10621)
- [ ] 5 `[agent]` Turn the feature on in the `AddressDetails.pw.tsx` "validator" case
- [ ] 6 `[human]` Regenerate and review the affected screenshot baselines
