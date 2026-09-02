# 01 — Stryker boots on this repo

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3665 |
| Blocked by | none |

## What to build

StrykerJS installed and configured so that a bare `stryker run` over one hand-named source file completes
and reports killed/survived counts. Two pnpm integration blockers stand in the way and are both solved by
configuration, not by code (see the parent spec's Implementation decisions). Everything the run needs that
does not vary per invocation lives in a committed `stryker.config.json`: the mutator restriction, the
determinism settings, the reporters and their output paths.

No CLI yet — this ticket's deliverable is that Stryker itself works here, which is the thing every later
ticket assumes.

## Acceptance criteria

How to verify: `./node_modules/.bin/stryker run --mutate <some src file with a co-located spec>`

- [ ] The run completes: no "no TestRunner plugins were loaded", no `minimatch`/`brace-expansion` boot error,
      no failure on symlinks under `.claude/worktrees/`.
- [ ] Only conditional-expression, equality-operator, logical-operator, arithmetic-operator and
      boolean-literal mutants appear in the report. No string-literal, array/object-declaration,
      block-statement, optional-chaining, method/call-expression, arrow-function or regex mutants.
- [ ] Two consecutive runs over an unchanged tree report identical killed / survived / no-coverage counts.
- [ ] The vitest runs Stryker drives do not execute `*.primed.spec.tsx`.
- [ ] `stryker.config.json` carries a `$schema` pointer and every non-varying setting; nothing needed for a
      plain run is passed on the command line.
- [ ] The JSON and HTML reports land under `tools/mutation-testing/reports/`, the sandbox under
      `tools/mutation-testing/.stryker-tmp`, and both are gitignored.
- [ ] The global `brace-expansion` security override in `pnpm-workspace.yaml` is unchanged.
- [ ] `(human)` The lockfile delta is reviewed: Stryker's dependency tree brings nothing unexpected, and the
      scoped override does not widen the global 1.x pin.

## Details

**The two blockers.** The scoped `brace-expansion` override follows the `vite-plugin-dts>brace-expansion`
precedent already in `pnpm-workspace.yaml`'s `overrides` block — add a sibling entry for the dependency path
that reaches Stryker's `minimatch`, and leave the global `brace-expansion: "1.1.12"` pin alone. The vitest
test runner must be named explicitly in the config's `plugins` array, because Stryker discovers plugins by
globbing `node_modules/@stryker-mutator/*` and pnpm's isolated layout defeats that.

**Determinism (FR10).** Static mutants ignored by default, and a raised mutation timeout — a mutant that
times out under load would otherwise flip between `timeout` and `survived` between runs.

**Sandbox.** Stryker copies the project per run, so its ignore patterns need tuning; left untuned it fails
outright on the symlinks under agent worktree directories.

**Reporters.** `json` and `html` both on; the clear-text reporter is unusable at this scale (FR8) and later
tickets read the JSON. `tempDirName` points the sandbox inside the tool folder rather than the repo root.

**Gitignore.** The existing `/tools/code-complexity/dist/` line is the placement precedent.

## Leaf worklist

- [x] 1 `[agent]` Add the Stryker dependencies and the scoped `brace-expansion` override; verify a bare run
      boots
- [x] 2 `[agent]` Write `tools/mutation-testing/stryker.config.json` — explicit plugin list, logic-only
      mutators, `ignoreStatic`, raised timeout, primed-spec exclusion, sandbox ignores, json + html reporters
      into `tools/mutation-testing/reports/`
- [x] 3 `[agent]` Gitignore the reports directory and the sandbox
- [x] 4 `[agent]` Verify determinism: two runs, identical counts
