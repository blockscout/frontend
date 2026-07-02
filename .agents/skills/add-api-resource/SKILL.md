---
name: add-api-resource
description: Declare new API resource(s) in an existing API service — registry entry, payload typing, pagination. Use whenever the app needs to call an endpoint that has no `service:name` resource yet.
---

# Add an API resource (to an existing service)

Every request the app makes goes through a **resource**: an entry in the per-service registry
under `src/api/resources/services/**` that maps a `service:name` key (e.g. `core:token`,
`stats:lines`) to a path template and, via a sibling conditional type, to its response type.
This skill declares new resource(s) in an **existing** service.

**Out of scope — brand-new service.** Adding a whole new API service also touches
`src/api/resources/index.ts` (register it in `RESOURCES` and add a branch to each dispatch
type: `ResourcePayload`, `PaginationFilters`, `PaginationSorting`) plus a config block in
`src/api/config.ts`. That is not covered here.

**Out of scope — consuming the resource.** Wiring it into UI (`useApiQuery` /
`useQueryWithPages`, stubs) is the caller's job; this skill only makes the resource exist and
be correctly typed.

**Background reading:** `src/api/CONTEXT.md` — how a resource's real URL is resolved
(*Resolving a resource's real request URL*) and where response types come from (*Where a
resource's response types come from*). Both sections are used below; read them first.

**Rule of thumb: never guess.** Whenever information is missing or required to proceed,
**pause and ask the user, or confirm your findings**, before writing files.

## Step 0 — Interview (REQUIRED before writing anything)

Collect for **each** resource, and confirm with the user:

1. **Service + endpoint path** — must come from the user or the task description. **Never
   hunt for endpoints** in specs or type packages yourself; if the path (or the HTTP service
   it belongs to) isn't given, ask. Then propose the `service:name` key — follow the naming
   of the sibling entries in the service's registry file.
2. **A live instance that has the endpoint deployed** — an alias from
   `tools/dev-server/registry.json` or a full instance URL. A brand-new endpoint may exist
   only on a staging instance; ask which. This powers Step 1.
3. **Filters / sorting** — note only the filters/sorts the task description explicitly names
   (see Step 4). Do not derive any from the API.

## Step 1 — Fetch a real sample response

Resolve the resource's real URL with the recipe in `src/api/CONTEXT.md` (path template +
URL-relevant env-var names from `src/api/config.ts` + their values from the instance's
`GET <host>/node-api/config`), then make **one GET per resource** and save each body to the
scratchpad. This sample is load-bearing three times over:

- it **proves the endpoint exists** on the chosen instance (a 404 here stops the task);
- it **settles pagination deterministically** — the resource is paginated **iff** the body
  has a `next_page_params` field (Step 2);
- it is the **ground truth for typing** (Step 3) and later for stub values in the wiring
  phase.

If the endpoint needs auth or params you can't supply, show the user the resolved URL and ask
them for a sample body instead.

## Step 2 — Add the resource entry

All edits for an existing service live in its registry file — Core API:
`resources/services/core/<group>.ts` (e.g. `token.ts`); micro-service:
`resources/services/<name>.ts`. Add the entry to the `*_API_RESOURCES` object — shape is
`ApiResource` (`resources/types.ts`): `{ path, pathParams?, filterFields?, paginated?,
headers? }`.

- `path` uses `:param` placeholders; list each one in `pathParams`.
- `paginated: true` **only** if the Step 1 sample has `next_page_params`.

**No `resources/index.ts` edit is needed** — the `ResourceName` union and the dispatch types
aggregate per-service keys automatically.

## Step 3 — Add the payload-type branch

Add a matching branch to the sibling `*ResourcePayload<R>` conditional type **in the same
file**. Miss this and `ResourcePayload<'service:new'>` silently resolves to **`never`** — no
error at the declaration, just untyped data downstream. Where the response type comes from
depends on the API:

- **Core API** — use the generated `@blockscout/api-types` package; its README *Usage*
  section (`node_modules/@blockscout/api-types/README.md`) is the reference for how to name
  a response type (`schemas[…]`, `operations[…]`, `paths[…]['get']`).
- **Micro-service APIs** — the types package has **no path → response-type map**, so the
  connection can't be derived mechanically. Pick the interface that looks right for the
  endpoint, **check it field-by-field against the Step 1 sample body**, and **confirm the
  choice with the user** before relying on it.
- **Local types** — some payloads are hand-typed in a slice/feature `types/api.ts` rather
  than generated; see *Where a resource's response types come from* in `src/api/CONTEXT.md`.

## Step 4 — Filters / sorting (only when the task names them)

Not every paginated resource has them. Add `filterFields` and branches to the service's
`*PaginationFilters<R>` / `*PaginationSorting<R>` types **only** for the filters/sorts named
in the task description or conversation — **never infer them** from the API. Define the
filter/sort types themselves in the owning slice/feature `types/api.ts` (kept local by
design).

## Step 5 — Verify

Run `pnpm run lint:tsc`. To catch a missed Step 3 branch (the silent `never`), use the inline
type-assertion pattern already present in `resources/index.ts` (e.g. the
`ResourcePayload<'core:api_keys'>` / `ResourcePathParams<'bens:address_domain'>` checks) as a
temporary probe for your new key — or hover/`tsc`-check a `ResourcePayload<'service:new'>`
usage and confirm it is not `never`.

## Output

Report back, per resource: the `service:name` key, the payload type (and its origin —
package or local), whether it's paginated, and the scratchpad path of the sample body —
everything a follow-up consumption task needs.
