# 01 — Tear down the table-view experiment and the transaction lists

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 01 of #3722 |
| Blocked by | none |

## What to build

Every transaction view — the transactions index and its tabs, block transactions, address transactions,
multichain address transactions — shows the transactions table on mobile unconditionally, and the mobile
action bar offers the sort dropdown again. The experiment that used to pick between list and table is gone
without a trace, and so is the transaction list layout it kept alive.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/txs` (each tab), `/block/<height>?tab=txs`, `/address/<hash>?tab=txs` at 375px

- [ ] `TxsContent` renders `TxsTable` inside `TableContainerScrollable` on every viewport; `showTableView` exists nowhere (`TxsContent`, `TxsWithApiSorting`, `AddressTxs`, `MultichainAddressTxs`).
- [ ] `TxsHeaderMobile` always receives `setSorting` where the view is sortable.
- [ ] Deleted: `useTableViewValue`, `TableViewToggleButton`, the `TABLE_VIEW_ON_MOBILE` cookie name, the `txns_view_exp` flag declaration, the `Txn view switch` Mixpanel event type, the `list_view` sprite icon (source SVG and the regenerated icon-name union).
- [ ] Deleted: `TxsList`, `TxsListItem`, `TxsListItem.pw.tsx` and its screenshots; the `mockFeatures` call for `txns_view_exp` in `AddressTxs.pw.tsx`.
- [ ] The transaction socket notices (`TxsSocketNotice`, `TxsSocketNoticeTypeAll`, `TxsSocketNoticeTypeAddress`) no longer render `SocketNewItemsNotice.Mobile`; on mobile the notice is the table one.
- [ ] Playwright: on the transaction views' remaining `*.pw.tsx` the `+@mobile` tag or mobile-only case that covered the list is dropped with its `*_mobile_*` screenshots; the remaining files pass under `pnpm test:pw --docker`.
- [ ] `pnpm lint:tsc`, `pnpm lint:eslint:fix` and `pnpm test:vitest` for touched specs pass.
- [ ] `(human)` At 375px each route shows the transactions table scrolling horizontally, the sort dropdown sorts it, the "new transactions" notice appears above the rows, and pagination, filter and CSV export are where they were.

## Details

Sprite outputs: which files are tracked and which are generated is in `src/sprite/CONTEXT.md`.

A `+@mobile` tag survives only where the case protects mobile layout other than the rows (the mobile
action bar, say) — name that layout in the test title, or drop the tag.

The developer cleared the agent to run the Docker runner with `--update-snapshots` for this task;
reviewing the resulting diff stays with the developer.

## Leaf worklist

- [ ] 1 `[agent]` Make `TxsContent` table-only, restore the mobile sort, delete the list and the mobile socket-notice branch
- [ ] 2 `[agent]` Delete the experiment: hook, toggle button, cookie, flag declaration, Mixpanel event, sprite icon
- [ ] 3 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [ ] 4 `[human]` Review the screenshot diff and check the routes at 375px
