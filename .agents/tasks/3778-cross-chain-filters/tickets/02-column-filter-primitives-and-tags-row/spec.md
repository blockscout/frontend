# 02 — Column-filter primitives refactor and the shared active-filter tags row

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3778 |
| Blocked by | none |

## What to build

Two prefactors the cross-chain filters build on, plus the advanced-filter page restyle the spec asks for (FR9).

**Primitives.** `src/shared/filters/TableColumnFilterWrapper` becomes `ColumnFilter` — the trigger button
plus the popover, the main component. It drops the `className` prop and the `chakra()` factory; the popover
content is styled through an explicit `contentProps` prop (the per-column `w` the two `FilterByColumn`
switches pass today). The `display: flex / flexDir: column / rowGap: 3` layout leaves `PopoverBody` and moves
into the content component. `src/shared/filters/TableColumnFilter` becomes `ColumnFilterContent` — the
title + Reset header, the children, the Filter button — and owns that column layout. Every consumer is
updated: `FilterByColumn` and the filter components under `advanced-filter/components/filters/`,
`ZetaChainFilterByColumn` and the zeta-chain filter components. `AddressRelationFilter` (the `or_and`
column) keeps using `ColumnFilter` alone, as it does now. The two stay separate components: the trigger's
`selected`/width belong to the column switch while `isFilled`/`isTouched` are popover-local state owned by
each filter component, and the `or_and` column has no content part at all. Behaviour-preserving: the
existing `FilterByColumn.pw.tsx` baselines must not change.

**Tags row.** A new shared component in `src/shared/filters/` renders active filters as closable
`Tag variant="filter"` tags followed by a "Reset all" link-style control. It takes the tags
(`{ key, name, value }`), `onClear(key)` and `onClearAll`, accepts optional non-closable leading /
placeholder tags, renders nothing when it has no tag at all, shows "Reset all" only when at least one
closable tag is present, and is not sticky. The `filter` tag variant's close trigger keeps its 20px box and
gains 4px padding so the icon renders at 14px; other tag variants are untouched. The advanced-filter page
replaces its inline "Filtered by:" / right-aligned "Reset filters" markup with the shared row, keeping its
non-closable "Chain" tag and the default "Type: All" / "Age: 7d" placeholder tags when no filter is active.
`ZetaChainFilterTags` is out of scope.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/advanced-filter`, set and clear a few filters.

- [ ] `TableColumnFilterWrapper` / `TableColumnFilter` no longer exist; `ColumnFilter` and
      `ColumnFilterContent` replace them in every consumer, `ColumnFilter` has `contentProps` and no
      `className`, and `ColumnFilterContent` owns the column layout
- [ ] `FilterByColumn.pw.tsx` passes without baseline changes
- [ ] A shared tags-row component exists in `src/shared/filters/`, renders only when it has a tag, and
      shows "Reset all" right after the tags only when a closable tag is present
- [ ] The `filter` tag variant's close trigger is a 20px click area with a 14px icon; other variants unchanged
- [ ] The advanced-filter page uses the shared row: no "Filtered by:" title, "Reset all" after the tags,
      Chain tag and Type/Age placeholder tags preserved
- [ ] Affected Playwright baselines (advanced-filter page, toolkit `Tag` if it has a `filter` case) are
      regenerated with `--docker`
- [ ] `(human)` The advanced-filter tags row matches the mockup at every breakpoint

## Details

- Tags-row mockup: Figma node `9138-91679` (inside the empty-state frame `9136-48611`). Its tags are
  illustrative; on the advanced-filter page the real ones come from `getFilterTags`.
- Close-trigger sizing lives in the `filter` variant block of `src/toolkit/theme/recipes/tag.recipe.ts`,
  scoped so the `closeTrigger` slot changes only for that variant.

## Leaf worklist

- [ ] 1 `[agent]` Rename and reshape the two primitives (`ColumnFilter` with `contentProps`,
      `ColumnFilterContent` owning the column layout) and update every consumer; run `FilterByColumn.pw.tsx`
- [ ] 2 `[agent]` Build the shared tags-row component, scope the 14px close icon to the `filter` tag variant,
      swap the advanced-filter page onto the row — [Figma](https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9138-91679)
- [ ] 3 `[human]` Regenerate affected Playwright baselines with `--docker` once the row is approved
