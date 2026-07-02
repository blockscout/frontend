# API layer — context

Non-obvious patterns for the `src/api/` layer. Add new sections as the layer grows.

## Resolving a resource's real request URL

The frontend never hardcodes a full API URL. A request is assembled as:

```
<endpoint><basePath><resource.path>   (+ compiled path params, + query string)
```

`endpoint` / `basePath` come from per-service **runtime config** (env vars), while the
`path` template lives in the repo. So resolving the real URL means reading the repo to
learn *which env vars* apply, then reading the *target instance's* runtime config to get
their values. Don't guess hosts, and don't transcribe `config.ts` logic into your head —
read it each time (it changes).

### 1. Repo → path template + which service the resource belongs to

Resources are registered per service under `resources/services/**` (see
`resources/index.ts`). Each entry maps a `service:name` key to a `path` template with
`:param` placeholders:

```ts
// resources/services/core/token.ts
token: { path: '/api/v2/tokens/:hash', pathParams: [ 'hash' ] }
```

The matching `…ResourcePayload` type in the same file ties the resource to its response
type (see *Where a resource's response types come from* below). The
`service:` prefix (`core:`, `contractInfo:`, `stats:`, …) selects which service config
applies; `getResourceParams` (`utils/get-resource-params.ts`) resolves `service:name` →
`{ api, resource }`.

### 2. Repo → which env vars build the URL (`config.ts`)

`config.ts` builds one config object per service. Find the block for your service and
read which env vars feed the URL-relevant fields — that's the whole point of reading the
file rather than a table here (the mapping changes; the file is the source of truth):

- **`endpoint`** — the origin. Sometimes a single host var; sometimes assembled from a
  protocol/host/port trio. Read the block to see which.
- **`basePath`** — an optional path prefix prepended before `resource.path`. Present on
  some services, absent on others. Don't drop it when present.
- **`instanceId`** — fills an `:instanceId` path param on services that have one. Note
  the fallback chains expressed in the file (e.g. a service-specific id var falling back
  to `NEXT_PUBLIC_NETWORK_ID`).

Collect the exact `NEXT_PUBLIC_*` names the block references for these fields.

### 3. Find the instance host, then read its runtime config

**Host** — the frontend host per instance is mapped in `tools/dev-server/registry.json`
(alias → base URL, e.g. `immutable → https://explorer.immutable.com`). Use it rather than
guessing: many instances don't follow the `<name>.blockscout.com` pattern (e.g.
`explorer.immutable.com`, `www.shibariumscan.io`, `zetascan.com`, `explorer.zora.energy`).
It lists ~30 common instances, not all of them — if yours is absent, find its explorer URL
another way and don't assume the hostname.

**Config** — every deployed instance exposes its full public config at
**`GET <host>/node-api/config`** (`{ envs: { …all NEXT_PUBLIC_* } }`; served by
`src/pages/api/config.ts`). Look up the env names from step 2 there to get their real
values. This is the canonical, deterministic source. (It also carries the "secret-ish"
public keys — WalletConnect, reCAPTCHA, GA — by design; treat it as a config source, not
secrets.)

### Worked examples

Each shows one of the three service-config shapes. Values are from the named instance's
`/node-api/config` at the time of writing — always re-fetch, don't copy these.

- **Core API — assembled origin + base path.** `core:token` →
  `path = /api/v2/tokens/:hash`. `config.ts` builds `endpoint` from
  `NEXT_PUBLIC_API_PROTOCOL` (default `https`) + `NEXT_PUBLIC_API_HOST` +
  optional `NEXT_PUBLIC_API_PORT`, and `basePath` from `NEXT_PUBLIC_API_BASE_PATH`.
  Runtime: host `eth.blockscout.com`, protocol/port unset, base path `/` (→ empty) ⇒
  `https://eth.blockscout.com/api/v2/tokens/0xdAC17…ec7`.

- **Contract-info — single host + instanceId.** `contractInfo:token_verified_info` →
  `path = /api/v1/chains/:instanceId/token-infos/:hash`. `endpoint =
  NEXT_PUBLIC_CONTRACT_INFO_API_HOST`, `instanceId = NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID`
  falling back to `NEXT_PUBLIC_NETWORK_ID`. Runtime: host
  `https://contracts-info.services.blockscout.com`, instance-id var unset so it uses
  `NETWORK_ID = 1` ⇒
  `https://contracts-info.services.blockscout.com/api/v1/chains/1/token-infos/0xdAC17…ec7`.

- **Stats — single host + base path (host from the registry).** `stats:lines` →
  `path = /api/v1/lines`; `endpoint = NEXT_PUBLIC_STATS_API_HOST`,
  `basePath = NEXT_PUBLIC_STATS_API_BASE_PATH`. Registry maps the `immutable` instance to
  host `explorer.immutable.com`; its `/node-api/config` gives
  `STATS_API_HOST = https://explorer.immutable.com`, `STATS_API_BASE_PATH = /stats-service`
  ⇒ `https://explorer.immutable.com/stats-service/api/v1/lines`. The stats service is
  mounted on the main origin under a base path — drop it and the URL is wrong.

