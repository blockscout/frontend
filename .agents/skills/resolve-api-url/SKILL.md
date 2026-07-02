---
name: resolve-api-url
description: Resolve the real request URL of an API resource on a live Blockscout instance (`service:name` + instance → full URL). Use whenever a request must be made to, or a sample response fetched from, a deployed instance's API.
---

# Resolve a resource's real request URL

A request URL is assembled as `<endpoint><basePath><resource.path>` (+ compiled path params,
+ query string): the `path` template lives in the repo, while `endpoint` / `basePath` come
from the **target instance's** runtime config. So resolution means reading the repo to learn
*which env vars* apply, then reading the instance's config to get their values. Background
facts: *How a request URL is assembled* in `src/api/CONTEXT.md`.

**Rule of thumb: never guess.** Don't guess hosts, and don't transcribe `config.ts` logic
from memory — read the files each time (they change).

## Step 0 — Inputs

The **`service:name` resource key** and the **target instance** (a
`tools/dev-server/registry.json` alias or a full URL). Ask if either is missing.

## Step 1 — Repo → path template

Find the resource in its service registry file under `src/api/resources/services/**`
(see `resources/index.ts`); the entry gives the `path` template and its `:param`
placeholders:

```ts
// resources/services/core/token.ts
token: { path: '/api/v2/tokens/:hash', pathParams: [ 'hash' ] }
```

The `service:` prefix (`core:`, `contractInfo:`, `stats:`, …) selects which service config
applies in the next step (`getResourceParams` in `utils/get-resource-params.ts` resolves it).

## Step 2 — Repo → which env vars build the URL

In `src/api/config.ts`, find the block for the service and read which env vars feed the
URL-relevant fields:

- **`endpoint`** — the origin. Sometimes a single host var; sometimes assembled from a
  protocol/host/port trio. Read the block to see which.
- **`basePath`** — an optional path prefix prepended before `resource.path`. Present on
  some services, absent on others. Don't drop it when present.
- **`instanceId`** — fills an `:instanceId` path param on services that have one. Note
  the fallback chains expressed in the file (e.g. a service-specific id var falling back
  to `NEXT_PUBLIC_NETWORK_ID`).

Collect the exact `NEXT_PUBLIC_*` names the block references for these fields.

## Step 3 — Instance → host + real values

**Host** — map the instance alias to its base URL via `tools/dev-server/registry.json`.
Use it rather than guessing: many instances don't follow the `<name>.blockscout.com`
pattern (e.g. `explorer.immutable.com`, `www.shibariumscan.io`, `zetascan.com`). It lists
~30 common instances, not all of them — if yours is absent, ask for the URL; don't assume
the hostname.

**Values** — fetch **`GET <host>/node-api/config`** and look up the env names from Step 2
in its `envs` object. This is the canonical, deterministic source — always re-fetch it;
never reuse values remembered from another instance or an earlier session.

## Step 4 — Assemble

Concatenate `<endpoint><basePath><resource.path>`, fill the `:param` placeholders, append
the query string. **Always use this direct URL — never the `/node-api/proxy` form**: that
rewrite exists only as a browser-CORS workaround in dev/review environments, and a
Node/server-side request doesn't need it. Sanity check when feasible: a GET should return a
2xx with valid JSON — on a 404, the most common miss is a dropped `basePath`.
