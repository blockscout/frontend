# 12 — Drag-and-drop column reordering in the selector (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 12 of #2881 |
| Blocked by | Q06, T03 |

## Goal

Let the user reorder columns by dragging rows in the column selector (popover on desktop, drawer on
mobile) with a handle on the right of each row; the order persists per surface like visibility does.

## Known context

- Strongly wanted by product. The meeting scoped it to the token transfers table; the developer's decision
  (2026-10-05) is to keep the shared `ColumnsButton` behaviour unified and let the advanced filter table
  reorder too, rather than disable the feature on one page.
- Reordering happens in the selector, not by dragging table headers.
- The shared `ColumnsButton` (extracted in T01) renders the rows for both tables; the token transfers
  persisted shape in `column-overrides.ts` is a visibility diff and would need an order component, read
  tolerantly for cookies written before this ticket. The advanced filter keeps its own column state and
  needs the same order handling on its side.
- Developer to pick a drag-and-drop library (ready-made ones exist; integration expected to be easy).

## Blocking unknowns

- Q06 — Tatyana: the redesigned dropdown / drawer with drag handles.
- T03 — persistence is landed; this ticket extends its stored shape.
