# Open questions — Replace the remaining mobile list views with table views

### Q01 — Does the home page's latest cross-chain transactions widget keep the table on mobile?

- Owner: Designer (Tatyana)
- Status: `pending`
- Resolved when: the designer has seen the converted widget on a preview deployment at mobile width
  and states either (a) keep it, or (b) revert to the list layout for this widget only — and, if (b),
  whether any other home-page widget treatment changes as a result.
- Slack: <to be sent once the migration has landed and a preview deployment exists>
- Answer:

<!-- Asked deliberately late: the preliminary read is that converting it is fine, but the decision
needs the running widget, so the question is raised only once the migration is complete and deployed.
The widget is converted in its own commit so that (b) is a single revert; the list item's container
is inlined either way, so the shared mobile-list primitives are deleted regardless of the answer. -->
