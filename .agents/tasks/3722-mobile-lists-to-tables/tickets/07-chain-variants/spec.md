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

- [x] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [x] Every list container and list item named below is deleted, and nothing imports it.
- [x] The Stability and Blackfort validators mobile `Sort` dropdowns stay in the action bar.
- [x] Playwright: a `*.pw.tsx` that tests a deleted component is deleted; on the remaining files of these views the `+@mobile` tag or mobile-only case that covered the list is dropped, and its `*_mobile_*` screenshots are deleted. No mobile screenshot of a table is added.
- [x] The remaining Playwright files of these views pass under `pnpm test:pw --docker`.
- [x] `pnpm lint:tsc` and `pnpm lint:eslint:fix` pass.
- [x] `(human)` At 375px each route shows the desktop table scrolling horizontally, the action bar, pagination, filters and socket notices behave as before, and nothing clips.

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
- `ZetaChainCCTxs` → `SocketNewItemsNotice.Mobile` + `ZetaChainCCTxsList`; its item, `ZetaChainCCTXListItem`,
  stays — the home page's `LatestZetaChainCCTXs` card widget is its other consumer, and that widget is a
  card surface with no table counterpart, so it is out of the task's scope
- `ValidatorsZilliqa`, `ValidatorsStability`, `ValidatorsBlackfort` → each directory's own `ValidatorsList` / `ValidatorsListItem`

Already-migrated parents, list item left behind — delete only:

- `AddressEpochRewardsListItem`

Four tables carried no `minW` and were given one from their content: `ValidatorsZilliqa` 900px,
`ValidatorsStability` 500px, `ValidatorsBlackfort` 1000px, and the `EpochElectionRewards` table 700px.

`EpochElectionRewardDetailsMobile` is deleted too — `EpochElectionRewardsListItem` was its only consumer.

`Epoch.pw.tsx` keeps its `+@mobile` tag: its mobile case covers the epoch details page layout, not a list of
rows. Its mobile baseline is regenerated, the election-rewards section now being a scrolling table.

## Leaf worklist

- [x] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [x] 2 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [x] 3 `[human]` Review the screenshot diff and check the routes at 375px
