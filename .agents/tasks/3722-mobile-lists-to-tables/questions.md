# Open questions — Replace the remaining mobile list views with table views

### Q01 — Do the home page's latest-transaction widgets keep their desktop rows on mobile?

- Owner: Designer (Tatyana)
- Status: `pending`
- Resolved when: the designer has seen the converted widgets on a preview deployment at mobile width
  and states either (a) keep them, or (b) revert to the stacked layout — and, if (b), whether that
  covers every widget or only some.
- Slack: <to be sent once the migration has landed and a preview deployment exists>
- Answer:

<!-- One decision for both the multichain and the single-chain home page. It covers the cross-chain
transactions widget converted in ticket 11 and the five viewport-branching widgets converted in ticket
13 — latest transactions and its degraded twin, the watchlist tab, ZetaChain CCTXs, and the shared
rollup deposits widget.

Asked deliberately late: the preliminary read is that converting them is fine, but the decision needs
the running widgets, so the question is raised only once the migration is complete and deployed. Each
of the two tickets is a commit of its own, so (b) is a revert rather than an edit, and the shared
mobile-list primitives are deleted regardless of the answer. -->
