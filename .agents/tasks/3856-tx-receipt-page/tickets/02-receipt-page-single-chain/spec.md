# 02 — Receipt page, single-chain

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3856 |
| Blocked by | T01 |

## What to build

The receipt of a transaction opens at `/tx/[hash]/receipt` in single-chain mode. The page is a new bare
layout — no sidebar, header, top bar or site footer, with the error boundary and the mount gate the other
layouts have — holding the receipt card centred in the viewport and the copyright line under it, in light
and dark mode.

The card shows the chain logo and the transaction status (Success / Failed, a spinner while pending), the
Date, Time and Tx fee rows, a separator, the Chain and Tx hash rows, and the two actions. The summary block
is a placeholder in this ticket; tickets 03 and 04 fill it. While the transaction loads the card shows
skeletons over the stub. A pending transaction shows a dash for Date and Time and turns into its final
status without a reload. When the transaction request fails for any reason the page redirects to
`/tx/[hash]`. `Transaction details` opens the transaction page in a new tab; the copy button copies the
receipt's absolute URL and turns into a check mark. Nothing else in the card is a link.

Covers FR1–FR6 and FR12, FR13, FR17 for single-chain, FR11, and of FR19 the page type and the two clicks
on the receipt.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/tx/<hash>/receipt` for the sample transactions in the spec
(a success, the failed one, a fresh pending one, a malformed hash)

- [ ] The route renders on the bare layout: no app chrome, error boundary and mount gate present
- [ ] The transaction query runs with the RPC fallback off and its socket update on
- [ ] Any `core:tx` error redirects to `/tx/[hash]` with the same hash
- [ ] Tx fee shows the native-coin amount and the USD value only when the rate is known
- [ ] Date and Time use the new `Time` formats; a transaction without a timestamp shows a dash in both rows
- [ ] The detail rows are composed as a list of independent pieces, not one hard-coded block
- [ ] The card contains no anchor other than `Transaction details`; that link is built with `route()` and opens a new tab
- [ ] Page type and the `Transaction details` and copy-link clicks are reported to analytics
- [ ] `(human)` A pending receipt turns into Success / Failed without a reload
- [ ] `(human)` Receipt page matches the mockup at every breakpoint, light and dark; on a screen narrower than the card it adapts to the width

## Details

- The copyright line belongs to the page, not the card. The page background and the card surface are the
  ones answered in the readout's Layout questions.
- Mockup deviation: the time follows the user's setting, not the drawn `+4:00 UTC` (FR5).
- Click events: add the two receipt clicks to the existing analytics event types; no new event type unless
  none of the existing ones fits.

## Skill inputs

### `add-new-page`

- Layout: no tabs; content type `general`, without `PageTitle` — the page is the card alone, on the new bare layout (set through the route's `getLayout`)
- Route & path params: `/tx/[hash]/receipt`; `hash` is the transaction hash
- Gated or core: core slice, `tx`; page dir `src/slices/tx/pages/receipt/`, component `TxReceipt`
- Title and navigation: no page title, no navigation item (skip Step 5)
- Metadata: title `%chain_name% transaction receipt %hash%`; description — the `/tx/[hash]` default description, reused
- Page-type analytics: `Transaction receipt`
- Server guard: reuse `tx` from `getServerSideProps/main`
- Sitemap: dynamic route, skip
- Data: wire now — `core:tx` (exists) through `useTxQuery` with the RPC fallback off, path param `hash`; sample instance `eth`. Loading state: skeletons over the existing `TX` stub
- Field hints: none — not a `DetailedInfo` page

## Leaf worklist

- [ ] 1 `[agent]` Add the bare layout
- [ ] 2 `[agent]` Scaffold `/tx/[hash]/receipt` and wire `core:tx` — skill: `add-new-page`
- [ ] 3 `[agent]` Card behaviour: status slot, pending dashes, redirect on error, actions, click events, with unit tests
- [ ] 4 `[agent]` Style the receipt page to mockup, light — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6292-224650) · [readout](../../design-readout.md#receipt-page-light--6292224650)
- [ ] 5 `[agent]` Style the receipt page to mockup, dark — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6292-225570) · [readout](../../design-readout.md#receipt-page-dark--6292225570)
