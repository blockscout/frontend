# 03 — Make unmocked-request failure the default and fix the stragglers

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3680 |
| Blocked by | T02 |

## What to build

Every visual test mocks everything it requests from `localhost`, so the unmocked-request failure from
ticket 02 is always on and the opt-in flag is gone. The rewards feature is off by default in the
Playwright env, so `RewardsContextProvider` no longer fires `rewards:config` in every test; the tests that
exercise rewards keep opting in with `mockEnvs` and mock what the provider then requests. Each remaining
test the T02 audit listed either gains the missing mock or, where the test exists to show an error or
empty state, an explicit mock with an error status. No per-test opt-out is introduced. The runner context
explains how to read the new failure.

## Acceptance criteria

- [x] `NEXT_PUBLIC_REWARDS_SERVICE_API_HOST` is gone from `playwright/.env.pw`; the tests that render
      rewards UI enable it through `mockEnvs([ ...ENVS_MAP.rewardsService ])` and mock `rewards:config`
      plus whatever else the provider requests in their state.
- [x] The strict-mocks runner flag and its env variable are removed; the `afterEach` assertion runs
      unconditionally.
- [x] Every test listed in T02's `notes.md` passes under the always-on check; intended failures are
      expressed as a mock with an error status, never by leaving the request unmocked.
- [x] No fixture, option or tag disables the check for a single test.
- [x] `pnpm test:pw --docker` passes for the whole suite; a baseline changes only where a previously
      failing request was silently rendering an empty or error state, and each such change is listed in
      the PR description.
- [x] `tools/playwright/CONTEXT.md` has a "Where to look" row for the unmocked-request failure and a
      constraint line stating that every `localhost` request must be mocked; `.agents/rules/tests-visual.md`
      says the same in one sentence under Fixtures.

## Details

- The T02 audit (`../02-unmocked-request-detection/notes.md`) found 527 of its 536 failing tests failing
  only on `rewards:config`: `playwright/TestApp.tsx` mounts `RewardsContextProvider` for every test and
  `.env.pw` enables the feature globally, while every test that actually shows rewards UI already sets
  `ENVS_MAP.rewardsService` itself (`RewardsDashboard`, `HeaderDesktop`, `HeaderMobile`,
  `NavigationDesktop`, `HeroBanner`). Turning the env off in `.env.pw` is the fix, not a global mock in
  the shared setup: a shared mock would keep the provider doing real work in every test and hide the
  dependency from the tests that exercise it. The parent spec's rule that `.env.pw` is not changed to
  switch a feature *on* still holds.
- A test whose baseline accidentally includes rewards UI without opting in (a header rewards button,
  `MarketplaceAppTopBar`, `UserProfileContent`) gets a screenshot diff from the env change; that is an
  accidental-state baseline per the rule below, and the test gains the `mockEnvs` opt-in only if the
  rewards UI is what it is meant to show.
- If the T02 audit list is large, split it by area (shell, slices, features) into sibling tickets appended
  to `progress.md`, each blocked by T02, and keep this ticket for the flag removal and docs, blocked by all
  of them.
- A baseline that changes here means a screenshot was taken of an accidental state; that is a finding
  worth a line in the PR, not a silent update.

## Leaf worklist

- [x] 1 `[agent]` Remove the rewards env from `playwright/.env.pw`; mock `rewards:config` and the provider's other requests in the tests that opt in
- [x] 2 `[agent]` Mock or explicitly fail every remaining request in T02's audit list
- [x] 3 `[agent]` Remove the strict-mocks flag from the runner, its spec, `--help` and the shared test setup
- [x] 4 `[agent]` Update `tools/playwright/CONTEXT.md` and `.agents/rules/tests-visual.md`
- [x] 5 `[agent]` Run `pnpm test:pw --docker` for the whole suite; record any baseline change for the PR description
