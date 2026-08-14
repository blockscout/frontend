# 06 — Point the search surfaces at the v2 shape (brief)

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 06 of #3627 |
| Blocked by | 02, and the core search API migration (Q1 below) |

## Goal

TAC operations appear in the search bar suggestions and on the search results page, and those rows render
the same status component as the operations list. Their payload does **not** come from
`tac-operation-lifecycle` — it arrives embedded in the **core** `/api/v2/search` response, and core still
returns the v1 operation shape. Once core returns the v2 shape, the search surfaces switch to it and the
last v1 usage leaves the codebase, completing requirement 11 of the parent spec.

## Context already gathered

- The payload is typed in
  [`src/features/chain-variants/tac/types/api.ts`](../../../../../src/features/chain-variants/tac/types/api.ts)
  as `SearchResultTacOperation`, wrapping the v1 `OperationDetails`, and is wired into the search slice's
  own result union.
- Three renderers consume it: the search-bar suggestion component in the tac feature, and the search results
  table row and list item in the search slice. All three render the status component the parent task
  rebuilds in subtask 02.
- The search slice also drops `tac_operation` results entirely when the feature is disabled.
- Why this cannot simply ride along with subtask 02: a v1 `type` can be `PENDING`, `ROLLBACK` or
  `INSUFFICIENT_FEE`, so it cannot be reinterpreted as a pure route. A v1-shaped payload fed to the v2
  component would render a wrong or empty label rather than degrade gracefully — which is why the v1 usage
  is kept deliberately, in one place, until core catches up.
- The npm types package exports the v1 and v2 modules side by side, so both shapes typecheck during the
  interim.

## Unknowns to resolve

### Q1 — Has the v2 operation shape reached the core `/api/v2/search` response?

- Owner: Backend (Evgenii → core backend team)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/D085WMQ2BC5/p1786700647766519
- Asked 2026-08-14. The gap was not accounted for when the issue was written; Backend agreed it is fair and
  is raising it with the core team, whose assessment is that only the endpoint needs changing there. Whether
  it ships as a core version bump this task must declare is part of the answer.

### Still to decide once Q1 lands

- Whether the search rows can share the status tag from subtask 02 unchanged, or need a reduced variant —
  the search payload has no pagination or timeline context and may not carry every field.
- Whether a minimum **core** API version has to be declared on the parent spec, and whether the search
  surfaces need a fallback for instances whose core is older, given the rest of the task deliberately
  carries no fallback.

## Links

- Parent task: https://github.com/blockscout/frontend/issues/3627
- Figma: [TAC TON-TAC operations](https://www.figma.com/design/1UWWsK0bg6ifzS9O1NLlo4/TAC-TON-TAC-operations?node-id=4001-37444)
