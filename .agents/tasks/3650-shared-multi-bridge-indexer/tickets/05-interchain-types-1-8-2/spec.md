# 05 — Types 1.8.2 makes the bridge id a guarantee and scopes the counterparty selector

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 05 of #3650 |
| Blocked by | T04, Q03 |

## What to build

The deployment's slice stops leaking into the one place ticket 03 could not reach. `/interchain/chains`
now accepts `bridge_ids`, so the counterparty selector lists the chains the deployment's own bridges
index instead of the union across every bridge on the shared instance — a Gnosis explorer stops offering
Avalanche chains as counterparties. No frontend request changes to make that happen: ticket 03 already
declared `bridge_ids` on the resource against a service that ignored it, so this ticket is where that
declaration starts doing something and where it gets verified against the running product.

The same version turns two response fields from promises into guarantees. `BridgeInfo.id` and
`has_unindexed_chain` are non-optional in `1.8.2`, which retires the "a row without a bridge id renders
unlinked" fallback ticket 04 had to carry — every cross-chain message row links to its qualified route,
and the code stops branching on a case the contract no longer allows.

## Acceptance criteria

How to verify: `pnpm dev:preset gnosis`, open `/cross-chain-tx` and the counterparty selector

- [ ] `package.json` pins `@blockscout/interchain-indexer-types` at `1.8.2` and the lockfile matches
- [ ] `pnpm lint:tsc` passes with no new `any`, cast, or `@ts-expect-error` introduced to absorb the bump
- [ ] The generated response types are used as they are: no narrowed re-declaration of an
      `interchainIndexer` message type is introduced to make a field non-nullable, and
      `CrossChainMessageEntity` keeps its optional bridge id, its unlinked branch and the spec case
      pinning that branch
- [ ] No code reads `has_unindexed_chain` to decide whether other fields are present — the guarantee that
      ticket 01 pinned still holds, and its test still passes unchanged
- [ ] A test asserts `bridge_ids` reaches the URL of `interchainIndexer:chains`; the registry-enumerating
      test from ticket 03 covers this and must not have been weakened to accommodate the bump
- [ ] `pnpm test:vitest`, `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:cspell` pass, and
      `pnpm test:code-complexity --changed` is within thresholds. Playwright is **not** a gate on this
      branch (see ticket 03's *Details*), but its specs and mocks stay consistent with the new types
- [ ] `(human)` On a Gnosis deployment the counterparty selector offers only Gnosis-bridge chains — no
      Avalanche entries — and the cross-chain transactions list, its stats block and the chain-stats
      sankey still populate

## Details

**Chain ids are decimal strings throughout `1.8.2`** — `Bridge.indexed_chain_ids` moved from `number[]` to
`string[]` and `ChainIndexingProgress.chain_id` from `number` to `string`. Neither type is consumed in
`src/` today (`GET /interchain/bridges` stays unregistered per ticket 03, and nothing reads indexing
progress), so the bump should surface no error here. If it does, that is a signal something started
consuming them since — reconcile rather than cast.

**`bridge` itself stays optional, so the unlinked branch stays.** `1.8.2` made the scalar
`BridgeInfo.id` required, but ts-proto renders every *message* field as `| undefined` regardless — the
parent is still `bridge: BridgeInfo | undefined`, which is what `data.bridge?.id` guards at the seven call
sites ticket 04 threads it through. Leave that optional chaining, the entity's optional prop and its
unlinked branch alone: they are resilience against the next contract change, not dead weight. Narrowing
the generated types to assert a non-nullable `bridge` is explicitly **not** wanted here — it trades a row
that degrades gracefully for one that throws, on a guarantee nobody gave us.

**Scoping `/interchain/chains` is a service-side change, not a frontend one.** The resource already
declares `bridge_ids` and `buildUrl` already sends it. Verify against the live services rather than
assuming: an unknown bridge id returns an empty list and a malformed one returns `400`, so a wrong env
value fails loudly instead of silently widening the selector.

**This does not close the whole leak.** A chain configured on the deployment's *own* bridge but with no
messages still appears in the selector — the spec's "Out of scope" entry, unchanged by this ticket.

## Leaf worklist

- [x] 1 `[agent]` Bump the types package to `1.8.2` and reconcile what the required fields surface
- [x] 2 `[agent]` Confirm the bump needs no reconciliation at the call sites — see *Details*
- [x] 3 `[agent]` Pin `bridge_ids` on `interchainIndexer:chains` with a test, and update the cross-chain
      Playwright specs and mocks for the new types
