# 13 — Page transition: keep the current rows dimmed until the next page arrives

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 13 of #3697 |
| Blocked by | T03, Q01 |

## What to build

The one behaviour change the designer must confirm (Q01), isolated so it can be shipped or dropped on
its own. The composed hook's `placeholderData` becomes the function described in the parent spec:
previous data when the previous query key differs from the new one only by cursor, the caller's stub
otherwise. `isTransitioning` becomes true in the first case and `isInitialLoading` in the second. With
the plumbing from T03 and the fan-out already in place, page changes on every migrated list keep the
current rows visible, dimmed and non-interactive, then replace them in one commit; first load and
filter / sort changes still show skeletons (FR7, FR8). The `DataList` treatment is then styled to
Q01's answer.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, address Transactions tab, `/txs`, `/blocks`.

- [ ] The hook's `placeholderData` keeps previous data only when resource, path params, filters,
      sorting and chain are unchanged and only page / cursor differ; unit spec covers page change (rows
      kept, `isTransitioning` true), filter change (stub, `isInitialLoading` true), first load (stub),
      and "Prev" onto a cached page (neither flag).
- [ ] `pagination.isLoading` is true in both placeholder cases.
- [ ] `useLazyRenderedList` still resets on every dataset change (`queryHash` changes on page change).
- [ ] `DataList` transition treatment matches Q01: opacity value or token, transition and duration;
      sticky header and sort buttons stay interactive; `TODO (design):` marker removed; Playwright
      screenshot baseline generated.
- [ ] Lint, tsc, unit and Playwright tests green.
- [ ] `(human)` Next / prev on a list: rows dim, pagination buttons disable, new rows appear in one
      commit with no skeleton; filter change still shows skeletons; socket "new items" notice on page 1
      still prepends.

## Details

Q01's answer in `questions.md` carries the visual values; the parent spec's UI inventory names the
state. Until the human style leaf runs, the interim look from T03 stays.

## Leaf worklist

- [ ] 1 `[agent]` Hook `placeholderData` decision and the two flags; spec scenarios
- [ ] 2 `[human]` Style the `DataList` transition state per Q01; generate the Playwright baseline
- [ ] 3 `[human]` Verify per the `(human)` criterion
