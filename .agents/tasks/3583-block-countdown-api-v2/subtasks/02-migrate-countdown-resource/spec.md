# Migrate the countdown resource and page to API v2

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 2 of #3583 |
| Status | `ready` |
| Sub-branch | `issue-3583-step-2` |
| Backend | Nikita P. |

## Context & goal

The actual migration: move `core:block_countdown` from the API v1 registry to the block registry, retype it
from the generated package, and rework the single consumer. Blocked on subtask 1 (the pin) and on **Q1** /
**Q2** in the parent spec, both of which can change the response shape or the branching.

## Requirements

Parent spec requirements 1–4. In particular, the branching rule: a **200 without
`estimated_time_in_seconds`** means "no countdown available" and redirects to `/block/[height_or_hash]`;
any 4xx/5xx throws through `throwOnResourceLoadError`.

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

Payload type — the generated 200 body, consolidated with the message variant the endpoint really can return
under a 200. `paths[…][method]` already resolves to the 200 `application/json` body, so no manual response
indexing is needed:

```ts
// src/slices/block/types/api.ts
export type BlockCountdownResponse =
  paths['/api/v2/blocks/{block_number_param}/countdown']['get'] |
  { message: string };
```

Local consolidation of a generated type is sanctioned by *Where a resource's response types come from* in
[src/api/CONTEXT.md](../../../../../src/api/CONTEXT.md) — the generated schema cannot express the 200-with-message
case, and narrowing/swapping generated members locally is the documented pattern.

## Steps

- [ ] 1 `[agent]` Declare the resource — skill: `add-api-resource` — questions: Q1, Q2
  - inputs:
    - Service + endpoint path: `core`, `/api/v2/blocks/:height/countdown`; key `core:block_countdown`
      (the key already exists — it moves from `v1.ts` into `block.ts`)
    - Live instance with the endpoint deployed: `eth` (`https://eth.blockscout.com`, backend v11.2.3).
      Sample already captured in the parent spec's *Data & API*; the endpoint is production-deployed, not
      staging-only.
    - Types-package state: available only after subtask 1. Type name
      `paths['/api/v2/blocks/{block_number_param}/countdown']['get']`, consolidated as shown above.
      **No temporary local type** — this step waits for the pin rather than hand-typing a stopgap.
    - Filters / sorting: none. Unpaginated — the sample body has no `next_page_params`.
- [ ] 2 `[agent]` Remove the v1 resource: drop the `block_countdown` entry and its
  `CoreApiV1ResourcePayload` branch from
  [src/api/resources/services/core/v1.ts](../../../../../src/api/resources/services/core/v1.ts), leaving only
  `graphql`. Also delete the pre-existing dead `core:block_countdown` branch in
  [block.ts](../../../../../src/api/resources/services/core/block.ts) if it is still the v1 shape — it has no
  matching entry in `CORE_API_BLOCK_RESOURCES` today, so it resolves to nothing and must not be left
  duplicated once the real entry lands.
- [ ] 3 `[agent]` Rework
  [BlockCountdown.tsx](../../../../../src/slices/block/pages/countdown-details/BlockCountdown.tsx): call the
  resource with `pathParams: { height }` instead of the `module`/`action`/`blockno` query params; narrow the
  response with `'estimated_time_in_seconds' in data` and drive the existing `handleTimerFinish` redirect off
  that instead of `!data.result`; read the four renamed fields. `Number(estimated_time_in_seconds)` still
  applies — the field stays a string. Keep the loading/redirect effect's behavior identical.
- [ ] 4 `[agent]` Update the mocks in
  [BlockCountdown.pw.tsx](../../../../../src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx) to
  the v2 shape and drop the `queryParams` matcher in favour of `pathParams`. Keep both existing cases
  ("short period", "long period until the block") and keep the mocked values numerically equivalent to
  today's so the baseline diff stays limited to what the type change forces. **Do not** regenerate baselines
  — that is subtask 3.
- [ ] 5 `[agent]` Unit-test the narrowing rule if step 3 extracts it into a helper — the branch that decides
  "countdown available vs. redirect" is the one piece of real logic this migration introduces. Skip if the
  check stays a one-line `in` guard inside the component; per
  [.agents/rules/tests-unit.md](../../../../../.agents/rules/tests-unit.md) a test that only re-asserts an
  inline conditional is noise.
- [ ] 6 `[agent]` Verify: `pnpm run lint:tsc`, `pnpm run lint:eslint`, and a manual check of the countdown
  page on the `eth` preset — a future block renders a countdown, an already-mined block redirects to the
  block page.
- [ ] 7 `[agent]` PR paperwork: `breaking changes` label, and a description plus release-note line stating
  the countdown page now requires backend **v11.2.3+**.

## Out of scope

- Regenerating screenshot baselines (subtask 3).
- Any change to `/block/countdown` (the index page) or the search suggestion that links into the countdown
  route — neither fetches this resource.
