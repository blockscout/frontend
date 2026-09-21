# Replace the remaining mobile list views with table views and remove the list components

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3722 |
| Feature branch | `issue-3722` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Almost every paginated view in the app ships two layouts: a table for `lg` and up, and a
purpose-built list of stacked label/value rows below it. The address page moved to table-on-mobile in
#3502 behind an A/B experiment (`txns_view_exp`, with a user-facing view toggle and a preference
cookie), and the list implementation was deliberately left in place as a rollback path. The
experiment has since gone stale — the toggle was never wired to a call site, `showTableView` is
hardcoded on the migrated views, and no user complaints followed. The decision to keep table view on
mobile is final.

That leaves the codebase carrying two renderings of the same data on ~68 surfaces. Both branches are
mounted in the DOM on every page (the split is CSS `hideFrom` / `hideBelow`, not a conditional
render), so each one costs render work and markup on both viewports, and every new column has to be
added twice — which is how defects like #3702 (a tooltip present in the table view and missing from
the list view) appear.

The goal is one rendering per view: mobile shows the same table as desktop, scrolled horizontally,
and every list container, list item and mobile-list primitive is deleted.

## Functional requirements

1. On mobile viewports, every migrated view renders the same table as desktop — same columns, same
   order, no column dropped or hidden — inside a horizontally scrollable container.
2. Sorting on mobile is performed through the action-bar sort dropdown, not the table header. The
   dropdown is present on every sortable view, including the transaction views where the experiment
   suppressed it and the sortable views that never had one (bridged tokens, name domain history,
   transaction internals).
3. Action bars, pagination, filters, CSV export links and socket "new items" notices keep their
   current mobile behaviour and placement; only the rows below them change.
4. No list layout remains: no `*List` container, no `*ListItem` component, and neither of the shared
   `ListItemMobile` / `ListItemMobileGrid` primitives, nor the mobile variant of the socket
   new-items notice.
5. No experiment code remains: the view-toggle hook and button, the `showTableView` prop threading,
   the `table_view_on_mobile` cookie and its `NAMES` entry, the `txns_view_exp` GrowthBook flag
   declaration and its test mock, the `Txn view switch` Mixpanel event, and the `list_view` sprite
   icon.
6. Existing Playwright coverage keeps its meaning: tests and cases that exercised a list-only
   component are removed, and the mobile screenshots of every migrated view are regenerated in the
   same commit as the code that changes them.

## Data & API

None. No endpoint, `service:name` resource, response type, env var or feature flag is added or
changed. The `txns_view_exp` GrowthBook flag declaration is removed from the client; PMs confirmed
the experiment and its analytics event are stale and safe to drop, so no data needs preserving and
no dashboard coordination is required.

## UI inventory

Affected surfaces, all of which already have a desktop table counterpart — the migration is the same
transform on each, no new table is designed:

- **Core slices** — transactions index and its tabs, blocks index, tokens index, token transfers
  (index, token page, transaction page), internal transactions (index, transaction and block tabs),
  verified contracts, addresses index, search results, token holders, transaction state.
- **Rollup features** — Optimism (batches, deposits, withdrawals, output roots, dispute games),
  Arbitrum (batches, messages, transaction withdrawals), Scroll (batches, deposits, withdrawals),
  ZkSync batches, Shibarium deposits and withdrawals.
- **Chain variants** — beacon chain deposits and withdrawals (index and block tabs), Celo epochs,
  TAC operations, ZetaChain CCTXs, the Zilliqa / Stability / Blackfort validator pages.
- **Multichain and cross-chain** — multichain accounts, contracts, internal transactions, token
  transfers, user ops, ecosystems, address portfolio; cross-chain bridged tokens, ICTT users, and the
  transaction-level cross-chain transfer tabs.
- **Remaining features** — name services (domains index, domain history, clusters leaderboard and
  directory), hot contracts, DEX pools, flashblocks, user ops, blobs, FHE operations, transaction
  authorizations, asset flows, tag search, interop messages, dapp approvals.
- **Account pages** — watchlist, API keys, private address and transaction tags, custom ABI,
  verified addresses.
- **Home page** — the latest cross-chain transactions widget, the one surface whose desktop side is a
  narrow headerless table inside a card. Converted in its own commit and reviewed by the designer on
  a preview deployment; see `questions.md` Q01.

No new screens, no new states, no mockups: the treatment is the one #3502 established.

## Implementation decisions

- **The per-view transform is fixed**: delete the mobile list branch, unwrap the desktop-only
  wrapper box, wrap the table in `TableContainerScrollable`, and give the table root a `minW` chosen
  from its content so the columns do not compress. Deviating from it needs a reason recorded on the
  ticket.
- **Deletion happens with the migration, not after it.** Each ticket deletes the list containers and
  list items it orphans, so no ticket leaves dead code behind for a later sweep.
- **The shared primitives die last.** `ListItemMobile`, `ListItemMobileGrid` and the socket notice's
  mobile variant are removed in a final teardown ticket, once no consumer remains.
- **The experiment teardown goes first.** It is pure deletion, it blocks nothing, and it restores the
  mobile sort dropdown that the experiment suppressed — so the sorting requirement is satisfied from
  the first ticket rather than at the end.
- **Sorting stays a dropdown on mobile.** A sortable table header sits off-screen behind horizontal
  scroll, so the header is not a usable mobile affordance. The shared `Sort` control is already
  viewport-adaptive (icon button on mobile, labelled select on desktop) and is reused as is.
- **The home widget is isolated and reversible.** It is one commit of its own so that a "no" from the
  designer is a single revert. Whichever way that decision goes, the list item it uses has its
  container inlined so that the shared primitives are deleted regardless.
- **Verification is per ticket.** Each ticket carries a human acceptance criterion: open its routes at
  375px against the matching dev-server preset (`eth` for the core slices, `optimism` / `arbitrum` /
  `scroll` for rollups, `celo` / `zeta_chain` / `tac` for chain variants, `multichain` for the
  multichain pages) and confirm the table scrolls, the action bar and pagination survive, and nothing
  clips.
- **Screenshots travel with their code.** Each ticket regenerates its own Playwright screenshots
  through the Docker runner so they match CI, and commits them alongside the change; the branch is
  never intentionally red between commits.
- **One PR, one commit per ticket**, so any single area can be reverted on its own.

## Out of scope

- Designing new tables or changing any existing table's columns, order or content.
- Card-based surfaces that have no table counterpart — the home page's latest blocks and
  transactions widgets, and the marketplace dapp cards.
- Making table headers usable for sorting on mobile (sticky or pinned columns).
- Any change to desktop rendering.
- Backend or API changes.
