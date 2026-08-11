---
name: implement-task
description: >-
  Execute a product-task spec one subtask per run — `[agent]` leaves via the project skills, `[human]`
  leaves handed off to the developer. `--auto` code-reviews, fixes, commits and chains unattended.
disable-model-invocation: true
---

# Implement task

Work through a spec produced by `grill-the-task` / `to-spec`, **one subtask per run**. The spec is the state
machine: each run starts a fresh session, picks up where the spec says work stopped, executes a single
subtask, updates the spec, and stops so the developer can verify and commit. Any colleague can resume the
task from the branch alone.

A **subtask** is the unit of a run, a review, and a commit — see "The subtask model" in
`.agents/tasks/README.md`. Its **leaves** are the steps inside it; they are not run boundaries, and their
checkboxes exist so a run can resume mid-subtask, where no commit has been made yet.

`--auto` makes the run unattended: it code-reviews each finished subtask, resolves the findings, commits,
and **chains** to the next. A manual run does none of that by default — the developer decides per run
whether they want the agentic review or would rather read the diff themselves.

## Invocation

- `/implement-task` — no arguments, the usual case: infer the spec from the branch name, per the Branch
  model below. Execute the next eligible subtask (Step 3).
- `/implement-task 4` — a **specific** subtask, out of order. Pending questions still refuse the run;
  unmet blocking edges are pointed out and need the developer's explicit confirmation to proceed.
- An explicit task dir as the first argument (e.g. `/implement-task 3219-cross-chain-views 4`) overrides
  branch inference — needed when not on the feature branch yet.
- `--auto` — chain subtasks unattended: review, resolve findings, commit, next subtask, until a stop
  condition (Step 9). `--auto 3-5` bounds the chain to those subtasks. Typing the flag is what **grants the
  run commit authority**; without it nothing is ever committed.

## Branch model

One **feature branch** holds the whole product task and lands in `main` as one PR when the task is done.
Each subtask is a single commit on it: a subtask is bounded to one context window, so the branch carries the
whole task and every subtask lands directly on it. Under a manual run, **never commit, push, or open PRs
yourself**: the developer reviews the diff and commits between runs.

**The one exception is `--auto`**, where the flag itself is the developer's grant: the run commits each
cleared subtask (Step 9), and pushes only when it finalizes the task's last subtask. It still never amends
and never force-pushes, so a per-subtask commit chain with no rewriting means unwinding a bad run is a plain
`git reset`.

**PR timing (developer's action — prompt, don't do):** a draft PR opens as soon as the spec is the branch's
first commit, and flips to ready for review when the index's last box is checked. Nudge accordingly: on a
first run with no PR yet, suggest opening the draft; when checking off the final subtask, suggest finalizing
it via the `create-pr` skill (finalize-draft mode: real description from the diff, labels, then ready for
review).

**Branch names carry the addressing.** The feature branch is `issue-<number>` (e.g. `issue-3219`); an
**ad-hoc** spec's branch is its task-dir slug (`.agents/tasks/<slug>/` → branch `<slug>`). The names are
fully mechanical, which is what lets the skill construct the branch itself and infer the spec with no
arguments: `issue-<n>` matches the task dir by issue number, any other branch matches by exact dir name.

## Workflow

### Step 1 — Load state

Resolve the spec per the Invocation section (branch inference by default, explicit task dir wins); if
neither yields a match in `.agents/tasks/`, ask. Read the main spec, the target subtask's
`subtasks/<NN>-<slug>/spec.md`, and `.agents/delegation.md`. If the header has no feature branch yet,
construct it from the convention above (`issue-<number>`), confirm with the developer, create it, and record
it in the header.

### Step 2 — Reconcile the previous handoff

A run can arrive mid-subtask, because a `[human]` leaf inside one stops the chain. Before anything else:

- **An unchecked `[human]` leaf in a subtask already in progress** — ask the developer whether it's done.
  Check it off if so; stop if it's still in progress. Then resume that subtask at its next unchecked leaf
  rather than picking a new one.
- **A finished subtask left uncommitted for verification** — ask whether the `(human)` acceptance criteria
  passed. If they did, the developer commits before this run starts new work; if they didn't, fix what
  failed inside that subtask instead of moving on.

### Step 3 — Pick the next subtask

If the invocation named a subtask, that's the pick (with the guardrails from the Invocation section).
Otherwise take the **frontier**: the first unchecked subtask whose `Blocked by:` edges are all checked
**and** whose listed questions are all `resolved` or `waived`. Then:

- **Nothing unchecked left** — the index's last box is checked → the task is done, so **finalize** rather
  than reporting nothing to do: hand off to the `create-pr` skill in finalize-draft mode. This is the path a
  task takes whenever its final subtask ends on a `[human]` leaf or a `(human)` criterion, which the default
  UI split makes the common case; without it a finished task would simply stall.
- **Every remaining subtask blocked by `pending` questions** → tell the developer which questions block
  what, so they can chase the threads. Stop.
- **The subtask's first leaf is `[human]`** → hand off: state what needs doing, link the Figma node, note
  that the scaffold's `TODO (design):` markers are the worklist. Stop.
- **The subtask has only a `brief.md`, no `spec.md` yet** → it isn't scoped; tell the developer to run
  `grill-the-task` in subtask mode for it. Stop.
- **Otherwise** → proceed.

### Step 4 — Execute (one subtask only)

