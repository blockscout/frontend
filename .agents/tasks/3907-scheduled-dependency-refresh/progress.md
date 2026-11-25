# Progress — Set up scheduled dependency refreshes and the checks that make them safe to merge

<!-- One checkbox per ticket, nothing else — no titles, edges, or content (those live in each ticket's
`spec.md`; edges and status are read from there and from this file's checks). A checked box means the ticket
LANDED: its commit exists, `Blocked by` edges read it to release dependents, and the last box checked is
what `finalize-task` acts on. `to-tickets` appends a line per ticket; `implement-ticket` checks the box at
commit time. Task status is derived from these boxes — see `.agents/tasks/structure.md`. -->

- [x] 01 → `tickets/01-dependency-checks-workflow/`
- [x] 02 → `tickets/02-smoke-set-pages/`
- [x] 03 → `tickets/03-smoke-set-wallet-analytics/`
- [x] 04 → `tickets/04-build-and-smoke-job/`
- [ ] 05 → `tickets/05-renovate-config/`
- [x] 06 → `tickets/06-lockfile-refresh/`
- [x] 07 → `tickets/07-residual-alerts/`
- [x] 08 → `tickets/08-audit-step/`
- [ ] 09 → `tickets/09-triage-routine-doc/`
- [x] 10 → `tickets/10-opentelemetry-latest-2x/`
