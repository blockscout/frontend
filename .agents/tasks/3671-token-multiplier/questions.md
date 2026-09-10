# Open questions — ERC-8056 token multiplier support

### Q01 — What does the frontend use when a transfer's or state change's `ui_multiplier` is `null`?

Transfers that precede a token's first recorded `UIMultiplierUpdated` come back with
`total.ui_multiplier: null`, and state changes behave the same way. Falling back to the token's current
factor would render those rows at today's multiplier when a different one applied at the time, so there is
no safe frontend-side default.

- Owner: Core API (Alexey)
- Status: `pending`
- Resolved when: either the API commits to always populating the historical factor (including the initial
  one, before any change event), or it names the value the frontend should substitute when the field is
  `null` — and says whether that value is derivable from the response.
- Slack: https://blockscout.slack.com/archives/D07RA1R99T4/p1789059568688819
- Answer: —

### Q02 — What is the response shape of `/tokens/{hash}/ui-multiplier-changes`?

The endpoint is agreed and will include the transaction hash, but it is not deployed and its schema is
unknown, so neither the API resource nor the history table can be built against it.

- Owner: Core API (Alexey)
- Status: `pending`
- Resolved when: the per-item fields and their types are known (at minimum: transaction hash, block number,
  timestamp, old factor, new factor, activation date), the pagination parameters are known, and the
  endpoint is reachable on an instance we can fetch a sample from.
- Slack: https://blockscout.slack.com/archives/D07RA1R99T4/p1789051937073589
- Answer: —

### Q03 — A test token exercising a pending multiplier change

The only ERC-8056 token available has one applied change, which covers scaled amounts but leaves the
"scheduled change" state unverifiable — `ui_multiplier_effective_at` in the future with a differing
`new_ui_multiplier`. Acceptance of requirement 5 needs it.

- Owner: PM (Nikita S.)
- Status: `pending`
- Resolved when: a token exists on a reachable instance with a multiplier other than 1 and a change
  scheduled for a future timestamp, and its address is known.
- Slack: — (not sent; deferred until the implementation reaches acceptance)
- Answer: —
