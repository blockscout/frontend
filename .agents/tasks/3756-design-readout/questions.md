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
