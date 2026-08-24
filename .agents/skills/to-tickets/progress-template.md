# Progress — <task title>

<!-- One checkbox per ticket, nothing else — no titles, edges, or content (those live in each ticket's
`spec.md`; edges and status are read from there and from this file's checks). A checked box means the ticket
LANDED: its commit exists, `Blocked by` edges read it to release dependents, and the last box checked is
what `finalize-task` acts on. `to-tickets` appends a line per ticket; `implement-ticket` checks the box at
commit time. Task status is derived from these boxes — see `.agents/tasks/structure.md`. -->

- [ ] 01 → `tickets/01-<slug>/`
- [ ] 02 → `tickets/02-<slug>/`
