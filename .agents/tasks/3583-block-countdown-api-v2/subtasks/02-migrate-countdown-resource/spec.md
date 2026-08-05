# Migrate the countdown resource and page to API v2

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 2 of #3583 |
| Status | `done` |
| Sub-branch | — (single commit on the feature branch) |
| Backend | Nikita P. |

## Context & goal

The actual migration: move `core:block_countdown` from the API v1 registry to the block registry, retype it
from the generated package, and rework the single consumer.

Nothing is blocked. Both open questions were delivered by
[blockscout#14646](https://github.com/blockscout/blockscout/pull/14646) in backend **v11.2.4**, so the
contract is final: real status codes for every non-success case, and all four response fields string-typed.
The one prerequisite is subtask 1's re-pin — the currently pinned beta predates #14646 and still types the
block numbers as `number`.

## Requirements

Parent spec requirements 1–4. In particular the branching rule: **404** means the block exists and there is
nothing to count down to, so the page redirects to `/block/[height_or_hash]`; every other non-200 throws
through `throwOnResourceLoadError`. No retry tuning is needed — `useQueryClientConfig`'s `retry` already
fails 4xx immediately ([useQueryClientConfig.ts:14](../../../../../src/api/hooks/useQueryClientConfig.ts)).

## Data & API

Resource — added to `CORE_API_BLOCK_RESOURCES` in
[src/api/resources/services/core/block.ts](../../../../../src/api/resources/services/core/block.ts):

```ts
block_countdown: {
  path: '/api/v2/blocks/:height/countdown',
  pathParams: [ 'height' as const ],
},
```

`:height` rather than the siblings' `:height_or_hash` — this endpoint takes only a non-negative integer (a
hash returns 422), and `height` matches the existing route param in `/block/countdown/[height]`, so the call
site reads `pathParams: { height }`.

Payload type — the generated 200 body, referenced inline in the payload branch like every other generated
sibling in that file. `paths[…][method]` already resolves to the 200 `application/json` body, so there is no
manual response indexing and no local consolidation: with #14646 a 200 always carries all four fields, and
the message bodies live under their own status codes.

```ts
R extends 'core:block_countdown' ? paths['/api/v2/blocks/{block_number_param}/countdown']['get'] :
```

`BlockCountdownResponse` in `src/slices/block/types/api.ts` is deleted rather than re-aliased to the
generated type: local types exist for payloads a schema cannot express (see *Where a resource's response
types come from* in [src/api/CONTEXT.md](../../../../../src/api/CONTEXT.md)), and nothing outside the registry
ever imported it.

## Steps

Steps 1–4 land together: with the key present in both registries the later spread in
[core/index.ts](../../../../../src/api/resources/services/core/index.ts) would win and keep routing to `/api`,
and the consumer plus its mocks stop typechecking the moment the payload type changes. One commit.

- [x] 1 `[agent]` Declare the resource — skill: `add-api-resource`
  - inputs:
    - Service + endpoint path: `core`, `/api/v2/blocks/:height/countdown`; key `core:block_countdown`
      (the key already exists — it moves from `v1.ts` into `block.ts`)
    - Live instance with the endpoint deployed: the `staging` preset (backend v11.2.4). Samples for every
      status are in the parent spec's *Data & API*; the endpoint is production-deployed, not staging-only, so
      the `eth` preset works too.
    - Types-package state: available after subtask 1's re-pin. Type name
      `paths['/api/v2/blocks/{block_number_param}/countdown']['get']`.
      **No temporary local type** — this step waits for the pin rather than hand-typing a stopgap.
    - Filters / sorting: none. Unpaginated — the sample body has no `next_page_params`.
- [x] 2 `[agent]` Remove the v1 resource: drop the `block_countdown` entry and its
  `CoreApiV1ResourcePayload` branch from
  [src/api/resources/services/core/v1.ts](../../../../../src/api/resources/services/core/v1.ts), leaving only
  `graphql`. Also delete the pre-existing dead `core:block_countdown` branch in
  [block.ts](../../../../../src/api/resources/services/core/block.ts) if it is still the v1 shape — it has no
  matching entry in `CORE_API_BLOCK_RESOURCES` today, so it resolves to nothing and must not be left
  duplicated once the real entry lands.
  → `CoreApiV1ResourcePayload` went with it: `graphql` never had a payload branch (it is only used through
  `buildUrl`), so the type was left vacuous. Its branch in `core/index.ts` is gone too.
- [x] 3 `[agent]` Rework
  [BlockCountdown.tsx](../../../../../src/slices/block/pages/countdown-details/BlockCountdown.tsx):
  - call the resource with `pathParams: { height }` instead of the `module`/`action`/`blockno` query params;
  - read the four renamed fields — all strings, so `Number(estimated_time_in_seconds)` and the
    `StatsWidget` values carry over unchanged;
  - replace the `!data.result` redirect effect with one keyed off `error?.status === 404`, reusing the
    existing `handleTimerFinish` redirect;
  - keep `throwOnResourceLoadError` for every other error — it must not fire on the 404.
  → the guard reads `isError && error.status === 404`, a bare literal like the repo's six other 404 checks
  (e.g. [Block.tsx:170](../../../../../src/slices/block/pages/details/Block.tsx)). The
  `estimated_time_in_seconds &&` guard around the timer is gone — the schema makes the field required.
- [x] 4 `[agent]` Update the mocks in
  [BlockCountdown.pw.tsx](../../../../../src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx) to
  the v2 field names and drop the `queryParams` matcher in favour of `pathParams`. Values stay strings, so
  keep them identical to today's — both cases ("short period", "long period until the block") should render
  the same text they do now. **Do not** regenerate baselines — that is subtask 3.
- [x] 5 `[agent]` Unit-test the 404-means-redirect branch if step 3 extracts it into a helper — deciding
  "countdown available vs. redirect" is the one piece of real logic this migration introduces. Skip if it
  stays an inline `error?.status === 404` guard in the component; per
  [.agents/rules/tests-unit.md](../../../../../.agents/rules/tests-unit.md) a test that only re-asserts an
  inline conditional is noise.
  → skipped; no helper was extracted, so the branch is covered by the dev verification in step 6.
- [x] 6 `[agent]` Verify: `pnpm run lint:tsc`, `pnpm run lint:eslint`, and a manual check on the `staging`
  preset — a future block renders a countdown, an already-mined block redirects to the block page, a
  non-numeric height shows the error page.
  → all three confirmed on the `staging` preset (backend v11.2.4); `lint:tsc`, `lint:eslint`, `lint:cspell`
  and 430 vitest tests pass. The payload type was probed against a temporary
  `ResourcePayload<'core:block_countdown'>` assertion (with a negative control) to rule out a silent `never`.
- [x] 7 `[agent]` PR paperwork: `breaking changes` label, and a description plus release-note line stating
  the countdown page now requires backend **v11.2.4+**. Runs with the `create-pr` finalize-draft pass on
  [#3605](https://github.com/blockscout/frontend/pull/3605) once subtask 3 is checked, not as its own commit.

## Out of scope

- Regenerating screenshot baselines (subtask 3).
- Any change to `/block/countdown` (the index page) or the search suggestion that links into the countdown
  route — neither fetches this resource.
