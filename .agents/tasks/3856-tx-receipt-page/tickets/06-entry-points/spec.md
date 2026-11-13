# 06 — Entry points

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3856 |
| Blocked by | T02, T05 |

## What to build

Two ways into the receipt from inside the explorer, both opening it in a new tab and both working in
multichain mode (linking to the receipt of the transaction's chain):

- the "Additional info" dropdown of a transaction row gets a `Receipt` link with the receipt icon, in the
  footer row opposite "More details", wherever that dropdown appears;
- the transaction details page gets a `Receipt` icon button in `TxSubHeading`, a sibling of `ActionsMenu`
  and not an item of it, shown whether or not the transaction has a tag.

A click on either is reported to analytics.

Covers FR14–FR16 and the entry-point clicks of FR19.

## Acceptance criteria

How to verify: `pnpm dev:preset eth` and `pnpm dev:preset multichain`; open the transactions list and the
home page's latest transactions (dropdown), and a transaction page with and without a tag

- [ ] Both links are built with `route()` and the multichain context, and open in a new tab
- [ ] The `Receipt` button renders when `hasTag` is true and when it is false
- [ ] Both clicks are reported to analytics, distinguishable by entry point
- [ ] `(human)` The dropdown footer row matches the mockup at every breakpoint
- [ ] `(human)` The `Receipt` button on the transaction page matches the mockup at every breakpoint; on mobile it drops to the second row with `ActionsMenu`
- [ ] `TxAdditionalInfo.pw.tsx` and `TxSubHeading.pw.tsx` show the entry points in their existing cases; no new file, a new case only for the tagged transaction if none of the existing ones has a tag
- [ ] `(human)` The baselines of both suites, and of any other suite whose screenshot contains the dropdown or the summary line, are regenerated in Docker and differ only by the entry points

## Details

- Mockup deviation: the `Receipt` link is drawn gray because it is the secondary link variant, not because
  it is disabled.
- Everything else the dropdown mockup draws differently from the shipped popup is stale — the readout's
  Layout questions list what stays as shipped.
- The `receipt` sprite icon is already in the repo.

## Leaf worklist

- [x] 1 `[agent]` Style the `Receipt` link in the "Additional info" dropdown to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4403) · [readout](../../design-readout.md#entry-point-additional-info-popup--62674403)
- [x] 2 `[agent]` Style the `Receipt` button on the transaction details page to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4363) · [readout](../../design-readout.md#entry-point-transaction-details-page--62674363)
- [x] 3 `[agent]` Click analytics for both entry points
- [x] 4 `[agent]` Extend `TxAdditionalInfo.pw.tsx` and `TxSubHeading.pw.tsx` where a case is missing; list the suites affected (`pnpm test:pw --changed`)
- [x] 5 `[human]` Regenerate and eyeball the affected baselines (`pnpm test:pw --docker … --update-snapshots`)
