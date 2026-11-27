# Brief — Multichain net worth on the Details tab, and the net-worth plate's spacing

Deferred only because it arrived through the inbox after tickets 01–07 landed. Nothing blocks scoping it;
the developer asked for one ticket covering both parts.

## Goal

1. Build FR 14 and the Details half of FR 15: the "Multichain net worth" row on the address Details tab.
2. Take the shared net-worth plate to the amended mockups, on the Multichain portfolio sub-tab, the Tokens
   sub-tab and the Multichain explorer (FR 16).

## Known context

**Details tab** — mockup https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6435-6649

- The new row sits directly below "Net worth" and holds the total across all chains, then the
  multichain-button providers.
- With the feature on, the providers leave the "Net worth" row, which keeps the current chain's value.
  With the feature off, the Details tab is as today.
- The total comes from `multichainAggregator:address_portfolio`, the resource the Multichain portfolio
  sub-tab already reads. No aggregator request when the feature is off.
- Shown for every address, contracts included; the mockup draws a contract.

**Plate** — mockups https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6435-4620 (Multichain
portfolio) and https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6363-10621 (Tokens)

- A horizontal divider separates the summary row from the breakdown row.
- Tokens: vertical dividers separate net worth, native balance and tokens in the summary row.
- Multichain portfolio: the provider buttons follow the value with no vertical divider between them.
- Gaps between elements follow the mockups.
- The Multichain portfolio node draws no ad banner; the banner slot of FR 10 stays.
- One shared plate serves all three places, so the Multichain explorer's plate changes with it.

## Blocking unknowns

None.
