# 05 — Record what stays isolated and prove the suite

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3876 |
| Blocked by | T02, T03, T04 |

## What to build

A developer who opens an isolated spec can find, in the unit-test rules, why it is isolated: every spec
left in the `isolated` project belongs to a named category with its reason, and every spec tickets 02–04
tried and could not move is listed individually. The suite is shown to be order-independent at its final
shape, and the task's before and after numbers are recorded for the pull request description to quote.

## Acceptance criteria

- [ ] The "Isolation" section of the unit-test rules carries the table of what stays isolated and why
      (parent spec → "What stays isolated, and why"), corrected for whatever tickets 02–04 actually found.
- [ ] Every spec listed in the `notes.md` of tickets 02, 03 and 04 as staying isolated appears in that
      section individually, with its reason.
- [ ] Every spec in the `isolated` project falls under a row of the table or is listed individually; none
      passes the shared-spec lint rules.
- [ ] Twenty consecutive `pnpm test:vitest --sequence.shuffle.files` runs pass, each on a different seed.
      `notes.md` in this ticket folder lists the seeds.
- [ ] A `--changed` run with coverage writes its coverage report; the CRAP gate scores a file from it; a
      mutation-testing run kills mutants through a spec of each project.
- [ ] `notes.md` holds the before/after table: spec-file count per project and isolated share, Vitest's
      reported duration locally (the same number of runs as the baseline in ticket 01's `notes.md`) and
      for the CI unit job.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:doc-links` pass.

## Details

- The baseline is in ticket 01's `notes.md`. Measure "after" the same way; say so in the table when the
  machine or its load differed.
- The CI "after" duration needs a run of the Checks workflow on this branch. Drafts skip it by design, so
  trigger it manually, as the pull request of #3873 did; if that is not possible from the session, record
  the local numbers, leave the CI cell marked as pending, and say so in the hand-back.
- The table stays in `notes.md`; post nothing to the pull request. The developer has it carried into the
  pull request description at finalization. Name the file and its table in the hand-back so that step is
  not missed.
- A failing seed among the twenty is a finding: replay it with `--sequence.seed`, fix the order dependence
  in the spec that has it, and restart the count. A spec that cannot be made order-independent goes back
  to the isolated name with its reason listed.

## Leaf worklist

- [x] 1 `[agent]` Write the "what stays isolated" table and the individual fallbacks into the unit-test rules
- [x] 2 `[agent]` Check every isolated spec against the table and the lint rule
- [x] 3 `[agent]` Run twenty shuffled full runs; record the seeds
- [x] 4 `[agent]` Check `--changed` with coverage, the CRAP gate and the mutation-testing gate
- [x] 5 `[agent]` Measure "after" and write the before/after table to `notes.md`
