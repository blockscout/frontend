# Notes — 05 Record what stays isolated and prove the suite

## What stays isolated

The table is in `.agents/rules/tests-unit.md` → "What stays isolated, and why". Against the parent spec's table:

- The wallet row names its specs: the isolated ones under `src/features/connect-wallet/` and `useRevoke`, which
  mocks `wagmi` and `viem` outside the wallet feature's folder.
- The module-singleton row is the server metrics spec.
- A "Specs" column names the specs of each row, so a developer who opens an isolated spec finds its row.
- Tickets 02, 03 and 04 left no spec isolated, so no row is a fallback. Two isolated specs also mock something a
  shared spec would drive for real, and are listed individually under the table: the Rollbar queue spec (the app
  config and the Rollbar client config) and `useWalletReown` (the analytics event logger). Their row keeps them
  isolated either way.

The section also gains the pattern ticket 02 proved: observe a third-party SDK through a spy on its real export, in
`beforeEach`.

### Every isolated spec against the table and the lint rule

24 specs in the `isolated` project: 15 `*.isolated.spec.ts(x)`, 9 `*.primed.spec.tsx`.

| Row | Specs |
| --- | --- |
| Wallet stack | 8 under `src/features/connect-wallet/` (`AccountPublisher`, `Web3Boundary`, `context`, `useAccountReown`, `useWalletReown`, `bridge`, `public-client`, `runtime`), `useRevoke` |
| `rollbar` | Rollbar queue |
| `next/script` | `AdbutlerBanner` |
| Specify publisher SDK | `SpecifyBanner` |
| `phoenix` | `AddressTokenTransfers` |
| `next/router`, `next/navigation` | `NextRouterProvider` |
| Module singleton | server metrics |
| Primed-requests drift specs | the 9 `*.primed.spec.tsx` |

None passes the shared-spec lint rules. Each spec was copied next to itself under a name outside the isolated globs
(`*.sharedprobe.spec.ts(x)`), the copies were linted in one ESLint run, and the copies were removed. Every copy
failed `no-restricted-syntax` and nothing else: the 15 `*.isolated.spec` copies on a module mock or registry reset
(`AddressTokenTransfers` on the `mockSocket` import too), the 9 primed copies on the `checkPrimedRequests` import.

## An order dependence, found and fixed

Ticket 04's one-off Stryker failure (`vitest/utils/mockViewport.spec.ts` › "is the desktop breakpoint by default",
`expected true to be false`) reproduces as an order dependence on the color-theme settings spec, which ticket 01
moved to the `shared` project.

`SettingsColorTheme.spec.tsx` replaced `window.matchMedia` by hand and never restored it. In a shared worker the jsdom
window outlives the spec file, and `vitest/setup.ts` installs its viewport stub only when `matchMedia` is missing. So
every later jsdom spec in that worker got the color-theme stub, which answers every query with the last
`prefers-color-scheme` value the spec set (`true`).

Replay, the two files in one worker:

```bash
pnpm exec vitest run --project shared --maxWorkers=1 --sequence.shuffle.files --sequence.seed=3 \
  src/shell/top-bar/settings/fields/color-theme/SettingsColorTheme.spec.tsx vitest/utils/mockViewport.spec.ts
```

Seed 3 runs the color-theme spec first. Before the fix, 6 of the 7 viewport tests failed, the first at
`mockViewport.spec.ts:13` with `expected true to be false`; seeds 1, 2 and 4 passed. The spec now installs its stub with `vi.stubGlobal('matchMedia', …)`, which the suite setup undoes after every test, and the
same replay passes. The unit-test rules' `mockViewport` paragraph says to stub that way.

The fix landed before the twenty runs below started, so the count did not need a restart.