Work the subtask's leaves in order, checking each box as it completes — that is what lets a later run resume
here, since nothing is committed until Step 9. Compose the project skills wherever one applies
(`add-api-resource`, `add-env-var`, `add-new-page`, `deploy-demo`, …) and stay inside the delegation
boundary — scaffolds get placeholder presentation and `TODO (design):` markers, never final styling.

**Stop at a `[human]` leaf** and hand off as in Step 3; the subtask resumes in a later run.

The subtask spec should already contain each executing skill's inputs — the grilling session runs those
interviews up front, so **skip any of the skill's questions the spec answers** and run uninterrupted. If an
input is genuinely missing, ask the developer and **backfill the answer into the spec** before proceeding.
Write the unit tests and Playwright scaffolds `.agents/delegation.md` assigns to agents (test the behavior
that matters, not the obvious — per `.agents/rules/tests-unit.md`).

### Step 5 — Verify

Run every code-quality check the repo defines (per `.agents/rules/code-quality.md` — run all of them, not
only the ones you remember) plus the relevant unit tests. Intentional scaffold `TODO`s may keep ESLint red
in the same way the `add-new-page` skill documents — say so explicitly rather than chasing green.

Then walk the subtask's **acceptance criteria** and confirm each unmarked one holds. A `(human)` criterion
is not yours to judge — it is what Step 9 stops for.

### Step 6 — Review

**Under `--auto` this step always runs** — it is what makes an unattended commit defensible. In a **manual**
run, ask once: agentic review, or is the developer reviewing the diff themselves? If they take it, go
straight to Step 8; a review nobody asked for spends a subagent per axis and delays the diff they are
waiting to read.

Dispatch the **`code-reviewer`** agent, synchronously (`run_in_background: false`) — you need its verdict
before you can continue. It follows `.agents/skills/review-changes/SKILL.md` and reviews the **uncommitted**
tree, which is exactly this subtask's whole diff, so do not touch a file while it runs.

Hand it four things, since it starts with an empty context: the **subtask spec's path** — its acceptance
criteria are what the spec axis checks — the **subtask's number and title** (it names the record's section
with them), the **round number** (≥ 2 is what tells it to arbitrate instead of reviewing afresh), and any
check failure Step 5 declared intentional.

Step 5 must be **settled** first — green, or red only for the intentional scaffold `TODO`s Step 5 documents.
Reviewing code that does not compile spends every axis on noise. Pass those known-intentional failures
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

Check the subtask's box in the main index, with a **one-line** note (files/skills involved) — never a
multi-line changelog; git and the PR carry the detail, and any durable decision (a new dependency, an
architectural choice) is folded into the relevant spec section instead. A finding worth keeping — a gotcha,
a bug you hit — goes to the subtask folder's `notes.md` as evidence the PR can quote, or graduates to a
`CONTEXT.md`, a rule, or the glossary if it's durable repo knowledge; it never lands in the spec as a
report. If the work uncovers a bug from an **earlier, finished** task, fix it here and note it in *this*
task's PR — never reopen or edit that task's frozen spec. See "What a spec holds" in
`.agents/tasks/README.md`.

Keep both levels in sync:

- Set the subtask spec's header `Status` to `in progress` on its first leaf and `done` when its last box is
  checked, then check its line in the **main index**.
- Set the **main** header `Status` to `in progress` on the first executed subtask and `done` when the
  index's last box is checked.

The main index is what "done" and draft-PR finalization key off, so never leave it trailing a completed
subtask spec.

### Step 9 — Commit and chain, or hand off

**Without `--auto`**: summarize and end the run. Verification of the diff, the commit, and the next
`implement-task` invocation belong to the developer.

**Under `--auto`**, when the `Outcome` is `clear` and the subtask has **no `(human)` acceptance criterion**:
commit it on the task branch — one commit for the whole subtask with the review fixes folded in, a plain
descriptive subject, and the repo's `Co-Authored-By` trailer — then return to **Step 3** for the next
subtask. Keep the issue out of the commit: no `#<issue>` or issue URL in the subject or body. GitHub adds a
timeline reference to the issue on every push that names it, so a chain of commits spams it; the PR's
`Resolves #N` already carries the link and closes the issue on merge.

Stop the chain, pushing nothing, on any of:

- the subtask has a `(human)` acceptance criterion → leave it **uncommitted**; the developer checks it
  against the running product per the spec's "How to verify" line, then commits what they verified
- the next leaf inside this subtask is `[human]`
- the next subtask is blocked, or has only a `brief.md`
- a `pending` question blocks every remaining subtask
- a `needs-human` finding, or a `disputed` finding at the 3-round cap
- verification stays red and the fix is not obvious — never thrash on a red build
- the `--auto 3-5` scope is exhausted

When the chain clears the task's **last** subtask, finalize: hand off to the `create-pr` skill in
finalize-draft mode (push, real description from the diff, labels, then ready for review). That is the only
point at which an `--auto` run pushes. The full-task review afterwards is the developer's, run by hand.

**Close every run with the catch-up summary**, in this order — stop reason first, because that is the only
part needed immediately:

1. Stop reason.
2. Subtasks completed, with their commit shas.
3. Findings per subtask, counts by severity.
4. **Every `rejected-accepted` finding with its one-line reason** — this is where an agent talked itself out
   of work while nobody was watching, so it must be impossible to miss.
5. Anything `needs-human` or `disputed`, with links.
6. The PR link, if it finalized.

Under `--auto`, also send a push notification carrying the stop reason: a chain that halts unattended and
then sits silent is the main way this wastes the developer's time.
