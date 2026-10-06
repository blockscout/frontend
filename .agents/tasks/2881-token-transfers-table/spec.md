# Unify the token transfers tables into one configurable table

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/2881 |
| Feature branch | `issue-2881` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | Victor |
| Minimum API version | — |
| Slack channel | — |

<!-- Header is static identity — no status row: task status is derived from `progress.md` (see
`.agents/tasks/structure.md`). People default from `.agents/TEAM.md`; override here per task. The spec body
below is immutable once written; only `progress.md` and `questions.md` change as work proceeds. -->

## Context & goal

Token transfers are listed on four surfaces — the `/token-transfers` page, the address page tab, the
token (and token instance) page tab, and the transaction page tab — and each one has its own table with
its own column set and order. The same transfer reads differently depending on where the user meets it:
the token sits in a "Token" column on one page and inside the "Amount" cell on another, the timestamp
hides inside the hash cell, mint/burn and token-standard badges appear or vanish. Three row
implementations carry three copies of the same rendering logic, so every fix lands three times.

The goal is one table format for all token-transfer views: a single ordered column vocabulary, a
per-surface default selection that reproduces what each page shows today (adjusted to the mockups), and
a column selector that lets the user add or remove columns the way the advanced filter table already
does. The chosen set survives reloads.

## Functional requirements

1. Every token-transfer view (index page, address tab, token tab, token instance tab, transaction tab,
   and the user-op and multichain variants that reuse them) renders the same table component with the
   same column vocabulary in the same default order: Txn hash, Type, Method, Timestamp, Block, From,
   To, Amount, ID / Asset, Value. In multichain context a chain column precedes them and cannot be
   hidden or moved.
2. Each surface has a default column selection that matches its mockup, with Value on everywhere:

   | Column | Index | Address tab | Token / instance tab | Tx tab |
   | --- | --- | --- | --- | --- |
   | Txn hash | on | on | on | unavailable |
   | Type | on | on | off | on |
   | Method | on | on | on | unavailable |
   | Timestamp | on | on | on | unavailable |
   | Block | on | on | off | unavailable |
   | From / To | on | on | on | on |
   | Amount | on | on | on | on |
   | ID / Asset | on | on | on | on |
   | Value | on | on | on | on |

   "Off" columns are hidden by default but offered in the selector; "unavailable" columns are neither
   rendered nor offered, because their value is constant for every row on that surface.
3. A column selector button sits next to each surface's existing filter control (tabs right slot or
   action bar, wherever that surface keeps its controls today) and toggles the available columns; its
   rows can be dragged by a handle to reorder the columns, hidden ones included. The mobile selector is
   the same control in the mobile action bar.
4. The user's selection and column order are persisted per surface and restored on the next visit,
   including on server-rendered first paint, with no flash of the default layout.
5. Each surface keeps exactly the controls it has today — the token-type filter, the address
   in/out filter, CSV export, the advanced-filter link, pagination, and the socket "new items" notice
   are neither added to nor removed from any surface.
6. The cells keep today's behaviour: the address tab highlights the current address, the token instance
   tab does not link the current token id, the Timestamp header keeps the time-format toggle, fungible
   amounts show the token-multiplier and confidential-value variants, and NFT rows show the token id
   (instance image, id, symbol) inside the ID / Asset cell with "1" as the amount when they carry no
   value, while fungible rows show icon and symbol only.
7. Toggling a column emits one Mixpanel event carrying the surface, the column and the new state;
   moving a column emits one carrying the surface, the column and the direction.
8. The advanced filter page's column selector becomes icon-only (no "Columns" label) and, since the
   control is shared, reorders that table's columns in memory; no other change to that page.

## Data & API

None. All five list endpoints already exist as `core:token_transfers_all`, `core:address_token_transfers`,
`core:token_transfers`, `core:token_instance_transfers` and `core:tx_token_transfers`, and they return the
same `TokenTransfer` item shape, so no column needs data the surface does not already fetch. The USD
value is derived client-side from the token's exchange rate, as today. The transaction endpoint returns
`method` and `timestamp` as null, which is why those columns are unavailable on the transaction tab.

No new resource, env var or feature flag. No backend release dependency.

## UI inventory

Figma page "Tables: Token transfers", desktop frames under
https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-26170 :

- `/token-transfers`, "Transfers" tab — https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-31715
- Address page, "Token transfers" tab (also the multichain address variant) —
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-32182
- Token page, "Token transfers" tab, and the token instance page's transfers tab —
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3883-4329
- Transaction page, "Token transfers" tab (also the user-op page's transfers tab) —
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3883-4723
- Advanced filter page (reference only for the icon-only selector button) —
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-26175
- Mobile table and column drawer —
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3889-33029 and
  https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3893-28801

Deliberate deviations from the mockups:

- Value is on by default on every surface (mockups show it only on the address tab).
- The mobile list/table view switcher is not built: the list views were removed in #3722 and that
  decision is final. Mobile shows the horizontally scrolled table only.
- The mobile drawer in the mockup omits Block; the selector offers every available column.
- The control set per surface stays as it is today (see FR 5), not the uniform
  Filter · Columns · CSV · Advanced bar the mockups draw on every screen.

Appearance (column widths, the From/To arrow, drawer vs popover on mobile) stays with the mockups and
the `[human]` style leaves.

## Implementation decisions

- **One table component** in the token-transfer slice replaces the three current row/table
  implementations (the shared list table, the index-page table, the token-page table). It takes the
  surface's column set and the row data; the columns are rendered from an ordered column vocabulary, in
  the spirit of the advanced filter's `ItemByColumn` switch, so a column is added once.
- **A column config module** owns the vocabulary, the display names, and the per-surface availability
  and defaults (FR 2). Consumers identify themselves by surface, not by passing column lists.
- **The selector UI is the advanced filter's `ColumnsButton`, extracted** to a shared location and made
  icon-only; the advanced filter keeps its own column state and table and only adopts the moved button.
- **Persistence is a cookie** read through the existing cookies utility, following the `NAMES` pattern
  used for the transactions sort and the NFT display type. One cookie holds a JSON map of surface →
  overrides from the defaults, so a change to the defaults does not resurrect stale full lists. The
  cookie is read on the server so the first paint already has the user's columns (FR 4).
- **Type column semantics and From/To splitting are gated on Q01 and Q02** in `questions.md`. Until
  answered: Type renders the token-standard tag with the mint/burn badge beside it; From and To are a
  single combined column backed by the existing `AddressFromTo` entity and toggled by a single selector
  entry.
- **Analytics** is one new Mixpanel event, following the existing event-registry convention.
- **Tests**: the unit specs of the deleted tables move to the new table; the Playwright files of each
  surface keep their cases; a selector-open state gets one screenshot.
- **One PR, one commit per ticket**, so the deletion of each old table can be reverted on its own.

## Out of scope

- The advanced filter table itself: its column set, header filters, the "Fee" → "Tx fee" rename, and its
  persistence (only the shared button is touched).
- Cross-chain transfer tables (interchain indexer data) on the index, address and transaction pages.
- The inline token-transfer snippets on the transaction details and Celo epoch pages.
- Adding CSV export, filters or advanced-filter links to surfaces that lack them today, and any backend
  work that would enable them.
- Sorting in any token-transfer table.
