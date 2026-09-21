# 09 — Name services and account pages

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 09 of #3722 |
| Blocked by | none |

## What to build

The name domains index, the domain history tab, the clusters leaderboard and directory, and the six account
tables — watchlist, API keys, private address tags, private transaction tags, custom ABI, verified
addresses — show their desktop table on mobile. Domain history, sortable only through its table header so
far, gains the action-bar sort dropdown.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/name-services`, `/name-services?tab=clusters` (leaderboard and directory), `/name-services/domains/<name>?tab=history`, and logged in: `/account/watchlist`, `/account/api-key`, `/account/tag-address` (both tabs), `/account/custom-abi`, `/account/verified-addresses`

- [ ] Each view below renders one table on every viewport, inside `TableContainerScrollable`, with a `minW` on the table root; its container holds no `hideFrom` / `hideBelow` table-vs-list split.
- [ ] Every list container and list item named below is deleted, and nothing imports it.
- [ ] `NameDomainHistory` renders the shared `Sort` control in its mobile action bar, with the options its sortable table header offers, driving the same sort state.
- [ ] The name domains mobile `Sort` dropdown in `NameDomainsActionBar` stays.
- [ ] Account row actions (edit, delete) work from the table rows on mobile.
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

- `NameDomains` → `NameDomainsList` / `NameDomainsListItem`
- `NameDomainHistory` → `NameDomainHistoryList` / `…ListItem`
- `Clusters` → `ClustersDirectoryList` / `ClustersDirectoryListItem`, and the leaderboard's `ClustersLeaderboardListItem` branch
- Account: the split containers around `WatchlistTable`, `ApiKeyTable`, `AddressTagTable`, `TransactionTagTable`, `CustomAbiTable`, `VerifiedAddresses` → `WatchListItem`, `ApiKeyListItem`, `AddressTagListItem`, `TransactionTagListItem`, `CustomAbiListItem`, `VerifiedAddressesListItem` and any `…List` between

## Leaf worklist

- [ ] 1 `[agent]` Apply the transform to every view and delete the orphaned list containers and items
- [ ] 2 `[agent]` Add the mobile `Sort` dropdown to `NameDomainHistory`
- [ ] 3 `[agent]` Prune the mobile Playwright coverage, run the affected files in Docker, regenerate any desktop baseline that changed
- [ ] 4 `[human]` Review the screenshot diff and check the routes at 375px
