# 04 — Address "Token transfers" tab on the unified table

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #2881 |
| Blocked by | T03, T08 |

## What to build

The address page's token-transfers tab (and its multichain variant) renders the unified table with the
`address` surface defaults — every column on — and gets the column selector beside its existing filter,
CSV export and advanced-filter link, in the desktop tabs right slot and the mobile action bar. The current
address is still highlighted in the From/To cell, socket "new items" rows still prepend, and the type and
in/out filters, CSV export and pagination are untouched. The shared list table stays in the tree for the
transaction tab until T05.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open an active address, "Token transfers" tab

- [ ] `AddressTokenTransfersLocal` renders the unified table with surface `address`, passing
      `baseAddress` so `AddressFromTo` highlights the current address, and the socket props as today;
      its `TableContainerScrollable` wrapper and `top` prop are removed (the table scrolls itself).
- [ ] Selector button added to `AddressTokenTransfers`'s right slot and the mobile `ActionBar` in
      `AddressTokenTransfersLocal`, plus `MultichainAddressTokenTransfers`'s right slot; column
      choices persist under the `address` surface key. Each selector gets `selected` and `onReset` from
      the hook, as on the index page (T08).
- [ ] Filters, CSV export, advanced-filter link, pagination, socket notice unchanged (FR 5).
- [ ] `AddressTokenTransfers.pw.tsx` and `MultichainAddressTokenTransfers.pw.tsx` keep every case;
      baselines regenerated after the style leaf.
- [ ] `(human)` The tab shows the FR 2 address defaults, the current address is highlighted, the
      selector toggles columns and the choice survives reload, on desktop and mobile.

## Details

The unified table owns its horizontal scroll container (`TableContainerScrollable` with
`onlyMobile={ false }`, scrollable on every viewport) and has no sticky header, so it takes no `top` prop:
the surface drops its own `TableContainerScrollable` wrapper and the `top={ ACTION_BAR_HEIGHT_DESKTOP }`
it passes today. Type is two columns since T02 (Q01): Token type (standard tag) and Transfer type
(mint/burn badge).

Mockup: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-32182 (also the multichain
address variant). Table A (`components/list/TokenTransferTable*.tsx`) is not deleted here — T05 does
that; if T05 lands first, move the deletion into this ticket before it starts.

## Leaf worklist

- [x] 1 `[agent]` Swap `AddressTokenTransfersLocal` to the unified table; add the selector to desktop
      right slot, mobile action bar, and the multichain wrapper
- [x] 2 `[human]` Style to mockup —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-32182); regenerate the
      two pw baselines