A related leak that breaks nothing today: three shared specs (`AddressEntity`, `interchain`, `resolve-entity-link`)
assign `window.__multichainConfig` by hand and can leave it set; `define-entity` resets it only after a passing
test. Six seeds over those four and the two jsdom specs that switch multichain on without setting the global
(`useNavItems`, `useCrossChainCountersQuery`), in one worker, all passed; the specs that read the chains (ticket
04's) set the global with `vi.stubGlobal`. Left as is; a follow-up for the developer.

## Twenty shuffled full runs

Twenty consecutive `pnpm test:vitest --sequence.shuffle.files` runs, back to back on the tree this ticket commits,
each on its own seed. All twenty passed: 322 files, 3523 tests, no unhandled errors. Apple M2, 8 cores, 24 GB,
Node 24.21.0, Vitest 5.0.0, the machine of the baseline. Other sessions were active; the 1-minute load average
before each run is in the table.

| Run | Seed | Load | Vitest duration |
| --- | --- | --- | --- |
| 1 | 1794476691914 | 2.3 | 49.89s |
| 2 | 1794476742239 | 10.0 | 53.69s |
| 3 | 1794476796364 | 16.9 | 61.44s |
| 4 | 1794476858251 | 15.0 | 70.59s |
| 5 | 1794476929283 | 15.6 | 72.83s |
| 6 | 1794477002556 | 14.4 | 67.48s |
| 7 | 1794477070499 | 11.3 | 68.41s |
| 8 | 1794477139364 | 13.2 | 66.83s |
| 9 | 1794477206654 | 14.4 | 67.50s |
| 10 | 1794477274635 | 12.7 | 71.33s |
| 11 | 1794477346419 | 13.7 | 67.05s |
| 12 | 1794477414004 | 16.5 | 72.25s |
| 13 | 1794477486736 | 14.0 | 87.17s |
| 14 | 1794477574466 | 27.0 | 80.81s |
| 15 | 1794477655801 | 16.4 | 81.22s |
| 16 | 1794477737567 | 14.5 | 87.05s |
| 17 | 1794477825122 | 17.9 | 82.30s |
| 18 | 1794477907931 | 14.2 | 97.30s |
| 19 | 1794478005822 | 24.4 | 92.57s |
| 20 | 1794478098927 | 15.5 | 76.44s |

The durations track the load, not the suite: the same tree took 50s to 97s.

## `--changed` with coverage, the CRAP gate, mutation testing

This ticket changes no source line, so the checks ran on a probe: one blank line added inside a function of a source
file with an isolated spec (`src/server/monitoring/metrics.ts`, spec `metrics.isolated.spec.ts`) and of one with a
shared spec (`src/server/utils/getAllowedApiOrigins.ts`, spec `getAllowedApiOrigins.spec.ts`), left uncommitted and
reverted afterwards.

- **`--changed` with coverage.** The unit job's pull-request command,
  `pnpm test:vitest --sequence.shuffle.files --changed=origin/main --coverage --coverage.provider=v8 --coverage.reporter=json --passWithNoTests`,
  ran 66 files and 893 tests, all passing. `vitest list` with the same `--changed` names both probe specs, one per
  project. `coverage/coverage-final.json` was written with both source files in it, every function of each hit.
- **CRAP gate.** `pnpm test:code-complexity --changed=origin/main --coverage-file coverage/coverage-final.json` scored
  10 functions of the two files from that report, `metrics.ts` at 100% coverage and `getAllowedApiOrigins.ts` at 80–100%,
  all within the caps.
- **Mutation testing.** `pnpm test:mutation-testing src/server/monitoring/metrics.ts src/server/utils/getAllowedApiOrigins.ts`
  (focused, whole files, after the probe was reverted): Stryker's initial test run passed, and its report credits
  every kill to the probe spec of each file. `metrics.ts`: 4 mutants, 4 killed by `metrics.isolated.spec.ts`
  (`isolated`). `getAllowedApiOrigins.ts`: 10 mutants, 8 killed by `getAllowedApiOrigins.spec.ts` (`shared`), 2
  survived. The two survivors are the ones ticket 04 recorded (L19, the dead `!endpoint` guard; L43, the cache); they
  are why the focused run exits 1. The gate in CI is diff-scoped and selects nothing in this task.

## Before and after

"Before" is ticket 01's baseline, on `3561237de`. "After" is this ticket's tree. Same machine, method and command:
`pnpm test:vitest --sequence.shuffle.files`, i.e. `vitest run --sequence.shuffle.files`, Vitest's reported duration.

| | Before | After |
| --- | --- | --- |
| `shared` spec files | 233 (72.4%) | 298 (92.5%) |
| `isolated` spec files | 89 (27.6%): 80 `*.isolated.spec`, 9 `*.primed.spec` | 24 (7.5%): 15 `*.isolated.spec`, 9 `*.primed.spec` |
| Total | 322 files, 3530 tests | 322 files, 3523 tests |
| Local, three shuffled full runs | 77.75s, 79.41s, 75.53s; mean 77.56s (load 6–28) | 119.07s, 86.57s, 87.26s; mean 97.63s (load 6–23) |
| Local, eight interleaved pairs, same load | mean 103.07s (86.74–124.12s) | mean 101.74s (86.57–119.50s) |
| CI unit job, full-suite dispatch | 152.86s ([run 43040334627](https://github.com/blockscout/frontend/actions/runs/43040334627/job/130592378557): `d2096e9d0`, single project before the split, 322 files, 3530 tests) | **pending** |

**The local durations do not resolve a difference.** Other sessions kept the machine loaded all afternoon, and the
same tree took 50s to 119s across today's runs. The "three runs" row is the baseline's method, but its two columns
ran at different times under different load, so it cannot be read as a change.

The "interleaved pairs" row is the control. The baseline tree (`git archive 3561237de`, sharing this worktree's
`node_modules`; no dependency or test-setup file changed since) ran alternately with this branch: eight pairs, the
first three being the "after" runs of the row above, with the order inside a pair alternating from pair 4 on. After
minus before: mean −1.3s, median −4.3s, range −15.6s to +28.0s. At this load the wall time shows no measurable
change.

One more pair ran with the JSON reporter on, to split the run by project. It is a single pair at different loads
(after 58.57s at load 7.6, before 114.14s at load 11.7), so it only indicates where the time moved:

| | Before | After |
| --- | --- | --- |
| `shared` phase: wall / summed file time | 56.0s / 71.5s | 38.9s / 91.2s |
| `isolated` phase: wall / summed file time | 57.4s / 187.2s | 19.3s / 66.9s |
| Summed file time, both projects | 258.7s | 158.1s |

The CI cell is pending. The branch's commits are not pushed yet, and no workflow was dispatched from the session. To fill
it: push `issue-3876`, dispatch the Checks workflow on it by hand (drafts skip it), and take the Vitest duration of
the `Run Vitest` step from three runs, as for the baseline. A dedicated runner is also the measurement this local
load could not give.

### One timeout outside the twenty

One of the interleaved "after" runs (pair 6, seed 1794479482213) failed: the first test of the color-theme settings
spec timed out at the `shared` project's 10s (10.8s) at load 20. It is the test and the cause ticket 01 pinned, its
first `withEnvs` call re-evaluating the app's module graph inside the test body. The seed's replay passed, that test
taking 3.8s, so it is not an order dependence. It is 1 of 30 full runs of this tree today: the twenty, the eight
timing runs, the split run and the replay. The parent spec rules out a per-test override, so the developer raised the
`shared` project's timeout to 15s, the same as the `isolated` project's.
