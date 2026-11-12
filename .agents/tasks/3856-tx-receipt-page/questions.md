# Open questions — Transaction receipt page

### Q01 — Which analytics click events does the receipt send?

- Owner: PM (Nikita S.)
- Status: `resolved`
- Resolved when: the reply confirms the proposed set (the `Receipt` click on both entry points, the
  `Transaction details` click and the copy-link click on the receipt) or names the events to send instead.
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1794470631480739
- Answer: the proposed four click events are enough (2026-11-12)

### Q02 — What do the fallback cards look like?

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: Figma has a frame for the `Call` card and one for the "Sent {value} {native coin}" card,
  or the reply says to derive both from an existing card and names which.
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1794470729609139
- Answer: `Call` card per Figma node `6297-3202`; the "Sent" card uses the Transfer template without a
  token icon; an unnamed method shows as the API returns it (2026-11-12)

### Q03 — What do the Date and Time rows show for a pending transaction?

- Owner: Designer (Tatyana)
- Status: `resolved`
- Resolved when: the reply picks one: hide both rows, or keep them with a placeholder (and names the
  placeholder).
- Slack: https://blockscout.slack.com/archives/D03PDKKMLQH/p1794470729609139
- Answer: both rows show a dash (2026-11-12)
