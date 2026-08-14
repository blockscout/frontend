# 05 — Remove the v1 client and refresh the generated API docs

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 05 of #3627 |
| Status | `draft` |
| Blocked by | 02, 03, 04 |

## What to build

No user-facing change. Once all three views read v2, the v1 client has no consumers left inside the tac
feature and comes out: the legacy `type` values (`PENDING`, `ROLLBACK`, `INSUFFICIENT_FEE`, `ERROR`) stop
appearing in any code path that talks to the tac service, the unused `stat_operations` resource is deleted,
and the two generated-docs files stop advertising `/api/v1/tac/...` in their curl samples.

The search surfaces still consume the v1 operation shape, because that payload comes from the core search
API rather than from this service. Their v1 usage stays and is removed by subtask 06 once core migrates —
which is what keeps this subtask honest rather than blocked.

## Acceptance criteria

- [x] No tac-service code path references `OperationType.PENDING`, `ROLLBACK`, `INSUFFICIENT_FEE` or `ERROR`
- [x] The `stat_operations` resource is gone from the tac service registry, with its payload-map and
      pagination entries
- [x] `/api/v1/tac/operations` and `/api/v1/tac/operations/{operation_id}` no longer appear in the
      llms-txt generators
- [x] The remaining v1 type usage is confined to the search payload and its rendering, and is the only such
      usage left
- [x] `pnpm lint:tsc`, `pnpm lint:eslint` and `pnpm lint:cspell` all pass

## Details

The two generated-docs files are `deploy/tools/llms-txt-generator/generate-standard.ts` and
`generate-pro-api.ts`; both hardcode the v1 paths in curl samples.

The npm package keeps exporting the v1 types alongside the v2 ones, so nothing has to be deleted upstream
and the search payload keeps typechecking.

## Leaf worklist

- [x] 1 `[agent]` Delete `stat_operations` and any now-unused v1 label mapping from the tac feature
- [x] 2 `[agent]` Update both llms-txt generators to the v2 paths
- [x] 3 `[agent]` Grep the repo for remaining legacy `type` value usage and confirm only the search payload remains
