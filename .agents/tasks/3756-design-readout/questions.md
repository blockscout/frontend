# Open questions — Design readout (phase 1)

### Q01 — Which ~10 shipped table row components, and their Figma nodes, seed the calibration set?

- Owner: Frontend (tom)
- Status: `resolved`
- Resolved when: a list of about ten `*TableItem.tsx` components, one per entity family (address, tx,
  block, token, NFT, batch, L1/L2, interchain, external), each with the Figma node URL of its row; the five
  already-calibrated nodes are included as-is.
- Slack: — (developer-held; no outreach needed)
- Answer: (all ten verified through the REST nodes endpoint on 2026-10-08; entries inside a component instance carry the nested `I<instance>;<internal>` id, which the URL parser and `--regions` / `--correct` must accept before the set is seeded; a plain pair is a node placed directly on the page)
    1. src/features/name-services/domains/pages/index/NameDomainsTableItem.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%F0%9F%96%A5%EF%B8%8F-Blockscout-desktop-pages?node-id=13828-42285&t=UXMWov7fkUnqatDj-4 - Node 13828:42285
    2. src/slices/address/pages/details/info/AddressNetWorth.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%F0%9F%96%A5%EF%B8%8F-Blockscout-desktop-pages?node-id=21998-159259&m=dev - Node I21998:159259;20539:210205;20534:197023
    3. src/slices/tx/pages/index/list/TxsTableItem.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=21998-143467&t=UXMWov7fkUnqatDj-11 - Node I21998:143467;20539:206951
    4. src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgetCard.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=21998-159259&t=UXMWov7fkUnqatDj-11 - Node I21998:159259;20539:210205;27896:45000;27896:44423
    5. src/slices/block/pages/index/BlocksTableItem.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=28972-117729&t=UXMWov7fkUnqatDj-11 - Node 28972:117729
    6. src/shared/detailed-info/DetailedInfoTimestamp.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=29024-135150&t=UXMWov7fkUnqatDj-11 - Node I29024:135150;28406:92845;17439:63824
    7. src/features/rollup/optimism/pages/withdrawals/OptimisticL2WithdrawalsTableItem.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=29167-7007&t=UXMWov7fkUnqatDj-11 - Node 29167:7007
    8. src/features/user-ops/pages/index/UserOpsTableItem.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=25201-111693&t=UXMWov7fkUnqatDj-11 - Node I25201:111693;24311:103865;24311:87534
    9. src/features/gas-tracker/components/GasTrackerPrices.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=22842-177328&t=UXMWov7fkUnqatDj-11 - Node 22842:177328
    10. src/features/hot-contracts/pages/index/HotContractsTableItem.tsx - https://www.figma.com/design/ErLH8qySSkpprB87H0onWw/%25F0%259F%2596%25A5%25EF%25B8%258F-Blockscout-desktop-pages?node-id=29131-74920&t=UXMWov7fkUnqatDj-11 - Node 29131:74920

### Q02 — Loosen the markup line in `delegation.md` inside this task, or wait for the gap log?

- Owner: Frontend (tom)
- Status: `resolved`
- Resolved when: a yes/no on moving "final markup and styling to match the designer's Figma mockups" to
  "Agents may do today" within this task — with a mandatory `(human)` criterion on every ticket carrying a
  style leaf, and visual polish / design sign-off staying human — and, if yes, the spec's Out of scope
  amended accordingly and ticket 11 cut (`delegation.md`, `concepts.md` ticket model, `ticket-template.md`,
  `to-tickets` Step 6, `implement-ticket` hand-off timing, `grill-the-task` wording); if no, a follow-up
  issue filed once the gap log holds entries from real markup leaves.
- Slack: — (developer-held; no outreach needed)
- Answer: Yes, now, with no re-tighten condition written into `delegation.md` (the doc instructs agents;
  tightening it again is the developer's call if the leaves go wrong). Settled in session on 2026-10-09:
    - The readout is a supporting input, not a required one. The style leaf is `[agent]` unconditionally,
      with a mandatory `(human)` "matches the mockup" criterion; the developer always verifies in the
      running app. Without a readout the agent runs the tool itself for values and a sidecar, and may read
      the Figma MCP design context on that path only. Every style leaf covers all breakpoints: the mobile
      node when linked, otherwise the desktop layout adapted the way neighbouring views do.
    - Corrections are the developer's own edits, not dictation: the agent stages its markup at hand-off
      and prints its `git write-tree` hash; the developer fixes unstaged; on "record my corrections" a
      subagent diffs the working tree against the hash, records node-mapped misses through `--correct` /
      `--override` and the rest through a new `--note … --gap markup`; `gaps.md` gains a stage column
      (readout / markup).
    - The readout moves out of grilling into an optional developer-run step between `to-spec` and
      `to-tickets`, URL optional (every spec link without a block yet); the skill writes
      `design-readout.md` and the designer questions into `questions.md` itself; `grill-the-task` goes
      back to enumerating links and asks for the nav icon per new route. A no-spec small task gets no
      readout.
    - Dropped: the `TODO (design):` marker convention (sent-on items are tracked by `Blocked by Q<NN>`
      alone), the `implement-ticket` `lastModified` re-run gate (the tool keeps its diff), and the
      "choosing nav/sprite icons" humans-only line. Kept: `TODO (api-data):` (it is `add-new-page`'s own
      phase marker), human-run Playwright baselines, design sign-off and visual polish as human, no
      review axis against the readout.
    - Realised as tickets 13 (readout as a post-spec step) and 12 (delegation loosening, blocked by T13);
      the spec's Out of scope is amended.
