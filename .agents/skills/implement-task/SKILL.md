---
name: implement-task
description: >-
  Execute a product-task spec one leaf subtask per run — [agent] subtasks via the project skills,
  [human] subtasks handed off to the developer. `--auto` code-reviews, fixes, commits and chains unattended.
disable-model-invocation: true
---

# Implement task

Work through a spec produced by `grill-the-task` / `to-spec`, **one subtask per run**. The spec is the state
machine: each run starts a fresh session, picks up where the spec says work stopped, executes a single
subtask, updates the spec, and stops so the developer can verify and commit. Any colleague can resume the
task from the branch alone.

`--auto` makes the run unattended: it code-reviews each leaf, resolves the findings, commits, and **chains**
to the next leaf without the developer. A manual run does none of that by default — the developer decides per
run whether they want the agentic review or would rather read the diff themselves.

## Invocation

- `/implement-task` — no arguments, the usual case: infer the spec (and the current subtask, from a
  `-step-<N>` branch) from the branch name, per the Branch model below. Execute the next eligible subtask
  (Step 3).
- `/implement-task 4` — a **specific** subtask, out of order. Pending questions still refuse the run;
  unchecked dependencies are pointed out and need the developer's explicit confirmation to proceed.
- `/implement-task 2.3` — when a subtask's own spec has a multi-step breakdown, address its **leaf steps**
  with dotted numbers: step 3 inside subtask 2's sub-spec (`subtasks/02-<slug>/spec.md`). The sub-spec's own
  breakdown is the checklist for that subtask; its header status is maintained like a spec's.
- An explicit task dir as the first argument (e.g. `/implement-task 3219-cross-chain-views 4`) overrides
  branch inference — needed when not on the feature branch yet.
- `--auto` — chain leaves unattended: review, resolve findings, commit, next leaf, until a stop condition
  (Step 9). `--auto 3-5` bounds the chain to those leaves. Typing the flag is what **grants the run
  commit authority**; without it nothing is ever committed.

The unit of one run is always a **leaf**: "next eligible subtask" descends — if the next subtask has its
own multi-step sub-spec, execute the next eligible leaf step *inside* it (one step, then stop). Under
`--auto` the run does not stop after one leaf; it keeps taking leaves until a stop condition fires.

## Branch model

One **feature branch** holds the whole product task; it lands in `main` as one PR when the task is done.
Within it: a big subtask (several commits) gets its own sub-branch and a PR into the feature branch; a simple
subtask is a single commit directly on the feature branch. Remind the developer of this when a subtask
starts, but **never commit, push, or open PRs yourself** — the developer reviews the diff and commits between
runs.

**The one exception is `--auto`**, where the flag itself is the developer's grant: the run commits each
cleared leaf (Step 9), and pushes only when it finalizes the task's last leaf. It still never amends and
never force-pushes, so a per-leaf commit chain with no rewriting means unwinding a bad run is a plain
`git reset`.

**PR timing (developer's action — prompt, don't do):** a draft PR opens as soon as the spec is the branch's
first commit (feature branch → `main`; a big subtask's sub-branch → feature branch, with its sub-spec as
the first commit) and flips to ready for review when its breakdown's last box is checked. Nudge accordingly:
on a first run with no PR yet, suggest opening the draft; when checking off the final subtask (or a big
subtask's final leaf step), suggest finalizing it via the `create-pr` skill (finalize-draft mode: real
description from the diff, labels, then ready for review).

**Branch names carry the addressing.** The feature branch is `issue-<number>` (e.g. `issue-3219`); a big
subtask's sub-branch adds a `-step-<N>` postfix (e.g. `issue-3219-step-2`). An **ad-hoc** spec's branch is its
task-dir slug (`.agents/tasks/<slug>/` → branch `<slug>`). Dash postfixes, **not** slashes — git forbids
`X` and `X/…` coexisting. The names are fully mechanical, which is what lets the skill construct branches
itself and infer the spec (and the current subtask) with no arguments: `issue-<n>` matches the task dir by
issue number, any other branch matches by exact dir name.

## Workflow

### Step 1 — Load state

