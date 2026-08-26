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
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1787675672358129
- Answer: Confirmed by Nikita (2026-08-26). Show the recipient list only when there is **more than one
  _unique_ recipient** — recipients are de-duplicated by address, so a batch whose calls all hit the same
  address keeps the regular single-address "To". First row keeps its full metadata; recipients 2+ render as
  bare hash only (identicon + hash + copy), since `calls[].to` carries no metadata. The recipient count `N`
  (used by "View all (N)" and the "Value" "N recipients" link) is the number of **distinct** addresses.
