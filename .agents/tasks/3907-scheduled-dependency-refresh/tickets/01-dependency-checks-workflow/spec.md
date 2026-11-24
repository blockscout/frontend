# 01 — Dependency checks workflow with a full unit run

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3907 |
| Blocked by | none |

## What to build

A new workflow, the dependency checks, that starts when a pull request changes `pnpm-lock.yaml` and can be
started by hand on any branch. Its first job runs the whole unit suite, so a lockfile-only pull request no
longer passes with zero tests run. The regular checks workflow stays as it is.

The same ticket removes the dead end-to-end workflow and the commented-out reference to it in the
pre-release workflow.

## Acceptance criteria

- [ ] The workflow triggers on `pull_request` only when `pnpm-lock.yaml` is in the diff, and on
      `workflow_dispatch`.
- [ ] It runs on draft pull requests too, unlike the regular checks. This is temporary: ticket 08 adds the
      draft skip once the runs on this pull request are confirmed.
- [ ] Its unit job runs the full suite: no `--changed`, no `--passWithNoTests`.
- [ ] `.github/workflows/checks.yml` is unchanged.
- [ ] `.github/workflows/e2e-tests.yml` is deleted and `pre-release.yml` carries no `e2e_tests` block.
- [ ] No doc still points at `e2e-tests.yml` as a live workflow (`pnpm lint:doc-links` passes).

## Details

**Not required for merging (FR5).** That is the branch protection of `main`, not code. Its required checks
hold `Code quality` only, so this ticket has nothing to do there beyond not asking for a change.

**Drafts.** The regular checks skip drafts because every spec-first pull request starts as one. The
dependency checks run on them for now: the workflow cannot be dispatched before it is on `main`, so this
task's own draft pull request is where it gets its first real runs (tickets 06 and 08). Ticket 08 then
makes it skip drafts like the regular checks.

**Shape to copy.** The `vitest_tests` job of `checks.yml`: pnpm and node setup, frozen-lockfile install,
shuffled spec order. Drop its change-scoped flags and the complexity and React Doctor steps, which are
diff-scoped gates of the regular checks.

**Later tickets add jobs here:** the build and smoke job (ticket 04) and the audit step (ticket 08).

**Leftover references.** `docs/research/tanstack-start-migration.md` names `e2e-tests.yml` twice. It is a
dated research note; fix the two mentions only if the doc-links check objects.

## Leaf worklist

- [ ] 1 `[agent]` Add the dependency checks workflow with the lockfile trigger, manual dispatch and the full unit job
- [ ] 2 `[agent]` Delete `e2e-tests.yml` and the disabled `e2e_tests` block in `pre-release.yml`
