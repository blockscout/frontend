# Open questions — Scope every interchain request to the deployment's slice of a shared indexer

### Q01 — Should an Avalanche-ecosystem instance show its messages to *unindexed* L1s?

- Owner: Frontend (tom) — product decision, punted here by Evgenii and taken to the product sync
- Status: `resolved`
- Resolved when: (a) yes/no for whether such messages are shown on an Avalanche L1 explorer;
  (b) if yes, whether the incomplete row is visually marked and what its non-advancing status reads;
  (c) which deployments therefore set `NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS=true`
- Slack: https://blockscout.slack.com/archives/C0A7SALNLPL/p1788283150728399 (asked as items 3 and 4;
  answered as "product question, no definite answer" and settled at the sync below)
- Answer: **No — such messages are not shown, and no deployment enables the flag** (product sync,
  2026-09-02). Interop is meant to run between Blockscout-indexed chains; Avalanche is the exception that
  motivated the flag, but Numine has no such messages in reality. The env stays as an escape hatch with
  `default false`. No UI marking is needed, so nothing was designed. Making an extra Avalanche chain
  "known" is an `interchain-indexer` config change, not an explorer one.

### Q02 — Keep a client-side redirect from the old `/cross-chain-tx/[id]`?

- Owner: Frontend (tom)
- Status: `resolved`
- Resolved when: yes/no on keeping a redirect page that does one unqualified lookup, reads `bridge.id`
  and replaces the URL with the qualified route
- Slack: — (internal decision, settled at the product sync)
- Answer: **No redirect** (2026-09-02). The predecessor explorers never had a single-message page, so
  there is nothing to stay compatible with; the only redirect configured for this area targets the
  *list* page from gnosisscan and lives in devops config, unaffected by this change.

### Q03 — Which `interchain-indexer` release ships `bridge_ids` on `/interchain/chains`?

- Owner: Microservices API (Evgenii)
- Status: `pending`
- Resolved when: (a) the release/version that adds `bridge_ids` to `GET /api/v1/interchain/chains`;
  (b) whether it is deployed to the shared mainnet and testnet instances; (c) confirmation that
  `has_unindexed_chain` and `BridgeInfo.id` become non-optional and that chain ids are serialized as
  strings consistently, and in which version
- Slack: https://blockscout.slack.com/archives/C0A7SALNLPL/p1788346383623139
- Answer: —

<!-- `BridgeInfo.id` was added to (c) after the ticket breakdown: it is `id?: number` in 1.8.1 although the
service always sends it, and the message-details route now needs it to build a link. Asked in
https://blockscout.slack.com/archives/C0A7SALNLPL/p1788371318691139. Until it is required, a row without
it renders unlinked.

Evgenii agreed to all three in
https://blockscout.slack.com/archives/C0A7SALNLPL/p1788335960248239 ("Принято, поставлю в работу") — this
question only tracks the version and its deployment.

**Does not block the task.** The work proceeds against the service as it stands today and is adjusted
once the version ships. The one consequence to accept in the meantime: `/interchain/chains` takes no
bridge scope yet, so the counterparty selector lists the union of chains across all bridges (today
`1, 100, 8021, 43114`) and Gnosis offers Avalanche chains as counterparties until the param exists.
Note this fixes cross-bridge leakage only — a chain configured on the deployment's *own* bridge but with
no messages still appears; see the matching entry in the spec's "Out of scope".

Deliberately *not* part of this question: adding `home_chain_id` to `/stats/chains` and
`/interchain/chains`. `bridge_ids` is the agreed scope for both (2026-09-02 sync). -->
