# 08 — Multichain remainder, cross-chain views and user operations

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 08 of #3722 |
| Blocked by | none |

## What to build

Multichain ecosystems and user operations, bridged tokens, ICTT users, and the cross-chain transaction and
token-transfer views — the shared content components and the transaction-level tabs — show their desktop
table on mobile. The one cross-chain list item the home widget still renders stops depending on the shared
mobile-list primitive.

## Acceptance criteria

How to verify: `pnpm dev:preset multichain`, open `/ecosystems`, `/ops`, `/txs` (cross-chain tab), `/token-transfers` (cross-chain tab), `/cc/tx/<hash>`; a preset with cross-chain indexing (`staging`), open `/tokens?tab=bridged`, `/ictt-users`, a transaction's cross-chain transfers tab

- [ ] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [ ] Every list container and list item named below is deleted, and nothing imports it.
- [ ] `TransactionsCrossChainListItem` survives with `LatestCrossChainTxs` as its only consumer and imports neither `ListItemMobile` nor `ListItemMobileGrid` — the container styles are inlined, its look unchanged.
- [ ] The bridged tokens and ICTT users mobile `Sort` dropdowns stay in the action bar.
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

- `MultichainEcosystems` → `MultichainEcosystemsList` / `…ListItem`; its `Sort` moves out of the deleted branch and stays mobile-only in the action bar
- `MultichainUserOps` → `UserOpsList` / `UserOpsListItem`
- `BridgedTokensIndex` → `BridgedTokensList` / `BridgedTokensListItem`
- `IcttUsers` → `IcttUsersList` / `IcttUsersListItem`
- `TransactionsCrossChainContent` → `TransactionsCrossChainList` (the list item stays, see below)
- `TokenTransfersCrossChainContent`, `TxTokenTransferCrossChain` → `TokenTransfersCrossChainList`; `TxCrossChainTransfers` → inline `TokenTransfersCrossChainListItem` map

Already-migrated parents, list item left behind — delete only:

- `MultichainAddressTokensListItem`

## Leaf worklist

- [ ] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [ ] 2 `[agent]` Inline the mobile-list container into `TransactionsCrossChainListItem`
- [ ] 3 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [ ] 4 `[human]` Review the screenshot diff and check the routes at 375px
