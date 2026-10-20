# 02 — Token transfers table on the grid

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3801 |
| Blocked by | T01 |

## What to build

The token transfers table renders through the grid primitives on all five of its surfaces: `/token-transfers`,
the address, token and transaction token-transfer tabs, and the multichain token transfers page with its
chain-icon column. Columns size to their content; From / To is capped at 350px and ID / Asset at 240px,
with long values truncating through the existing entity components. The table scrolls only inside its own
box, whose height fills the viewport below the top bar and action bar, and the header stays visible while
scrolling. Column selector, persisted columns, lazy rendering, unique keys, pagination, filters and the
socket "new items" notice keep working; the notice becomes a grid full-width row. The `<table>`-era
leftovers go: the width field on the column definition and the scroll-everywhere branch of the shared
scroll container, whose only consumer this table was.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/token-transfers`, an address Token transfers tab, a token
Transfers tab, a transaction Token transfers tab; a multichain preset for the multichain token transfers page

- [ ] `TokenTransfersTable` and `TokenTransfersTableItem` compose the ticket 01 primitives; no `TableRoot`,
      `TableContainerScrollable` or `<table>` markup remains in `src/slices/token-transfer/components/table/`.
- [ ] `TokenTransferColumn` has no `width`; it carries an optional max width set only on `from_to` (350px)
      and `asset` (240px), which the surface turns into the capped tracks.
- [ ] The multichain chain-icon column is an extra leading uncapped column when a chain is in context.
- [ ] `SocketNewItemsNotice` gains a grid variant that renders the notice as a full-width row; the token
      transfers table uses it when `showSocketInfo` is set, with the same loading look as the desktop variant.
- [ ] The scroll box receives the viewport-fill height from the ticket 01 helper.
- [ ] Lazy rendering (`useLazyRenderedList`) and `useUniqueKeys` keep working: the cut element sits inside the
      scroll box after the rows, keys are computed over the full list (`src/shared/lists/CONTEXT.md`).
- [ ] The `onlyMobile` prop and its branch are removed from `TableContainerScrollable`; every other caller
      keeps the mobile-only behaviour unchanged.
- [ ] `TokenTransfersTable.spec.tsx` passes with role-based queries instead of `thead th` / `tbody tr`, and
      still covers batch rows, page replacement, column order and the missing-token row.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm test:code-complexity --changed` pass.
- [ ] `(human)` On each of the five surfaces the columns hug their content with no wide gaps, From / To and
      ID / Asset truncate at their caps, the table alone scrolls horizontally at a narrow viewport, and
      the header stays visible while scrolling rows.
- [ ] `(human)` Column selector, reorder, reset, pagination and the token-type filter behave as before; the
      socket notice appears as a full-width row on the index and address surfaces.
- [ ] `(human)` `TokenTransfersTable.pw.tsx` screenshots regenerated with `pnpm test:pw --docker` and eyeballed.

## Details

- Surfaces: `TokenTransfersLocal` (index), `AddressTokenTransfersLocal`, `TokenTransfer` (token tab),
  `TxTokenTransferLocal`, `MultichainTokenTransfersLocal`. Only the shared table changes; the pages keep
  their props.
- Chain context comes from `useMultichainContext` as today; the chain-icon header cell has no name.
- The time format toggle stays inline in the Timestamp header cell.
- The existing Playwright case scrolls the table horizontally with `page.mouse.wheel` and takes a second
  shot; keep both shots, the scroll now targets the grid scroll box.

## Leaf worklist

- [ ] 1 `[agent]` Replace `width` with an optional max width on `TokenTransferColumn` and `TOKEN_TRANSFER_COLUMNS`
- [ ] 2 `[agent]` Grid full-width-row variant of `SocketNewItemsNotice`
- [ ] 3 `[agent]` `TokenTransfersTable` and `TokenTransfersTableItem` on the grid primitives with the viewport-fill height, chain-icon column and socket row; delete the `onlyMobile` branch of `TableContainerScrollable`
- [ ] 4 `[agent]` Update `TokenTransfersTable.spec.tsx` to role-based queries
- [ ] 5 `[human]` Regenerate `TokenTransfersTable.pw.tsx` screenshots in Docker and verify the five surfaces