### Note for agents: ignore the proxy — use the direct URL

`build-url.ts` can rewrite the URL through the app's own origin (`config.app.baseUrl` +
`/node-api/proxy…`, true upstream in the `x-endpoint` header). Per `utils/is-need-proxy.ts`
this only happens in **local dev / review** environments, or when
`NEXT_PUBLIC_USE_NEXT_JS_PROXY` is explicitly set — i.e. to let the *browser* make
credentialed cross-origin requests. An agent hitting the API from a Node environment
(server-side, no browser CORS) is unaffected: **always use the direct resolved URL from
step 3**, never the `/node-api/proxy` form.

## Where a resource's response types come from

Each service registry file (`resources/services/**`) declares a `…ResourcePayload` type
mapping every `service:name` to its response type. Follow that type's import to learn its
origin — there are two:

- **Generated types from an `@blockscout/*` npm package** (the general case). These are
  generated from the API's OpenAPI spec **in the API's own source repo** and published to
  npm per API version; this repo only pins the version in `package.json`. Each service
  maps to one package in one of **four** source repos — see the table under *Publishing a
  beta yourself* below. Authoritative pointer for any package's repo: its `repository`
  field in `node_modules/@blockscout/<pkg>/package.json`.
- **Locally-defined types** in `src/**/types/api.ts` (the exceptions — see below).

### Stable vs. beta package versions

Publishing is done by workflows **in the API source repo**, not here. Two channels:

- **Stable** — normal semver (e.g. `2.11.1`) under npm dist-tag `latest`, published
  automatically when a release is published in the API repo.
- **Beta / dev** — published **manually** from an API *feature* branch, versioned from the
  publish commit's short SHA (roughly `0.0.1-beta.<sha>`; the exact string is
  workflow-defined and varies — e.g. the Core API workflow adds a `v` prefix, and hash
  length has changed over time). **Copy the exact published version string** from the run
  output / npm — don't construct it. Used to try a not-yet-released API (e.g. one deployed
  to staging) before its final release.

**Pin the exact `0.0.1-beta.<hash>`, never `@beta`.** Multiple in-progress API feature
branches publish under the same `beta` dist-tag, so `@beta` is ambiguous and can collide;
the commit hash identifies the specific branch/build. The hash is the API
**feature-branch commit the manual publish ran against** — get it from whoever published,
the API branch, or the publish workflow run's logs. You **cannot** reliably derive it from
a running/staging instance (not every commit is published as a beta, and micro-services
don't expose it), so there's no `/node-api/config`-style shortcut here.

### Publishing a beta yourself (cross-repo, via `gh`)

When staging has a new (unreleased) API version, you can publish its beta types package
yourself and pin it here. The publish is a **manual (`workflow_dispatch`) workflow in the
API source repo**. Requires `gh` authenticated with access to that repo (private is fine)
and `workflow` token scope — see the `check-github-cli` skill.

1. Find the package, repo, and workflow for your service in the table below.
2. Trigger: `gh workflow run <workflow> --repo <repo> --ref <branch> <inputs>`.
3. Read output: `gh run list --repo <repo> --workflow <workflow>`, then
   `gh run watch <id> --repo <repo>` and `gh run view <id> --repo <repo> --log`.
4. The run publishes `0.0.1-beta.<hash>`; set that exact version in `package.json`,
   reinstall, and let the typecheck surface the diffs.

If any cell is unknown, discover it with `gh workflow list --repo <repo>` and
`gh workflow view <workflow> --repo <repo>` (shows the dispatch inputs).

| API service | npm package | Source repo | Publish workflow | Dispatch inputs (`-f …`) |
|---|---|---|---|---|
| `core` | `@blockscout/api-types` | `blockscout/blockscout` | publish-api-types-npm-dev.yml | - |
| `stats`| `@blockscout/stats-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: stats |
| `bens` | `@blockscout/bens-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: blockscout-ens |
| `multichainAggregator` | `@blockscout/multichain-aggregator-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: multichain-aggregator |
| `multichainStats` | `@blockscout/stats-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: stats |
| `interchainIndexer` | `@blockscout/interchain-indexer-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: interchain-indexer |
| `tac` | `@blockscout/tac-operation-lifecycle-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: tac-operation-lifecycle |
| `visualize` | `@blockscout/visualizer-types` | `blockscout/blockscout-rs` | npm-publisher-dev.yml | service: visualizer |
| `contractInfo` | `@blockscout/contracts-info-types` | `blockscout/blockscout-admin` | publish-types-dev.yml | service: contracts-info |
| `admin` | `@blockscout/admin-rs-types` | `blockscout/blockscout-admin` | publish-types-dev.yml | service: admin-rs |
| `rewards` | `@blockscout/points-types` | `blockscout/points` | npm-publisher-dev.yml | - |
| `zetachain` | `@blockscout/zetachain-cctx-types` | `blockscout/blockscout-rs` | manual / ad-hoc — not merged upstream, maintenance only | - |

### APIs with typings in the repo

| API service | Comment |
|---|---|
| `metadata` | Typed locally for now; npm package may be added later |
| `userOps` | No resources registered / consumed by the app right now |
| `clusters` | External API (tRPC), not maintained by Blockscout; typed locally |


### The exceptions (types not from an npm package)

- **Whole APIs typed locally** — e.g. the **Metadata API** (`metadata:*` →
  `src/features/address-metadata/types/api`). Also, not every **Core API** resource has an
  OpenAPI schema yet, so some `core:*` payloads are still hand-typed locally (to be
  improved over time).
- **Kept local by design even when generated types exist:**
  - **Filter & sorting param types** (e.g. `TokensFilters`, `TokenTransferFilters` in
    `src/slices/**/types/api.ts`) — not cleanly derivable from the generated schemas, so
    they're shaped to be sensible in our code.
  - **Socket message types** — cannot be typed from an OpenAPI spec.
  - **Convenience type aliases** for deep-nested generated types (e.g. `ArbitrumBatchStatus`,
    `AddressCeloAccount`).
- **Feature-owned sub-types for data the Core API only proxies.** Some Core API responses
  embed data the Core API merely proxies from a micro-service and doesn't fully describe in
  its own OpenAPI spec — it doesn't know those shapes (e.g. the `tac_operation` field in the
  search-result variant with `type: 'tac_operation'`). In the generated `@blockscout/api-types` schema such data
  therefore shows up only as **optional properties** or **loose members of a type union**.
  The precise shape is owned by the **feature** and must live under
  `src/features/**/types/api.ts` (the feature owns the rendering, so it owns the type). A
  slice may then **consolidate** these feature types with the generated schema — swapping a
  generic union member / narrowing an optional field — but must not redefine them locally.
  Example — `src/slices/search/types/api.ts` replaces two generic generated variants with the
  feature-owned ones:

  ```ts
  import type { schemas } from '@blockscout/api-types';
  import type { SearchResultTacOperation } from 'src/features/chain-variants/tac/types/api';
  import type { SearchResultDomain }       from 'src/features/name-services/domains/types/api';

  export type SearchResultItem =
    Exclude<schemas['SearchResultItem'], { type: 'tac_operation' | 'ens_domain' }> |
    SearchResultTacOperation |
    SearchResultDomain;
  ```

