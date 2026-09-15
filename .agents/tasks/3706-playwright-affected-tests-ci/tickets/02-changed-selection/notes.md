# 02 — implementation notes

## Deviation from the spec: the icon path

The spec's force-full entry `src/icons/**` does not exist; the sprite sources live in `src/sprite/icons/`
(`deploy/scripts/build_sprite.sh` reads from there). The old walker in `deploy/tools/affected-tests`
hard-coded the same stale `./src/icons`, so its "icons changed → run everything" rule never fired. The
tool's list uses `src/sprite/icons/`. Ticket 04's gate path `src/` already covers it; nothing to mirror.

## Manual selection checks

All runs used `--base HEAD` because this branch itself changes `playwright-ct.config.ts`, which would
force the full suite against `origin/main`. Diff = the uncommitted edit only; each edit was reverted after.

| # | Edit | Command | Result |
| --- | --- | --- | --- |
| 1 | trailing newline in `src/shared/lifecycle/steps/VerificationSteps.tsx` | `pnpm test:pw --changed --base HEAD --project=default --pass-with-no-tests --reporter=line` | `--only-changed=<HEAD sha>` appended; 28 tests in 6 files ran: `VerificationSteps.pw.tsx` plus the five files whose component imports it (`TxDetails`, `BlockDetails`, `Block`, `TxDetailsWithdrawalStatusOptimistic`, `ZkSyncL2TxnBatch`). Screenshot failures were the usual macOS-vs-Linux baselines, not selection. |
| 2 | trailing newline in `src/sprite/icons/arrows/east.svg` | `pnpm test:pw --changed --base HEAD --project=default --list` | printed `Running the full suite: src/sprite/icons/arrows/east.svg changed`; no `--only-changed`; `--list` reported 721 tests in 228 files. |
| 3 | trailing newline in `src/shell/footer/types.ts` (type-only module) | `pnpm test:pw --changed --base HEAD --project=default --pass-with-no-tests` | exit 0; `playwright-results/report.json` has 0 tests (`stats.expected` 0). The CT bundle still built (~1 min), as expected — the tool does not short-circuit. |

Gotcha found in check 1: `--reporter=line` on the command line replaces the config's reporters, so the
JSON report is not written. Pass through without a reporter override when the report is needed.
