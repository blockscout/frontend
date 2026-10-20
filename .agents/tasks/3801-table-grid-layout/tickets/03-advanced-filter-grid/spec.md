# 03 — Advanced filter table on the grid

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3801 |
| Blocked by | T01 |

## What to build

The advanced filter table on `/advanced-filter` renders through the grid primitives. Columns size to their
content; From and To are capped at 200px and Asset at 240px, with long values truncating through the
existing entity components. The header keeps its per-column filter buttons and the time format toggle
inline, the nameless `or_and` column stays center-aligned, and the chain-icon column appears in a
multichain context. The table scrolls only inside its own box, whose height fills the viewport below the
top bar and action bar, and the header stays visible while scrolling, which the page-level sticky header
never managed inside the old scroll container. Column selector, persisted columns, lazy rendering,
pagination and filters keep working. The width field leaves the column definition and the page drops its
`TableHeaderSticky`.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/advanced-filter`

- [ ] `AdvancedFilterTable` composes the ticket 01 primitives; no `TableRoot`, `TableHeaderSticky` or `<table>`
      markup remains under `src/features/advanced-filter/`.
- [ ] `TxTableColumn` has no `width`; it carries an optional max width set only on `from` (200px), `to`
      (200px) and `asset` (240px), which the surface turns into the capped tracks.
- [ ] Header cells render the column name, its `FilterByColumn` control (none where `noFilter` is set) and,
      on `age`, the `TimeFormatToggle`, all inline and non-wrapping; the `age` header reads "Timestamp" as today.
- [ ] `or_and` header and cells are center-aligned; numeric columns right-align.
- [ ] The scroll box receives the viewport-fill height from the ticket 01 helper.
- [ ] Lazy rendering keeps working: the cut element sits inside the scroll box after the rows.
- [ ] Row keys stay as they are today (`item.hash` + index); no new hand-built key scheme.
- [ ] `AdvancedFilter.spec.tsx` passes with role-based queries instead of `thead th` / `tbody tr`, and still
      covers stored column order/visibility and the multiplier column.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm test:code-complexity --changed` pass.
- [ ] `(human)` Columns hug their content with no wide gaps; From, To and Asset truncate at their caps and the
      caps look right against real data, adjust the three values if not; the table alone scrolls
      horizontally at a narrow viewport; the header stays visible while scrolling rows.
- [ ] `(human)` Every filter button opens and applies, the time toggle switches format, column selector,
      reorder, reset and pagination behave as before.
- [ ] `(human)` `AdvancedFilter.pw.tsx` screenshots regenerated with `pnpm test:pw --docker` and eyeballed.

## Details

- `AdvancedFilter.tsx` (the page) keeps its filters, persisted columns and action bar; only the table
  component and the column type change. `SELECTOR_COLUMNS` renames `or_and` to "And/Or" for the selector
  and keeps working off the new column shape.
- The `(human)` cap check is the developer verification the parent spec promised instead of a question.

## Leaf worklist

- [ ] 1 `[agent]` Replace `width` with an optional max width on `TxTableColumn` and `TABLE_COLUMNS`
- [ ] 2 `[agent]` `AdvancedFilterTable` on the grid primitives: inline filter header, `or_and` centering, chain-icon column, viewport-fill height; drop `TableHeaderSticky` from the page
- [ ] 3 `[agent]` Update `AdvancedFilter.spec.tsx` to role-based queries
- [ ] 4 `[human]` Regenerate `AdvancedFilter.pw.tsx` screenshots in Docker and verify caps on the running page
