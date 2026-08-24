---
name: to-tickets
description: >-
  Break a product-task spec into a set of tracer-bullet tickets, each declaring its blocking edges.
disable-model-invocation: true
---

# To tickets

Break a spec into a set of tickets: tracer-bullet vertical slices, each declaring the tickets that block it.
Its input is the **spec** and **open questions**.

The ticket model is defined in [`../../tasks/concepts.md`](../../tasks/concepts.md). Layout and file ownership 
are in [`../../tasks/structure.md`](../../tasks/structure.md). This skill carries the steps only.

**Feasibility is the forcing function.** Every gap you hit here — a requirement the spec never pinned, an
executor question the spec can't answer — is a gap that spec should have closed. Ask the developer to fill it
and note it, rather than guessing.

## Step 1 — Load

Resolve the task folder from the issue number or the branch (`issue-<number>`), and read its `spec.md`, 
`questions.md` and `.agents/delegation.md`.

## Step 2 — Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect CONTEXT.md in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

## Step 3 — Draft slices

Break the work into tracer bullet tickets.
- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests) — a vertical slice.
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

Give each ticket its `Blocked by` edges — the blockers that must clear before it can start, each prefixed by
kind: `T<NN>` for a ticket that must complete first, `Q<NN>` for an open question that must be answered
first. A ticket with no blockers can start immediately.

**Defer what can't be scoped.** A ticket blocked on a prototype, a spike, or an answer nobody has yet gets a `brief.md` and no `spec.md`; a later `to-tickets` run scopes it — writing its `spec.md`, or a fresh `brief.md` if it still can't be scoped.

## Step 4 — Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:
- Title: short descriptive name
- Blocked by: which other tickets (if any) must complete first
- What it delivers: the end-to-end behaviour this ticket makes work

Ask the user:
- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on the tickets and questions that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

## Step 5 — Front-load the executor inputs

For every `[agent]` leaf that runs a project skill (`add-new-page`, `add-api-resource`, `add-env-var`, …),
**open that skill and run its user-facing interview now**, against the spec — from the skill's current text,
not from memory of its questions (e.g. `add-new-page` Step 0). Record the answers in the ticket's **Skill
inputs** section, grouped by skill. Where the spec answers a question, take the answer from it and move on;
where it has a genuine gap, ask the developer. This is what lets the later `implement-ticket` run go
uninterrupted.

## Step 6 — Write the files

Per approved ticket, write `tickets/NN-<slug>/spec.md` from [`ticket-template.md`](ticket-template.md) — What
to build, Acceptance criteria (tagging `(human)` per the ticket model), the Skill inputs from Step 5, the
Leaf worklist with each leaf tagged `[agent]` / `[human]` per `.agents/delegation.md`, and the header's
`Blocked by` edges (`T<NN>` / `Q<NN>`). A ticket that can't be scoped gets a `brief.md` instead — its goal,
the known context, and the blocking unknowns with their owners.

Create (or append to) `progress.md` from [`progress-template.md`](progress-template.md) — one checkbox line
per ticket. When scoping a deferred ticket, **append** its siblings and retarget the `Blocked by` edges that
pointed at the deferred one; never renumber, never nest.
