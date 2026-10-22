# Open questions — Advanced site settings modal with a user-defined RPC node

### Q01 — Should the contract page indicate that a custom RPC node is active?

- Owner: PM (Ulyana)
- Status: `pending`
- Resolved when: a yes/no on a contract-page indicator while a custom node is set; if yes, its placement
  (alerts row vs. elsewhere), whether it carries the node's connection status, and whether a mockup is
  needed.
- Slack: — (developer discusses with the PMs in person; the designer's view is in
  https://blockscout.slack.com/archives/D03PDKKMLQH/p1792679332976659 — the modal's connected state is
  enough, no separate alert). Argument for the alert: with no post-save verification (FR8), a
  wrong-chain node is otherwise visible only on the next RPC-tab visit.
- Answer: —

### Q02 — Time format tab content

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: the controls the tab holds are named.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1792678732622049
- Answer: "Local time" switch + relative / absolute selector. 2026-10-22.

### Q03 — Which popover controls move into the modal, and where

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: for each of scam, poor-reputation, address-format, local-time: stays or moves, and
  the destination tab.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1792678732622049
- Answer: popover keeps theme, identicon, link only. Scam + poor-reputation → Scam tokens tab;
  address format → Appearance next to identicon; local time → Time format tab. 2026-10-22.

### Q04 — RPC node error states without a mockup (unreachable, wrong chain, stale node)

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: the visual treatment for the three states is confirmed.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1792678732622049
- Answer: all three reuse the existing "Invalid format" error state (red field, red plug, message under
  the field). 2026-10-22.

### Q05 — Copy changes (tab description, helper, contract alert, scam description)

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: the proposed strings are accepted or replaced.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1792678732622049
- Answer: accepted; developer may edit freely as long as the copy stays short and on-message.
  2026-10-22.
