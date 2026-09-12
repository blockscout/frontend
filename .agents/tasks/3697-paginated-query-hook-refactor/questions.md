# Open questions — Stop redundant requests and skeleton cycles in paginated list navigation

### Q01 — Visual treatment of the page-transition state

Page changes will keep the current rows on screen, dimmed and non-interactive, until the next
page arrives, instead of a skeleton pass. What should that state look like?

- Owner: Designer (Tatyana), with PM (Ulyana) confirming the behaviour change
- Status: `pending`
- Resolved when: (1) the dimmed treatment is specified — opacity value or token, whether a
  fade transition is used and its duration; (2) confirmation that skeletons stay for first load and
  filter/sort changes only; (3) confirmation that the sticky header and sort buttons remain active
  during the transition.
- Slack: —
- Answer: —
