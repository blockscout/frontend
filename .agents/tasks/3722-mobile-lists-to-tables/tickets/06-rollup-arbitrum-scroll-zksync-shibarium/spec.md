# 06 — Arbitrum, Scroll, ZkSync and Shibarium rollup views

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 06 of #3722 |
| Blocked by | none |

## What to build

The Arbitrum batches, messages and transaction withdrawals, the Scroll batches, deposits and withdrawals,
the ZkSync batches, and the Shibarium deposits and withdrawals show their desktop table on mobile.

## Acceptance criteria

How to verify: `pnpm dev:preset arbitrum`, open `/batches`, `/deposits`, `/withdrawals`, `/txn-withdrawals`; `pnpm dev:preset scroll_sepolia`, open `/batches`, `/deposits`, `/withdrawals`; `pnpm dev:preset zksync`, open `/batches`; `pnpm dev:preset shibarium`, open `/deposits`, `/withdrawals`

- [x] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [x] Every list container and list item named below is deleted, and nothing imports it.
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

- `ArbitrumL2TxnBatches` → `…List` / `ArbitrumL2TxnBatchesListItem`
- `ArbitrumL2Messages` (one container behind both message pages) → `ArbitrumL2MessagesList` / `…ListItem`
- `ArbitrumL2TxnWithdrawals` → `…List` / `ArbitrumL2TxnWithdrawalsListItem`
- `ScrollL2TxnBatches`, `ScrollL2Deposits`, `ScrollL2Withdrawals` → their `…List` / `…ListItem`
- `ZkSyncL2TxnBatches` → `…List` / `ZkSyncTxnBatchesListItem`
- Shibarium `Deposits`, `Withdrawals` → `DepositsList` / `DepositsListItem`, `WithdrawalsList` / `WithdrawalsListItem`

All nine tables already carried a `minW`, so none was added. `ScrollL2TxnBatches` was the one table
that needed its width revisited once it had to hold all ten columns on a narrow viewport: its `minW`
went to `1100px` and the block and txn-hash entities in its row dropped their icons. Its desktop
baseline is regenerated accordingly.

One deviation: on `ArbitrumL2TxnWithdrawals` both split branches carried `mt={ 6 }`, and
`TableContainerScrollable` takes no style props, so the margin moved onto that view's `TableRoot`
rather than a wrapper box being kept — the desktop baseline confirms the spacing is unchanged.

## Leaf worklist

- [x] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [x] 2 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [x] 3 `[human]` Review the screenshot diff and check the routes at 375px
