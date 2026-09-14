# 13 — Page transition: keep the skeleton pass, defer the dimmed state

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 13 of #3697 |
| Blocked by | T03, Q01 |

## What to build

The behaviour change originally scoped here (previous rows kept dimmed while the next page loads) is
deferred to #3704 because its design is not ready. This ticket pins the current behaviour instead: a
page change renders the caller's stub (skeleton rows) exactly like first load and filter / sort
changes, and the `isTransitioning` plumbing from T03 stays wired but inert. The hook's unit spec gains
a scenario that walks pages 1 → 2 → 3 and asserts the stub, `isInitialLoading` and
`pagination.isLoading` during each in-flight page and `isTransitioning` false throughout. The
`TODO (design):` marker in `DataList` becomes a plain `TODO` pointing at #3704. The parent spec's FR7,
UI inventory and placeholder decision are edited in place to state the deferral, and Q01 is waived with
the follow-up issue as its answer.

## Acceptance criteria

- [x] Unit spec covers page 1 → 2 → 3: while each next page is in flight `data` equals the stub (not
      the previous page), `isInitialLoading` and `pagination.isLoading` are true and `isTransitioning`
      is false; after the response lands both loading flags are false.
- [x] `DataList` keeps the `isTransitioning` prop and its interim look; its marker is a `TODO` that
      links #3704.
- [x] `spec.md` FR7, UI inventory and the placeholder decision state the deferral; Q01 is `waived`
      with #3704 as the answer.
- [x] Lint, tsc and unit tests green.

## Leaf worklist

- [x] 1 `[agent]` Spec scenario for the page-change skeleton pass; retarget the `DataList` marker
- [x] 2 `[agent]` Fold the deferral into `spec.md`, `questions.md` and this ticket
