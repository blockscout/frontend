# 03 — CI wiring + GitHub annotations

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 03 of #3663 |
| Blocked by | T02 |

## What to build

Run the gate on real PRs from inside the existing `vitest_tests` job in `.github/workflows/checks.yml`.
Enable coverage on the affected-tests run (`--coverage`, `@vitest/coverage-v8`) so it emits a
`coverage-final.json`, then run the tool as a post-step that consumes that file and the `origin/main`
diff. Under `$GITHUB_ACTIONS` the CLI additionally emits `::error file=,line=::` annotations for each
offender and writes the full table to `$GITHUB_STEP_SUMMARY`. The job keeps its provisional
thresholds until ticket 04 calibrates them; the step passes no threshold numbers (they live in the
tool per FR12).

## Acceptance criteria

- [x] `(human)` The `vitest_tests` job runs `vitest --changed` with `--coverage`, produces a
      `coverage-final.json`, and a post-step runs the tool against it — verified from a CI run on a
      PR that touches an in-scope file.
- [x] Under `$GITHUB_ACTIONS` the CLI emits `::error file=,line=::` annotations for offenders and
      writes the table to `$GITHUB_STEP_SUMMARY`; outside CI it prints only the table.
- [x] The gate fails the job (non-zero exit) when a touched function breaks a threshold and passes
      when none do.
- [x] The CI step carries no threshold numbers — thresholds come from the tool config.

## Details

- Coverage config: enable `@vitest/coverage-v8` with the `coverage-final.json` (json) reporter;
  confirm it resolves in the pnpm store (spec's coverage-rides-the-affected-run decision).
- `vitest --changed` runs every spec that transitively imports a changed module, so the coverage
  collected for a changed file equals its whole-suite coverage — affected-scoped coverage is correct
  (spec decision), not an undercount.

## Skill inputs

None — no project skill applies to this ticket.

## Leaf worklist

- [x] 1 `[agent]` Enable `--coverage` (`@vitest/coverage-v8`, `coverage-final.json` reporter) on the
      `vitest_tests` affected-tests run in `checks.yml`
- [x] 2 `[agent]` Add the post-step invoking the tool on the produced coverage file + `origin/main`
- [x] 3 `[agent]` `$GITHUB_ACTIONS` output path — `::error` annotations for offenders +
      `$GITHUB_STEP_SUMMARY` table
- [x] 4 `[human]` Open a PR and confirm the job runs coverage, the post-step gates, and annotations
      land on the diff
