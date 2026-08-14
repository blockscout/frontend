# 03 — Operation details page

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 03 of #3627 |
| Status | `draft` |
| Blocked by | 02 |

## What to build

`/operation/[id]` reads the v2 details endpoint and renders the same facts as the list, plus the stage
timeline. The Status row carries the combined status tag and, when `rollback: true`, the rollback tag beside
it. The title keeps exactly one badge: `Rollback` when the operation rolled back, otherwise the route — the
behaviour the page already has, now driven by two fields instead of one. The lifecycle accordion is
unchanged in shape; what changes is that its per-stage failure `note` is reachable for a failed stage, and
that its trailing synthetic "Pending" item is decided by `status` rather than by `type`.

## Acceptance criteria

How to verify: `pnpm dev:preset tac_spb` with `NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST` pointed at the
staging service host from the issue, open `/operation/[id]` for a success, a failure, a rollback and a
pending operation

- [x] `tac:operation` resolves to `/api/v2/tac/operations/:id` and its payload is typed from the v2 types
- [x] The Status row renders the shared status tag from subtask 02, with the rollback tag beside it when
      `rollback: true`
- [x] The title renders one badge: `Rollback` when `rollback: true`, otherwise the route — never both
- [x] The trailing synthetic pending lifecycle item is driven by `status`, not `type`
- [x] The per-stage `note` is reachable for a failed stage
- [x] `(human)` The page matches the mockup for success, failure, failure with a reason, rollback and
      pending — including the title badge and the expanded stage card
- [x] `(human)` The stage timeline is unchanged versus the v1-backed page on the same operation

## Details

The lifecycle accordion's item content already renders a `note` row, so requirement 9 of the parent spec may
already be satisfied by construction — confirm against a real failed operation before adding anything, and
only extend if a failed stage's note is actually unreachable.

`TacOperationTag` is the title badge component; it takes the v1 `type` today.

## Leaf worklist

- [x] 1 `[agent]` Wire the details page and its Status row to the v2 fields, reusing the components from subtask 02
- [x] 2 `[agent]` Drive the title badge from `rollback` / `type`, and the accordion's synthetic pending item from `status`
- [x] 3 `[agent]` Confirm the failed-stage `note` is reachable; extend the accordion only if it is not
- [x] 4 `[agent]` Update `TacOperation.pw.tsx` cases and the details mocks to the v2 shape
- [x] 5 `[human]` Style the details page to the mockup and regenerate its screenshot baselines — [Figma](https://www.figma.com/design/1UWWsK0bg6ifzS9O1NLlo4/TAC-TON-TAC-operations?node-id=4001-37444)
