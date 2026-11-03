# 10 — After profile and the performance verdict

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 10 of #3838 |
| Blocked by | T09 |

## What to build

The same two scenarios as ticket 01 recorded on the finished branch in the same build flavor, compared
with `pnpm profile:analyze <before> <after>`, and the verdict written down. FR7 is met when the after
render time is no worse; if it is worse, the ticket stops with the delta table and the entity components
that regressed named, so the follow-up can be scoped — further perf work is out of this task's scope.
The task's `CONTEXT.md` gets its final pass against the shipped code.

## Acceptance criteria

How to verify: `pnpm prod:preset eth --profile`, open the two URLs in ticket 01 Details

- [ ] Two "after" exports exist in `.ai/tmp/`; `notes.md` holds the delta table for each scenario and the
      SHA of the build.
- [ ] Render time of both scenarios is no worse than the ticket 01 baseline, or the ticket is stopped with
      the regressing components named in `notes.md`.
- [ ] `src/shared/entities/CONTEXT.md` matches the shipped contract; `pnpm lint:doc-links` passes.
- [ ] `(human)` Each recording covers the real-data commit at 50 rows, as in ticket 01.

## Leaf worklist

- [ ] 1 `[agent]` Build and serve the profiling build on the finished branch; record the SHA
- [ ] 2 `[human]` Record both scenarios and export to `.ai/tmp/`
- [ ] 3 `[agent]` Run the before/after comparison; write the verdict in `notes.md`
- [ ] 4 `[agent]` Final pass over `src/shared/entities/CONTEXT.md`
