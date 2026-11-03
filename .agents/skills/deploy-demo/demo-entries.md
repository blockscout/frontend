# Demo entries

The one home for what a task's demo answer means — from the grilling question, through the spec header's
`Demo` row, to the `deploy-demo` runs that `finalize-task` and `create-pr` Mode C trigger. The skills that
ask, write and deploy link here; none restates it.

## The answer

`none`, or **up to two** presets from `tools/dev-server/registry.json`. `none` is a decision, not a
blank: the land step reads it and deploys nothing.

Two is the cap because the workflow has two deployment slots, the `variant` input's `review` and
`review-2`. `review-2` disables ENVs validation, which is what a `multichain` demo needs. Refuse a third
preset with that reason.

## The row

```
| Demo | none |
| Demo | <preset> |
| Demo | <preset> (review-2) |
| Demo | <preset> · <preset> |
```

Entries are **positional**: the first deploys on `review`, the second on `review-2`. So a preset that
needs validation off (`multichain`) goes second. The `(review-2)` mark exists only for a **single** entry
that needs that slot; never mark one of two. A small task without a spec holds the same answer in
session, in the same shape.

## The runs

One `deploy-demo` run per entry, **sequentially**, with explicit inputs:

| Entry | Inputs |
| --- | --- |
| first of two, or a single unmarked entry | `--preset <p>` |
| second of two | `--preset <p> --variant review-2 --no-build` |
| single entry marked `(review-2)` | `--preset <p> --variant review-2` |

The second run reuses the image the first built, and `deploy-demo` aborts on a run already in progress,
so wait for the first run to complete before triggering the second.

**A failed first run is two different things**, and the workflow's jobs tell them apart (`gh run view <run
id> --json jobs`). The `Publish Docker image` job builds the image and the `Deploy frontend` job deploys
it, running only after a successful or skipped build. Both call reusable workflows, so the rows come back
named `<caller> / <callee>` when the job ran, and by the bare caller name only when it was `skipped`:

- `Publish Docker image / Run` failed, `Deploy frontend` skipped → no image exists. Do not trigger the
  `--no-build` run; report the failed run and name both entries as not deployed.
- `Publish Docker image / Run` succeeded, `Deploy frontend / Deploy` failed → the image is there. Report
  the failed deploy and trigger the second entry as planned; it deploys from that image.

Collect each run's deployment URL from `deploy-demo`'s output for the report. Post **no** demo comment on
the PR: GitHub's deployment entry already links it.
