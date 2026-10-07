# 14 — Multiplier column in the token transfers table

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 14 of #2881 |
| Blocked by | Q07, T13 |

## What to build

Token transfers get their own Multiplier column, as the advanced filter already has, and the multiplier
tag leaves the Amount cell. The column sits right before Amount and shows the factor in force when the
transfer happened. It is styled like the advanced filter's column, with a dash for rows that have no
multiplier. Amounts stay scaled and keep the raw-value tooltip.

The column only appears where it can carry a value. It is unavailable (neither rendered nor offered in
the selector) when the chain has ERC-8056 off, when the type filter is set and does not include
ERC-8056, and on the token / instance tab when the page token is not ERC-8056. Otherwise it is `on` by
default. Changing the type filter makes the column appear and disappear. The user's stored choice for
it survives while it is unavailable.

Returning columns slot back into place. Today a column that comes back after being unavailable is
appended to the **end** of a stored custom order (`getOrderedColumns`). Filter toggling would make that
common, so a returning column is put back at its default slot instead. The advanced filter's multiplier
column across chains gets the same fix.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, with `ERC-8056` in `NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES`
if the instance doesn't already list it (live example in the #3671 spec). Open `/token-transfers`,
the address tab of the live example, an ERC-8056 token's transfers tab and a non-ERC-8056 one. Toggle
the type filter between all, ERC-8056 and ERC-20.

- [ ] `multiplier` is added to `TokenTransferColumnId` and to `TOKEN_TRANSFER_COLUMNS` right before
      `amount`, named "Multiplier", numeric, with the same width as the advanced filter's column.
- [ ] The static `SURFACE_COLUMN_STATES` lookup becomes a pure function (e.g.
      `getSurfaceColumnStates(surface, { chainConfig, typeFilter, tokenType })`) that returns today's
      states plus `multiplier`. It returns `'unavailable'` when `isTokenMultiplierEnabled(chainConfig)`
      is false, when `typeFilter` is non-empty without `UI_MULTIPLIER_TOKEN_TYPE`, or on the `token`
      surface when `tokenType` is not `UI_MULTIPLIER_TOKEN_TYPE`; otherwise `'on'`. The other columns'
      states are unchanged. The column-states unit spec covers every branch.
- [ ] `useTokenTransferColumns(surface, …)` takes those inputs and passes memoized states to
      `usePersistedColumns`. Every call site passes the inputs it already holds: index and multichain
      index (`typeFilter`, chain config), address and multichain address (`filters.type`), tx
      (`typeFilter`), token (`token?.type`, no type filter). The chain config is the same one the page
      already passes to the table.
- [ ] `MultiplierCell` in `TokenTransferCellByColumn` renders `formatUiMultiplier` of
      `getTokenTransferUiMultiplier(item, chainConfig)` as plain `text.secondary` text, the same way as
      the advanced filter's `multiplier` case, and a dash when there is none. `AmountCell` drops the
      `TokenMultiplierTag` `startElement` and keeps `multiplier` for scaling and the tooltip.
- [ ] `getOrderedColumns` places an available column that is missing from the stored order at its
      default position, after the nearest preceding column in default order (or first if there is none),
      instead of appending it. `column-overrides.spec.ts` covers a column returning into the middle of a
      custom order and at the start. A stored order with no missing columns is unchanged.
- [ ] Unit specs: the cell spec's "scales the amount by the token multiplier and tags it" becomes a
      scaled amount without the tag. New `multiplier` cases cover the factor for ERC-8056 and a dash for
      ERC-20. `columns.spec.ts` and `useTokenTransferColumns.spec.ts` are updated for the new column and
      the state inputs.
- [ ] Playwright baselines that include an ERC-8056 row or the full header are regenerated.
- [ ] `(human)` On an ERC-8056-enabled chain the Multiplier column shows before Amount on the index,
      address and tx surfaces and on an ERC-8056 token's tab, with no tag in Amount. It disappears from
      the table and the selector on a chain without ERC-8056, under an ERC-20-only type filter, and on a
      non-ERC-8056 token. Hiding it, toggling the filter away and back keeps it hidden. Moving another
      column while it is filtered out and then clearing the filter brings it back before Amount.

## Details

Mockup for the column style: advanced filter
[6004:40199](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6004-40199). Match
`ItemByColumn`'s `multiplier` case. The one deviation is the dash for empty rows, which matches the other
empty token-transfer cells.

Decisions from Q07, 2026-10-07:

- Separate column; the Amount tag is dropped. A user who hides the column sees no multiplier tag
  anywhere in the table, which is accepted.
- Position right before Amount, as in the advanced filter.
- Filter-driven availability is limited to the type filter and the token's own type. The column is not
  hidden based on the rows the page happens to contain.
- Out of scope: the tx-details snippet (`TokenTransferSnippetFiat`) and the other surfaces that show the
  tag (holders, balances, state changes, token select) keep it.

Spec amendments made with this ticket (genuine requirement change): FR 1 vocabulary adds Multiplier; the
FR 2 table gains a Multiplier row with its availability note; FR 6 restates the multiplier treatment.

T10 (defaults review) will find the surface states behind a function instead of a constant map.

## Leaf worklist

- [x] 1 `[agent]` Missing columns slot into their default position in `getOrderedColumns`; spec
- [x] 2 `[agent]` `multiplier` column id + registry entry; surface states as a function of chain config,
      type filter and token type; `useTokenTransferColumns` inputs and all call sites; specs
- [x] 3 `[agent]` `MultiplierCell` (factor or dash) and the tag removed from `AmountCell`; cell specs
- [x] 4 `[human]` Match the cell to the advanced filter's column, verify availability toggling on every
      surface, regenerate Playwright baselines —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6004-40199)
