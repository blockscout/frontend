# 03 — Filter params through to the API, the bridges resource, and `bridge_ids` precedence

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3778 |
| Blocked by | none |

## What to build

A deep link such as `/txs?tab=txs_cross_chain&src_chain_ids=100&dst_chain_ids=1&bridge_ids=3` makes the
cross-chain list request carry exactly those params, and the same holds for the token-transfers index, the
address cross-chain tabs and the tx-details cross-chain transfers tab. With no `bridge_ids` in the URL the
env-derived scope list is sent as before; with one, the user value replaces it (FR4/FR5). The app also gains
the `interchainIndexer:bridges` resource (`GET /api/v1/interchain/bridges`) typed by `GetBridgesResponse`, so
the protocol filter can show bridge names. No UI changes in this ticket.

## Acceptance criteria

How to verify: `pnpm dev:preset gnosis`, open the deep link above and inspect the network request.

- [ ] `CrossChainFilters` gains `src_chain_ids`, `dst_chain_ids`, `bridge_ids` (comma-joined string values)
- [ ] `filterFields` on `messages`, `transfers`, `address_messages`, `address_transfers`, `tx_transfers`
      include the three params; `tx_messages` deliberately does not (no list UI consumes it)
- [ ] `InterchainIndexerApiPaginationFilters` has branches for `address_messages`, `address_transfers`,
      `tx_transfers` (missing today) so `useApiPaginatedQuery` types their filters
- [ ] `interchainIndexer:bridges` is declared (not paginated, no params) with a `GetBridgesResponse` payload
      branch, and a mock in `cross-chain-txs/mocks/`
- [ ] The scope resolver for `bridge_ids` yields when the request's `queryParams` already carry
      `bridge_ids`; `scope-filters.spec.ts` covers user-value-wins and env-fallback, and the existing drift
      test over every interchain resource still passes
- [ ] `pnpm lint:tsc` and `pnpm test:code-complexity --changed` pass

## Details

- Precedence mechanics: `buildUrl` spreads `resolveScopeFilters(...)` over `queryParams`, so a scope value
  currently wins. Pass the query params into `ScopeFilterContext` and let `resolveBridgeIds` return
  `undefined` when `bridge_ids` is present there; keep the other resolvers as they are.
- Sample `/api/v1/interchain/bridges` on the `gnosis` instance (two bridges configured there).

## Skill inputs

### `add-api-resource`

- Service + endpoint path: `interchainIndexer`, `GET /api/v1/interchain/bridges`; key `interchainIndexer:bridges`
- Live instance: `gnosis` alias in `tools/dev-server/registry.json`
- Types-package state: published, `@blockscout/interchain-indexer-types@1.11.0` (installed); response type
  `GetBridgesResponse` (`items: Bridge[]` with `id`, `name`, `type`, `enabled`, `indexed_chain_ids`)
- Filters / sorting: none on `bridges`; the three list filters above go on the existing list resources

## Leaf worklist

- [ ] 1 `[agent]` Declare `interchainIndexer:bridges` and its payload branch; add a bridges mock — skill: `add-api-resource`
- [ ] 2 `[agent]` Extend `CrossChainFilters`, the `filterFields` of the five list resources and the missing
      `PaginationFilters` branches
- [ ] 3 `[agent]` Make the `bridge_ids` scope resolver yield to a user value; extend `scope-filters.spec.ts`
