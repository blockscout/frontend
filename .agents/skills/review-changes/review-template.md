# Review — <task or subtask title>

<!-- One `review.md` per subtask folder (or beside a small task's `spec.md`). One `##` section per
reviewed unit — a leaf step, or the whole subtask when it has no sub-breakdown. Rounds do NOT get their
own sections: a round updates the header and appends exchange lines under the findings it touched.

Two writers share this file. `review-changes` adds findings and maintains the header. `resolve-review`
maintains each finding's **Status** and appends the exchange lines. Finding ids are stable and continue
numbering across rounds — the exchange log and PR replies reference them.

`Outcome` is the machine gate the auto-loop reads:
  `clear`       — no blocker or major left open; the chain may proceed
  `blocked`     — a blocker or major is still open or disputed
  `needs-human` — something needs the developer, whatever the severity -->

## Step <N> — <leaf title>

| | |
| --- | --- |
| Reviewed | `<base sha>` → `<head sha, or "working tree">` |
| Round | <N> of 3 |
| Findings | <N> blocker · <N> major · <N> nit |
| By axis | Spec <N> · Standards <N> · Correctness <N> |
| Outcome | `clear` \| `blocked` \| `needs-human` |

### F1 · blocker · Correctness — `src/slices/token/pages/Holders.tsx:41`

**Claim.** <what is wrong, quoting the code.>

**Suggested fix.** <one or two lines.>

**Status.** `open` \| `fixed` \| `rejected-accepted` \| `disputed` \| `needs-human` \| `deferred`

<!-- One line per exchange, appended in order. `deferred` is for nits, which are never auto-fixed. -->

- R1 coder: `fix` — <what changed>
- R1 coder: `reject` — <argument>
- R2 reviewer: disagree — <counter-argument>
- R2 coder: `fix` — <what changed>

### F2 · nit · Standards — `src/slices/token/utils/model.ts:12`

**Claim.** <…>

**Suggested fix.** <…>

**Status.** `deferred`

## Out of scope — for the final review

<!-- Findings outside this unit's diff that this change did not cause. Recorded, not acted on, so they
resurface at the end-of-task review instead of unravelling the chain backwards. -->

- `src/…:<line>` — <one line.>
