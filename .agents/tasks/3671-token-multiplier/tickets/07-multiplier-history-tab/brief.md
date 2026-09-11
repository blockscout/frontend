# 07 — Multiplier history tab (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #3671 |
| Blocked by | Q02, T02 |

## Goal

A **Multiplier history** tab on the token page (`/token/{hash}?tab=multiplier_history`) listing every
recorded multiplier change: transaction, timestamp, block, old → new factor, activation date, and an
Active / Inactive status; the tab title carries the count from `ui_multiplier_changes_count` in
`/tokens/{hash}/counters`. Table on desktop, list on mobile. Spec FR7.

## Known context

- Endpoint `/tokens/{hash}/ui-multiplier-changes`; agreed, includes the transaction hash, not deployed
  (404 on eth-sepolia at ticketing time) and not on either ERC-8056 API branch.
- Resource key to propose: `core:token_ui_multiplier_changes` in `src/api/resources/services/core/token.ts`,
  beside `token_counters`. Paginated iff the sample carries `next_page_params`.
- The tab is a new tab on an existing page, not a new route: extend `TokenTabs` and the `tabs` array in
  `src/slices/token/pages/details/Token.tsx`, body components under
  `src/slices/token/pages/details/multiplier-history/` (`TokenMultiplierHistory`, `…Table`, `…TableItem`,
  `…List`, `…ListItem`), mirroring `holders/`. `add-new-page` is not needed; `add-api-resource` is.
- The counter needs its own field on `schemas['TokenCountersResponse']` — same beta-types publish as the
  history endpoint, once it lands on the API branch.
- Factor cells use T01's formatter; the arrow between old and new is a design element.
- Mockup: [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28735).

## Blocking unknowns

- **Q02** — response shape, pagination params, and an instance to sample from. Owner: Core API (Alexey).
- Which API branch will carry the endpoint and the counter, for the follow-up `publish-beta-types`. Owner:
  Core API (Alexey), same thread.
- How "active" is determined: a flag in the item, or derived by the frontend from
  `activation date <= now` plus "latest such change". Owner: Core API (Alexey), same thread.

## Skill inputs collected so far

### `add-api-resource`

- Service + endpoint path: `core`, `/api/v2/tokens/:hash/ui-multiplier-changes`; proposed key
  `core:token_ui_multiplier_changes`
- Live instance with the endpoint: unknown (Q02)
- Types-package state: not published; beta from the API branch once known (`publish-beta-types`, service
  `core`)
- Filters / sorting: none
