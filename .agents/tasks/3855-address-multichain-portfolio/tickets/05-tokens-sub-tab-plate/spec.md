# 05 — Tokens sub-tab: summary plate

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 05 of #3855 |
| Blocked by | T03 |

## What to build

On every single-chain instance, the Tokens sub-tab opens with the shared plate from T03 instead of the
three `AddressTokenBalances` boxes. For the current chain it shows total net worth, the native-coin balance
with its USD value, the token count with its USD value, and the top-3 breakdown bar: the two largest
holdings by USD value plus "Others", the native coin taking part. The count covers fungible tokens only.
The plate carries no ad banner and no multichain-button providers. The NFTs sub-tab has no plate (FR2, FR6).

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/address/<hash>?tab=tokens_erc20`, then the NFTs sub-tab

- [x] The plate is fed by the core API only: the address resource for native balance and exchange rate, the
      address tokens fetch for count, value and breakdown.
- [x] Count, value and breakdown use fungible token types only, NFTs excluded; the count matches the table
      below.
- [x] The breakdown computation is a pure function with unit tests: native coin among the top holdings, two
      largest plus "Others", a single holding, no USD values, no tokens.
- [x] Today's overflow behaviour is kept when the address holds more tokens than the fetch returns.
- [x] The total's label reads the same as on the portfolio plate.
- [x] The plate renders on the Tokens sub-tab only; the NFTs sub-tab shows none.
- [x] Banner and providers are off for this use.
- [x] `AddressTokenBalances` and `AddressTokenBalancesItem` are deleted if nothing else uses them.
- [x] `(human)` Numbers on the plate agree with the address's Details tab and the table below.
- [x] `(human)` The Tokens plate matches the mockup at every breakpoint.

## Details

- Spec → "Data & API" → "Tokens sub-tab plate".
- Today's sources: `AddressTokenBalances`, `useFetchTokens`, `getTokensTotalInfo`. The token select on the
  Details tab shares `useFetchTokens`; its behaviour must not change.
- The portfolio's breakdown logic lives inline in `MultichainAddressPortfolioTokens`; share the algorithm
  rather than writing a second one, if it extracts cleanly.

## Leaf worklist

- [x] 1 `[agent]` Compute the current-chain plate data (fungible-only totals, breakdown with the native coin), with unit tests
- [x] 2 `[agent]` Render the shared plate on the Tokens sub-tab only and remove `AddressTokenBalances`
- [x] 3 `[agent]` Style the Tokens plate to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6337-4418)
- [x] 4 `[agent]` Extend `AddressTokens.pw.tsx` for the plate
- [x] 5 `[human]` Regenerate and review the affected screenshot baselines
