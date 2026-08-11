# Product task specs

This directory holds one folder per specced product task: a `spec.md` index plus one folder per subtask
(`subtasks/NN-<slug>/`). Specs merge with their task's PR and **accumulate here as a permanent record** —
consult past specs as precedent for how similar tasks were scoped and split.

## Why

Product issues often arrive thin (a title, a Figma link) — too thin to hand to an agent, and thin enough
that a developer fills the gaps with guesswork. The spec workflow fixes the input: an interview fills the
gaps, unanswerable questions get routed to the people who own the answers, and the resulting spec explicitly
says which steps an agent does and which a developer does by hand.

## Not every task needs a spec

A spec exists to **hand work to a session that wasn't in the room**. A task whose breakdown comes out as a
single subtask never leaves the room: it is grilled, implemented, and opened as a PR inside one session, so
it gets no folder here and its reasoning goes into the PR description instead. Ask for a spec anyway when
the work will sit before it starts — the draft PR then parks it somewhere visible.

## What a spec holds

A spec is an **index of decisions**, not a worklog: *what* to build and *why*, pointing at detail instead of
copying it — so it stays legible and never drifts out of sync with its sources.

- **Rationale lives in its Slack thread.** A resolved question records the **decision, not the
  deliberation** — the outcome as a phrase, never who proposed what or the iterations that reached it; the
  recorded permalink holds all of that. And the repo is **public**: client specifics, roadmap, and dates
  stay in the thread too. Keep only what executing the task needs — a shipped backend version for the
  release notes, yes; the date it's planned to ship, no.
- **Values live in the code.** Reference existing code by pointer ("match `LogDecodedInputDataTable`"), not
  by copying its values, class names, or line numbers — those rot, and the code already owns them. Capture
  only a deliberate deviation and its reason.
- **What-was-done lives in the PR.** Completion is the checked box plus a one-line note; the diff is the
  record. A finding worth keeping goes to the task or subtask folder's `notes.md` (task-scoped evidence the
  PR can quote), or graduates to a `CONTEXT.md`, a rule, or the glossary if it's durable repo knowledge —
  never into the spec as a report.

The one thing that flows *back into* a spec is a **durable decision** taken mid-task (a new dependency, an
architectural choice): fold it into the section it changes, as revised intent.

Once its task is **done**, a spec is frozen — a record of what was decided then. A later task that finds a
bug from an earlier one fixes it in its *own* spec and PR; it never rewrites the finished spec.

## The subtask model

**This section is the only definition of the model** — other files point here rather than restating it.

A **subtask is a vertical slice**: a narrow but complete path through every layer it touches, verifiable on
its own once it lands. Two hard bounds make it the unit everything else keys off:

- It **fits in one fresh context window** — the sizing test the breakdown is quizzed against.
- It is **one commit**, made once its review comes back clear.

Inside a subtask, the **leaves** are the actual steps, and they run *along* layers — one project skill each
(`add-api-resource`, then `add-new-page`, then the styling). See
[`../adr/0002-layer-shaped-subtask-leaves.md`](../adr/0002-layer-shaped-subtask-leaves.md) for why the two
levels cut in different directions.

### Leaves

Each leaf carries `[agent]` or `[human]` per the capability boundary in `.agents/delegation.md` — exactly
one, written explicitly, because `implement-task` reads the tag as its state machine. UI work is **two
linked leaves** by default: an `[agent]` scaffold, then a `[human]` style leaf that takes it to the mockup —
layout, spacing, styling, icons — with the exact Figma node linked on that leaf and the scaffold's
`TODO (design):` markers as its worklist.

A leaf's checkbox is **resumption state**: a subtask has no commits until it finishes, so the boxes are the
only durable record of the frontier inside it. They say where to pick up, never what was done — the commit
and the PR carry that.

### Acceptance criteria

Every subtask spec carries a checklist of what must be true when it is done. A criterion marked `(human)`
is one only a person looking at the running product can judge; every other criterion is what the review
checks. One `(human)` criterion is what makes `implement-task` pause for verification before it commits —
the list *is* the gate, so nothing separate has to stay in sync with it.

The test for a `(human)` criterion: *does this change what a user sees or does?*

- **Earns one** — component scaffolds (placeholder ones included), data wiring that renders, page
  behaviour, perf-sensitive changes, anything touching CSP or security, and new dependencies.
- **Does not** — env vars, API resources and response types, route plumbing, metadata, sitemap, analytics,
  unit tests, glossary and docs, behaviour-preserving refactors.

Getting it wrong costs in both directions: a needless `(human)` criterion stalls an unattended chain, and a
missing one lets `--auto` commit something nobody looked at.

### Order

Every subtask declares `Blocked by:` — the subtasks that must be checked before it can start, or `None`.
**Numbers are identity, not order**: the edges carry the order, which is what lets a subtask be appended
without renumbering anything. A subtask may also list blocking question ids; it can't start while one is
`pending`, and unrelated subtasks carry on regardless.

