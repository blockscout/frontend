# API layer — context

Non-obvious patterns for the `src/api/` layer.

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
read which env vars feed the URL-relevant fields:

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
  maps to one package in one of the source repos — see the mapping table in the
  `publish-beta-types` skill. Authoritative pointer for any package's repo: its `repository`
  field in `node_modules/@blockscout/<pkg>/package.json`.
- **Locally-defined types** in `src/**/types/api.ts` (the exceptions — see below).

### Stable vs. beta package versions

Publishing is done by workflows **in the API source repo**, not here. Two channels:

- **Stable** — normal semver (e.g. `2.11.1`) under npm dist-tag `latest`, published
  automatically when a release is published in the API repo.
- **Beta / dev** — published **manually** from an API *feature* branch, versioned from the
  publish commit's short SHA (roughly `0.0.1-beta.<sha>`). Used to try a not-yet-released
  API (e.g. one deployed to staging) before its final release.

**A beta build is identified only by its exact version string.** The `beta`
dist-tag is shared by all in-progress feature branches, so `@beta` is ambiguous and can
collide; the hash — the API **feature-branch commit the manual publish ran against** — is
what identifies a specific build. A running/staging instance doesn't reveal its types
version (not every commit is published as a beta, and micro-services don't expose the
commit), so there's no `/node-api/config`-style shortcut.

### Publishing a beta yourself

**Use the `publish-beta-types` skill** (`.agents/skills/publish-beta-types/`) — it holds the
per-service package/repo/workflow mapping table and the `gh` dispatch procedure.

### The exceptions (types not from an npm package)

- **Whole APIs typed locally** — `metadata:*` (`src/features/address-metadata/types/api`;
  an npm package may be added later), `userOps` (no resources registered / consumed by the
  app right now), and `clusters` (external tRPC API, not maintained by Blockscout). Also,
  not every **Core API** resource has an OpenAPI schema yet, so some `core:*` payloads are
  still hand-typed locally (to be improved over time).
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
