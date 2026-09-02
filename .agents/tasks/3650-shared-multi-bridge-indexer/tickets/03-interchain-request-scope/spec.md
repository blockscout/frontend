# 03 — Every interchain request declares the deployment's slice

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 03 of #3650 |
| Blocked by | T02 |

## What to build

Point a frontend at the shared indexer and it shows only its own traffic. Every request to an
`interchainIndexer:*` resource — first page, page 2, refetch, a request issued from a chain-scoped
multichain view — carries the deployment's filter profile, and no call site opts in. The Numine frontend
against the shared instance shows Avalanche traffic and no Gnosis↔Ethereum Omnibridge rows; the Gnosis
frontend shows the mirror image. Adding a chain to a bridge the deployment already lists then needs no
release at all, and adding a bridge needs only the env from ticket 02.

Two mechanisms make that hold. Each resource entry **declares which scope params the endpoint accepts** —
a generic field on `ApiResource`, so any service with static request filters can use it, and so the
author of the next interchain resource is forced to answer the question. And the profile is **resolved
and merged in one place**, because fifteen call sites spreading three params by hand would leak the
moment one is missed, and a missed one returns `200` rather than an error. The last piece is the test
that makes a drop or a typo fail: it walks the resource registry rather than a hand-written list, so a
resource added next month is covered the day it lands.

## Acceptance criteria

- [ ] `ApiResource` carries a generic scope-filter declaration, named and typed without reference to the
      interchain service, and each `interchainIndexer:*` entry declares its accepted params per the table
      in *Details*
- [ ] `interchainIndexer:message` declares none, and no request to it carries `include_unindexed_chains`
- [ ] The profile is resolved in exactly one place and merged into the query string for every
      `interchainIndexer:*` request; no call site passes `home_chain_id`, `bridge_ids` or
      `include_unindexed_chains` itself
- [ ] Unit tests cover all three derivation cases — multichain off, multichain with a focal chain,
      multichain aggregated — asserting the exact query string, and that a focal-chain request sends
      `home_chain_id` **without** `bridge_ids`
- [ ] A test enumerates `RESOURCES.interchainIndexer` and fails when a declared param is absent from, or
      misspelled in, the URL a resource's request produces. Asserting a `200` response is not sufficient
      and no test does so
- [ ] `include_unindexed_chains` comes from env on every declaring resource; no code path hardcodes it
- [ ] Cross-chain search (`q`), sorting, pagination and the Protocol column are untouched on every
      affected surface, and page 2+ carries the profile
- [ ] The whole Playwright suite passes — in particular the interchain mocks still match (see *Details*)
- [ ] `pnpm test`, `pnpm lint` and `pnpm lint:tsc` pass
- [ ] The PR description flags that DevOps must repoint `NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST` at the
      shared instances at release time, for the release notes
- [ ] `(human)` On a cross-chain-enabled instance, the transactions list, its stats block, token
      transfers, bridged tokens, ICTT users, the home page latest-cross-chain block, the tx-details
      cross-chain blocks, the address cross-chain tab and the chain-stats sankey all still populate, and
      the counterparty selector still opens

How to verify: `pnpm dev:preset numine`, then walk the surfaces listed above; repeat with
`pnpm dev:preset gnosis`.

## Details

**Inject in `src/api/utils/build-url.ts`, not in `useApiFetch`.** The profile is a pure function of
`src/config` plus `buildUrl`'s existing `chain` argument, so it needs no hook — and `buildUrl` is the one
funnel every request passes through (`useApiQuery`, `useApiQueries`, `useApiInfiniteQuery` and
`useQueryWithPages` all reach it via `useApiFetch`; no `interchainIndexer:*` resource is fetched
server-side, so `src/server/utils/buildUrl.ts` needs no change). It is also what the Playwright
`mockApiResponse` fixture calls to build its route matcher, which is what keeps every interchain visual
test matching for free. Injecting a layer higher would break all of them silently.

**Derivation** — one decision point, in this precedence:

- the resource declares `home_chain_id` **and** a focal chain exists → send `home_chain_id` only. Focal
  chain is `config.chain.id` when multichain is off, or `buildUrl`'s `chain` argument when multichain is
  on and a chain is in scope. `bridge_ids` would only narrow it further, so it is not sent;
- otherwise → send `bridge_ids` from env;
- `include_unindexed_chains` is sent from env on every resource that declares it, independently.

A per-chain multichain view therefore sends a byte-identical query string to a single-chain explorer.
`useApiQuery` already resolves `chain` as `chainProp || multichainContext?.chain`, so an aggregated
multichain view arrives with `chain` undefined and lands on the `bridge_ids` branch with no extra
plumbing.

**Accepted params per resource** — from the `1.8.1` request interfaces:

| Resource | `home_chain_id` | `bridge_ids` | `include_unindexed_chains` |
| --- | --- | --- | --- |
| `chains` | — | yes | yes |
| `messages`, `tx_messages`, `address_messages` | yes | yes | yes |
| `transfers`, `tx_transfers`, `address_transfers` | yes | yes | yes |
| `stats_common`, `stats_daily` | yes | yes | yes |
| `stats_chains` | — | yes | yes |
| `stats_chain_messages_sent`, `stats_chain_messages_received` | — | yes | yes |
| `bridged_tokens` | — | yes | yes |
| `message` | — | — | — |

`stats_chains`, the two `messages-paths` resources and `bridged_tokens` take no chain predicate —
`messages-paths` and `bridged_tokens` carry their chain in the path, and for `/stats/chains` and
`/interchain/chains` "reachable from the focal chain" would mean scanning a messages table already past a
million rows. `bridge_ids` is the agreed scope for both.

**`bridge_ids` on `/interchain/chains` is declared now** even though the service does not accept it yet
(Q03). Unknown params are silently ignored, so the declaration is inert today and starts scoping the
counterparty selector the moment the version ships — no follow-up release. Until then the selector lists
the union of chains across all bridges; Q03 gates no ticket.

**No `/interchain/bridges` lookup.** The env supplies the ids directly and the service does the chain
filtering, so no request is gated on a directory fetch and `GET /interchain/bridges` stays unregistered.

**Pagination** holds because the profile is constant per deployment and per selected chain, and a chain
change inside multichain already resets pagination through the existing chain-select flow.

## Leaf worklist

- [ ] 1 `[agent]` Add the generic scope-filter declaration to `ApiResource` and the per-param resolvers
- [ ] 2 `[agent]` Declare the accepted params on every `interchainIndexer:*` resource entry
- [ ] 3 `[agent]` Resolve and merge the profile in `buildUrl`
- [ ] 4 `[agent]` Add the derivation unit tests and the registry-enumerating drop test
