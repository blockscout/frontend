# 01 — Interchain types 1.8.1, fixtures carry bridge id and the unindexed flag

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 01 of #3650 |
| Blocked by | none |

## What to build

The app is typed against the shared indexer's current contract: `@blockscout/interchain-indexer-types`
moves from `1.6.0` to `1.8.1`, which is the version that knows about the filter vocabulary
(`home_chain_id`, `bridge_ids`, `include_unindexed_chains`, `bridge_id` on message details) and about the
two new response fields, `BridgeInfo.id` and `has_unindexed_chain`. Stubs and mocks start carrying both
fields, so every later ticket builds links and requests off fixtures that look like the real thing.

Nothing changes on screen. The second half of the ticket is a guarantee rather than a feature: a
cross-chain row whose destination side never resolves — the shape `has_unindexed_chain: true` describes —
must render as an ordinary row with empty destination cells. The list components already guard each
optional field individually, so this ticket pins that behaviour with a test instead of introducing it,
which is what stops a later change from reaching for the flag as a shortcut for "this row is complete".

## Acceptance criteria

- [ ] `package.json` pins `@blockscout/interchain-indexer-types` at `1.8.1` and the lockfile matches
- [ ] `pnpm lint:tsc` passes with no new `any`, cast, or `@ts-expect-error` introduced to absorb the bump
- [ ] `INTERCHAIN_MESSAGE`, `INTERCHAIN_TRANSFER` and the message/transfer mocks carry `bridge.id` and
      `has_unindexed_chain`
- [ ] A test renders a message row with `has_unindexed_chain: true`, no `destination_chain`, no
      `destination_transaction_hash` and no `recipient`, and asserts the row renders with its
      destination side empty
- [ ] No code reads `has_unindexed_chain` to decide whether other fields are present
- [ ] `pnpm test` and the cross-chain Playwright specs pass unchanged

## Details

The `1.6.0` → `1.8.1` diff is additive on the response side: `BridgeInfo` gains `id?: number`,
`InterchainMessage` and `InterchainTransfer` gain `has_unindexed_chain?: boolean`, and the request
interfaces gain the filter fields ticket 03 uses. `1.7.0` was never published. Both new response fields
are optional in `1.8.1` although the service always sends them — tracked upstream in Q03; ticket 04
handles the missing-`bridge.id` case at the call site rather than asserting the type here.

## Leaf worklist

- [x] 1 `[agent]` Bump the types package to `1.8.1` and reconcile the type errors it surfaces
- [x] 2 `[agent]` Add `bridge.id` and `has_unindexed_chain` to the interchain stubs and mocks
- [x] 3 `[agent]` Add the partial-row rendering test