Resolve the spec per the Invocation section (branch inference by default, explicit task dir wins); if
neither yields a match in `.agents/tasks/`, ask. Read the main spec — and the target subtask's
`subtasks/<NN>-<slug>/spec.md`, when a `-step-<N>` branch or a dotted target selects one — plus
`.agents/delegation.md`. If the header has no feature branch yet, construct it from the convention
above (`issue-<number>`), confirm with the developer, create it, and record it in the header.

### Step 2 — Reconcile the previous handoff

If the previous subtask in the breakdown is `[human]` and still unchecked, ask the developer whether it's
done before doing anything else — check it off if so, stop if it's still in progress (the order exists for a
reason; don't leapfrog a pending style step unless the developer explicitly says the next subtask is
independent).

### Step 3 — Pick the next subtask

If the invocation named a subtask or leaf step, that's the pick (with the guardrails from the Invocation
section). Otherwise: the first unchecked subtask whose dependencies are all checked **and** whose listed
questions are all `resolved` or `waived`, descending into sub-specs to a leaf step. Then:

- **Nothing unchecked left** — the index's last box is checked → the task is done, so **finalize** rather
  than reporting nothing to do: hand off to the `create-pr` skill in finalize-draft mode. This is the path a
  task takes whenever its final leaf is `[human]` or `[verify]`, which the default UI split makes the common
  case; without it a finished task would simply stall.
- **All remaining subtasks blocked by `pending` questions** → tell the developer which questions block what,
  and suggest running `to-spec` to harvest Slack answers. Stop.
- **Next subtask is `[human]`** → hand off: state what needs doing, link the Figma node, note that the
  scaffold's `TODO (design):` markers are the worklist. Stop.
