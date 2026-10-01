# 01 — Shared icon-only `ColumnsButton`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #2881 |
| Blocked by | none |

## What to build

The advanced filter's column selector button becomes a shared control any table can use. It moves out of
`src/features/advanced-filter/components/` into a shared location, loses its "Columns" text label so the
trigger is the icon alone (FR 8), and is made generic over the column-id type instead of being tied to the
advanced filter's `ColumnsIds`. The advanced filter page adopts the moved button and is otherwise
unchanged: same column state, same table, same popover contents. This is a prefactor — it makes T03's
change easy.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/advanced-filter`

- [ ] `ColumnsButton` lives in a shared location (not under `features/advanced-filter`), typed over a
      generic column id; the advanced filter is its only consumer.
- [ ] The trigger renders the `columns` sprite icon only — no text label at any viewport.
- [ ] The popover body (checkbox grid) behaves as before; the `or_and` → "And/Or" relabelling stays
      with the advanced filter caller (e.g. via the column's display name), not inside the shared
      component.
- [ ] No other change to the advanced filter page (`AdvancedFilter.tsx` column state and
      `AdvancedFilterTable` untouched beyond the import).
- [ ] `(human)` On `/advanced-filter` the icon-only button sits where the labelled one did, opens the
      same column list, and toggling columns still shows/hides table columns.

## Details

Source: `src/features/advanced-filter/components/ColumnsButton.tsx`, imported only by
`src/features/advanced-filter/pages/index/AdvancedFilter.tsx`. Target location: `src/shared/filters/`,
beside `PopoverFilter` and `FilterButton` (the other shared action-bar controls). Keep the popover on all
viewports; the mobile drawer is a style decision taken in T03's `[human]` leaf and inherited here because
the button is shared.

Advanced filter reference mockup (icon-only button):
https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-26175

## Leaf worklist

- [ ] 1 `[agent]` Move `ColumnsButton` to `src/shared/filters/`, generic column id, drop the label;
      rewire the advanced filter import; keep `or_and` naming at the call site
- [ ] 2 `[agent]` Unit spec for the shared button (renders every column, emits the toggled set)
