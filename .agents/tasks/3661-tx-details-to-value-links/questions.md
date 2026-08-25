# Open questions — UI/UX changes: tx details page ("to" & "value")

### Q01 — Token-transfer "View all": restyle only, or per-section max-5 cap?

- Owner: Designer (Tatyana)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1787675406240359
- Answer: Restyle the link only (remove icon, new style); keep the current show-logic and Token-transfers-tab
  target. The per-section max-5 cap is dropped — it would need a backend change to the embedded-list/overflow
  contract. (2026-08-25)

### Q02 — "To" recipient list: switch threshold and per-row metadata

- Owner: PM (Nikita S.)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1787675672358129
- Answer: _Interim decision, pending Nikita's confirmation (2026-08-25):_ show the recipient list only when
  there is more than one recipient — if all calls hit a single address equal to top-level `to`, keep the
  regular single-address "To". First row keeps its full metadata; recipients 2+ render as bare hash only
  (identicon + hash + copy), since `calls[].to` carries no metadata. Revisit if Nikita asks for richer rows.
