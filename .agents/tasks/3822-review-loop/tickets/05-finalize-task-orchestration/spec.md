# 05 — `finalize-task` runs the loop, deploys the demos and reports

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3822 |
| Blocked by | T03, T04 |

## What to build

`finalize-task` becomes the full land step: prune → `create-pr` Mode B (flip to ready, which starts CI) →
`review-loop` (T02/T03) → demo deploys → final report. Demos deploy only after the loop ended `cleared` with
green CI: the spec header's `Demo` entries sequentially, the first with an image build, the second reusing
it (`build_image=false`); first entry → `review` slot, second → `review-2`, an explicit `(review-2)` mark on
a single entry selects that slot; `none` deploys nothing; a loop that stopped short deploys nothing. The run
ends with a push notification and a terminal report — PR link, review outcome and rounds, CI status, demo
URLs, anything left open — and no demo comment on the PR. `tasks/README.md` step 6 describes the extended
land step.

## Acceptance criteria

- [ ] `finalize-task` lists the five steps in order and hands off to `review-loop` and `deploy-demo` (with
  T04's explicit inputs) rather than inlining them.
- [ ] Demo slot and build rules as above, including the `(review-2)` mark, `none`, and "loop stopped short →
  no deploy".
- [ ] Final report content and the push notification are specified; no demo comment on the PR.
- [ ] `.agents/tasks/README.md` step 6 describes prune → ready → review loop → demos → report, linking the
  skills.
- [ ] `pnpm lint:doc-links` passes.

## Leaf worklist

- [ ] 1 `[agent]` Extend `finalize-task/SKILL.md`: loop handoff, demo deploys, final report — skill:
  `writing-for-agents`
- [ ] 2 `[agent]` Update `.agents/tasks/README.md` step 6; run `pnpm lint:doc-links`
