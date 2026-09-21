# 05 — Optimism rollup views

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 05 of #3722 |
| Blocked by | none |

## What to build

The Optimism batches, deposits, withdrawals, output roots and dispute games pages show their desktop table on mobile.

## Acceptance criteria

How to verify: `pnpm dev:preset optimism`, open `/batches`, `/deposits`, `/withdrawals`, `/output-roots`, `/dispute-games`

- [ ] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [ ] Every list container and list item named below is deleted, and nothing imports it.
- [ ] Playwright: a `*.pw.tsx` that tests a deleted component is deleted; on the remaining files of these views the `+@mobile` tag or mobile-only case that covered the list is dropped, and its `*_mobile_*` screenshots are deleted. No mobile screenshot of a table is added.
- [ ] The remaining Playwright files of these views pass under `pnpm test:pw --docker`.
- [ ] `pnpm lint:tsc` and `pnpm lint:eslint:fix` pass.
- [ ] `(human)` At 375px each route shows the desktop table scrolling horizontally, the action bar, pagination, filters and socket notices behave as before, and nothing clips.

## Details

The transform is the one fixed in the spec's Implementation decisions; match an already-migrated view
(`AddressInternalTxs`, `UserOpsContent`). Pick `minW` from the table's content; a deviation from the
transform is recorded here with its reason.

A `+@mobile` tag survives only where the case protects mobile layout other than the rows (a mobile
action bar with filters, say) — name that layout in the test title, or drop the tag.

The developer cleared the agent to run the Docker runner with `--update-snapshots` for this task;
reviewing the resulting diff stays with the developer.

Views — split container → list branch to delete:

- `OptimisticL2TxnBatches` → `…List` / `OptimisticL2TxnBatchesListItem`
- `OptimisticL2Deposits` → `…List` / `OptimisticDepositsListItem`
- `OptimisticL2Withdrawals` → `…List` / `OptimisticL2WithdrawalsListItem`
- `OptimisticL2OutputRoots` → `…List` / `OptimisticL2OutputRootsListItem`
- `OptimisticL2DisputeGames` → `…List` / `OptimisticL2DisputeGamesListItem`

## Leaf worklist

- [ ] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [ ] 2 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [ ] 3 `[human]` Review the screenshot diff and check the routes at 375px
