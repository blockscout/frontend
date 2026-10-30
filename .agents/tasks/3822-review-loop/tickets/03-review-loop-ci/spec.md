# 03 — CI per round: wait, fix red runs, one push per round, cleared-and-green terminal condition

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3822 |
| Blocked by | T02 |

## What to build

The loop from T02 learns about CI. After the resolver has fixed, the round waits for the Checks run in
progress on the branch; a red run is fixed by the **same** resolver, resumed with the CI-fix procedure, in a
separate commit; review fixes and CI fixes go out in one push per round. The terminal condition becomes
`cleared` **and** a green CI run for the current HEAD: `cleared` with CI pending waits; `cleared` with CI
red fixes and pushes without another review round, at most 2 post-clear CI-fix cycles.

The CI-fix procedure lives in `review-loop/ci-fixes.md`: Playwright failures are reproduced in Docker, the
diff image viewed, and the baseline updated only when the diff is explained by a spec requirement cited in
the commit — any other visual diff is `needs-human`; other gate failures (mutation, complexity, React
Doctor) are fixable with the same escape — a fix that changes behaviour or restructures beyond the finding
is `needs-human`.

## Acceptance criteria

- [ ] After the resolver's fixes (before the push), the loop waits for the Checks run in progress for the
  branch (`gh run list`/`gh run watch`), noting the workflow has no cancel-in-progress so the run to watch
  is identified by head SHA.
- [ ] A red run is fixed by resuming the round's resolver with `ci-fixes.md`; the CI fix is a separate commit
  from the review fixes; both leave in one push per round.
- [ ] `ci-fixes.md` carries the Playwright procedure (Docker reproduction per `.agents/rules/tests-visual.md`
  and `tools/playwright/CONTEXT.md`, view the diff image, baseline update only with a cited spec requirement
  in the commit message, else `needs-human`) and the other-gates rule (mutation, complexity, React Doctor;
  behaviour change or restructuring beyond the finding is `needs-human`), each pointing at the gate's
  `CONTEXT.md` for how to read a failure.
- [ ] Terminal condition: `cleared` and green for the current HEAD; `cleared` + pending waits; `cleared` +
  red fixes and pushes without a new review round; 2 post-clear CI-fix cycles, then stop with a report.
- [ ] A `needs-human` raised during a CI fix pauses exactly like a review `needs-human` (T02).
- [ ] `.agents/delegation.md` gains: update a Playwright baseline when the diff is explained by a cited spec
  requirement; the rest of the baseline rule stays humans-only.
- [ ] `pnpm lint:doc-links` passes.

## Leaf worklist

- [ ] 1 `[agent]` Extend `review-loop/SKILL.md`: CI wait, CI-fix dispatch, one push per round, the
  cleared-and-green terminal condition and the post-clear bound — skill: `writing-for-agents`
- [ ] 2 `[agent]` Write `review-loop/ci-fixes.md`: Playwright and other-gate procedures with their
  `needs-human` escapes — skill: `writing-for-agents`
- [ ] 3 `[agent]` Extend `.agents/delegation.md` with the baseline line; run `pnpm lint:doc-links`