`implement-task` works the **frontier** — any subtask whose blockers are checked and whose questions are
settled.

### Deferred subtasks

A subtask that can't be scoped until something happens first — a prototype, a spike, an answer nobody has
yet — gets a `brief.md` in its folder and **no** `spec.md`. That absence is the only marker; nothing labels
the task as a whole.

A just-in-time `grill-the-task` subtask session scopes it later, against the by-then-current code: the
folder gets its `spec.md`, and whatever else the spike revealed is **appended as new sibling subtasks**,
with `Blocked by:` edges retargeted to match. The structure stays flat — a subtask never contains subtasks.

## Lifecycle

1. **Grill** — run the `grill-the-task` skill with the issue URL. It researches first (issue, codebase,
   live API samples, Figma mockups — enumerate-only), interviews you one question at a time, quizzes the
   breakdown with you, and sends what you couldn't answer to its owner on Slack once you approve the draft.
   A **one-subtask** task ends here: the session implements it and `create-pr` opens the finished PR.
2. **Spec** — the session hands off to the `to-spec` skill, which writes the `spec.md` index plus every
   subtask folder (a `spec.md` where the subtask is scoped, a `brief.md` where it is deferred) and records
   each question's Slack permalink. Commit the spec to the feature branch and **open a draft PR right away**
   (`to-spec` walks you through branch, commit, and draft PR at the end of the run) — a spec-only draft is
   the cheap moment to catch a wrong split or a missed requirement, it links the issue to the work, and CI
   and demo deploys hang off it for the rest of the task.
3. **Answers** — when colleagues reply, read the threads and ask for the spec to be updated. `to-spec`
   folds each accepted decision into the section it changes and marks the question `resolved`.
4. **Implement** — run the `implement-task` skill repeatedly, **one subtask per run**: it executes the
   subtask's `[agent]` leaves (composing `add-api-resource`, `add-new-page`, `add-env-var`, …), verifies
   them, and hands `[human]` leaves over to you. In a manual run you review the diff and commit between
   runs; under `--auto` the run reviews, commits, and chains itself (step 5).
5. **Review** — the `review-changes` skill reviews a finished subtask in a fresh subagent context on three
   axes (spec compliance, repo standards, correctness). Findings land in the subtask folder's `review.md`,
   and `resolve-review` adjudicates each one — fix, or reject with a written reason that an arbitration
   round rules on. `implement-task --auto` runs that whole cycle unattended, then commits the subtask and
   chains to the next, stopping at a `(human)` acceptance criterion, a `[human]` leaf, a `needs-human`
   finding, or an unsettled dispute. In a manual run the review is optional: you either ask for it or read
   the diff yourself.
6. **Land** — flip the draft PR to **ready for review** when the index's last box is checked. One feature
   branch holds the whole task and lands in `main` as one PR, spec included; it is named `issue-<number>`
   (`issue-3219`), which is what lets `implement-task` run with no arguments on a task branch. Once the PR
   is ready, run `review-changes` **by hand** for the whole-task pass: per-subtask reviews structurally
   cannot see inconsistency between subtasks, duplicated helpers, or dead scaffolding. On a pushed branch it
   posts inline PR comments instead of a file, so your own review comments and the agent's sit side by side —
   `resolve-review` closes out both, and never rejects a human's.

## Supporting files

- `.agents/delegation.md` — the living capability boundary: what agents are trusted to do in this repo
  today, and what stays with a developer. It decides every `[agent]` / `[human]` tag above. Loosen it via
  PR as the repo gets more agent-friendly, never per task.
- `.agents/TEAM.md` — the team roster (members + Slack IDs); the grilling session picks one contact per
  team for the task and records the picks in the spec header.
- `.agents/skills/to-spec/spec-template.md` — the main spec: header, context, shared facts, and the
  subtask index.
- `.agents/skills/to-spec/subtask-template.md` — a subtask spec: what to build, acceptance criteria,
  blocking edges, and the leaf worklist.
- `.agents/skills/review-changes/` — the reviewer: the three axes, the smell baseline (`smells.md`), the
  record format (`review-template.md`), and the `gh` surface both review skills share (`gh-commands.md`).
- `.agents/skills/resolve-review/SKILL.md` — adjudicating findings and closing them out.
- Each `subtasks/NN-<slug>/` folder holds the subtask's `spec.md` (once scoped) or a `brief.md` (the
  handoff for a not-yet-scoped subtask), plus optional `research.md` (real research / prototype notes),
  `notes.md` (implementation findings kept as evidence for the PR — an appendix, never a second spec), and
  `review.md` (the review findings for that subtask, with each one's verdict and the exchange behind it —
  written by `review-changes`, maintained by `resolve-review`).
