# Cross-chain views: column filters by chain and protocol

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3778 |
| Feature branch | `issue-3778` |
| PM | Nikita S. |
| Designer | Tatyana |
| Backend | Evgenii |
| Minimum API version | `interchain-indexer` v1.11.0 (already deployed on the shared mainnet instance) |
| Slack channel | #dev-interchain |

## Context & goal

The cross-chain transactions and cross-chain token-transfers tables show every message the deployment's
bridges carry, with no way to narrow them. The indexer already accepts directional chain filters and a
bridge filter on every list endpoint; the frontend sends none of them from user input. Goal: let a user
narrow both tables by source chain, destination chain and protocol (bridge) from the column headers, the
same way the advanced-filters table does, and tidy the token-transfers table layout the designer asked for
at the same time.

## Functional requirements

1. The cross-chain transactions table and the cross-chain token-transfers table each expose three column
   filters: **Source tx** (source chain), **Dest tx** (destination chain), **Protocol** (bridge). No
   other column has a filter.
2. Chain filters are a checkbox group (one checkbox per chain, logo + name) with no "All" entry — an
   empty selection means no filter. A search field (by chain name or chain ID) appears only when there
   are 10 or more chains. The selection maps to the comma-separated `src_chain_ids` / `dst_chain_ids`
   params. Chain options come from the indexer's chain directory, so
   the filters work on a single-chain explorer with no multichain configuration.
3. The protocol filter is a checkbox group ("All" + one checkbox per bridge) over the bridges the
   deployment is configured for; it is always rendered, even with a single bridge. The selection maps to
   `bridge_ids`.
4. A user protocol selection replaces the env-derived `bridge_ids` scope filter for that request; with no
   selection the env scope applies as before. A user can never widen the deployment's scope: the option
   list is the intersection of the indexer's enabled bridges and the env list.
5. Filter state lives in the URL under the API param names, is restored on reload / deep link, and resets
   pagination to page 1 on change.
6. The filters appear on every surface that renders these tables against a list endpoint accepting the
   params: transactions and token-transfers index pages (single-chain and multichain), the cross-chain tabs
   on address pages (single-chain and multichain), and the cross-chain tabs on transaction details. The
   home-page latest list stays filter-less.
7. With an active filter and no rows, the list shows the active-filters empty state instead of the plain
   empty text.
8. Whenever any filter is active, a non-sticky row above the table lists the active filters as closable
   tags (one tag per filter, multiple values joined; closing a tag clears that filter) followed by a
   "Reset all" control that clears every filter. The row is the reset affordance when the table header
   is out of view (empty state, or scrolled past).
9. The advanced-filter page's existing tags row is restyled to the same mockup: the "Filtered by:" title
   is dropped, the reset control sits right after the tags and reads "Reset all", and the tag close icon is
   14px inside the unchanged 20px click area. Its non-closable "Chain" tag and the default "Type / Age"
   placeholder tags stay.
10. Token-transfers table: the Message and Timestamp columns are merged into one column (message id on the
   first line, time below); the Source token and Target token cells get more width. The transactions table
   gets the same Message + Timestamp merge.
11. The filters, the tags row and the empty state look and behave the same at every breakpoint; there is
    no separate mobile mockup. On mobile the tags row sits above the pagination action bar.
12. No regression in search (`q`), scope filters, pagination or the Protocol column on any affected
    surface, and none on the advanced-filter page beyond the restyled row.

## Data & API

**Endpoints** — `/interchain/messages`, `/interchain/transfers` and their `:byAddress` / `:byTx` variants
all accept `src_chain_ids`, `dst_chain_ids`, `bridge_ids` (comma-separated, AND-combined; a destination
filter excludes rows with an unknown destination). Verified on the shared mainnet instance. Swagger:
`interchain-indexer/interchain-indexer-proto/swagger/v1/interchain-indexer.swagger.yaml` in
`blockscout-rs`.

