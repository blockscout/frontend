# Scope every interchain request to the deployment's slice of a shared indexer

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3650 |
| Feature branch | `issue-3650` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | Evgenii |
| Minimum API version | `interchain-indexer` **v1.8.1** |
| Slack channel | #dev-interchain |

## Context & goal

Until now each frontend got its interchain scope from *where it pointed*: one `interchain-indexer`
instance per consumer, indexing exactly that consumer's bridge. Numine pointed at an Avalanche-only
instance, Gnosis at an Omnibridge-only one. The per-frontend instances are being consolidated into one
shared instance per environment (mainnets and testnets), indexing every bridge and every chain, and the
same instance will back Multichain Explorer.

Repointing a frontend at the shared instance **without** frontend changes makes it show every
cross-chain message the instance knows about — Gnosis↔Ethereum Omnibridge traffic on Numine, Avalanche
subnet traffic on Gnosis. Because unknown query params are silently ignored by the service, a dropped or
misspelled filter is not an error but a cross-frontend data leak that returns `200`.

Goal: every interchain request declares the deployment's slice, and adding a bridge or a chain on the
backend needs at most an env change — never a frontend release.

## Functional requirements

1. Every request to an `interchainIndexer:*` resource carries the deployment's filter profile, including
   page 2+, refetches and requests issued from a chain-scoped multichain view.
2. The profile resolves per consumer, with no per-call-site opt-in:
   - single-chain explorer, and a **per-chain** multichain view → `home_chain_id` (the focal chain);
   - **aggregated** multichain views → `bridge_ids` from env;
   - `/stats/chains` and `/interchain/chains` on **every** consumer → `bridge_ids` from env, because
     neither endpoint accepts a chain predicate.
3. `include_unindexed_chains` is sent from its own env, defaulting to `false`, on **every**
   `interchainIndexer:*` resource except `interchainIndexer:message` — that is, on all list, stats and
   directory resources, but never on message details, which deliberately does not accept the param so
   that a link to a details page always resolves even for a row the lists hide. No code path hardcodes
   the value.
4. A test fails when an `interchainIndexer:*` resource is added without declaring its scope, or declares
   a filter name nothing resolves. Asserting that the request returned `200` is explicitly not sufficient.
5. Pointed at the shared instance, the Numine frontend shows only Numine-related traffic and the Gnosis
   frontend only Gnosis↔Ethereum traffic.
6. Adding a bridge on the backend surfaces on a deployment after an env change alone; adding a chain to
   an existing bridge surfaces with no frontend or env change at all.
7. The message-details request carries `bridge_id`, including after a page reload and from a deep link —
   the bridge travels in the URL, not in component state.
8. A malformed message identifier (`400`, `code: 3`) is surfaced as invalid input, not as a service
   error. A wrong `bridge_id` (`404`, `code: 5`) surfaces as not-found. An ambiguous unqualified lookup
   (`400`, `code: 9`) is not recovered from by retrying — the qualified route makes it unreachable.
9. Rendering never treats `has_unindexed_chain: false` as "all fields are populated", and never caches
   the flag as an immutable property of a row: it is derived from live bridge config and flips without a
   migration.
10. No regression in cross-chain search (`q`), sorting, pagination or the Protocol column on any
    affected surface.

## Data & API

**Service** — `interchainIndexer`, host from `NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST`. Shared instances
are already deployed: mainnets `interchain-indexer.k8s-prod-4.blockscout.com`, testnets
`interchain-indexer-testnet.k8s-dev.blockscout.com`. Repointing the instances is DevOps' step at release
time (out of scope here, flagged in the PR description for the release notes).

**Filter vocabulary** — all params optional, `snake_case`, `AND`-combined, `*_ids` comma-separated.
Blank/comma-only normalizes to "absent"; malformed returns `400 InvalidArgument` naming the param.

| Param | Applies to | Used by this task |
| --- | --- | --- |
| `home_chain_id` | messages, transfers, their `:byTx` / `:byAddress` variants, `stats/common`, `stats/daily` | yes — focal-chain consumers |
| `bridge_ids` | the above, plus `stats/chains`, `messages-paths/*`, `bridged-tokens`; `/interchain/chains` after Q03 | yes — aggregated multichain, and the two chain-predicate-less resources everywhere |
| `include_unindexed_chains` | the above | yes — from env |
| `counterparty_chain_ids` | as above | already sent by the chain-stats sankey chart; unchanged |
| `src_chain_ids` / `dst_chain_ids` | lists and stats | no — for future "outgoing only" / "incoming only" sub-views |

