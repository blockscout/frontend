# 03 — Fallback headline

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3856 |
| Blocked by | T02 |

## What to build

The summary block of the receipt card for a transaction with no interpretation to show — in this ticket,
every transaction, since the interpretation arrives in ticket 04. It replaces the placeholder from
ticket 02 and never shows an "unknown" label:

- the transaction calls a contract → `Call`, then the method as the API returns it (a name or a selector),
  or "Executed a contract call" when there is no method; the parties row joins sender and receiver with
  `interacted with`;
- otherwise → the transfer view: `Transfer`, then the transaction's own value with the native coin's icon
  and symbol, zero included; the parties row joins sender and recipient with `to`.

The summary and the parties row are one panel with an inner divider. Every address carries an icon — an
identicon, or the contract icon for a contract — and none is a link. The transfer view is a component fed
by an amount, a token or the native coin, and the parties, so ticket 04 can feed it from an interpretation.

Covers FR9, FR10 and the view of FR8.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open the receipt of the spec's sample transactions: the uninterpreted
contract call, the failed call with a method name, the zero-value non-call, a fresh pending one

- [ ] The choice between the `Call` fallback and the transfer view is a pure function of the transaction, covered by unit tests: contract call with a method name, with a selector, without a method; non-call with a value; non-call with zero value
- [ ] The transfer view takes its amount, asset and parties as props and reads nothing from the transaction itself
- [ ] No anchor is rendered in the summary block or the parties row
- [ ] A long name in the parties row truncates; the row fills the panel
- [ ] `(human)` `Call` card, transfer card and the address icons match the mockup at every breakpoint, in a pending and in a final status

## Details

- Not in the mockups: the `Call` card and the native-coin transfer card in a final status — the pending
  frames with the status and the Date and Time rows filled in.
- The showcase node also draws the status variants and an API sentence; here it is the reference for the
  address-icon variants of the parties row only.
- The transaction page's own "{sender} called {method} on {receiver}" fallback is not touched.

## Leaf worklist

- [ ] 1 `[agent]` Scaffold the summary panel, the parties row, the transfer view and the `Call` view; fallback selection with unit tests
- [ ] 2 `[agent]` Style the `Call` fallback card to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3202) · [readout](../../design-readout.md#card-call-fallback-pending--62973202)
- [ ] 3 `[agent]` Style the transfer view to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3859) · [readout](../../design-readout.md#card-transfer-view-token-transfer-and-pending-native-coin-fallback--62973859)
- [ ] 4 `[agent]` Style the parties row's address-icon variants to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6282-3275) · [readout](../../design-readout.md#status-and-address-icon-showcase--62823275)
