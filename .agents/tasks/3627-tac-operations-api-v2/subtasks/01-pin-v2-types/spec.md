# 01 — Pin the v2 types package

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — subtask 01 of #3627 |
| Status | `done` |
| Blocked by | none |

## What to build

Nothing user-facing. The rest of the task needs the generated v2 types on disk, and until
[blockscout-rs#1725](https://github.com/blockscout/blockscout-rs/pull/1725) landed no published version of
`@blockscout/tac-operation-lifecycle-types` contained them — the package's `compile:proto` compiled only
the v1 protos, so `1.2.0` shipped without the v2 module even though it was published after the v2 protos
merged. That fix is merged and the beta is already published, so this subtask is only the pin and the
typecheck that proves the pin is sound.

The exact version to pin is **`0.0.1-beta.71a05d5`**, published from `main` by
[run 31796957575](https://github.com/blockscout/blockscout-rs/actions/runs/31796957575) and verified to
contain `dist/tac-operation-lifecycle-proto/proto/v2/` with `status`, `rollback` and `error_reason` on both
`V2OperationBriefDetails` and `V2OperationDetails`, and `V2OperationStatus` as a string enum of exactly
`pending` / `success` / `failed`. Pin that string, never the `beta` dist-tag — rationale in
[`src/api/CONTEXT.md`](../../../../../src/api/CONTEXT.md).

## Acceptance criteria

- [x] `package.json` pins `@blockscout/tac-operation-lifecycle-types` to the exact version above, with
      `pnpm-lock.yaml` updated by a real `pnpm install`
- [x] `tac.V2OperationBriefDetails`, `tac.V2OperationDetails`, `tac.V2OperationStatus`, `tac.V2OperationType`
      and `tac.V2OperationStage` all resolve from the existing `@blockscout/tac-operation-lifecycle-types`
      import
- [x] `pnpm lint:tsc` passes — the v1 exports are untouched, so nothing that reads them should break
- [x] Any typecheck breakage unrelated to the tac feature is reported rather than fixed here — none surfaced

## Leaf worklist

- [x] 1 `[agent]` Pin the exact version, `pnpm install`, then `pnpm lint:tsc` — skill: `publish-beta-types` (steps 3–4 only; the publish itself is done)
  - inputs:
    - API service: `tac` → package `@blockscout/tac-operation-lifecycle-types`
    - Version to pin: `0.0.1-beta.71a05d5`
    - Publish is already done — do not re-run the workflow; `main` is the ref it came from, which is
      acceptable here because the v2 protos are merged and the skill's "never the default branch" rule
      exists to protect the stable channel, not this pin

## Work log

- `package.json` + `pnpm-lock.yaml` only — pin bumped from `1.1.0`; skill: `publish-beta-types` (steps 3–4).
