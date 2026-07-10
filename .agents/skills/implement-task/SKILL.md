---
name: implement-task
description: >-
  Execute a product-task spec one leaf subtask per run — [agent] subtasks via the project skills,
  [human] subtasks handed off to the developer.
disable-model-invocation: true
---

# Implement task

Work through a spec produced by `grill-the-task` / `to-spec`, **one subtask per run**. The spec is the state
machine: each run starts a fresh session, picks up where the spec says work stopped, executes a single
subtask, updates the spec, and stops so the developer can verify and commit. Any colleague can resume the
task from the branch alone.

## Invocation

- `/implement-task` — no arguments, the usual case: infer the spec (and the current big step) from the
  branch name, per the Branch model below. Execute the next eligible subtask (Step 3).
- `/implement-task 4` — a **specific** subtask, out of order. Pending questions still refuse the run;
  unchecked dependencies are pointed out and need the developer's explicit confirmation to proceed.
- `/implement-task 2.3` — large tasks address **leaf steps** with dotted numbers: step 3 inside big step 2's
  sub-spec (`subtasks/02-<slug>.md`). The sub-spec's own breakdown is the checklist for that big step; its
  header status is maintained like a spec's.
- An explicit task dir as the first argument (e.g. `/implement-task 3219-cross-chain-views 4`) overrides
  branch inference — needed when not on the feature branch yet.

The unit of one run is always a **leaf**: in a large task, "next eligible subtask" descends — if the next
subtask is a big step with a sub-spec, execute the next eligible step *inside* it (one step, then stop).

## Branch model

One **feature branch** holds the whole product task; it lands in `main` as one PR when the task is done.
Within it: a big subtask (several commits) gets its own sub-branch and a PR into the feature branch; a simple
subtask is a single commit directly on the feature branch. Remind the developer of this when a subtask
starts, but **never commit, push, or open PRs yourself** — the developer reviews the diff and commits between
runs.

**PR timing (developer's action — prompt, don't do):** a draft PR opens as soon as the spec is the branch's
first commit (feature branch → `main`; a big step's sub-branch → feature branch, with its sub-spec as the
first commit) and flips to ready for review when its breakdown's last box is checked. Nudge accordingly: on
a first run with no PR yet, suggest opening the draft; when checking off the final subtask (or a big step's
final step), suggest finalizing it via the `create-pr` skill (finalize-draft mode: real description from the
diff, labels, then ready for review).

**Branch names carry the addressing.** The feature branch is `issue-<number>` (e.g. `issue-3219`); a big
step's sub-branch adds a `-step-<N>` postfix (e.g. `issue-3219-step-2`). An **ad-hoc** spec's branch is its
task-dir slug (`.agents/tasks/<slug>/` → branch `<slug>`). Dash postfixes, **not** slashes — git forbids
`X` and `X/…` coexisting. The names are fully mechanical, which is what lets the skill construct branches
itself and infer the spec (and the current big step) with no arguments: `issue-<n>` matches the task dir by
issue number, any other branch matches by exact dir name.

## Workflow

### Step 1 — Load state

Resolve the spec per the Invocation section (branch inference by default, explicit task dir wins); if
neither yields a match in `.agents/tasks/`, ask. Read the spec — and the sub-spec, when a `-step-<N>`
branch or a dotted target selects one — plus `.agents/rules/delegation.mdc`. If the header has no feature
branch yet, construct it from the convention above (`issue-<number>`), confirm with the developer, create
it, and record it in the header.

### Step 2 — Reconcile the previous handoff

If the previous subtask in the breakdown is `[human]` and still unchecked, ask the developer whether it's
done before doing anything else — check it off if so, stop if it's still in progress (the order exists for a
reason; don't leapfrog a pending style step unless the developer explicitly says the next subtask is
independent).

### Step 3 — Pick the next subtask

If the invocation named a subtask or leaf step, that's the pick (with the guardrails from the Invocation
section). Otherwise: the first unchecked subtask whose dependencies are all checked **and** whose listed
questions are all `resolved` or `waived`, descending into sub-specs to a leaf step. Then:

- **All remaining subtasks blocked by `pending` questions** → tell the developer which questions block what,
  and suggest running `to-spec` to harvest Slack answers. Stop.
- **Next subtask is `[human]`** → hand off: state what needs doing, link the Figma node, note that the
  scaffold's `TODO (design):` markers are the worklist. Stop.
- **Next subtask is a big step without its sub-spec yet** → tell the developer to run `grill-the-task` in
  subtask mode for it. Stop.
- **Next subtask is `[agent]`** → proceed.

### Step 4 — Execute (one subtask only)

Do the work, composing the project skills wherever one applies (`add-api-resource`, `add-env-var`,
`add-new-page`, `deploy-demo`, …) and staying inside the delegation boundary — scaffolds get placeholder
presentation and `TODO (design):` markers, never final styling. Follow the sub-spec if the subtask has one.

The spec should already contain the executing skill's inputs — the grilling session runs each skill's
interview up front, so **skip any of the skill's questions the spec answers** and run uninterrupted. If an
input is genuinely missing, ask the developer and **backfill the answer into the spec** before proceeding.
Write the unit tests and Playwright scaffolds the standing testing policy assigns to this subtask.

### Step 5 — Verify

Run the repo's checks for what was touched: `pnpm run lint:tsc`, ESLint on changed files, and the relevant
unit tests (commands per `.agents/rules/code-quality.mdc`). Intentional scaffold `TODO`s may keep ESLint red
in the same way the `add-new-page` skill documents — say so explicitly rather than chasing green.

### Step 6 — Update the spec and stop

Check the subtask off with a one-line note of what was done (files/skills involved). Set the header status to
`in progress` on the first executed subtask, and to `done` when the last box is checked. Then summarize the
result and end the run — verification of the diff, the commit, and the next `implement-task` invocation
belong to the developer.
