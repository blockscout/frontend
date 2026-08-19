# 04 — By-transaction operations block

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 04 of #3627 |
| Status | `draft` |
| Blocked by | 02 |

## What to build

The operations block on the transaction details page reads the v2 by-tx endpoint, and each operation row
shows the combined status tag, the rollback tag when the operation rolled back, and the current-stage tags
it already renders. One transaction can produce many operations, so every row is independent.

This is the smallest of the three view subtasks: the components come from subtask 02 and the stage tags are
existing behaviour that stays exactly as-is.

## Acceptance criteria

How to verify: `pnpm dev:preset tac_spb` with `NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST` pointed at the
staging service host from the issue, open a transaction that produced at least one operation

- [x] `tac:operation_by_tx_hash` resolves to `/api/v2/tac/operations:byTx/:tx_hash` and its payload is typed
      from the v2 types
- [x] Each row renders the shared status tag, plus the rollback tag when `rollback: true`
- [x] The existing current-stage tags still render, unchanged, from `status_history`
- [x] The block stays gated on `config.features.tac.isEnabled`
- [x] `(human)` The rows match the mockup, including the order of status tag, rollback tag and stage tags

## Details

`TxDetailsTacOperation` is composed into the transaction details page by the tx slice, not the other way
around; that composition does not change. The stage tags come from `getTacOperationStage`, which reads
`status_history` — returned by this endpoint.

The known issue where this block renders nothing is explicitly **out of scope** (see the parent spec). If it
reproduces while working here, report it rather than fixing it.

## Leaf worklist

- [x] 1 `[agent]` Wire the by-tx block to the v2 payload, reusing the components from subtask 02
- [x] 2 `[human]` Style the operation rows to the mockup — [Figma](https://www.figma.com/design/1UWWsK0bg6ifzS9O1NLlo4/TAC-TON-TAC-operations?node-id=4001-37444)
