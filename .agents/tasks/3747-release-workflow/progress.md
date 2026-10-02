# Progress — Redesign the release workflow around labeled PRs and traceable backports

<!-- One checkbox per ticket, nothing else — no titles, edges, or content (those live in each ticket's
`spec.md`; edges and status are read from there and from this file's checks). A checked box means the ticket
LANDED: its commit exists, `Blocked by` edges read it to release dependents, and the last box checked is
what `finalize-task` acts on. `to-tickets` appends a line per ticket; `implement-ticket` checks the box at
commit time. Task status is derived from these boxes — see `.agents/tasks/structure.md`. -->

- [x] 01 → `tickets/01-release-tool-check-pr/`
- [x] 02 → `tickets/02-label-command-workflows/`
- [x] 03 → `tickets/03-notes-command/`
- [x] 04 → `tickets/04-check-tag-ci-gates/`
- [x] 05 → `tickets/05-prepare-alpha/`
- [x] 06 → `tickets/06-pick-step/`
- [x] 07 → `tickets/07-releasing-doc/`
- [ ] 08 → `tickets/08-release-skill/`
- [x] 09 → `tickets/09-publish/`