## Declaring a new resource (in an existing API)

Everything for an existing service lives in its registry file — for Core API,
`resources/services/core/<group>.ts` (e.g. `token.ts`); for a micro-service,
`resources/services/<name>.ts`. It's **two edits that must stay in sync**, and the second
one fails silently:

1. **Add the resource entry** to the `*_API_RESOURCES` object — shape is `ApiResource`
   (`resources/types.ts`): `{ path, pathParams?, filterFields?, paginated?, headers? }`.
   `path` uses `:param` placeholders; list each one in `pathParams`.

2. **Add a matching branch** to the sibling `*ResourcePayload<R>` conditional type. Miss
   this and `ResourcePayload<'service:new'>` resolves to **`never`** — no error at the
   declaration, you just get untyped data downstream. Where the response type comes from
   depends on the API:
   - **Core API** — use the generated `@blockscout/api-types` package; its README *Usage*
     section (`node_modules/@blockscout/api-types/README.md`) is the reference for how to
     name a response type (`schemas[…]`, `operations[…]`, `paths[…]['get']`).
   - **Micro-service APIs** — the types package has **no path → response-type map** like the
     Core API's `paths`, so the connection can't be derived mechanically. Pick the interface
     that looks right for the endpoint and **confirm the choice with the user** before
     relying on it.
   - **Local types** — some payloads are hand-typed in a slice/feature `types/api.ts` rather
     than generated; see *Where a resource's response types come from*.

3. **Pagination — only if the response is actually paginated.** A resource is paginated
   **iff its response body has a `next_page_params` field** — set `paginated: true` only
   then. If you can't tell whether a resource is paginated, **ask the user** rather than
   assuming. Consume paginated resources with `useQueryWithPages`; everything else with
   `useApiQuery('service:name', …)`.

4. **Filters / sorting — only when the task says so.** Not every paginated resource has
   them. Add `filterFields` and branches to the service's `*PaginationFilters<R>` /
   `*PaginationSorting<R>` types **only** for the filters/sorts named in the feature task
   description or conversation context — **never infer them** from the API. 
   Define the filter/sort types themselves in the owning slice/feature `types/api.ts` 
   (kept local by design).

**No `resources/index.ts` edit is needed** for a new resource in an existing service.
Only a brand-new *service* touches `index.ts`: register it in `RESOURCES`
and add a branch to each of those dispatch types.
