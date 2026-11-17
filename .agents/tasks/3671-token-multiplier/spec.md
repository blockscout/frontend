# ERC-8056 token multiplier support

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3671 |
| Feature branch | `issue-3671` |
| PM | Nikita S. |
| Designer | Tatyana |
| Backend | Alexey |
| Minimum API version | Core API v12.0.0+ |
| Slack channel | — |

## Context & goal

ERC-8056 is a token standard whose contract exposes a *UI multiplier*: the amount a holder should see is the
raw ERC-20 amount scaled by that factor (`uiAmount = rawAmount × uiMultiplier`). The multiplier changes over
time, each change announced by a `UIMultiplierUpdated` event carrying an activation timestamp, so a change
can be scheduled ahead of when it takes effect.

The explorer currently renders these tokens as plain ERC-20s, showing raw amounts. A holder comparing the
explorer against their wallet sees different numbers for the same balance, with nothing explaining the
discrepancy.

This task makes the explorer speak the token's own units: every displayed amount of an ERC-8056 token is
scaled, the raw value stays reachable in a tooltip, and a tag marks that scaling is in effect at all.

## Functional requirements

1. `ERC-8056` is a selectable token type wherever token types are filtered, and appears as the type tag on
   token entities.
2. Every amount of an ERC-8056 token rendered anywhere in the app is the scaled amount, never the raw one —
   the single exception is the amount tooltip, which discloses the raw value.
3. An amount of an ERC-8056 token carries a multiplier tag showing the factor in effect, shown even when the
   factor is exactly 1.
4. The amount tooltip states the scaled value, the raw value, and the multiplier applied.
5. The token details page shows a Multiplier row with the currently effective factor and an explanatory
   tooltip.
6. The token details page shows the most recent multiplier changes inline, capped at five, linking to the
   full history when more exist.
7. A Multiplier history tab lists every recorded multiplier change with its transaction, block, old and new
   factor, activation date, and whether it is the active one; the tab carries a count.
8. A token whose multiplier data is absent, or one on an instance where the type is not enabled, renders
   exactly as an ERC-20 does today — no scaling, no tag, no tooltip, no Multiplier row.
9. Fiat values of ERC-8056 amounts are computed from the scaled amount.

## Data & API

Shipped in **Core API v12.0.0** (testing builds sit on top of 11.3.0). All fields are nullable; the
multiplier is a fixed-point integer with **18 decimals of precision**, independent of the token's own
`decimals`.

**Token model** (`token`, wherever it is embedded):

- `ui_multiplier` — the factor in effect at request time. The API already resolves a scheduled change, so
  this is the effective value, not the raw stored one.
- `new_ui_multiplier` — the factor scheduled to replace it.
- `ui_multiplier_effective_at` — when that replacement takes effect. A change is *pending* exactly when this
  is in the future.

**Token transfers** — `total.ui_multiplier` carries the factor in force when the transfer happened.

**State changes** — `ui_multiplier` sits alongside `balance_before` / `balance_after` / `change`.

**Type filtering** — `?type=ERC-20` no longer returns ERC-8056 tokens; `?type=ERC-8056` selects them.

**Supplies** — `total_supply` is raw and must be scaled by `token.ui_multiplier`. `circulating_supply` is
already in UI units and must not be scaled. `circulating_market_cap` is fiat, not a token quantity, and must
not be scaled either.

**Exchange rate** — quoted per *UI* token, so fiat is `uiAmount × rate`. The existing USD path is correct
once it receives the scaled amount.

**New resource** — the multiplier history endpoint `/tokens/{hash}/ui-multiplier-changes` needs a
`service:name` resource; its response shape is Q02. Its count arrives as `ui_multiplier_changes_count` in
`/tokens/{hash}/counters`.

**Readiness** — the token fields, transfer `total.ui_multiplier`, state-change `ui_multiplier` and type
filtering are deployed and observable on a live instance. The history endpoint and the counter are not.

**Live example** — https://eth-sepolia.blockscout.com/address/0x6D50E6CBca0e390BbCF82bEA80B31F4c2694395e

**Env** — instances opt in through the existing `NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES` by listing
`ERC-8056`. No new env var.

## UI inventory

Parent frame:
[Token multiplier support #3671](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6004-41185).

| Surface | Change | Node |
| --- | --- | --- |
| Token transfers table | type filter option, multiplier tag, amount tooltip | [5995:28720](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28720) |
| Address → token transfers tab | same treatment | [5995:28716](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28716) |
| Token details → Details tab | Multiplier row, info tooltip, inline history (max 5) with link to the tab, scaled supply | [5995:20900](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-20900) |
| Token details → Multiplier history tab | new tab, table + mobile list, tab counter | [5995:28735](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28735) |
| Advanced filter | Multiplier column, amount tooltip | [6004:40199](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6004-40199) |

Route for the new tab: `/token/{hash}?tab=multiplier_history`.

Surfaces absent from the mockups but in scope, because they render an amount of the token and would
otherwise disagree with the ones that are: token holders (Quantity column), address token balances and net
worth, the address token-select dropdown, and transaction state changes. They reuse the amount treatment
above — no new elements.

Search results need a fix of a different kind: they branch on `ERC-20` to choose between showing a price and
showing an NFT-style item count, so an ERC-8056 token currently renders as if it were an NFT collection.
Search carries no multiplier fields and displays no amount, so it needs the branch corrected, not scaling.

## Implementation decisions

- **The frontend scales; the API never does.** API v2 hands over raw values plus the multiplier. (Backend
  scaling does exist, but only on the old-UI and notification-email paths.)
- **One predicate owns the decision to scale.** A single helper resolves a token to its multiplier or to
  nothing, and every amount site multiplies by what it returns. It yields nothing unless the instance
  enables `ERC-8056` *and* the response carries multiplier data. When it yields nothing the whole treatment
  is suppressed together — scaling, tag, tooltip and Multiplier row — so a half-configured instance degrades
  to today's ERC-20 rendering rather than to a mix of scaled and raw figures.
- **Multiplier formatting is one shared rule**, reused everywhere the factor appears: six decimals, no
  trailing zeros, and the app's existing "below the smallest representable value" treatment underneath that.
  This departs from the mockups, which render `1.00x`; the PM confirmed the trailing zeros carry no meaning.
- **Amount precision is unchanged.** Scaled amounts use the app's existing accuracy in the cell and full
  precision in the tooltip; computation stays full-precision throughout, rounding only at render.
- **A transfer shows the multiplier that applied to it**, from `total.ui_multiplier`, not the token's current
  factor — pending Q01 for what to do when that value is absent.
- **The Details Multiplier row and the history block are separable.** The row comes from the token model and
  works with no history at all; the inline block and the tab come from the history endpoint. When history is
  unavailable or empty, the row renders alone.

## Out of scope

- **B-20.** It carries a comparable multiplier interface but brings a much larger surface of its own;
  supporting it is a separate task.
- **CSV exports.** Generated backend-side; scaling them is a backend change.
- **Reconstructing historical fiat.** Fiat follows from the scaled amount and the current rate.
- **Analytics events.** No custom Mixpanel events; tab views are covered by existing page-view tracking.
