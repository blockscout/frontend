# Open questions — Multichain portfolio on the address page of a single-chain explorer

### Q01 — Does the reputation filter affect the portfolio total, and can the aggregator take a chain explorer's address-page traffic?

- Owner: Microservices API (Leonid)
- Status: `pending`
- Resolved when: the reply says (1) whether a total unchanged by `include_poor_reputation_tokens` is
  expected or a defect, and what happens next if a defect; (2) whether the aggregator can serve portfolio
  and token-list requests from a high-traffic chain explorer as is, or what must be prepared first.
- Slack: https://blockscout.slack.com/archives/D07QVFJ4ZE3/p1795085858134579
- Answer:

Does not block implementation; it gates enabling the feature on a production instance.
