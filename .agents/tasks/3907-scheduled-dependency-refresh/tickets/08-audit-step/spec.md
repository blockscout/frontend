# 08 — Vulnerability audit in the dependency checks

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 08 of #3907 |
| Blocked by | T01, T07, T10 |

## What to build

A step in the dependency checks that fails when the lockfile holds a runtime dependency with a known
vulnerability of high or critical severity. An advisory the team has decided to live with is skipped
through the ignore entries ticket 07 added, each with its reason. The audit runs nowhere else.

## Acceptance criteria

- [ ] The dependency checks audit runtime dependencies only and fail at high and critical severity.
- [ ] Development dependencies and advisories of medium and low severity do not fail it.
- [ ] The audit reads the ignore entries in `pnpm-workspace.yaml` and passes no ignore of its own.
- [ ] The audit passes on this branch with the backlog cleared.
- [ ] Adding a known-vulnerable runtime version locally makes the same command fail; the result is noted
      and the change is not committed.
- [ ] `.github/workflows/checks.yml` does not run the audit.
- [ ] `(human)` The audit is green in the dependency checks run of the pull request.
- [ ] After that confirmation, the dependency checks skip draft pull requests and start on
      `ready_for_review`, with the same condition the regular checks use. A manual dispatch still runs on
      any branch.

## Details

**Command.** `pnpm audit` with its production and severity flags. The ignore entries are pnpm's own
setting in `pnpm-workspace.yaml`, added by ticket 07; the step passes no ignore flags.

**Why only here.** The audit reads the whole lockfile against the live advisory database, so in the
regular checks it would fail pull requests that have nothing to do with the advisory.

**Draft skip.** The paths filter matches a pull request's whole diff, so a draft feature pull request that
adds one package would run the full unit suite, the build and the smoke set on every push. Renovate's pull
requests are not drafts and are unaffected. The skip comes last because this pull request is a draft and
needs the runs until the audit is confirmed.

**Placement.** A step of an existing job or a job of its own; it needs the install and nothing else, and
its failure should read as "audit" in the run summary.

## Leaf worklist

- [x] 1 `[agent]` Add the audit step
- [ ] 2 `[human]` Confirm the audit is green in the pull request's dependency checks run
- [ ] 3 `[agent]` Make the dependency checks skip drafts and start on `ready_for_review`
