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
