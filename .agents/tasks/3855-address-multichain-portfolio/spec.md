# Multichain portfolio on the address page of a single-chain explorer

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3855 |
| Feature branch | `issue-3855` |
| PM | Nikita S. |
| Designer | Tatyana |
| Backend | Leonid |
| Demo | eth |

## Context & goal

The cross-chain portfolio (an address's assets and total value across all Blockscout-indexed chains)
exists only on the separate Multichain explorer, where few users find it. Goal: show the same portfolio on
the address page of a regular single-chain explorer, as an opt-in a chain enables by configuring the
multichain aggregator, and bring the address page's token views to one shape with the Multichain
explorer's.

## Functional requirements

**On every single-chain instance**

1. The address page's token tab keeps its ids: `tokens` for the tab, `tokens_erc20` and `tokens_nfts` for
   its sub-tabs. Existing links keep working.
2. The Tokens sub-tab's summary plate shows, for the current chain: total net worth, native-coin balance
   with its USD value, token count with its USD value, and a top-3 breakdown bar (two largest holdings by
   USD value plus "Others"). The native coin takes part in the breakdown. The token count covers fungible
   tokens only, so it matches the table below; NFTs are not counted, unlike today. The total's label reads
   the same as on the portfolio plate. The plate carries no ad banner and no multichain-button providers.
3. The fungible-tokens table has the Multichain explorer's columns: Asset, Price, Quantity, Value. The
   Asset cell holds the token, its contract address below it, and its type tag. There is no separate
   Contract address column.
4. The add-to-wallet control sits next to the contract address in the Asset cell, placed as in the tokens
   index table.
5. Filters, the NFT display-type switch and pagination render inside the sub-tab content, above the list,
   not in the sub-tab row. This holds for Tokens and NFTs.
6. The NFTs sub-tab has no summary plate and is otherwise unchanged.
7. Tokens and NFTs list the current chain only and have no network filter.

**When the multichain portfolio feature is enabled**

8. The tab's title is "Assets" instead of "Tokens".
9. A "Multichain portfolio" sub-tab, id `tokens_multichain`, comes first, before Tokens and NFTs. Opening
   the tab without a sub-tab id (`tab=tokens`) shows it.
10. The sub-tab shows what the Multichain explorer's portfolio tokens view shows: the net-worth plate with
    the top-3 breakdown, the multichain-button providers and the 320px ad banner slot; the per-chain value
    cards, which filter the list by chain; the search by token name or symbol; and the paginated token
    table.
11. It is shown for every address, contracts included.
12. In the portfolio table, a token on the current chain links inside the explorer; a token on another
    chain links to that chain's explorer. Rows carry no add-to-wallet control.
13. Links that mean "this chain's tokens" — the "view all" link of the token select on the Details tab and
    the Etherscan-style `#asset-tokens` redirect — open the Tokens sub-tab, not the portfolio.

**When the feature is disabled**

14. The tab is titled "Tokens", has the Tokens and NFTs sub-tabs only, and makes no request to the
    aggregator.

**Multichain explorer**

15. Its own address page behaves as before: same portfolio, same tab ids, no add-to-wallet control. It
    picks up the shared table and plate components without a visible change.

## Data & API

**Gating** — no new variable. The feature is on when `NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST` and
`NEXT_PUBLIC_MULTICHAIN_CLUSTER` are both set and `NEXT_PUBLIC_MULTICHAIN_ENABLED` is not `true`.

- Both variables are validated today only by the multichain schema; the default schema lets them through
  unchecked. Their rules move to a sub-schema both top-level schemas compose.
- `docs/ENVS.md` gets a "Multichain portfolio" feature section with no variable of its own and a
  dependencies table naming the two API variables. The Multichain Aggregator API section's description
  stops saying the API serves the Multichain explorer only.

**Aggregator** — production-deployed, no API change needed. Existing resources cover the sub-tab:
`multichainAggregator:address_portfolio` (total and per-chain values), `multichainAggregator:address_tokens`
(paginated; `chain_id`, `type`, `query`) and `multichainAggregator:address` (chains the address is known
on). The aggregator allows cross-origin requests from a chain explorer's origin.

**Cluster chains config** — the portfolio needs each cluster chain's name, logo, explorer URL and app
config (native token address, additional token types, token multiplier). The container entrypoint already
generates that file whenever the aggregator host is set, so a single-chain instance with the two variables
gets it without a deploy change.

**Tokens sub-tab plate** — core API only, as today: the address resource for the native balance and
exchange rate, the address tokens fetch for count, value and breakdown, fungible types only. It keeps today's overflow
behaviour when an address holds more tokens than the fetch returns.

**Demo** — the `eth` preset does not set the two aggregator variables; the demo needs them added, pointing
at the production aggregator and the `multichain` cluster.

## UI inventory

Route: `/address/[hash]`, tab `tokens`. No new route or navigation entry.

| Screen | Mockup |
| --- | --- |
| Assets → Multichain portfolio | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6330-3356 |
| Assets → Tokens | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6337-4418 |
| Assets → NFTs | https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6339-2653 |

- Mockups are desktop only.
- **Deliberate deviation**: the Tokens mockup still draws the old five-column table with a Contract address
  column. Build requirement 3 instead; the designer agreed the Multichain explorer's layout is the
  blueprint.
- The Multichain portfolio screen is the existing `MultichainAddressPortfolioTokens` view; port it, do not
  redraw it.
- The mockups' top-level "Activity" and "Internal txn" tabs belong to other tasks.

## Implementation decisions

- **Two features, one config file.** A new `multichain-portfolio` feature carries the flag and the
  single-chain wiring. The Multichain explorer feature stays as it is.
- **`multichainConfig()` keeps meaning "this is the Multichain explorer".** Many call sites outside the
  feature branch on it being defined: quick search, wallet chains, the chain menu, entity links, CSP,
  allowed API origins, server-side chain resolution. It must stay `undefined` on a single-chain instance.
- **Shared accessor.** The read of the generated cluster config (browser global or server file) moves to
  the shared external-chains module as `clusterConfig()`, with its Node.js half beside it. It returns a
  value whenever the file exists, knowing neither feature flag. `multichainConfig()` becomes a wrapper that
  returns it only when the Multichain explorer is enabled; its import path does not change. The startup
  script that preloads the config follows the move.
- **Portfolio components read the shared accessor directly**, so one implementation serves both the
  Multichain explorer's address page and the single-chain one. The new feature gets no accessor wrapper of
  its own.
- **Types stay put.** The cluster config types remain in the Multichain explorer feature for now; moving
  them to shared is https://github.com/blockscout/frontend/issues/3909.
- **Config script loading.** On a single-chain instance the cluster config script loads only where the
  portfolio renders, not on every page.
- **CSP.** With the feature on, a single-chain instance allows the aggregator host; it does not allow the
  other chains' API hosts.
- **One table, one plate.** The fungible-tokens table and the net-worth plate are shared between the
  portfolio and the Tokens sub-tab; add-to-wallet and the banner / providers are opt-in per use.
- **Analytics.** No new custom events.

## Out of scope

- Excluding individual chains from the portfolio per instance.
- Poor-reputation tokens inflating the portfolio total: an aggregator matter, tracked as Q01.
- A network filter on the Tokens and NFTs sub-tabs.
- The Multichain explorer's portfolio NFTs view on a single-chain instance.
- Moving the cluster config types to shared (#3909).
- Renaming or restructuring the address page's other top-level tabs.
