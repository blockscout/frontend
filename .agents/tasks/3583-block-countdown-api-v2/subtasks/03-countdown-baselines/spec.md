# Regenerate the block countdown screenshot baselines

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 3 of #3583 |
| Status | `ready` |
| Sub-branch | — (commit on the feature branch) |
| Designer | — |

## Context & goal

Nothing about the countdown page changes visually by intent, so the "short period" baseline should pass
untouched. The "long period until the block" case is different: it is built on a 30-digit block height, and
v2 returns `remaining_blocks_count` as a JSON integer instead of v1's string. That value cannot survive
`JSON.parse` — it renders as `1.2345678901234568e+29` rather than the full digit string — so the rendered
text genuinely changes and the baseline must be re-taken and eyeballed.

Per [.agents/delegation.md](../../../../../.agents/delegation.md), generating and reviewing baselines is a
human step: a screenshot diff is only meaningful once someone has looked at whether the new rendering is
acceptable.

## Steps

- [ ] 1 `[human]` Run the countdown component tests and inspect the diff for
  [BlockCountdown.pw.tsx](../../../../../src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx).
  Confirm "short period" is unchanged — if it moved, something in subtask 2 changed rendering unintentionally.
- [ ] 2 `[human]` Decide whether the long-period rendering is acceptable. If **Q2** lands and the field
  becomes a string, the value renders in full again and the case behaves as it does today; if it stays an
  integer, the scientific-notation rendering is what ships. Worth confirming before accepting the baseline
  rather than after.
- [ ] 3 `[human]` Regenerate and commit the accepted baselines.

## Out of scope

- Any styling or layout change. If the long-period case looks wrong, that is a finding to raise against
  **Q2**, not something to paper over with CSS.
