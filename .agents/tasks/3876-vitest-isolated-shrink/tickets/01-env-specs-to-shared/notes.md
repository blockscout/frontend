# Notes — 01 Env-override specs join the shared project

## Baseline

Measured on `3561237de` (the tip of `issue-3876` before this ticket changed anything), 2026-11-12.

### Spec files per project

| Project | Spec files | Share |
| --- | --- | --- |
| `shared` | 233 | 72.4% |
| `isolated` | 89 (80 `*.isolated.spec.ts(x)`, 9 `*.primed.spec.tsx`) | 27.6% |
| Total | 322 (3530 tests) | |

### Local: three shuffled full runs

`pnpm test:vitest --sequence.shuffle.files`, run back to back. Apple M2, 8 cores, 24 GB, Node 24.21.0,
Vitest 5.0.0. Other sessions were active on the machine; the 1-minute load average read 5.9 before the
first run and 23–28 before the next two, most of it the runs themselves.

| Run | Seed | Result | Vitest duration |
| --- | --- | --- | --- |
| 1 | 1794468277887 | 322 files, 3530 tests passed | 77.75s |
| 2 | 1794468356114 | 322 files, 3530 tests passed | 79.41s |
| 3 | 1794468435989 | 322 files, 3530 tests passed | 75.53s |

Mean 77.56s.

### CI: the unit job

The ticket asks for three recent runs on `main`. There are none: the Checks workflow runs on
`pull_request`, on `workflow_dispatch`, and from the pre-release workflow on a tag; nothing runs it on a push
to `main`. A pull-request run executes only the specs related to the diff (`--changed=origin/main`), so a
full-suite run of the unit job comes from a manual dispatch or a pre-release tag (the last one, v2.13.0-alpha.1,
predates the two-project split).

The three most recent full-suite runs at the two-project shape are the manual dispatches on the #3880 branch
(`05a023dd`), the same three that pull request reported as its "after". Main has gained three spec files
since (319 → 322); no newer full-suite run exists, and no run was dispatched from this session.

| Run | Seed | Result | Vitest duration | `Run Vitest` step | Unit tests job |
| --- | --- | --- | --- | --- | --- |
| [43000038407](https://github.com/blockscout/frontend/actions/runs/43000038407) | 1794391592600 | 319 files, 3491 tests passed | 129.42s | 2m10s | 4m04s |
| [43002941426](https://github.com/blockscout/frontend/actions/runs/43002941426) | 1794392818451 | 319 files, 3491 tests passed | 100.85s | 1m41s | 3m17s |
| [43002958403](https://github.com/blockscout/frontend/actions/runs/43002958403) | 1794392836779 | 319 files, 3491 tests passed | 140.86s | 2m21s | 4m19s |

Mean Vitest duration 123.71s. Ticket 05 measures "after" with a manual dispatch on this branch, which runs the
same full-suite command.

## Pinning the unexplained failure

**Cause: the test timeout.** It recurred in 3 of 20 shuffled full runs, once the 44 env specs ran in the
`shared` project at its 5s default. Every failure was `Test timed out in 5000ms`, in the first test of the
app error screen spec or the color-theme settings spec — two of the three files the research run hit. That
first test is the one that pays for `withEnvs` re-evaluating the app's module graph inside the test body.

The runs were made on this ticket's renamed specs before the timeout changed, back to back, with
`pnpm test:vitest --sequence.shuffle.files --reporter=default --reporter=json`, on the machine of the baseline
above. Other sessions loaded it: the 1-minute load average read 3 before the first run and 12–47 before the
rest.

| Runs | Seeds | Result |
| --- | --- | --- |
| 1–17 | 1794469388317, 1794469449870, 1794469516521, 1794469579014, 1794469662663, 1794469739208, 1794469809444, 1794469892170, 1794469972831, 1794470054017, 1794470137473, 1794470219984, 1794470307476, 1794470396867, 1794470482346, 1794470570282, 1794470664783 | passed, 61–94s |
| 18 | 1794470752370 | 1 failed: app error screen (5011ms) |
| 19 | 1794470861772 | 2 failed: color-theme settings (5762ms), app error screen (5030ms) |
| 20 | 1794470957114 | 1 failed: color-theme settings (5123ms) |

The passing runs show the same tests creeping up on the limit with the load: the slowest test of the app
error screen spec reached 4.7s, of the color-theme settings spec 4.6s, of the advanced-filter page spec 2.5s.

Failing output, run 19 (run 18 and run 20 print the same error for one of the two tests):

```text
 FAIL  |shared| src/shell/top-bar/settings/fields/color-theme/SettingsColorTheme.spec.tsx > SettingsColorTheme > offers the Auto (System) swatch after the concrete themes
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/shell/top-bar/settings/fields/color-theme/SettingsColorTheme.spec.tsx:103:3

 FAIL  |shared| src/shared/errors/AppError.spec.tsx > rate limit error screen > offers the wait only when the instance has no reCAPTCHA site key
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/shared/errors/AppError.spec.tsx:37:3

 Test Files  2 failed | 320 passed (322)
      Tests  2 failed | 3528 passed (3530)
```

**Outcome:** the `shared` project's test timeout is now 10s, in `vitest.config.ts`. No per-test override was
added. In the five verification runs below, the slowest color-theme settings test took 5.8s and passed.

## After this ticket

Spec files: 277 `shared`, 45 `isolated` (36 `*.isolated.spec.ts(x)`, 9 `*.primed.spec.tsx`), 14.0% isolated.
Not a timing comparison; that is ticket 05's, against the baseline above.

Five consecutive shuffled full runs with the 10s timeout, all 322 files and 3530 tests passed:
seeds 1794471138019, 1794471202208, 1794471311528, 1794471422545, 1794471524842 (1-minute load average 8–22).
