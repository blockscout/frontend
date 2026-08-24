# Review — 01 Pin the v2 types package

## Subtask 01 — Pin the v2 types package

| | |
| --- | --- |
| Reviewed | `4e05cbd867ebf2e39ac7ca8fa3f54adf002449de` → working tree |
| Round | 1 of 3 |
| Findings | 0 blocker · 0 major · 1 nit |
| By axis | Spec 1 · Standards 0 · Correctness 0 |
| Outcome | `clear` |

Checks run in this review's own context: `pnpm lint:tsc` clean, `pnpm lint:cspell` 0 issues,
`pnpm test:vitest --changed` selected no test files (exit 0). `pnpm lint:eslint` 0 errors with 7
pre-existing `playwright/no-skipped-test` warnings in files this diff does not touch — declared
intentional by the dispatch, so out of bounds.

Acceptance criteria all satisfied. Independently verified beyond the checks: the installed package on
disk is `0.0.1-beta.71a05d5`; `dist/tac-operation-lifecycle-proto/proto/` carries both `v1` and `v2`;
`index.d.ts` re-exports the v2 module alongside both v1 modules; all five types named in criterion 2
(`V2OperationBriefDetails`, `V2OperationDetails`, `V2OperationStatus`, `V2OperationType`,
`V2OperationStage`) resolve from the package root under an isolated `tsc` probe; `status`, `rollback`
and `error_reason` are present on both detail interfaces and `V2OperationStatus` is a string enum of
`pending` / `success` / `failed`; every v1 exported type name survives, and no stale `1.1.0` reference
remains in the lockfile.

The two empty axes are expected rather than suspicious: the diff is a two-line dependency pin with no
source code, so the standards axis has almost no documented rule to breach and the correctness axis
has no logic to get wrong. The pin also needed no `pnpm-workspace.yaml` change — the package is
already listed under `minimumReleaseAgeExclude`, so the repo's `minimumReleaseAge` does not block a
fresh beta.

### F1 · nit · Spec — `pnpm-lock.yaml:8103`

**Claim.** The diff carries one hunk unrelated to the pin — `deprecated: Active development of CryptoJS
has been discontinued. This library is no longer maintained.` added under `crypto-js@4.2.0`. The spec
scopes the subtask to "only the pin and the typecheck that proves the pin is sound", and nothing asked
for this. It is registry metadata a real `pnpm install` picked up, so it corroborates the "updated by a
real `pnpm install`" half of criterion 1 rather than contradicting it, and hand-reverting it would
return on the next install.

**Suggested fix.** Leave it as is; mention it in the PR body so a reader does not take it for scope creep.

**Status.** `deferred`

## Out of scope — for the final review

- None.
