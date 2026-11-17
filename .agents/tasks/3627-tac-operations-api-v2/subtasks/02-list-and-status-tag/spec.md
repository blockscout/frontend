# 02 — Repoint the resources and rebuild the status tag on the operations list

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 02 of #3627 |
| Status | `draft` |
| Blocked by | 01 |

## What to build

`/operations` reads the v2 endpoint and every row shows the truth the new contract carries: the status icon
and colour come from `status`, the route text from `type` — including for pending operations, which
previously showed no route at all — and a separate `Rollback` tag appears beside the tag when
`rollback: true`. Hovering the status tag explains the outcome, and for a failed operation with an
`error_reason` the tooltip names the reason. An operation whose `type` is still `UNKNOWN` shows the pending
presentation with the status word and a spinner instead of a route, rather than the blank cell it renders
today.

This is the subtask that creates the two shared components the details page and the by-tx block then reuse,
so it carries the v2 resource declarations and the route-label helper as well. Search is deliberately left
on the v1 shape here — it is fed by a different API and is handled in subtask 06.

## Acceptance criteria

How to verify: `pnpm dev:preset tac_spb` with `NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST` pointed at the
staging service host from the issue, open `/operations`

- [x] `tac:operations` resolves to `/api/v2/tac/operations`, with `q`, `page_token` and `page_items`
      unchanged, and its payload typed from the v2 package types
- [x] The status presentation is derived from `status` only; no code path in the list reads `type` to decide
      an outcome
- [x] The route label is derived from `type` and renders for `pending` operations
- [x] `rollback: true` renders as a tag beside the status tag, for both rollback and non-rollback failures
- [x] `error_reason` appears in the status tooltip when present; the tooltip falls back to the plain failure
      text when absent
- [x] `type: UNKNOWN` renders the pending presentation with no route and no layout breakage
- [x] A Vitest spec covers the label and tooltip branching across every `status` × `rollback` ×
      `error_reason` × `UNKNOWN` combination
- [x] `(human)` The list matches the mockup — tag colours, icons, spacing, and the rollback tag's placement
      and tooltip copy
- [x] `(human)` Search (`q`), pagination and sender rendering behave exactly as before on the same data

## Details

Endpoint and object shape are in the parent spec's *Data & API*; the components involved are listed in its
*UI inventory*. Two naming consequences worth doing here rather than leaving behind: `getTacOperationStatus`
returns a route once it stops returning a status and should be renamed, and `STATUS_SEQUENCE` /
`STATUS_LABELS` are keyed by the v1 stage enum and move to the v2 one.

`TacOperationEntity` decides its spinner from `type === PENDING` today; that becomes `status`.

Keep the screenshot matrix minimal — one case per visual variant, not per text permutation. The tag is
assembled from standard toolkit components, so the branching belongs in the Vitest spec.

## Leaf worklist

- [x] 1 `[agent]` Repoint the three tac resources to `/api/v2/tac/...` and retype their payloads — skill: `add-api-resource`
  - inputs:
    - Service: `tac` (`src/api/resources/services/tac-operation-lifecycle.ts`), existing resources
      `operations`, `operation`, `operation_by_tx_hash`
    - Paths: `/api/v2/tac/operations`, `/api/v2/tac/operations/:id`, `/api/v2/tac/operations\\:byTx/:tx_hash`
      — pagination and the `q` filter field unchanged
    - Payload types: `V2OperationsResponse`, `V2OperationDetails`, `V2OperationsFullResponse`
    - Leave `stat_operations` alone here; subtask 05 removes it
- [x] 2 `[agent]` Rebuild `TacOperationStatus` around `status` + `type` + `error_reason`, and extract the rollback tag as its own component
- [x] 3 `[agent]` Wire the table and mobile-list rows to the new props, including the pending spinner and the `UNKNOWN` case
- [x] 4 `[agent]` Vitest spec for the route-label and tooltip-text branching
- [x] 5 `[agent]` Extend the `TacOperationStatus.pw.tsx` cases to one per visual variant and update the tac mocks and stubs to the v2 shape
- [x] 6 `[human]` Style the status tag and the rollback tag to the mockup, then regenerate the screenshot baselines — [Figma](https://www.figma.com/design/1UWWsK0bg6ifzS9O1NLlo4/TAC-TON-TAC-operations?node-id=4001-37444)