- **Next subtask has only a `brief.md`, no `spec.md` yet** → it isn't scoped; tell the developer to run
  `grill-the-task` in subtask mode for it (it writes the folder's `spec.md` from its `brief.md`). Stop.
- **Next subtask is `[agent]`** → proceed.

### Step 4 — Execute (one subtask only)

Do the work, composing the project skills wherever one applies (`add-api-resource`, `add-env-var`,
`add-new-page`, `deploy-demo`, …) and staying inside the delegation boundary — scaffolds get placeholder
presentation and `TODO (design):` markers, never final styling. Follow the sub-spec if the subtask has one.

The spec should already contain the executing skill's inputs — the grilling session runs each skill's
interview up front, so **skip any of the skill's questions the spec answers** and run uninterrupted. If an
input is genuinely missing, ask the developer and **backfill the answer into the spec** before proceeding.
Write the unit tests and Playwright scaffolds `.agents/delegation.md` assigns to agents (test the behavior
that matters, not the obvious — per `.agents/rules/tests-unit.md`).

### Step 5 — Verify

Run every code-quality check the repo defines (per `.agents/rules/code-quality.md` — run all of them, not
only the ones you remember) plus the relevant unit tests. Intentional scaffold `TODO`s may keep ESLint red
in the same way the `add-new-page` skill documents — say so explicitly rather than chasing green.

### Step 6 — Review

**Under `--auto` this step always runs** — it is what makes an unattended commit defensible. In a **manual**
run, ask once: agentic review, or is the developer reviewing the diff themselves? If they take it, go
straight to Step 8; a review nobody asked for spends three subagents and delays the diff they are waiting to
read.

Dispatch the **`code-reviewer`** agent, synchronously (`run_in_background: false`) — you need its verdict
before you can continue. It follows `.agents/skills/review-changes/SKILL.md` and reviews the **uncommitted**
tree, so do not touch a file while it runs.

Hand it four things, since it starts with an empty context: the **spec path** for this leaf (the sub-spec if
there is one), the **leaf's number and title** — it names the record's section with them — the **round
number** (≥ 2 is what tells it to arbitrate instead of reviewing afresh), and any check failure Step 5
declared intentional.

Step 5 must be **settled** first — green, or red only for the intentional scaffold `TODO`s Step 5 documents.
Reviewing code that does not compile spends three subagents on noise. Pass those known-intentional failures
to the agent so it does not report them back as findings.

The agent returns the review record's path and an `Outcome`:

- `clear` → skip to Step 8. Any nits already carry Status `deferred` from the review itself, so skipping
  Step 7 loses nothing; they stay in the record for the whole-task pass.
- `blocked` → Step 7.
- `needs-human` → Step 7 adjudicates what it can, then the run stops with the open items.

### Step 7 — Resolve findings

Read `.agents/skills/resolve-review/SKILL.md` and follow it — it is user-invoked, so reach it by path
rather than by invoking a skill. A manual run keeps its Gate 1 and Gate 2; an `--auto` run takes its
no-gates posture, where the written verdicts are what replace the gates.

Then re-dispatch `code-reviewer` for an **arbitration** round, and repeat until the record reads
`Outcome: clear` — or until, under `--auto`, either **3 rounds** have passed or a finding is `needs-human`.
A manual run is uncapped; the developer decides when to stop arguing.

Nits never gate: `deferred` findings leave the `Outcome` `clear`.

### Step 8 — Update the spec

Check the box for what you did, with a **one-line** note (files/skills involved) — never a multi-line
changelog; git and the PR carry the detail, and any durable decision (a new dependency, an architectural
choice) is folded into the relevant spec section instead. A finding worth keeping — a gotcha, a bug you hit
— goes to the task folder's `notes.md` as evidence the PR can quote, or graduates to a `CONTEXT.md`, a rule,
or the glossary if it's durable repo knowledge; it never lands in the spec as a report. If the work uncovers
a bug from an **earlier, finished** task, fix it here and note it in *this* task's PR — never reopen or edit
that task's frozen spec. See "What a spec holds" in `.agents/tasks/README.md`.

Keep both checklist levels in sync when the subtask has its own sub-spec:

- Check the **leaf step** in the sub-spec's breakdown; set the sub-spec's header `Status` to `in progress`
  on its first step and `done` when its last box is checked.
- When a sub-spec goes `done`, check its **subtask line in the main index** too.
- Set the **main** header `Status` to `in progress` on the first executed subtask and `done` when the
  index's last box is checked.

The main index is what "done" and draft-PR finalization key off, so never leave it trailing a completed
sub-spec.

### Step 9 — Commit and chain, or hand off

**Without `--auto`**: summarize and end the run. Verification of the diff, the commit, and the next
`implement-task` invocation belong to the developer.

**Under `--auto`**, when the `Outcome` is `clear` and the leaf is **not** tagged `[verify]`: commit the leaf
on the task branch — one commit with the review fixes folded in, a plain descriptive subject, and the repo's
`Co-Authored-By` trailer — then return to **Step 3** for the next leaf. Keep the issue out of the commit: no
`#<issue>` or issue URL in the subject or body. GitHub adds a timeline reference to the issue on every push
that names it, so a per-leaf chain spams it; the PR's `Resolves #N` already carries the link and closes the
issue on merge.

Stop the chain, pushing nothing, on any of:

- the leaf is `[verify]` → leave it **uncommitted**; the developer verifies per its `verify:` line, then commits
- the next leaf is `[human]`, or has only a `brief.md`
- a `pending` question blocks the next leaf
- a `needs-human` finding, or a `disputed` finding at the 3-round cap
- verification stays red and the fix is not obvious — never thrash on a red build
- the `--auto 3-5` scope is exhausted

When the chain clears the task's **last** leaf, finalize: hand off to the `create-pr` skill in
finalize-draft mode (push, real description from the diff, labels, then ready for review). That is the only
point at which an `--auto` run pushes. The full-task review afterwards is the developer's, run by hand.

**Close every run with the catch-up summary**, in this order — stop reason first, because that is the only
part needed immediately:

1. Stop reason.
2. Leaves completed, with their commit shas.
3. Findings per leaf, counts by severity.
4. **Every `rejected-accepted` finding with its one-line reason** — this is where an agent talked itself out
   of work while nobody was watching, so it must be impossible to miss.
5. Anything `needs-human` or `disputed`, with links.
6. The PR link, if it finalized.

Under `--auto`, also send a push notification carrying the stop reason: a chain that halts unattended and
then sits silent is the main way this wastes the developer's time.
