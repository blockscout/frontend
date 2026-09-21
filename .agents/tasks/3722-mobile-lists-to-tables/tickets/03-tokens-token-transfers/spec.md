# 03 — Tokens and token transfers

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 03 of #3722 |
| Blocked by | none |

## What to build

The tokens index, the token holders tab and every token-transfer view — the index, the token page tab,
the transaction page tab, the multichain index — show their desktop table on mobile.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/tokens`, `/token/<hash>?tab=holders`, `/token/<hash>` (transfers), `/token-transfers`, `/tx/<hash>?tab=token_transfers`; `pnpm dev:preset multichain`, open `/token-transfers`

- [ ] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [ ] Every list container and list item named below is deleted, and nothing imports it.
- [ ] The tokens mobile `Sort` dropdown in `Tokens` stays in the action bar, for the bridged-tokens tab too.
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

`components/list/` may still be imported by the already-migrated `AddressTokenTransfersLocal`; delete what no longer has a consumer and leave the rest.

Views — split container → list branch to delete:

- `TokensList` (the split container, despite the name) → inline `TokensListItem` map
- `TokenHolders` → `TokenHoldersList` / `TokenHoldersListItem`, `TokenHoldersList.pw.tsx`
- `TokenTransfersLocal`, `MultichainTokenTransfersLocal` → inline `TokenTransfersListItem` map
- `TokenTransfer` (token page) → `SocketNewItemsNotice.Mobile` + `pages/token/TokenTransferList` / `pages/token/TokenTransferListItem`
- `TxTokenTransferLocal` → `components/list/TokenTransferList` / `TokenTransferListItem`, `TokenTransferList.pw.tsx`

Already-migrated parents, list item left behind — delete only:

- `AddressFungibleTokensListItem`

## Leaf worklist

- [ ] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [ ] 2 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [ ] 3 `[human]` Review the screenshot diff and check the routes at 375px
