# 03 — Make unmocked-request failure the default and fix the stragglers

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3680 |
| Blocked by | T02 |

## What to build

Every visual test mocks everything it requests from `localhost`, so the unmocked-request failure from
ticket 02 is always on and the opt-in flag is gone. Each test the T02 audit listed either gains the
missing mock or, where the test exists to show an error or empty state, an explicit mock with an error
status. No per-test opt-out is introduced. The runner context explains how to read the new failure.

## Acceptance criteria

- [ ] The strict-mocks runner flag and its env variable are removed; the `afterEach` assertion runs
      unconditionally.
- [ ] Every test listed in T02's `notes.md` passes under the always-on check; intended failures are
      expressed as a mock with an error status, never by leaving the request unmocked.
- [ ] No fixture, option or tag disables the check for a single test.
- [ ] `pnpm test:pw --docker` passes for the whole suite; a baseline changes only where a previously
      failing request was silently rendering an empty or error state, and each such change is listed in
      the PR description.
- [ ] `tools/playwright/CONTEXT.md` has a "Where to look" row for the unmocked-request failure and a
      constraint line stating that every `localhost` request must be mocked; `.agents/rules/tests-visual.md`
      says the same in one sentence under Fixtures.

## Details

- If the T02 audit list is large, split it by area (shell, slices, features) into sibling tickets appended
  to `progress.md`, each blocked by T02, and keep this ticket for the flag removal and docs, blocked by all
  of them.
- A baseline that changes here means a screenshot was taken of an accidental state; that is a finding
  worth a line in the PR, not a silent update.

## Leaf worklist

- [ ] 1 `[agent]` Mock or explicitly fail every request in T02's audit list
- [ ] 2 `[agent]` Remove the strict-mocks flag from the runner, its spec, `--help` and the shared test setup
- [ ] 3 `[agent]` Update `tools/playwright/CONTEXT.md` and `.agents/rules/tests-visual.md`
- [ ] 4 `[agent]` Run `pnpm test:pw --docker` for the whole suite; record any baseline change for the PR description
