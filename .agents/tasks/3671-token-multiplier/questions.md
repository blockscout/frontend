# Open questions — ERC-8056 token multiplier support

### Q01 — What does the frontend use when a transfer's or state change's `ui_multiplier` is `null`?

Transfers that precede a token's first recorded `UIMultiplierUpdated` come back with
`total.ui_multiplier: null`, and state changes behave the same way. Falling back to the token's current
factor would render those rows at today's multiplier when a different one applied at the time, so there is
no safe frontend-side default.

- Owner: Core API (Alexey)
- Status: `resolved`
- Resolved when: either the API commits to always populating the historical factor (including the initial
  one, before any change event), or it names the value the frontend should substitute when the field is
  `null` — and says whether that value is derivable from the response.
- Slack: https://blockscout.slack.com/archives/D07RA1R99T4/p1789059568688819
- Answer: the API always populates the historical factor, including the initial `1.0` before the first
  `UIMultiplierUpdated`. Fixed by Alexey and verified on eth-sepolia: both transfers of
  `0x6D50E6CBca0e390BbCF82bEA80B31F4c2694395e` and all four of their token state changes now return
  `1000000000000000000`. The field stays nullable in the schema (`@blockscout/api-types`
  `0.0.1-beta.77c8e15baf` still declares `IntegerStringNullable`), so a `null` is a data gap, not a
  value to substitute: `getUiMultiplier` already returns `undefined` for it and the row degrades to plain
  ERC-20 rendering (no scaling, no tag), the same path as the env gate being off. No frontend fallback
  and no new ticket.

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
- Status: `waived`
- Resolved when: a token exists on a reachable instance with a multiplier other than 1 and a change
  scheduled for a future timestamp, and its address is known.
- Slack: — (not sent)
- Answer: waived at ticketing — the API already resolves a scheduled change into `ui_multiplier`, the
  mockups carry no pending-change UI, and no ticket reads `new_ui_multiplier` or
  `ui_multiplier_effective_at`. Reopen if a pending-change indicator is ever added.

### Q04 — What heading does an ERC-8056 token sit under in search results?

Search groups results by category, and the fungible group's heading is the fixed string
`Tokens (ERC-20)`. T01 moved ERC-8056 out of the NFT group into it, so the token now shows under a heading
that names another type. Mockups cover no search surface.

- Owner: PM (Nikita S.)
- Status: `resolved`
- Resolved when: the PM picks one of: keep `Tokens (ERC-20)`; list the instance's enabled fungible types
  (`Tokens (ERC-20, ERC-8056)`), which we recommend; or a separate `Tokens (ERC-8056)` group like the
  ERC-7984 one. Not a blocker for any ticket — only the heading string changes.
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1789124062421439
- Answer: list the enabled fungible types. The heading is built from `ERC-20` plus every additional token
  type that is not confidential, e.g. `Tokens (ERC-20, ERC-8056)`. Done in T01.

### Q05 — Why is `total.ui_multiplier` `null` on the transaction endpoints only?

`/addresses/{hash}/token-transfers` and `/tokens/{hash}/transfers` populate the historical factor as Q01
promised, but `/transactions/{hash}` (its `token_transfers` array) and `/transactions/{hash}/token-transfers`
return `null` for the same transfer. The frontend degrades those rows to plain ERC-20 rendering (Q01), so
the tx page shows an unscaled amount with no tag while every list of the same transfer shows the tag.

- Owner: Core API (Alexey)
- Status: `pending`
- Resolved when: the two transaction endpoints return the same `total.ui_multiplier` as the address and
  token transfer lists, verified on eth-sepolia for
  `0xd872e60be3db1ef32aabd863af2037330decb3dd73a3786df7a9540b38597fbd`.
- Slack: https://blockscout.slack.com/archives/D07RA1R99T4/p1789469766618439
- Answer: —

### Q06 — Does a transfer show the factor that applied to it, or the token's current factor?

The spec's implementation decision scales a transfer by `total.ui_multiplier`, the factor in force when it
happened, while balances use the token's current factor. On eth-sepolia the address
`0x242ba6d68FfEb4a098B591B32d370F973FF882B7` received 100 IOU at 1x, and the factor became 1.69x 48 seconds
later: the Tokens tab shows 169 IOU while the Token transfers tab shows the same transfer as 100 IOU with a
`1x` tag. The decision came from the API contract, not from a stated product intent.

- Owner: PM (Nikita S.)
- Status: `resolved`
- Resolved when: the PM confirms one of: keep the historical factor (current behaviour, the `1x` tag being
  the disclosure); or scale transfers by the token's current factor (169 IOU, `1.69x` tag), which makes
  `total.ui_multiplier` unused and amends the spec, T03, T04 and T06.
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1789469867600519
- Answer: keep the historical factor. A transfer shows the multiplier that applied when it happened, with
  the tag as the disclosure; balances use the current factor. No change to the spec or to T03/T04/T06.
