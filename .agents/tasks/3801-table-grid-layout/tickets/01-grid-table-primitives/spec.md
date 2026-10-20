# 01 — Grid table primitives in the toolkit

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3801 |
| Blocked by | none |

## What to build

A grid-based table a surface composes the way it composes `src/toolkit/chakra/table.tsx` today: a scroll
box with a bounded height, a grid root that builds its tracks from the visible columns, a sticky column
header cell, a cell, and a full-width row. It looks like the `table` recipe (header colors, padding, top
radius, cell padding, row border, font), keeps its header visible while rows scroll beneath it, never
widens the page, and right-aligns numeric cells. A sample on the design-system Table tab shows it with a
capped column, a numeric column and enough rows to scroll, so the primitives are demoable before any
product surface migrates. The app-side viewport-fill height value that the product surfaces will pass
also lands here, so the two surface tickets can run in parallel.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/design-system`, Table tab, "Grid" sample

- [ ] A new module beside `src/toolkit/chakra/table.tsx` exports the scroll box, grid root, column header
      cell, cell and full-width row; the surfaces compose lazy rendering, keys and notices themselves.
- [ ] The primitives resolve their styles with `useSlotRecipe` against the existing `table` recipe; the
      recipe's first/last-column padding and top radius are applied per column index, not via sibling
      selectors.
- [ ] The grid root takes the visible columns and builds `grid-template-columns`: `auto` for a column
      without a cap, `fit-content(<max>)` for a capped one; a unit test covers the builder.
- [ ] Grid root is `width: max-content; min-width: 100%`; rows are `display: contents`; the scroll box is
      `overflow: auto` with `contain: inline-size` and takes a max height prop defaulting to `70vh`.
- [ ] Header cells are sticky to the top of the scroll box, do not wrap, sit on an opaque `bg.primary`
      underlay beneath `table.header.bg`, and carry no scrolled-state shadow.
- [ ] Numeric cells use `justify-items: end`; spacing is cell padding, no grid gaps.
- [ ] The primitives carry table ARIA roles (`table`, `rowgroup`, `row`, `columnheader`, `cell`) so a
      surface's tests can query by role.
- [ ] An app-side constant pair (top bar + action bar stack) exposes a `calc(100vh - <offset>)` value
      the surfaces pass as the scroll box height; the value is not baked into the toolkit.
- [ ] Toolkit code imports no `SpriteIcon` and nothing from outside the toolkit (`src/toolkit/CONTEXT.md`).
- [ ] `(human)` The design-system sample matches the `table` recipe sample above it: header colors, padding,
      radius, row borders and font read as the same table; the header stays put while the rows scroll;
      the page does not scroll horizontally at a narrow viewport.

## Details

- Prototype reference: PR #3785 (closed, unmerged); the issue body of #3801 lists what it established.
- Column input shape is the minimum the surfaces need: an id, an optional max width, an optional numeric
  flag. The surfaces keep their own column types and map onto it.
- Full-width row: one grid child spanning every column (`grid-column: 1 / -1`); the token transfers
  socket notice is its first consumer (ticket 02).
- The app-side height helper lives under `src/shared/lists/` next to the other table helpers; it reuses
  `ACTION_BAR_HEIGHT_DESKTOP` from `src/shell/page/action-bar/ActionBar.tsx` and the layout's top bar
  height rather than restating the numbers.
- No `*.pw.tsx` for the toolkit module: the two migrated surfaces already own screenshot suites that are
  regenerated in tickets 02 and 03 (`.agents/rules/tests-visual.md`, "Extend").

## Leaf worklist

- [ ] 1 `[agent]` Grid table primitives in `src/toolkit/chakra/`, styled from the `table` slot recipe, with the template-columns builder and its unit test
- [ ] 2 `[agent]` App-side viewport-fill scroll box height value under `src/shared/lists/`
- [ ] 3 `[agent]` "Grid" sample on the design-system Table tab (`src/toolkit/pages/design-system/tabs/Table.tsx`): capped column, numeric column, scrolling rows
