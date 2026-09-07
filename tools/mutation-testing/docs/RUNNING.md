# Mutation testing — running it

`pnpm test:mutation-testing --help` lists the flags. This page covers what they do not: run cost, limits, CI behavior, and repo quirks required for Stryker to boot.

## What a run costs

Runtime follows **import-graph centrality, not mutant count**. Stryker's dry run executes everything related to mutated code: five leaf utilities with 140 mutants finished in 10 seconds, while one 28-mutant file imported across the app took 70. Diff size predicts nothing.

Runs are therefore bounded by wall clock (`--budget`, default in `../config.ts`), not mutant count. A count limit would need to track Stryker's generator and still would not predict runtime.

Central changes are the cases worth expecting. If a run truncates:

- narrow it — a focused run on one file answers the same question for that file;
- or raise `--budget` and let it finish.

**A truncated run is not a pass.** Its table covers only reached mutants and reports the selection completed. CI also adds a warning annotation because a green job is easy to overlook. Its findings are real; unreached mutants remain unknown.

## Determinism

Runs over an unchanged tree must produce identical counts; otherwise survivors become debatable instead of actionable. Three settings in `../stryker.config.json` ensure this: 
- static mutants are ignored because whether they are killed depends on module load order across the suite; 
- the per-mutant timeout exceeds Vitest's to prevent slow machines scoring timeouts as kills and fast machines as survivals; 
- drift specs are excluded (`./SCOPE.md`).

`--changed` invokes git without setting a working directory, so it scores the diff from the directory where you run it. `./run.sh` locates itself to compile, so it runs from anywhere. Compilation is cwd-independent; the diff is not.

## Output on disk

Reports and Stryker's per-run sandbox live in this gitignored folder. A complete run prints the HTML report location; use it to see a mutant's actual diff, which the terminal report omits.

The key failure mode is mistaking a stale report for a fresh one. That is why each run clears previous output before starting, not after finishing.

## In CI

`.github/workflows/checks.yml` → the `mutation_tests` job, diff-scoped against `origin/main`, runs only on pull requests. Two details:

- **Its own job, not a unit-test step.** It cannot reuse that job's artifacts because Stryker drives Vitest once per mutant.
- **Chained after the unit-test job.** If the suite is red, Stryker aborts during its dry run, making the error look like a tooling failure rather than the failing test. Job ordering ensures the honest message appears first.

The job timeout is separate from the run's wall-clock budget, so an expired run can still print its truncation report instead of being killed mid-write.

## Why Stryker needed repo-level plumbing

Two integration issues are solved outside this folder and are easy to misdiagnose:

- **`pnpm-workspace.yaml` has a scoped `minimatch@10>brace-expansion` override.** The repo globally pins `brace-expansion` to a 1.x security override, but Stryker's `minimatch` dependency needs the 5.x ESM build. Without the scoped override, Stryker does not boot. The global pin remains unchanged.
- **`../stryker.config.json` explicitly lists the Vitest runner in `plugins`.** Otherwise Stryker discovers plugins by globbing its own `node_modules` scope, which pnpm's isolated layout prevents. The resulting “no TestRunner plugins were loaded” error looks like a missing dependency rather than a resolution-layout issue.

The config's `ignorePatterns` address the same problem: Stryker copies the project into a per-run sandbox, and without them the copy fails on symlinks under agent worktree directories.