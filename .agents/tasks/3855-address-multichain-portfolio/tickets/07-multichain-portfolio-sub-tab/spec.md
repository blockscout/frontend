# 07 — Multichain portfolio sub-tab on the single-chain address page

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 07 of #3855 |
| Blocked by | T01, T02, T03, T06 |

## What to build

With the `multichain-portfolio` feature on, the address page's token tab is titled "Assets" and gains a
"Multichain portfolio" sub-tab, id `tokens_multichain`, first in the row and shown when the tab opens
without a sub-tab id. It shows what the Multichain explorer's portfolio tokens view shows — net-worth plate
with breakdown, providers and the banner slot, per-chain value cards that filter the list, search, the
paginated table — for every address, contracts included. Tokens on the current chain link inside the
explorer, tokens on other chains to their chain's explorer; rows have no add-to-wallet. Links that mean
"this chain's tokens" open the Tokens sub-tab. With the feature off, nothing changes and the aggregator is
never called (FR1, FR8–FR14).

## Acceptance criteria

How to verify: `pnpm dev:preset eth` (the feature is on through `.env.extra`), open `/address/<hash>?tab=tokens`
for an EOA and for a contract; then empty the two variables and reopen

- [ ] `.env.extra` sets `NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST` to the production aggregator and
      `NEXT_PUBLIC_MULTICHAIN_CLUSTER=multichain`; this serves local checks and the `eth` demo.
- [ ] Feature on: tab title "Assets"; sub-tabs Multichain portfolio, Tokens, NFTs in that order; `tab=tokens`
      shows the portfolio; `tokens`, `tokens_erc20`, `tokens_nfts` keep working.
- [ ] Feature off: title "Tokens", sub-tabs Tokens and NFTs only, `tab=tokens` shows Tokens, no request to
      the aggregator and no cluster config script — covered by a unit test.
- [ ] The portfolio view is the one implementation the Multichain explorer uses, not a copy; it reads
      `clusterConfig()` and the `multichainAggregator:address_portfolio`, `:address_tokens` and `:address`
      resources.
- [ ] The cluster config script loads on a single-chain instance only where the portfolio renders, not on
      every page; the portfolio waits for it rather than rendering without chains.
- [ ] Portfolio rows: current-chain token → internal link; other-chain token → that chain's explorer; no
      add-to-wallet. Unit-tested.
- [ ] The token select's "view all" link and the `#asset-tokens` redirect open `tokens_erc20`; unit-tested
      for the redirect.
- [ ] `multichainConfig()` is still `undefined` on the single-chain instance: quick search, wallet chains,
      chain menu and entity links elsewhere are unaffected.
- [ ] The Multichain explorer's address page keeps its `portfolio_*` tab ids and look (FR15); its visual
      suites pass against current baselines.
- [ ] `(human)` On `eth` with the feature on: the portfolio loads for an EOA and a contract; chain cards
      filter; search and pagination work; links go where the criterion above says; no CSP violation in the
      console.
- [ ] `(human)` With the feature off the tab is as before, with no aggregator call in the network panel.
- [ ] `(human)` The Multichain portfolio sub-tab matches the mockup at every breakpoint.

## Details

- Spec → "Data & API" (Aggregator, Cluster chains config, Demo) and "Implementation decisions" (Config
  script loading, CSP, Portfolio components read the shared accessor directly, Analytics: no new events).
- Port `MultichainAddressPortfolioTokens`, do not redraw it. It takes the aggregator's address response for
  the chains the address is known on; on a single-chain page that query has to be made by the sub-tab.
- Chain filter state uses the `chain_id` query param in the Multichain explorer; it belongs to the portfolio
  sub-tab only — Tokens and NFTs have no network filter (FR7).
- The production aggregator host is the one the `multichain` preset's instance uses; read it with
  `tools/dev-server/fetch.sh multichain`, do not guess it.
- `.env.extra` is committed and layered over the fetched preset for the dev server and the review deploy
  (`tools/dev-server/CONTEXT.md`); the spec's `Demo` row (`eth`) is deployed by `finalize-task`, so the demo
  needs no ticket of its own.
- `_document.tsx` loads the config script on every page for the Multichain explorer; that stays.
- `Address.tsx` lists the token tab's sub-tab ids in `TOKEN_TABS`; `tokens_multichain` joins them only when
  the feature is on.
- Q01 gates enabling the feature on a production instance, not this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Add the aggregator variables to `.env.extra`
- [ ] 2 `[agent]` Load the cluster config on demand on a single-chain instance and expose its readiness to the portfolio
- [ ] 3 `[agent]` Make the portfolio tokens view usable on the single-chain address page: own address query, current-chain links, no add-to-wallet
- [ ] 4 `[agent]` Wire the sub-tab into the address page: "Assets" title, `tokens_multichain` first and default, feature-off path untouched
- [ ] 5 `[agent]` Point the token select's "view all" link and the `#asset-tokens` redirect at `tokens_erc20`
- [ ] 6 `[agent]` Unit tests: feature on/off tab set, no aggregator request when off, link targets, redirect
- [ ] 7 `[agent]` Style the Multichain portfolio sub-tab to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6330-3356)
- [ ] 8 `[human]` Regenerate and review any affected screenshot baselines
