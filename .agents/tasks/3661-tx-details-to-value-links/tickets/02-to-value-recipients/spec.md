# 02 — Surface batch recipients in "To" and "Value"

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 02 of #3661 |
| Blocked by | none |

## What to build

For an Eden sponsored (batch) transaction — detected by the presence of `calls` — with **more than one
unique recipient**, surface the per-recipient breakdown in two places on the Details tab
(`/tx/[hash]?tab=index`). Recipients are **de-duplicated by address** (keeping the first call for each), and
`N` is the number of **distinct** recipient addresses everywhere it appears:

- **"To"** renders the list of unique recipients from `calls[]`, capped at 5 rows; when there are more, a
  grey **"View all (N)"** link follows. The **first row** (the top-level `to`, which carries metadata) keeps
  the existing rich "To" rendering; **rows 2+** render as a bare hash (identicon + hash + copy) via
  `AddressEntity` fed only `{ hash }`, since `calls[].to` carries no metadata.
- **"Value"** appends a grey `to` word followed by a blue **"N recipients"** link, e.g.
  `0.002395904453623692 TIA ($2.55) to 2 recipients`.

Both links reveal the "Calls" section lower on the same tab. That section (`TxDetailsEden`) lives inside the
Details **collapsible**, which renders its children only when expanded. Each link **expands the collapsible**
(via the `isExpanded` state lifted from `TxDetails`), bringing the per-recipient "Calls" breakdown into view.

When the batch resolves to a single unique recipient (every call hits the same address), "To" keeps its
existing single-address rendering and "Value" keeps its plain amount — the new UI appears only when there is
more than one distinct recipient.

## Acceptance criteria

How to verify: `pnpm dev:preset eden_testnet`, open a sponsored batch tx at `/tx/[hash]?tab=index`

- [ ] Recipient count and both link labels ("View all (N)", "N recipients") derive from the number of
      **distinct** recipient addresses (calls de-duplicated by `to`)
- [ ] The "To" list is capped at a named constant (`= 5`); the "View all (N)" link appears only when the
      distinct-recipient count exceeds it
- [ ] The recipient list / "N recipients" link appear only when `calls` is present and there is more than
      one **unique** recipient; a batch that resolves to a single address keeps the existing single-address
      "To" and plain "Value"
- [ ] First "To" row uses the existing rich rendering; rows 2+ are `AddressEntity` given only `{ hash }`
- [ ] `(human)` Both links expand the Details collapsible, revealing the "Calls" section
- [ ] `(human)` The "To" recipient list and "View all (N)" link match the mockup
- [ ] `(human)` The "Value" row (grey `to` + blue "N recipients" link) matches the mockup

## Details

- Endpoint `GET /api/v2/transactions/{hash}` → `TransactionResponse`; fields `to`, `value`, `calls[]`.
  Production-deployed, no backend work. Sample instance: `eden_testnet`.
- Components: `TxDetails.tsx` (core `tx` slice — owns the collapsible `isExpanded` state and the "Value"
  row), `TxDetailsTo.tsx` (the extracted "To" field, in the same `parts/` folder), `TxDetailsEden.tsx`
  (`features/chain-variants/eden` — owns the "Calls" section), composed at the slice page level (the slice
  renders the feature's component, not vice versa).
- Reveal on click: `TxDetails` already force-expands the collapsible via `setIsExpanded(true)`
  (`showAssociatedL1Tx`); reuse that shape as an `expandDetailsSection` handler passed to the "To"/"Value"
  links. Expanding brings the always-below "Calls" section into view — no separate scroll target is needed.
- Max visible recipients is a named `UPPER_SNAKE_CASE` constant (`= 5`).
- Figma: "To" list + "View all" — nodes `5940:8800` / `5940:8801`; "Value" row — node `5940:7643`
  (screen `5940:4556`).

## Leaf worklist

- [x] 1 `[agent]` Prefactor: lift an `expandDetailsSection` handler out of `TxDetails` (`setIsExpanded(true)`)
      that the "To"/"Value" links can call to reveal the "Calls" section
- [x] 2 `[agent]` Scaffold the "Value" recipients link (grey `to` + blue "N recipients", gated on more than
      one unique recipient, wired to the expand handler); mark exact presentation `TODO (design):`
- [x] 3 `[agent]` Scaffold the "To" recipient list — first row rich, rows 2+ bare `AddressEntity {{ hash }}`,
      capped at the named constant with a "View all (N)" link wired to the expand handler; gated on
      more-than-one-recipient; mark exact presentation `TODO (design):`
- [x] 4 `[agent]` Unit tests for the derivation logic — distinct-recipient count (calls de-duplicated by
      `to`), the more-than-one-unique threshold, and the visible-rows cap
- [x] 5 `[human]` Style the "To" recipient list + "View all (N)" link to the mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5940-8800)
- [x] 6 `[human]` Style the "Value" row (`to` word + "N recipients" link) to the mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5940-7643)
