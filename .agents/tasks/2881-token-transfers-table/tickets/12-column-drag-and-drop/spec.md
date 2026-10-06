# 12 — Drag-and-drop column reordering in the column selector

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 12 of #2881 |
| Blocked by | T03, T08 |

## What to build

Every row of the shared `ColumnsButton` selector (desktop popover, mobile drawer) gets a drag handle on
its **left** (the `move` sprite icon, then the checkbox + label, per the mockup — the brief's "right" is
superseded). Dragging a row by its handle reorders the list; the table re-renders in the new order the
moment the row is dropped. Hidden (unchecked) rows are reorderable too and keep their slot. The list is a
single column on both tables, replacing today's two-column grid. The sortable list is loaded lazily on
first open; until the chunk arrives the same rows render statically with an inert handle.

For the token transfers surfaces the order is persisted per surface in the existing cookie next to
visibility, restored on server-rendered first paint, cleared by Reset, and counted as a customisation.
The advanced filter keeps its order in component state only (lost on reload, as its visibility is today).
Each drop that changes a row's index logs one Mixpanel event.

Library: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (legacy line; see
[`research.md`](research.md) for the rubric and the losing candidates). No `DragOverlay`: the row itself
moves via `useSortable` transforms, which are immune to the popover / drawer positioners.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/token-transfers`, drag "Method" above "Txn hash", reload;
then `/advanced-filter` for the in-memory variant; a mobile viewport for the drawer

- [ ] `ColumnsButton` renders `tableColumns` in the order given, one row per column: handle (left),
      checkbox + name. New prop `onOrderChange(ids: Array<TColumnId>)` fires once per drop with the full
      new order; `columns` / `onChange` (visibility) are unchanged. The single-column layout applies to
      both tables.
- [ ] The handle is the only draggable and focusable element of a row (`attributes` + `listeners` from
      `useSortable`, `aria-label="Reorder {name}"`, `touch-action: none`); the checkbox is untouched by
      a drag. Sensors: `MouseSensor` (distance 5px), `TouchSensor` (delay 250ms, tolerance 5px),
      `KeyboardSensor` with `sortableKeyboardCoordinates`. `DndContext` gets a stable `id`.
- [ ] The sortable list is a `next/dynamic` component with `ssr: false`; its `loading` fallback is the
      same rows without `DndContext` (handle rendered, inert). The dnd packages do not appear in the
      initial chunk of any page.
- [ ] Token transfers cookie value becomes `{ [surface]: { visibility?: { [id]: boolean }, order?:
      Array<id> } }`. `order` is present only when it differs from the surface's default available
      order; `visibility` only when non-empty; a surface with neither is absent. No back-compat with the
      previous flat shape (it parses as "no overrides").
- [ ] Reading `order` tolerates drift against the code vocabulary: unknown ids are dropped, available
      ids missing from the stored order are appended at the end in default order.
- [ ] `useTokenTransferColumns` returns `columns` in the effective order and gains
      `onColumnsReorder(ids)`; Reset clears order and visibility; `isCustomized` is true when the order
      differs from the default even with default visibility.
- [ ] `TokenTransfersTable` renders columns in the order passed (the "keeps the vocabulary order" spec
      flips), so the multichain variants inherit the order through the hook with no change of their own.
- [ ] The advanced filter page holds an ordered id list in state and passes it through
      `columnsToShow` / `selectorColumns`; the table follows the order.
- [ ] `EventTypes.TABLE_COLUMNS` `State` gains `'Moved up' | 'Moved down'`; exactly one event per drop
      whose index changed, `Column` = the moved column's display name. Drops that land on the same index
      log nothing and write nothing.
- [ ] Unit specs: order utils (parse / serialise / drift merge / omit-when-default); hook reorder,
      reset-clears-order, `isCustomized` on order-only change; `ColumnsButton` keyboard-driven reorder
      (focus handle, Space, ArrowDown, Space → `onOrderChange` with the new order) and that a drop on the
      same index does not call it; table order spec flipped.
- [ ] `public/icons/name.d.ts` regenerated with `move`.
- [ ] `(human)` Desktop popover and mobile drawer match the mockup: handle left, single column, lifted
      row shows the ghost look (shadow, background) while siblings shift; touch drag works in the drawer
      without scrolling it; order survives a hard reload on `/token-transfers` and an address tab;
      Reset restores the default order.

## Details

Mockup: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34054-7396
(232px popover, 20px handle, 12px gap to the checkbox, 32px rows with 8px gaps, lifted row with shadow).
Handle icon: `src/sprite/icons/move.svg` (already in the repo, sprite not yet rebuilt).

Decisions folded in from Q06 (2026-10-06):

- Handle on the left, as drawn; the brief said right.
- Order is stored per surface, like visibility, in the same cookie; the per-surface value grows a second
  member rather than a reserved key.
- Hidden rows reorder too; no pinned columns.
- Advanced filter reorders in memory only — its persistence stays out of scope.
- Keyboard sensor stays (it is what the unit test drives); default dnd-kit announcements, no custom
  screen-reader text.
- The dnd chunk is deferred to the first open: the toolkit popover and drawer already `lazyMount` +
  `unmountOnExit`, so a `dynamic()` child mounts only then (precedent `src/shell/header/HeaderMobile.tsx`).

Library facts that shape the leaves (from `research.md`): `useSortable` items move by relative
`transform`, so Chakra's positioner transforms do not offset them; the `aria-describedby` id must come
from a stable `DndContext id` to avoid a hydration mismatch; `touch-action: none` on the handle only, so
the drawer still scrolls from the row body.

Spec amendments made with this ticket (genuine requirement change): FR 1 "in the same order" becomes the
default order; FR 3, 4 and 7 extend to reordering; FR 8 allows the advanced filter to reorder in memory.

## Leaf worklist

- [ ] 1 `[agent]` Add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`; rebuild the sprite
      (`move` in `name.d.ts`)
- [ ] 2 `[agent]` `ColumnsButton`: single-column rows with handle, lazy `SortableColumnList`
      (`DndContext` + sensors + `useSortable` rows) with static fallback, `onOrderChange`; keyboard
      reorder spec
- [ ] 3 `[agent]` Token transfers persistence: new per-surface `{ visibility, order }` shape, order
      utils (serialise / parse / drift merge), hook `onColumnsReorder`, Reset + `isCustomized`,
      Mixpanel `Moved up` / `Moved down`; specs
- [ ] 4 `[agent]` Table renders in passed order (flip the order spec); wire `onOrderChange` on every
      surface that mounts the hook (index, address, token, tx, multichain index + address)
- [ ] 5 `[agent]` Advanced filter: ordered-ids state, pass order to the table and the selector
- [ ] 6 `[agent]` Style the rows and the lifted row to the mockup —
      [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34054-7396);
      regenerate advanced filter baselines
- [ ] 7 `[human]` Verify leaf 6 against the mockup on desktop and mobile; verify touch drag in the drawer
