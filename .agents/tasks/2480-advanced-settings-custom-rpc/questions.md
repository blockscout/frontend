# Open questions — Advanced site settings modal with a user-defined RPC node

### Q01 — Should the contract page indicate that a custom RPC node is active?

- Owner: PM (Ulyana)
- Status: `resolved`
- Resolved when: a yes/no on a contract-page indicator while a custom node is set; if yes, its placement
  (alerts row vs. elsewhere), whether it carries the node's connection status, and whether a mockup is
  needed.
- Slack: — (decided in person; the designer's earlier view is in
  https://blockscout.slack.com/archives/D03PDKKMLQH/p1792679332976659)
- Answer: yes, with mockups. Two indicators while a custom node is in use, both carrying the last ping
  status and opening the modal on the RPC tab: a plug icon in the top bar (FR16) and a "Custom RPC"
  pill in the contract methods alert row (FR17). 2026-10-28.

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

### Q06 — What the plug (connect / disconnect) button on the RPC tab does

- Owner: PM (Ulyana)
- Status: `resolved`
- Resolved when: the button's effect relative to Save is confirmed.
- Slack: — (decided in person)
- Answer: Save stores the URL and switches to it; the plug toggles whether the stored URL is in use
  without forgetting it ("disconnect" returns to the default node with the URL still in the field,
  "connect" switches back). The plug, the top-bar indicator and the contract pill exist only while a
  URL is saved (indicators: only while it is in use, a non-responding one included). A broken node is
  never disconnected automatically. Tag "Disconnected" = stored but not in use; "Not responding" for
  any dead node. 2026-10-28.
