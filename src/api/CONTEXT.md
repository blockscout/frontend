# API layer — context

Non-obvious patterns for the `src/api/` layer.

## How a request URL is assembled

The frontend never hardcodes a full API URL. A request is assembled as:

```
<endpoint><basePath><resource.path>   (+ compiled path params, + query string)
```

- **The `path` template lives in the repo.** Resources are registered per service under
  `src/api/resources/services/**` (see `src/api/resources/index.ts`); each entry maps a `service:name` key
  to a `path` template with `:param` placeholders. The matching `…ResourcePayload` type in
  the same file ties the resource to its response type (see *Where a resource's response
  types come from* below). The `service:` prefix (`core:`, `contractInfo:`, `stats:`, …)
  selects which service config applies; `getResourceParams`
  (`src/api/utils/get-resource-params.ts`) resolves `service:name` → `{ api, resource }`.
- **`endpoint` / `basePath` are per-service runtime config.** `src/api/config.ts` builds one config
  object per service from `NEXT_PUBLIC_*` env vars; the env-var → field mapping changes, so
  the file is the source of truth.
- **Every deployed instance exposes its full public config** at
  **`GET <host>/node-api/config`** (`{ envs: { …all NEXT_PUBLIC_* } }`; served by
  `src/pages/api/config.ts`) — the canonical source for those values on a live instance.
  It also carries the "secret-ish" public keys (WalletConnect, reCAPTCHA, GA) by design;
  treat it as a config source, not secrets.
- **The `/node-api/proxy` rewrite is a browser-CORS workaround only.** In local dev /
  review environments (or with `NEXT_PUBLIC_USE_NEXT_JS_PROXY`), `src/api/utils/build-url.ts` routes the
  request through the app's own origin with the true upstream in the `x-endpoint` header
  (`src/api/utils/is-need-proxy.ts`); server-side/Node requests never need this form.

**To resolve the concrete URL of a resource on a live instance, use the `resolve-api-url`
skill** — it holds the step-by-step recipe (env-var lookup, instance host registry,
runtime-config fetch).

## Where a resource's response types come from

Each service registry file (`src/api/resources/services/**`) declares a `…ResourcePayload` type
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
