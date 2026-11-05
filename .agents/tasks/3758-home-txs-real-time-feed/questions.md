# Open questions — Home page: transactions real-time feed toggle

### Q01 — Will the global transaction socket channel carry transaction objects, and how does the frontend detect that support on an instance?

- Owner: Backend (Victor)
- Status: `pending`
- Resolved when: (1) decision whether `transactions:new_transaction` will push full transaction objects
  (same shape as the per-address channel) and in which core API release; (2) whether it is configurable
  per instance; (3) if configurable, the signal the frontend reads to know support is present (config
  endpoint flag, channel join reply, or other).
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1791539492113039
- Answer: —
