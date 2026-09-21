# 07 — Chain-variant views

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 07 of #3722 |
| Blocked by | none |

## What to build

Beacon chain deposits and withdrawals (index and block tabs), Celo epochs and epoch election rewards, TAC
operations, ZetaChain CCTXs and the Zilliqa, Stability and Blackfort validator pages show their desktop
table on mobile.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/deposits`, `/withdrawals`, `/block/<height>?tab=deposits`, `?tab=withdrawals`; `pnpm dev:preset celo`, open `/epochs`, `/epochs/<number>`; `pnpm dev:preset tac`, open `/operations`; `pnpm dev:preset zetachain`, open `/txs?tab=cctx`; `pnpm dev:preset zilliqa` / `stability_testnet` / `blackfort_testnet`, open `/validators`

- [ ] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [ ] Every list container and list item named below is deleted, and nothing imports it.
- [ ] The Stability and Blackfort validators mobile `Sort` dropdowns stay in the action bar.
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

- `BeaconChainDeposits`, `BlockDeposits` → `BeaconChainDepositsList` / `…ListItem`
- `BeaconChainWithdrawals`, `BlockWithdrawals` → `BeaconChainWithdrawalsList` / `…ListItem`
- `Epochs` → `EpochsList` / `EpochsListItem`
- `EpochElectionRewards` → the inline mobile items inside the same file
- `TacOperations` → `TacOperationsList` / `TacOperationsListItem`
- `ZetaChainCCTxs` → `SocketNewItemsNotice.Mobile` + `ZetaChainCCTxsList` and its item
- `ValidatorsZilliqa`, `ValidatorsStability`, `ValidatorsBlackfort` → each directory's own `ValidatorsList` / `ValidatorsListItem`

Already-migrated parents, list item left behind — delete only:

- `AddressEpochRewardsListItem`

## Leaf worklist

- [ ] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [ ] 2 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [ ] 3 `[human]` Review the screenshot diff and check the routes at 375px
