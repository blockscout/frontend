# Confirm the block countdown screenshot baselines

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 3 of #3583 |
| Status | `done` |
| Sub-branch | — (commit on the feature branch) |
| Designer | — |

## Context & goal

Nothing about the countdown page changes visually by intent, and with
[blockscout#14646](https://github.com/blockscout/blockscout/pull/14646) the v2 fields are strings just as the
v1 ones were — so both cases should render exactly the text they render today, including the 30-digit height
in "long period until the block". Only the mock field names change.

That makes this subtask a **confirmation** step rather than a re-take: if either baseline moves, something in
subtask 2 changed rendering unintentionally. Per
[.agents/delegation.md](../../../../../.agents/delegation.md), looking at a screenshot diff and deciding it is
acceptable is a human step.

## Steps

- [x] 1 `[human]` Run the countdown component tests and inspect the diff for
  [BlockCountdown.pw.tsx](../../../../../src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx).
  Both cases are expected to pass untouched.
- [x] 2 `[human]` If either case did move, decide whether the new rendering is acceptable before accepting it.
  Scientific notation in the long-period case means the pinned package predates
  [#14646](https://github.com/blockscout/blockscout/pull/14646) and the block numbers are still `number` —
  that is a subtask 1 problem, not a baseline to accept.
- [x] 3 `[human]` Regenerate and commit baselines only if step 2 accepted a change.

## Out of scope

- Any styling or layout change. If the long-period case looks wrong, that is a finding about the pinned types
  package or the migration, not something to paper over with CSS.