**Resources** — all needed resources are already registered under `interchainIndexer:*`. No new resource
is added: the bridge scope comes from env, so `GET /interchain/bridges` is deliberately **not**
registered (see *Out of scope*).

**Message details** — `GET /interchain/messages/{message_id}` takes an optional `bridge_id` query param.
Verified against the live instance: a correct value resolves; omitting it resolves while no collision
exists; a **wrong** value returns `404 code: 5` (not the `400 code: 9` the issue documents — that is the
cross-bridge-collision case only, which the current bridge set makes unreachable).

**Pagination** — `page_token` and the raw cursor fields are valid only for the exact filter combination
that produced them. The profile is constant per deployment (and per selected chain inside multichain), so
this holds as long as the profile is applied uniformly; a chain change inside multichain already resets
pagination through the existing chain-select flow.

**Env vars** — two new, both documented in `docs/ENVS.md` and validated by the envs-validator:

| Env | Type | Requirement |
| --- | --- | --- |
| `NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS` | array of bridge ids | Required when `NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED=true`. Omitting it would leave `/stats/chains` and `/interchain/chains` unscoped — a silent leak, not an error — so the validator must fail at startup. |
| `NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS` | boolean | Optional, default `false`. |

The neutral (non-multichain) name is deliberate: a single-chain deployment spanning two bridges is
expected, and this way it needs no rename or deprecation cycle.

**Bridge ids are deployment data, not constants.** Today: mainnet AMB/Omnibridge `1`, mainnet Avalanche
ICTT/ICM `2`, testnet Sepolia↔Chiado AMB `1001`. They must never be hardcoded in `src/`.

**Types** — bump `@blockscout/interchain-indexer-types` to `1.8.1` (note: `1.7.0` was never
published). Stubs and mocks gain `bridge.id` and `has_unindexed_chain`. Two known type facts, both being
fixed upstream per Q03: `Bridge.indexed_chain_ids` is `number[]` while `Chain.id` is `string`, and
`has_unindexed_chain` is optional despite always being sent.

## UI inventory

No visual changes and no mockups — the bridge is already rendered. `Protocol` is an existing column in
both cross-chain tables and both mobile list items, backed by `CrossChainBridgeLink`, so bridge identity
is visible wherever rows from more than one bridge can appear.

**Route change** — the message-details route becomes `/bridge/[bridgeId]/cross-chain-tx/[id]`. 
The old `/cross-chain-tx/[id]` is **deleted with no redirect**. Every link to the page is built from a 
row or a message object that already carries `bridge.id`, so no call site needs new data. 
Touch points: the page under `src/pages/`, the metadata template registry, the mixpanel page-type map, 
`CrossChainMessageEntity`'s default href, and the two `tab: 'transfers'` links.

**Surfaces the profile must reach** — cross-chain transactions list and its stats block, token-transfers
list, bridged tokens, ICTT users, the message details page and its transfers tab, the latest-cross-chain
block on the home page, the cross-chain messages/transfers blocks on tx details, the cross-chain tab on
address pages, the chain-stats cross-chain sankey chart and its counterparty selector, and the multichain
equivalents of the home, address and chain-stats surfaces.

## Implementation decisions

- **The profile is injected centrally, not at call sites.** The API layer applies it to every
  `interchainIndexer:*` request. Fifteen call sites spread the same three params by hand would leak the
  moment one is missed, and a missed one returns `200`.
- **Which params a resource accepts is declared on the resource entry**, in a *generic* field usable by
  any service that needs static filters — not an interchain-specific map. Uniform injection is rejected:
  it would send `home_chain_id` to endpoints that silently ignore it, which is the same trap from the
  other side. Adding a resource then forces its author to answer the question.
- **Profile derivation** is a single decision point:
  - multichain disabled → `home_chain_id = config.chain.id`;
  - multichain enabled with a chain in `MultichainContext` → `home_chain_id = <that chain>`;
  - multichain enabled, no chain in context → `bridge_ids` from env.
  A per-chain multichain view therefore sends `home_chain_id` **only**, byte-identical to a single-chain
  explorer — the standing multichain rule that per-chain views mirror a single-chain explorer. The
  consequence is accepted: were a cluster chain ever served by a bridge outside the env list, a per-chain
  view would show it while the aggregated view hid it. Unreachable today, and reaching such a view would
  require a link nobody can construct.
