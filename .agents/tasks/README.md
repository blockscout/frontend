# Product task specs

This directory holds one folder per product task, each with a `spec.md`. A medium/large task also has a
`subtasks/` folder with one sub-folder per subtask (`subtasks/NN-<slug>/`). Specs merge with their task's
PR and **accumulate here as a permanent record** — consult past specs as precedent for how similar tasks
were scoped and split.

## Why

Product issues often arrive thin (a title, a Figma link) — too thin to hand to an agent, and thin enough
that a developer fills the gaps with guesswork. The spec workflow fixes the input: an interview fills the
gaps, unanswerable questions get routed to the people who own the answers, and the resulting spec explicitly
says which steps an agent does and which a developer does by hand.

## Lifecycle

1. **Grill** — run the `grill-the-task` skill with the issue URL. It researches first (issue, codebase, live
   API samples, Figma mockups — enumerate-only), then interviews you one question at a time. What you can't
   answer becomes an open question with an owner.
2. **Spec** — the session ends in the `to-spec` skill: it writes a slim index `spec.md` here plus one
   `subtasks/NN-<slug>/` folder per subtask (a `spec.md` if it's scoped now, or a `brief.md` if it's
   deferred to its own later session), sizes the task (small / medium / large), tags every subtask
   `[agent]` or `[human]` per the delegation boundary, then
   drafts the open questions as Slack messages grouped by owner — you approve, it sends, and each thread's
   permalink lands in the spec. (`to-spec` also works standalone, from any conversation worth capturing.)
   Commit the spec to the feature branch and **open a draft PR right away** (`to-spec` walks you through
   branch, commit, and draft PR at the end of the run) — a spec-only draft is the cheap moment to catch a
   wrong split or a missed requirement, it links the issue to the work, and CI and demo deploys hang off it
   for the rest of the task.
3. **Answers** — when colleagues reply, run `to-spec` on the spec again: it harvests the Slack threads,
   proposes resolutions, folds accepted decisions into the spec, and sends approved follow-ups.
4. **Implement** — run the `implement-task` skill repeatedly, one subtask per run: it executes `[agent]`
   subtasks (composing `add-api-resource`, `add-new-page`, `add-env-var`, …) and verifies them, or hands
   `[human]` subtasks (styling to Figma mockups) over to you. You review the diff and commit between runs.
   A subtask can't start while a question blocking it is `pending` — unrelated subtasks can. If you've
   dropped a `review.md` in a subtask's folder (from a local review pass), the next `implement-task` run for
   that subtask works through each finding and records a fix/reject response in it.
5. **Land** — flip the draft PR to **ready for review** when the spec's last box is checked; the feature
   branch merges to `main` as one PR, spec included. Big subtasks may have had their own sub-branch + PR
   into the feature branch along the way (same pattern: draft when the step starts with its sub-spec as the
   first commit, ready when the step's boxes are checked); simple ones are single commits on it. Branch
   names carry the addressing — feature branch is `issue-<number>` (`issue-3219`), a big step's sub-branch
   adds `-step-<N>` (`issue-3219-step-2`) — so `implement-task` needs no arguments on a task branch.

## Task sizes

- **small** — one step; a single `spec.md`, no `subtasks/` folder. An agent or a user can implement it
  right after the grilling session.
- **medium** — the main `spec.md` is a slim index; each subtask lives in its own
  `subtasks/NN-<slug>/spec.md`, fully specified up front (`ready`).
- **large** — same layout, but big subtasks are deferred: the grilling session drops a `brief.md` in the
  folder now (no `spec.md`), and each gets its sub-spec written **just-in-time** via a `grill-the-task`
  subtask session right before it starts.

A subtask is "scoped" once its folder has a `spec.md`; until then it holds only a `brief.md`. The main
spec's breakdown carries only the done checkbox and a link to each subtask folder.

## Supporting files

- `.agents/rules/delegation.mdc` — the living agent/human boundary (incl. the scaffold → style split for UI
  work and the standing testing policy). Loosen it via PR as the repo gets more agent-friendly.
- `.agents/TEAM.md` — the team roster (members + Slack IDs); the grilling session picks one contact per
  team for the task and records the picks in the spec header.
- `.agents/skills/to-spec/spec-template.md` — the spec template (used for both main and subtask specs).
- Each `subtasks/NN-<slug>/` folder holds the subtask's `spec.md` (once scoped) or a `brief.md` (the
  handoff for a not-yet-scoped subtask), plus optional `research.md` (real research / prototype notes) and
  `review.md` (local review-agent findings + the implementer's fix/reject responses).
