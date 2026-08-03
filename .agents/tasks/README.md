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
   deferred to its own later session), sizes the task (small / medium / large), tags every subtask per
   **Subtask tags** below — `[agent]` / `[human]`, plus `[verify]` where a human must judge the running
   product — then
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
   `[human]` subtasks (styling to Figma mockups) over to you. In a manual run you review the diff and commit
   between runs; under `--auto` the run commits each cleared leaf itself (step 5).
   A subtask can't start while a question blocking it is `pending` — unrelated subtasks can.
5. **Review** — the `review-changes` skill reviews a subtask in a fresh subagent context on three axes (spec
   compliance, repo standards, correctness). Findings land in the subtask folder's `review.md`, and
   `resolve-review` adjudicates each one — fix, or reject with a written reason that an arbitration round
   rules on. `implement-task --auto` runs that whole cycle unattended, then commits the cleared leaf and
   chains to the next, stopping at the first `[verify]` leaf, `[human]` subtask, `needs-human` finding, or
   unsettled dispute. In a manual run the review is optional: you either ask for it or read the diff
   yourself.
6. **Land** — flip the draft PR to **ready for review** when the spec's last box is checked; the feature
   branch merges to `main` as one PR, spec included. Big subtasks may have had their own sub-branch + PR
   into the feature branch along the way (same pattern: draft when the step starts with its sub-spec as the
   first commit, ready when the step's boxes are checked); simple ones are single commits on it. Branch
   names carry the addressing — feature branch is `issue-<number>` (`issue-3219`), a big subtask's sub-branch
   adds `-step-<N>` (`issue-3219-step-2`) — so `implement-task` needs no arguments on a task branch. Once the
   PR is ready, run `review-changes` **by hand** for the whole-task pass: per-subtask reviews structurally
   cannot see inconsistency between subtasks, duplicated helpers, or dead scaffolding. On a pushed branch it
   posts inline PR comments instead of a file, so your own review comments and the agent's sit side by side —
   `resolve-review` closes out both, and never rejects a human's.

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

## Subtask tags

A breakdown line carries its per-subtask state as tags. **This section is the only definition of them** —
other files point here rather than restating.

- **`[agent]` / `[human]`** — who does the work, per the capability boundary in `.agents/delegation.md`.
  Exactly one per subtask. UI work is **two linked leaves** by default: an `[agent]` scaffold, then a
  `[human]` style leaf that takes it to the mockup — layout, spacing, styling, icons — with the exact Figma
  node linked on that leaf and the scaffold's `TODO (design):` markers as its worklist.
- **`[verify]`** — on an `[agent]` leaf only: once the code review comes back clear, a **human must verify
  the running product** before the leaf is committed. Such a leaf also carries a `verify:` line saying how
  to check it.

`to-spec` writes every tag explicitly, never implicitly, because `implement-task` reads them as its state
machine: it hands `[human]` subtasks over, and it leaves a cleared `[verify]` leaf **uncommitted** for the
developer instead of committing it and chaining on.

### When a leaf needs `[verify]`

The test: *is there user-visible behaviour only a human can judge?* The review covers the code; it cannot
tell whether the running product is right.

- **No `[verify]`** — env vars, API resources and response types, route plumbing / metadata / sitemap /
  analytics, unit tests, glossary and docs, behaviour-preserving refactors.
- **`[verify]`** — anything that changes what a user sees or does: component scaffolds (placeholder ones
  included), data wiring that renders, page behaviour, perf-sensitive changes, anything touching CSP or
  security, and new dependencies.

Getting it wrong costs in both directions: a needless `[verify]` stalls an unattended chain, and a missing
one lets `--auto` commit something nobody looked at.

## Supporting files

- `.agents/delegation.md` — the living capability boundary: what agents are trusted to do in this repo
  today, and what stays with a developer. It decides every `[agent]` / `[human]` tag above. Loosen it via
  PR as the repo gets more agent-friendly, never per task.
- `.agents/TEAM.md` — the team roster (members + Slack IDs); the grilling session picks one contact per
  team for the task and records the picks in the spec header.
- `.agents/skills/to-spec/spec-template.md` — the spec template (used for both main and subtask specs).
- `.agents/skills/review-changes/` — the reviewer: the three axes, the smell baseline (`smells.md`), the
  record format (`review-template.md`), and the `gh` surface both review skills share (`gh-commands.md`).
- `.agents/skills/resolve-review/SKILL.md` — adjudicating findings and closing them out.
- Each `subtasks/NN-<slug>/` folder holds the subtask's `spec.md` (once scoped) or a `brief.md` (the
  handoff for a not-yet-scoped subtask), plus optional `research.md` (real research / prototype notes) and
  `review.md` (the review findings for that subtask, with each one's verdict and the exchange behind it —
  written by `review-changes`, maintained by `resolve-review`).
