# 07 — Multiplier history tab

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #3671 |
| Blocked by | T02, Q02 |

## What to build

An ERC-8056 token gets a **Multiplier history** tab (`/token/{hash}?tab=multiplier_history`). The tab lists
every recorded multiplier change, newest first: transaction, timestamp, block, old → new factor, activation
date and an Active / Inactive status. Its title carries the count from `ui_multiplier_changes_count` in
`/tokens/{hash}/counters`. The tab is paginated like the Holders tab and shows an empty state for a token
with no recorded changes. It is one horizontally scrollable table at every width, with no mobile list,
matching the address page tabs.

The ticket also lays down what T08 reuses: the API resource, the status rule, and the two cells that carry
the design elements (the old → new factor and the status tag).

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open
`/token/0xE1C0a83Ab03e4498Fad1f833fA484E2cfc68dE7b?tab=multiplier_history` (GTB8056, two changes), then
`/token/0x907C9A3Dd7a2eBE292d831A352Adb39aE202A193?tab=multiplier_history` (NVDA, multiplier 4x, no changes)

- [ ] `core:token_ui_multiplier_changes` is declared in `src/api/resources/services/core/token.ts` with
      `paginated: true`, and its payload branch resolves to
      `paths['/api/v2/tokens/{address_hash_param}/ui-multiplier-changes']['get']` (not `never`).
- [ ] `TokenTabs` includes `multiplier_history`. The tab is present exactly when the token's type is
      `ERC-8056` and the instance enables that type (`isTokenMultiplierEnabled`). This holds whatever the
      count is, including `0`, and whether or not `ui_multiplier` is populated.
- [ ] The tab count comes from `ui_multiplier_changes_count`, handled the same way as `holdersCount`
      (undefined while the counters are placeholder data).
- [ ] A pure helper in `src/slices/token/utils/` decides each row's status. It has a unit spec covering: the
      first row in API order whose `effective_at` is not after now is Active; rows above it (future
      `effective_at`) and below it are Inactive; nothing is Active on pages after the first; an empty list.
- [ ] Reusable cells live in `src/slices/token/components/`. One renders `old → new`, both formatted by
      `formatUiMultiplier`. The other is the status tag.
- [ ] Table columns: Txn hash (tx entity, truncated, copy; a `null` `transaction_hash` renders a
      placeholder, not a broken link), Timestamp (`TimeFormatToggle` in the header), Block (block entity),
      Multiplier, Activation date (`TimeFormatToggle` in the header), Status. Dates go through the shared
      time components.
- [ ] Loading, empty ("There are no multiplier changes for this token.") and error states follow
      `TokenHolders`. Pagination sits in the action bar.
- [ ] A stub item in `src/slices/token/stubs.ts` feeds `placeholderData`. Mocks with at least two changes
      (one Active, one Inactive) and a `next_page_params` variant sit in `src/slices/token/mocks/`.
- [ ] Playwright scaffold `TokenMultiplierHistoryTable.pw.tsx` covers desktop and mobile with
      `ENVS_MAP.additionalTokenTypes`. No screenshot baselines are generated before the style leaf.
- [ ] `(human)` GTB8056: the tab reads `Multiplier history 2`. Row 1 is `1.05x → 1.04x`, Active; row 2 is
      `1x → 1.05x`, Inactive. Links go to the tx and block pages, and the time toggle switches both date
      columns.
- [ ] `(human)` NVDA: the tab is present with count 0 and shows the empty state. An ERC-20 token has no tab.
      With `ERC-8056` removed from the additional-types env, GTB8056 has no tab.
- [ ] `(human)` At mobile width the table scrolls horizontally inside its container, as the address Coin
      balance history tab does.

## Details

**Endpoint and data.** `GET /api/v2/tokens/:hash/ui-multiplier-changes` returns items of
`schemas['TokenUIMultiplierChange']`, newest first (by `block_number`, then `log_index`; confirmed on the
GTB8056 sample). Pagination is by `block_number`, `log_index` and `items_count`. The items carry no status
field, so the frontend derives it (see Q02 in `questions.md`).

**Status rule.** The API orders items newest first. The active change is the most recent one already in
effect, i.e. the first row whose `effective_at` is not in the future. Apply the rule only to the first page
and mark every row on later pages Inactive: page 2 can't contain the active change unless all of page 1 is
scheduled for the future. Cross-check against the token: the Active row's `new_multiplier` should equal the
token's `ui_multiplier`. Only use this cross-check to sanity-test the helper, never as the rule.

**Scheduled changes.** A row whose `effective_at` is still in the future renders **Inactive** for now. Q07
asks the designer whether that state gets its own label. If Q07 is answered before this ticket lands, edit
this ticket. If it is answered after, it becomes a new ticket. Keep the status as a small union returned by
the helper, so a third state is an additive change.

**Tab gate.** The user asked for the tab on every ERC-8056 token, so the gate is the type plus the env and
does not use `getUiMultiplier`. `getUiMultiplier` also requires `ui_multiplier` to be present, and the
history does not depend on that field. Place the tab after Holders, as in the mockup.

**Mobile.** Wrap the table in `TableContainerScrollable` with a `minW` on `TableRoot`, following
`AddressCoinBalanceHistory`. There are no `…List` / `…ListItem` components.

**Components.** `src/slices/token/pages/details/multiplier-history/`: `TokenMultiplierHistory` (query,
action bar, `DataList`), `TokenMultiplierHistoryTable`, `TokenMultiplierHistoryTableItem`. Mirror
`holders/` for query and lazy rendering.

**Primed requests.** The tab is not the default tab, so the primer registry needs no change. The
existing `Token.primed.spec.tsx` case for a non-default tab keeps passing.

## Skill inputs

### `add-api-resource`

- Service + endpoint path: `core`, `/api/v2/tokens/:hash/ui-multiplier-changes`; key
  `core:token_ui_multiplier_changes`, placed beside `token_counters` / `token_holders`
- Live instance with the endpoint: `eth_sepolia`, token `0xE1C0a83Ab03e4498Fad1f833fA484E2cfc68dE7b` (two
  changes). An empty sample is available from `0x907C9A3Dd7a2eBE292d831A352Adb39aE202A193`.
- Types-package state: published in `@blockscout/api-types` `0.0.1-beta.082a03750a`, which is already
  pinned. No publish needed.
- Filters / sorting: none

## Leaf worklist

- [x] 1 `[agent]` Declare `core:token_ui_multiplier_changes` — skill: `add-api-resource`
- [x] 2 `[agent]` Status helper with unit spec; old → new factor cell and status tag scaffolds in
      `src/slices/token/components/` (placeholder presentation, `TODO (design):` markers)
- [x] 3 `[agent]` Tab wiring in `Token.tsx` (gate, count), `multiplier-history/` scaffold (query, table,
      states, pagination), stub, mocks, Playwright scaffold
- [x] 4 `[human]` Style the table, factor cell and status tag to mockup; generate baselines —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28735)
