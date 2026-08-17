---
name: to-spec
description: >-
  Write the current conversation into a product-task spec in .agents/tasks/, or update an existing spec —
  folding in decisions taken since, including answers that came back from colleagues. Use at the end of a
  grilling session, when the user wants a conversation captured as a spec, or when a spec needs updating.
---

# To spec

Turn the current conversation into a spec — or merge it into one that already exists. **Synthesize what
the conversation already settled; do not interview.** The decisions, the breakdown, and the open questions
were made in the session that hands off to this skill (`grill-the-task`, normally); this skill's whole job
is writing them down in the right files.

That boundary cuts both ways. Reading Slack replies is **not** this skill's job either — the developer
reads the threads in their own session and brings the answers into the conversation; what arrives here is
a decision to fold in, like any other.

The spec is the single source of truth for a product task: `implement-task` executes from it and humans
work from it. Not every task gets one — see "Not every task needs a spec" in `.agents/tasks/README.md`.

## Spec location and structure

- With a GitHub issue: `.agents/tasks/<issue-number>-<slug>/spec.md` — the bare issue number, then a
  kebab-case slug naming the task.
- Ad-hoc (no issue): `.agents/tasks/<slug>/spec.md`.
- Every subtask gets its own folder `subtasks/<NN>-<slug>/`, holding either:
  - `spec.md` — the subtask spec, written from `subtask-template.md` (next to this file). Status
    `draft | ready | in progress | done`.
  - `brief.md` — for a subtask that **isn't scoped yet**; its presence with no `spec.md` is the only marker
    of a deferred subtask. It carries: the subtask's goal in a sentence or two; the context already gathered
    (relevant code, endpoints, mockups); the specific unknowns to resolve (what to research, prototype, or
    decide) and who owns each; and links (issue, Figma, related specs) — enough for a `grill-the-task`
    subtask session to start without re-deriving it.
  - `research.md` — optional; research findings or prototype notes produced before the subtask session,
    feeding it alongside the brief.

**The main spec is an index, not a container.** Its Task breakdown is one line per subtask — checkbox,
title, folder link, blocking edges — and never inlines requirements, inputs, or changelogs. Write it from
`spec-template.md`; write every subtask from `subtask-template.md`. The two templates are shaped
differently on purpose: the main spec holds the task's shared facts, a subtask spec holds one vertical
slice's contract. "The subtask model" in `.agents/tasks/README.md` is the definition of both — follow it
rather than restating it, and tag every leaf explicitly, since `implement-task` reads the tags as its state
machine.

Specs merge with the task's PR and accumulate in `.agents/tasks/` as precedent.

## Workflow

### Step 1 — Locate the spec

Derive the path from the issue (or ask for a slug). If the file already exists, this is an **update** run:
read the spec first and treat it as hand-editable — developers edit specs directly between runs.

### Step 2 — Write or merge

Extract from the conversation: decisions, requirements, data/API facts, UI inventory, the approved task
breakdown with its blocking edges, and unanswered questions with their owners — the per-team contacts
picked during the session (defaults from `.agents/TEAM.md`), recorded in the header. Record the Slack
permalink of every question the session already sent.

**Write to the right file.** Task-level facts (context, shared data/API, overall UI inventory, out-of-scope,
the index breakdown) go in the main `spec.md`; a subtask's own what-to-build, acceptance criteria, blocking
edges, executor-skill `inputs:`, and leaf worklist go in `subtasks/<NN>-<slug>/spec.md`. A subtask that
isn't scoped yet gets a `brief.md` instead.

**Merge surgically.** On update runs, never regenerate the file: preserve checked boxes, statuses, hand
edits, and resolved-question records; only add or amend what the conversation actually changed. When an
answer resolves a question, fold the decision into the section it affects, set the question's status to
`resolved`, and record the answer as a phrase plus its date — the decision, not the deliberation, and
nothing this public repo shouldn't carry. Show the user a summary of the changes and confirm before moving
on.

**Scoping a deferred subtask.** A subtask session hands off with its folder's `spec.md` to write, plus
whatever else the spike revealed. Append those as new sibling subtasks and retarget the `Blocked by:` edges
that pointed at the deferred one; never renumber, and never nest a subtask inside a subtask.

**No changelogs.** A subtask's completion is its checked box plus a one-line note — the commit and the PR
are the record of what changed. Durable decisions taken during work (a new dependency, an architectural
choice) are folded into the relevant section, not appended as a "done: …" block. See "What a spec holds" in
`.agents/tasks/README.md` for what stays in the spec versus what lives in its thread, the code, or the PR.

Status field: a new spec starts as `draft`; set it to `ready` once no `pending` question blocks the first
subtask — blocking is per-subtask, so unblocked subtasks may proceed while unrelated questions are pending.

### Step 3 — Branch and draft PR (first creation only)

When this run **created** the spec, bootstrap the workflow's draft-PR-first policy — each action only with
the developer's explicit approval, never unprompted:

1. **Branch** — `issue-<number>` off `main`, or, for an **ad-hoc spec** (no issue), the task-dir slug
   itself (spec in `.agents/tasks/<slug>/` → branch `<slug>`). Create/switch if needed and record the
   branch in the spec header.
2. **Commit** — propose committing the spec as the branch's first commit; show what will be committed and
   wait for confirmation.
3. **Draft PR** — suggest opening it right away via the `create-pr` skill (draft-placeholder mode, feature
   branch → `main`). Why drafts open this early is documented in `.agents/tasks/README.md`; the PR flips to
   ready when the breakdown's last box is checked (the `implement-task` skill nudges at that moment).

For ad-hoc specs the draft PR doubles as a **parking spot**: an idea captured as a spec today can sit in
its draft PR and be picked up, refined, or implemented days later — visible on GitHub instead of only in a
local working tree.
