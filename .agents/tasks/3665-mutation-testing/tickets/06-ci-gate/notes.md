# Notes — 06

## `process.chdir()` in a spec aborts the whole run (found while verifying T03)

Stryker's vitest runner passes `pool: 'threads'` to `createVitest` as a command-line override
(`vitest-test-runner.js`, `#getVitestPoolConfig`), so a config-file `pool` setting cannot win. In a worker
thread `process.chdir()` throws, and any spec calling it fails the **dry run** — which aborts the entire run
with `ConfigError: There were failed tests in the initial test run.`, exit code 1, and no report.

`tools/mutation-testing/select/files.spec.ts` switches into a throwaway git repository that way for its
git-backed modes, so a diff-scoped run that selects `select/files.ts` aborts:

```
ERROR DryRunExecutor One or more tests failed in the initial test run:
	git-backed modes selects only the eligible files the branch itself touched
		process.chdir() is not supported in workers
```

This matters for the gate: a PR touching that file (this branch's own PR included) fails the job for a
tooling reason, not a finding. The fix is to make the selection's git calls take a working directory rather
than move the process into one — which means threading a `cwd` through the complexity gate's
`select/diff.ts` helpers, wider than T03 was scoped for. Decide in this ticket whether the gate works around
it (skipping those specs under `STRYKER_MUTATOR_WORKER`, which downgrades their mutants to no-coverage) or
the specs get fixed properly.

**Decided: the specs were fixed properly, inside T03.** `selectFiles` takes the repository to resolve
against as an argument, and `select/files.spec.ts` addresses its throwaway repo by path
(`execFileSync(..., { cwd: repo })`) instead of moving the process into it. The gate needs no
workaround, and a PR touching `select/files.ts` — this branch's own included — runs clean.

## What stood in for the deferred PR run

The `(human)` criterion needs a non-draft PR, which is after T07. Verified locally instead, with
`GITHUB_ACTIONS=1` set so the annotation path ran:

- **Fails on a survivor.** Deleting one assertion from `render/truncation.spec.ts` produced
  `::error file=tools/mutation-testing/render/truncation.ts,line=21::…` and exit 1. Restoring it:
  exit 0, no annotations.
- **A well-formed disable suppresses.** `// Stryker disable next-line ConditionalExpression: <reason>`
  above that line dropped the file from 12 scored mutants to 10 and the survivor with it. Swapping it
  for `// Stryker disable all` made the ESLint rule error on the real file.
- **Wall time.** A diff-scoped run over this branch's whole diff — 12 files, 761 generated / 288 scored
  mutants — took **34 s**. The job's prelude (checkout at `fetch-depth: 0`, pnpm, node, frozen install)
  measured **86 s** on run `33516039521`'s identical `vitest_tests` steps, which is what `timeout-minutes:
  20` is sized against: 15-min budget + prelude + teardown ≈ 17 min worst case.

What could not be checked without GitHub rendering it: that the annotations land on the right diff
lines. The file/line pairs in the directives are correct and repo-relative.

## Outstanding: the gate fails this branch

That same rehearsal reported **18 survivors, score 77%** — in the tool's own code, not tooling noise:
`index.ts` L120/L128, `render/table.ts` L9/L13, `select/files.ts` L65/L68/L85, `select/ranges.ts`
L31/L32, `stryker/report.ts` L111/L112/L130, `stryker/stream.ts` L44. Plus 49 no-coverage mutants
(31 of them in `stryker/invoke.ts`), which do not gate.

So the task's own PR is red until those assertions are strengthened. Not T06's scope — T06's job was to
make the gate fail correctly, which it does — but it has to be dealt with before this lands.
