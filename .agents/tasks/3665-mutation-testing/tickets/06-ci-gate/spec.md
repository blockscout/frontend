# 06 — The PR gate

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 06 of #3665 |
| Blocked by | T03, T05 |

## What to build

A CI job that runs the tool diff-scoped on every pull request and fails when any mutant on a changed line
survives. Findings are additionally emitted as inline annotations on the PR diff, naming the surviving
mutator and the line, so a weak assertion is visible during review rather than buried in a job log.

Suppressing a mutant stays possible but must be a reviewable claim: Stryker's disable comment carrying both
the mutator name and a reason. Blanket file-level disables are not permitted, and an ESLint rule enforces
that rather than leaving it to review discipline.

## Acceptance criteria

- [ ] The job runs only on pull requests, diff-scoped against `origin/main`, and carries an explicit timeout.
- [ ] It is its own job, chained on the unit-test job. It does not attempt to reuse that job's coverage
      artifacts.
- [ ] A surviving mutant on a changed line fails the job; no survivors passes it.
- [ ] Each survivor produces a `::error file=…,line=…::` annotation naming the mutator, and the annotation
      appears inline on the diff.
- [ ] A no-coverage mutant alone does not fail the job — that is the CRAP gate's finding, not this one.
- [ ] `// Stryker disable all` and any file-scoped disable are an ESLint error.
- [ ] A disable comment missing either the mutator name or the `: reason` is an ESLint error; one carrying
      both passes and does suppress the mutant.
- [ ] The ESLint rule has unit coverage, or is verified against fixture files in both directions.
- [ ] `(human)` The first real PR run behaves: the job is ordered correctly, its wall time is acceptable, and
      the annotations land on the right lines.

## Details

**Job placement.** `.github/workflows/checks.yml`; `vitest_tests` is the job to chain on and the shape to
copy (checkout with `fetch-depth: 0` so the merge-base resolves, pnpm + node setup, frozen-lockfile install).

**Why its own job (FR14).** Stryker must drive vitest itself, so the unit-test job's coverage artifacts are
useless here. It chains on that job because a red suite makes Stryker abort during its dry run with an error
that reads like a tooling failure.

**Annotations** follow `tools/code-complexity/render/github.ts` — pure formatters returning the directive
strings, with the `process.env.GITHUB_ACTIONS` guard and the stdout writes in `index.ts`. Annotation messages
are single-line; newlines truncate the directive.

**The ESLint rule** is defined inline in `eslint.config.mjs`, following the `spdxLicenseRule` precedent
already there, and reads comments via `context.sourceCode.getAllComments()`.

## Leaf worklist

- [ ] 1 `[agent]` Emit `::error` annotations for survivors and set a failing exit code; specs
- [ ] 2 `[agent]` Add the CI job to `checks.yml`, chained on `vitest_tests`, with a timeout
- [ ] 3 `[agent]` Add the inline ESLint rule for well-formed Stryker disable comments; specs
- [ ] 4 `[human]` Confirm the first real PR run — ordering, wall time, annotation placement