**Resources** — existing: `interchainIndexer:messages`, `transfers`, `address_messages`,
`address_transfers`, `tx_messages`, `tx_transfers` gain the three params as `filterFields`;
`interchainIndexer:chains` supplies chain options. **New**: `interchainIndexer:bridges` →
`GET /api/v1/interchain/bridges` (`id`, `name`, `type`, `enabled`, `indexed_chain_ids`), no params,
typed by `GetBridgesResponse` from `@blockscout/interchain-indexer-types` (present in the installed
`1.11.0`). This reverses the "not registered" decision of task 3650: a deployment now spans two bridges
(mainnet `1` and `3`) and the filter needs bridge names.

**Scope-filter precedence** — `bridge_ids` is both an env scope filter and now a user filter. The user
value wins when present; the resolver falls back to the env list otherwise.

**No new env vars.** No analytics events.

**What the API does not offer** (and this task does not build): status, date range, amount, address
direction, token or message-id filters. Only `q` multisearch exists beyond the params above.

## UI inventory

Mockup (token-transfers table + filter popovers):
https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9120-121109

- Table: node `9120-115382`.
- Source tx chain popover: node `9120-120563`; Destination tx popover: node `9120-120521`; Protocol
  popover: node `9120-120033`.
- The Source tx popover (`9120-120563`) is the reference for both chain popovers: a checkbox list
  with chain logos and a search field. The Destination tx node still shows the earlier select-based
  layout and is superseded. Deviations agreed with the designer, not yet in Figma: the Protocol
  popover is a checkbox group, not an input.
- The remaining popovers in the section (Status/Address, Source token, Message/time) are out of scope.
- The transactions table has no mockup; it mirrors the token-transfers filters on the same column names.
- Empty state with active filters + the active-filter tags row:
  https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9136-48611
  (tags row node `9138-91679`). The empty-state illustration and copy are the existing generic
  active-filters empty state. The tags in the mockup are illustrative; the real ones are Source chain,
  Destination chain, Protocol.
- The same tags-row mockup is the target for the advanced-filter page's row (currently "Filtered by:"
  title + right-aligned "Reset filters").

Placement and behaviour: filter trigger icon in the column header, popover with title + Reset link +
Filter button — match `FilterByColumn` / `TableColumnFilterWrapper` / `TableColumnFilter` from the
advanced-filters feature. Chain popover body is a `CheckboxGroup` with an optional `FilterInput`
above it, matching `MethodFilter`; protocol popover body matches `TypeFilter`.

## Implementation decisions

- **Filters are column filters, not a filter bar.** Same wrapper and popover components as advanced
  filters; no new shared primitives.
- **URL-backed state through `filterFields`**, so the paginated-query hook reads them and the cursor is
  invalidated with the filter combination; the per-surface pages don't manage filter state themselves.
- **Chain options** are fetched with the existing chains resource inside the popover component, relying
  on React Query caching with `refetchOnMount: false` — no hoisting to the table.
- **Bridge options** are fetched with the new bridges resource the same way and intersected client-side
  with the feature config's bridge ids and `enabled`.
- **The filter components live in the cross-chain-txs feature** and are shared by both tables; the table
  header takes an "is filterable" switch so the home-page latest list renders no triggers.
- **The active-filter tags row is one shared filters component** (tags + "Reset all"), consumed by the
  advanced-filter page and by both cross-chain tables; the advanced-filter page's inline row is replaced by
  it. It renders only when at least one filter is active and is not sticky.
- **Close-icon sizing is scoped to the tag's `filter` variant**: the close trigger keeps its 20px box
  and gains 4px padding so the icon renders at 14px; other tag variants are untouched.
- **Column changes**: merged Message/Timestamp cell follows the Source tx / chain-label two-line pattern;
  token cells get a larger `maxW` (set to 200px, to be verified visually by the developer).

## Out of scope

- Any other change to the advanced-filter page beyond its tags row.
- Filters on token columns, a tx-hash input, status / date / amount / address / message filters — none
  exist in the API.
- A mockup for the transactions table; mirrored from the token-transfers one.
- Any change to the home-page latest cross-chain list.
