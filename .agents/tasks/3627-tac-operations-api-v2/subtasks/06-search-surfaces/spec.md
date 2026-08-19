# 06 — Point the search surfaces at the v2 shape

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 06 of #3627 |
| Status | `done` |
| Blocked by | 02 |

## What to build

TAC operations appear in the search bar suggestions and on the search results page, and those rows render
the same status component as the operations list. Their payload does **not** come from
`tac-operation-lifecycle` — it arrives embedded in the **core** `/api/v2/search` response, which is why it
was the one surface left on the v1 shape while the rest of the task moved to v2.

Core now returns the v2 shape, so the three search renderers switch to the shared status tag from subtask 02
and the deliberate v1 island — the legacy status component, the legacy label helper and the v1 mock — leaves
the codebase. That completes requirement 11 of the parent spec: no code path anywhere still reads a v1
operation value.

The **feature-owned result type stays**, retyped to the v2 shape. Core does describe the object in its own
spec now, but the generated TypeScript cannot express it — see *Details*.

## Acceptance criteria

How to verify: `pnpm dev:preset tac_spb` with `NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST` pointed at the
staging service host from the issue, search for an operation id and check both the suggestion row and the
results page

- [x] `@blockscout/api-types` is pinned to a version whose `SearchResultItem` describes the v2
      `tac_operation` shape, with `pnpm-lock.yaml` updated by a real `pnpm install`
- [x] The three search renderers use the shared `TacOperationStatus` from subtask 02
- [x] `SearchResultTacOperationStatus`, `utils/tac-operation-legacy.ts` and the v1 mock are gone;
      `SearchResultTacOperation` stays but is retyped to the v2 shape, and the `Exclude` in
      `src/slices/search/types/api.ts` stays with it
- [x] No `tac.Operation*` (v1) identifier remains anywhere in `src/`
- [x] `error_reason` and `sender` are handled as **nullable** — the core schema declares them
      `nullable: true`, so they arrive as `null` rather than absent
- [x] `(human)` The suggestion row and the results row match the operations list's tag presentation
- [x] `(human)` Searching by operation id, sender and tx hash returns the same results as before

## Details

The search payload carries no `status_history` — core proxies the brief object, not the details one — so the
rows have the same fields the list rows do and need no reduced variant of the tag.

**The generated types cannot describe this variant, so the feature-owned type stays.** Core's search result
union discriminates on `type`, and the TAC operation object has its own `type` field carrying the transfer
route. `openapi-typescript` collided the two: in the generated `SearchResultTacOperation` it overwrote the
route enum with the discriminator literal `"tac_operation"` (its own doc comment says *"enum property
replaced by openapi-typescript"*) and flattened the operation's fields to the top level, losing the
`tac_operation` wrapper and `priority`. The runtime response is nested and does carry the route — core's own
controller test asserts it — so the generated type is simply wrong here, and `src/api/CONTEXT.md`'s
`tac_operation` example remains accurate rather than becoming stale. Reported upstream; when core's spec and
codegen agree, the feature-owned type can go.

The one thing the pin still buys is honesty about the dependency: it is the build of core that serves this
shape.

A **minimum core version** has to be declared on the parent spec: core drops `/api/v1/tac/operations` rather
than serving both, so an instance running an older core with this frontend would return the v1 shape to a UI
that no longer parses it. See Q4 on the parent spec.

## Leaf worklist

- [x] 1 `[agent]` Publish `@blockscout/api-types` from the core `dev` branch and pin the exact version — skill: `publish-beta-types`
  - inputs:
    - API service: `core` → package `@blockscout/api-types`, workflow `publish-api-types-npm-dev.yml`
    - Branch to publish from: `dev` — it carries blockscout/blockscout#14719 (`d8baca6e9`), the commit that
      switched the search result to Read API v2
- [x] 2 `[agent]` Point the three search renderers at the shared status tag and delete the v1 island
- [x] 3 `[agent]` ~~Narrow the `src/api/CONTEXT.md` example to `ens_domain`~~ — not needed; the example is still true (see *Details*)
- [x] 4 `[agent]` Declare the minimum core version on the parent spec and record Q4

## Work log

- Published `@blockscout/api-types@0.0.1-beta.089aef5` from core `dev`; retyped the search payload, pointed
  the three renderers at `TacOperationStatus`, deleted the v1 island.
