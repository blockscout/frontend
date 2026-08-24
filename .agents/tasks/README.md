# Product task specs

This directory holds one folder per specced product task. A task is worked through a spec-driven workflow —
grill, spec, break into tickets, implement, land — and its `spec.md` survives here as a permanent record.

Two companion docs carry the detail this spine points at: [`concepts.md`](concepts.md) for what the words
mean and the rules that hold the workflow together (the ticket model, write-once, prune-on-land), and
[`structure.md`](structure.md) for the task-folder layout and which skill owns which file.

## Why

Product issues often arrive thin (a title, a Figma link) — too thin to hand to an agent, and thin enough
that a developer fills the gaps with guesswork. The spec workflow fixes the input: an interview fills the
gaps, unanswerable questions get routed to the people who own the answers, and the resulting spec explicitly
says which steps an agent does and which a developer does by hand.

## Not every task needs a spec

A spec exists to **hand work to a session that wasn't in the room**. A task small enough to grill,
implement, and open as a PR inside one session never leaves the room, so it gets no folder here and its
reasoning goes into the PR description instead. The fork is a rough sizing judgment made at the end of
grilling — one session of work or not — no formal breakdown required to make the call.

## Lifecycle

Each step names the skill that runs it; the session model — what runs where, and why — is in
[`concepts.md`](concepts.md).

1. **Grill** — run `grill-the-task` with the issue URL.
2. **Spec** — `to-spec` writes `spec.md` and `questions.md`, then opens the draft PR.
3. **Break into tickets** — `to-tickets` runs with the spec and open questions as its input. It writes the
   ticket files and `progress.md`.
4. **Answers** — when colleagues reply, read the threads and fold each decision into `questions.md`. When an
   answer changes the work, realise it through `to-tickets` — a new sibling ticket, or an edit to the
   affected ticket if it isn't implemented yet, retargeting `Blocked by` edges.
5. **Implement** — run `implement-ticket <NN>` repeatedly, **one ticket per run**.
6. **Land** — `finalize-task` prunes `tickets/`, `progress.md`, and `questions.md` (only `spec.md` survives),
   then hands off to `create-pr` to push, write the real description, and flip the draft to ready for review.

## Supporting files

- [`concepts.md`](concepts.md) — the vocabulary, the ticket model, and the write-once / freeze / prune rules.
- [`structure.md`](structure.md) — the task-folder layout and the file-ownership table.
- [`../delegation.md`](../delegation.md) — the living capability boundary: what agents are trusted to do in
  this repo today, and what stays with a developer. It decides every `[agent]` / `[human]` tag. Loosen it
  via PR as the repo gets more agent-friendly, never per task.
- [`../TEAM.md`](../TEAM.md) — the team roster (members + Slack IDs); grilling picks one contact per team for
  the task and records the picks in the spec header.
- [`../adr/0002-layer-shaped-ticket-leaves.md`](../adr/0002-layer-shaped-ticket-leaves.md) — why a ticket
  cuts vertically while its leaves run along layers.
