# 10 — Remaining feature views

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 10 of #3722 |
| Blocked by | none |

## What to build

Hot contracts, DEX pools, flashblocks, user-facing transaction tabs — blobs, FHE operations, authorizations,
asset flows — tag search, interop messages and the revoke dapp's approvals show their desktop table on
mobile.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/hot-contracts`, `/pools`, `/tx/<hash>?tab=blobs`, `?tab=authorizations`, `?tab=asset_flows`, `/accounts/label/<slug>`, `/essential-dapps/revoke`; `pnpm dev:preset optimism`, open `/interop-messages`; `pnpm dev:preset base`, open the flashblocks tab of `/blocks`; FHE operations on a preset that enables them, otherwise from the Playwright mocks

- [ ] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [ ] Every list container and list item named below is deleted, and nothing imports it.
- [ ] The hot contracts mobile `Sort` dropdown stays in the action bar.
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

- `HotContracts` → `HotContractsList` / `…ListItem`
- `Pools` → `PoolsList` / `PoolsListItem`
- `Flashblocks` → `FlashblocksList` (holds `SocketNewItemsNotice.Mobile`) / `FlashblocksListItem`
- `TxBlobs` → `TxBlobsList` / `TxBlobListItem`
- `TxFheOperations` → `TxFheOperationsList` / `TxFheOperationsListItem`; the split sits in the two sibling files, not in the parent
- `TxAuthorizations` → `…List` / `TxAuthorizationsListItem`
- `TxAssetFlows` → `…List` / `TxAssetFlowsListItem`
- `TagSearch` → `TagSearchList` / `TagSearchListItem`
- `InteropMessages` → inline `InteropMessagesListItem` map
- `Approvals` → `ApprovalsList` / `ApprovalsListItem`

Already-migrated parents, list item left behind — delete only:

- `AddressAccountHistoryListItem`

## How it went

Hot contracts and FHE operations already carried a 900px `minW` and kept it. The seven that carried none
were given one from their columns: interop messages 1200px for its nine `tableLayout="auto"` columns,
approvals 1000px, authorizations and asset flows 900px (two address columns plus 440px of fixed ones; an
auto action column beside a 450px From/To), blobs 600px, tag search 500px with its columns rebalanced to
60/20/20 so the two numeric ones stop crowding the address. Pools came down from 900px to 700px — the
inherited width was more than its four columns need. Flashblocks takes 600px only when its rows carry a
timestamp beside the block entity, and 300px when they do not.

Two deviations from the fixed transform:

- `TxFheOperations` had its split in the sibling files, so the `TableContainerScrollable` replaces the
  `hideBelow="lg"` scroll box **inside** `TxFheOperationsTable` rather than sitting in the parent, and the
  parent's wrapping `Box` — which existed only to hold the two branches — goes away.
- `Content.pw.tsx` (revoke) keeps its `+@mobile` tag: the case also covers the summary above the rows,
  which stacks and goes full width below `lg`. Its title now names that layout, which renames its three
  screenshots; only the mobile one's content moved.

## Leaf worklist

- [x] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [x] 2 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [x] 3 `[human]` Review the screenshot diff and check the routes at 375px