- **`home_chain_id` alone is the correct scope for the list endpoints**, per the backend owner: sending
  it means accepting three defaults — unindexed chains excluded, events from **all** bridges covering the
  focal chain included, and stats spanning all chains of those bridges. Adding `bridge_ids` there would
  only narrow it, so it is not sent.
- **`/stats/chains` and `/interchain/chains` cannot take `home_chain_id`.** "Which chains are reachable
  from the focal chain" would mean scanning the full messages/transfers table per request, since a
  message can arrive from any chain, and the messages table is already past a million rows. `bridge_ids`
  is the agreed scope for these two, confirmed at the 2026-09-02 sync.
- **No client-side intersection of `indexed_chain_ids`.** The env supplies bridge ids directly and the
  service does the chain filtering, so `/interchain/bridges` is never fetched and no request is gated on
  a directory lookup.
- **The bridge travels in the path, not a query param, and there is no retry on ambiguity.** `bridge_id`
  is effectively required in the new paradigm, so the route reflects that; a wrong value 404s, which
  makes guessing worse than not guessing.
- **The param-drop test enumerates the resource registry** rather than listing resources by hand, so a
  newly added interchain resource is covered on the day it is added. It asserts two invariants — every
  resource declares a scope (bar `message`), and every declared name has a resolver — not the specific
  filters each resource takes. Pinning those would restate the registry: the expectation would have to be
  edited in lockstep with every legitimate change, so it would only ever catch a deliberate edit, which
  is code review's job. The leak risk FR4 guards is a *new* resource whose author never answered the
  question, and a name that silently resolves to nothing; both are caught without duplication.

## Out of scope

- **Indexing-progress UI** from `GET /status/indexing` (the issue's optional item). Live data currently
  reads 718k failed blocks on chain `100` and 19% catch-up on `43114`; shipping it would advertise a
  backend state without a product decision. Separate ticket if product wants it.
- **A user-facing bridge filter control.** No deployment today sees more than one bridge (Numine → `2`,
  Gnosis → `1`, multichain → `1`), and there are no mockups. Revisit when a deployment actually spans two.
- **Deriving bridge or chain selectors from `/interchain/bridges`** — replaced by the env, and rejected
  on its own merits at the 2026-09-02 sync: a bridge's `indexed_chain_ids` is not the set of chains the
  focal chain has actually talked to, so with ~100 Avalanche chains configured the selector would list
  all of them while Numine exchanges messages only with C-Chain.
- **Marking `has_unindexed_chain` rows in the UI** and explaining their empty destination side. Product
  decided (2026-09-02) not to show such messages at all — the env exists only as an escape hatch and no
  deployment sets it to `true`, so there is nothing to mark. Requirement 9 covers defensive rendering
  only, since the flag can still arrive on a row.
- **Repointing the instances** and retiring the old ones — DevOps, at release time. The Numine explorer
  is explicitly not being retired: it is the reference instance for the Autoscout rollout.
- **`src_chain_ids` / `dst_chain_ids`** — no "outgoing only" / "incoming only" sub-view exists.
- **Moving the cross-chain summary tiles to the stats service.** Raised at the 2026-09-02 sync: the
  `stats/common` endpoints were built for debugging small per-frontend indexers and do direct DB counts,
  so they don't hold at shared scale; the same counters exist in the stats service, at ~2 hours'
  staleness (accepted). Needs the counter names from the backend owner and its own issue — this task
  keeps reading `stats/common`, merely scoped.
- **Rendering a native asset for the new token `type` field** (`native` vs erc20), which the
  xDAI/Omnibridge onboarding introduces — a native coin must render without a token link. Same sync, own
  issue.
- **Closing the selector/statistics divergence.** Once `bridge_ids` reaches `/interchain/chains` (Q03),
  the counterparty selector lists the chains **configured** on the deployment's bridges; the statistics
  below it show the chains the deployment has **actually exchanged messages with**. A configured chain
  with no traffic therefore appears in the selector and is absent from the chart. Bridge scoping cannot
  narrow this further — such a chain is on our own bridge — and the set of "chains we have really talked
  to" is not something the service can answer today. Invisible with the current config (all four chains
  of the two bridges have traffic), visible as soon as a bridge gains an idle chain. Knowingly accepted
  at the 2026-09-02 sync, where the chart itself was taken as the answer to "which chains actually
  participate" — not a defect to file.
