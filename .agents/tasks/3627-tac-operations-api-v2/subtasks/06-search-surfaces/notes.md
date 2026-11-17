# 06 — Notes

## The generated core types cannot express the search result's TAC operation

Core's `/api/v2/search` result union discriminates on `type`, and the proxied TAC operation object has its
own `type` field carrying the transfer route. `openapi-typescript` collapsed the two, producing a
`SearchResultTacOperation` that

- overwrites the route enum with the discriminator literal `"tac_operation"` — its own doc comment reads
  *"(enum property replaced by openapi-typescript)"*, so the route is unrecoverable from the type; and
- flattens the operation's fields to the top level, losing both the `tac_operation` wrapper and `priority`.

The wire format is nested and does carry the route — asserted by core's own `search_controller_test.exs` in
[#14719](https://github.com/blockscout/blockscout/pull/14719):

```json
{ "type": "tac_operation", "priority": 0,
  "tac_operation": { "operation_id": "…", "type": "TON_TAC_TON", "status": "success",
                     "rollback": false, "timestamp": "…", "sender": null, "error_reason": null } }
```

So the frontend keeps its feature-owned `SearchResultTacOperation`, retyped to v2. Worth raising with the
core team: either the operation's field is renamed in the spec's search context, or the union gets an
explicit discriminator mapping that leaves member properties alone.

## Core publishes absent fields as `null`, the service's proto omits them

`error_reason` and `sender` are `nullable: true` in core's schema and arrive as `null`, whereas the
`tac-operation-lifecycle` proto types them as optional-and-absent. `getTacOperationStatusTooltip` and
`TacOperationStatus` therefore accept `string | null | undefined` rather than `string | undefined`.

## The search payload is the brief object

No `status_history` — core proxies the brief shape — so the search rows need no reduced variant of the
status tag, and the timeline is only reachable from the operation details page.
