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
   same column vocabulary in the same default order: In / Out, Txn hash, Token type, Transfer type,
   Method, Timestamp, Block, From / To, Multiplier, Amount, ID / Asset, Value. In multichain context a
   chain column precedes them and cannot be hidden or moved.
2. Each surface has a default column selection that matches its mockup, with Value on everywhere:

   | Column | Index | Address tab | Token / instance tab | Tx tab |
   | --- | --- | --- | --- | --- |
   | In / Out | unavailable | on | unavailable | unavailable |
   | Txn hash | on | on | on | unavailable |
   | Token type | on | on | off | on |
   | Transfer type | off | off | off | off |
   | Method | on | on | on | unavailable |
   | Timestamp | on | on | on | unavailable |
   | Block | off | off | off | unavailable |
   | From / To | on | on | on | on |
   | Multiplier | on* | on* | on* | on* |
   | Amount | on | on | on | on |
   | ID / Asset | on | on | on | on |
   | Value | on | on | on | on |

   "Off" columns are hidden by default but offered in the selector; "unavailable" columns are neither
   rendered nor offered, because their value is constant for every row on that surface.

   \* Multiplier is unavailable when the chain has ERC-8056 off, when the type filter is set without
   ERC-8056, and on the token / instance tab when the token is not ERC-8056; a user's stored choice for
   it survives while it is unavailable.
3. A column selector button sits next to each surface's existing filter control (tabs right slot or
   action bar, wherever that surface keeps its controls today) and toggles the available columns; its
   rows can be dragged by a handle to reorder the columns, hidden ones included. The mobile selector is
   the same control in the mobile action bar.
4. The user's selection and column order are persisted per surface in the browser and restored on the
   next visit. Client-side navigation shows them at once; on a hard reload the server-rendered skeleton
   carries the default columns and switches to the user's at hydration, before any row data is shown. A
   change in one tab applies to the other open tabs.
5. Each surface keeps exactly the controls it has today — the token-type filter, the address
   in/out filter, CSV export, the advanced-filter link, pagination, and the socket "new items" notice
   are neither added to nor removed from any surface.
6. The cells keep today's behaviour: the address tab highlights the current address and spells the
   direction relative to it in the In / Out column (In, Out, Self, or a dash when it is neither side),
   the token instance tab does not link the current token id, the Timestamp header keeps the
   time-format toggle, fungible amounts are scaled by the token multiplier (raw value in the tooltip,
   the factor in the Multiplier column rather than a tag) and show the confidential-value variant, and
   NFT rows show the token id (instance image, id, symbol) inside the ID / Asset cell with "1" as the
   amount when they carry no value, while fungible rows show icon and symbol only.
7. Toggling a column emits one Mixpanel event carrying the table, the surface, the column id and the new
   state; moving a column emits one carrying the table, the surface, the column id and the direction.
   The advanced filter emits the same events without a surface.
8. The advanced filter page's column selector becomes icon-only (no "Columns" label) and, since the
   control is shared, reorders that table's columns; its selection and order are persisted like a
   token-transfer surface (FR 4), as one setting for the whole app regardless of chain; no other change
   to that page.

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
- **The selector UI is the advanced filter's `ColumnsButton`, extracted** to `src/shared/lists/columns/`
  and made icon-only, next to a table-agnostic persisted-columns hook. The advanced filter keeps its own
  column registry and table and uses the shared hook; the token-transfer slice wraps it per surface.
- **Persistence is localStorage**, one key per table + surface under a common `table_columns_` prefix,
  each holding only the overrides from the defaults, so a change to the defaults does not resurrect stale
  full lists. A cookie was dropped because it grows with every configurable table, is capped at 4 KB and
  rides on every request; the cost is the hydration-time switch described in FR 4. Per-key values keep a
  future cross-instance settings sync simple.
- **Type is two columns, From / To is one** (Q01, Q02): "Token type" renders the token-standard tag and
  "Transfer type" the mint/burn badge; From and To stay a single combined column backed by the existing
  `AddressFromTo` entity and toggled by a single selector entry.
- **Analytics** is one new Mixpanel event shared by both tables, following the existing event-registry
  convention; it logs column ids, not display names.
- **Tests**: the unit specs of the deleted tables move to the new table; the Playwright files of each
  surface keep their cases; a selector-open state gets one screenshot.
- **One PR, one commit per ticket**, so the deletion of each old table can be reverted on its own.

## Out of scope

- The advanced filter table itself: its column set, header filters and the "Fee" → "Tx fee" rename (only
  the shared selector and column persistence are touched).
- Cross-chain transfer tables (interchain indexer data) on the index, address and transaction pages.
- The inline token-transfer snippets on the transaction details and Celo epoch pages.
- Adding CSV export, filters or advanced-filter links to surfaces that lack them today, and any backend
  work that would enable them.
- Sorting in any token-transfer table.
