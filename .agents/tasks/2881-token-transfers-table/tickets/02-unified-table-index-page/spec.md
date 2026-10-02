# 02 — Column config and the unified table on `/token-transfers`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #2881 |
| Blocked by | none |

## What to build

The `/token-transfers` page (its local tab, and the multichain variant) renders a new single
token-transfer table whose columns come from an ordered column vocabulary — Txn hash, Type, Method,
Timestamp, Block, From/To, Token ID, Amount, Asset, Value — with a chain column in front in multichain
context. A column config module in the token-transfer slice owns the vocabulary, display names, and the
per-surface availability and defaults from FR 2; the table takes a surface id plus the resolved column set
and renders each cell through a per-column switch, so a column is implemented once. This ticket wires
the index surface with its defaults only (every column on); the selector arrives in T03. The old
index-page table and row are deleted and their unit specs move to the new table.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/token-transfers`; multichain via a multichain preset

- [ ] A column config module exports the ordered vocabulary, display names, and per-surface
      availability/defaults exactly as FR 2's table (all four surfaces encoded now, even though only the
      index surface is consumed here).
- [ ] One table component in `src/slices/token-transfer/components/` renders a row cell per column via a
      switch over the column id; it accepts a surface id, the column set to show, the row data, and the
      props the surfaces need (`baseAddress`, `tokenId`/`instance`, socket props, `top`, `isLoading`,
      `resetKey`, `enableTimeIncrement`).
- [ ] Cell behaviour per FR 6: Type shows the token-standard tag with the mint/burn badge beside it;
      Timestamp is its own column with `TimeFormatToggle` in its header; Token ID shows `NftEntity` for
      NFT rows and a dash otherwise; Amount shows the token-multiplier and confidential variants; Asset is
      the `TokenEntity`; Value is the derived USD value; From/To is one `AddressFromTo` column.
- [ ] The chain column renders first when a chain is in scope (multichain) and is not part of the
      configurable vocabulary.
- [ ] `TokenTransfersLocal` and `MultichainTokenTransfersLocal` use the new table; the old
      `pages/index/TokenTransfersTable*.tsx` files are deleted and their spec cases
      (every item of a batch transfer rendered; page change drops previous rows) pass against the new
      table.
- [ ] Controls on the surface are unchanged (type filter popover, pagination; FR 5).
- [ ] `TokenTransfers.pw.tsx` keeps its case; baseline regenerated via `--docker` only once the
      `[human]` style leaf is done.
- [ ] `(human)` On `/token-transfers`, every column from FR 2 renders in the stated order with sensible
      content for fungible, NFT, mint and burn rows, on desktop and in the mobile scrolled table.

## Details

Pattern to copy: `src/features/advanced-filter/pages/index/AdvancedFilterTable.tsx` +
`components/ItemByColumn.tsx` (header map + per-column cell switch). Source material for the cells: the
three existing row components — `components/list/TokenTransferTableItem.tsx`,
`pages/index/TokenTransfersTableItem.tsx`, `pages/token/TokenTransferTableItem.tsx` — hold every
rendering variant today; the new switch must cover the union. Only the index table is deleted in this
ticket; the other two remain until T05 / T06.

Surface ids: `index`, `address`, `token`, `tx`. The config must encode "unavailable" (neither rendered
nor offered) distinct from "off" (hidden by default, offered).

Keep `getTokenTransferKey` row keys, `useLazyRenderedList` with `resetKey`, `AddressHighlightProvider`
wrapping, and `TableContainerScrollable` as today.

Mockup: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-31715 (desktop),
https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3889-33029 (mobile table).

## Leaf worklist

- [x] 1 `[agent]` Column config module (vocabulary, names, per-surface availability/defaults) + spec
- [x] 2 `[agent]` Unified table + per-column cell switch scaffold with `TODO (design):` markers; wire
      `TokenTransfersLocal` and `MultichainTokenTransfersLocal`
- [x] 3 `[agent]` Delete the index table/row; move its unit specs onto the new table; add cell-switch specs
      for the FR 6 variants
- [x] 4 `[human]` Style the table to mockup (column widths, From/To arrow, Type cell) —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-31715); regenerate
      `TokenTransfers.pw.tsx` baselines
