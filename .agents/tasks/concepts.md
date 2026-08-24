# Product task concepts

The semantics of the workflow: what the words mean, what the ticket model is, and the three rules that make
the whole thing hold together — write-once, freeze-on-land, prune-on-land. The skills carry the steps;
this file carries the meaning they act on. Layout and file ownership live in
[`structure.md`](structure.md).

## Vocabulary

- **Spec** — the task's durable statement of intent. It is a handoff artifact describing a multi-session piece
  of work — what's being built, not how each session does its share.
- **Ticket** — one vertical slice of the task, scoped to a single fresh context window (the ticket model,
  below). Tickets are the unit of implementation and of a commit.
- **Leaf** — one step inside a ticket, worth one project skill (`add-api-resource`, `add-new-page`, …). The
  hierarchy is **spec → ticket → leaf**.
- **Progress** — the task's checkbox list, one box per ticket. The only place ticket-completion state is
  stored; `progress.md`.
- **Questions** — every open question the task raised, each with a stable id (`Q01`), its owner, Slack
  permalink, status, and answer once it lands; `questions.md`. A ticket that a question gates names that id
  in its `Blocked by`.
- **Brief** — the marker of a **deferred** ticket: a ticket folder with a `brief.md` and no `spec.md`,
  because the ticket can't be scoped until something happens first (a prototype, a spike, an answer nobody
  has yet).

## The ticket model

A **ticket is a vertical slice**: a narrow but complete path through every layer it touches, verifiable on
its own once it lands. Two hard bounds make it the unit everything keys off:

- It **fits in one fresh context window** — the sizing test the breakdown is quizzed against in `to-tickets`.
- It is **one commit**, made when the ticket is fully implemented.

Inside a ticket, the **leaves** are the actual steps, and they run *along* layers — one project skill each
(`add-api-resource`, then `add-new-page`, then the styling). The two levels cut in different directions on
purpose; [`../adr/0002-layer-shaped-ticket-leaves.md`](../adr/0002-layer-shaped-ticket-leaves.md) holds the
reasoning.

Tickets can block or be blocked by sibling tickets, so the order of work falls out of their dependency graph 
rather than a linear plan.

### Leaves

Each leaf carries `[agent]` or `[human]` per the capability boundary in
[`../delegation.md`](../delegation.md) — exactly one, written explicitly, because `implement-ticket` reads
the tag as its state machine. UI work is **two linked leaves** by default: an `[agent]` scaffold, then a
`[human]` style leaf that takes it to the mockup — layout, spacing, styling, icons — with the exact Figma
node linked on that leaf and the scaffold's `TODO (design):` markers as its worklist.

A leaf's checkbox is **progress state**: a ticket has no commit until it finishes, so the boxes are the
only durable record of how far it has got inside the ticket. They mark which leaves are done, never what
each one did.

### Acceptance criteria

Every ticket carries a checklist of what must be true when it is done — the gate for `implement-ticket`. A
criterion marked `(human)` is one only a person looking at the running product can judge; that is what makes
`implement-ticket` pause for verification before it commits. These criteria gate the ticket **only**: the
whole-task review contract is the spec's Functional Requirements (below), so acceptance criteria are not
needed once the ticket lands.

The test for a `(human)` criterion: *does this change what a user sees or does?*

- **Earns one** — component scaffolds (placeholder ones included), data wiring that renders, page
  behaviour, perf-sensitive changes, anything touching CSP or security, and new dependencies.
- **Does not** — env vars, API resources and response types, route plumbing, metadata, sitemap, analytics,
  unit tests, glossary and docs, behaviour-preserving refactors.

Getting it wrong costs in both directions: a needless `(human)` criterion stalls an unattended chain, and a
missing one lets an autonomous run commit something nobody looked at.

### Order

Every ticket declares `Blocked by` — the blockers that must clear before it can start, or `none`. Each entry
is prefixed by kind: a **ticket** blocker `T<NN>` (cleared when its box is checked in `progress.md`) or a
**question** blocker `Q<NN>` (cleared when it is `resolved` or `waived` in `questions.md`). This one list is
the whole runnable test — the ticket spec states its own blocked status, so `implement-ticket` reads
`Blocked by` and nothing else to decide whether it can start. **Numbers are identity, not order**: the edges
carry the order, which is what lets a ticket be appended without renumbering anything. `implement-ticket`
works the **frontier** — any ticket whose `Blocked by` entries have all cleared.

### Deferred tickets

A ticket that can't be scoped until something happens first gets a `brief.md` in its folder and **no**
`spec.md`. That absence is the only marker; nothing labels the task as a whole. A just-in-time `to-tickets`
run scopes it later, against the by-then-current code — writing its `spec.md` (or a fresh `brief.md` if it
still can't be scoped), and whatever else the spike revealed is **appended as new sibling tickets**, with
`Blocked by` edges retargeted to match. The structure stays flat — a ticket never contains tickets.

## Write-once, freeze-on-land, prune-on-land

Three rules keep the artifacts a *final statement of intent*, never a log of how they got there.

### The spec is write-once

`to-spec` runs **once** per task; there is no update or merge mode. The spec body — Functional Requirements,
Data & API, UI inventory — is **immutable**. The mutable artifacts are `progress.md` checkboxes,
`questions.md`, and — each until it freezes — the ticket specs, their leaf checkboxes included. A rare
genuine requirement change is a plain in-place edit: no superseding history, no
changelog. The spec is always the *final* statement, never a record of iterations.

A colleague's answer never mutates the spec into a history file. Fold the answer into `questions.md`, and
realise the change as a **new ticket** — or, if the affected ticket is not implemented yet, an edit to that
ticket. Not a rewrite of the spec.

### A ticket freezes when fully implemented

A ticket is editable until its **last leaf lands**; then it freezes, mirroring the spec one level down.
Before it freezes, a change is a plain edit to the ticket. After, a late answer that changes shipped
behaviour spawns a **new ticket**, never a rewrite.

### Functional Requirements are the acceptance contract

The spec's **Functional Requirements** are written as verifiable, feature-level statements, and they are
what the **whole-task review** checks at land time (`review-changes` reads the spec plus the diff). This is
why per-ticket acceptance criteria don't need to survive the ticket: the FR carry the contract for the task
as a whole.

### Disposability and pruning

At land, `finalize-task` prunes `tickets/`, `progress.md`, and `questions.md` — **only `spec.md` survives**
in the tree. The decomposition is preserved in git history (one commit per ticket), so nothing is lost:
precedent to browse is the accumulated specs; decomposition precedent is git history. Pruning runs
**before** the whole-task `review-changes` pass, which reads the spec and the diff via inline PR comments
and so needs no ticket files.

## What the spec holds, and what it doesn't

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
- **What-was-done lives in the PR.** Completion is the checked box; the diff is the record. A finding worth
  keeping goes to the ticket folder's `notes.md` (task-scoped evidence the PR can quote), or graduates to a
  `CONTEXT.md`, a rule, or the glossary if it's durable repo knowledge — never into the spec as a report.
