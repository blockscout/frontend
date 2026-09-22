# 13 — Home page latest-transaction widgets on mobile

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 13 of #3722 |
| Blocked by | none |

## What to build

The five home-page widgets that still render one row layout on mobile and another on desktop show the
desktop row on every viewport, scrolling horizontally the way the migrated tables do: `LatestTxs` and its
degraded twin `LatestTxsDegraded`, the watchlist tab `LatestWatchlistTxs`, `LatestZetaChainCCTXs`, and the
shared `LatestDeposits` behind the Optimism and Arbitrum deposit widgets. `LatestTxsItemMobile` and
`ZetaChainCCTXListItem` are deleted with them. One block style per widget, whatever the device.

This is a deliberate extension of the task: the spec's Out of scope excludes the home page's card
surfaces, and these widgets are half of that exclusion. The other half — latest blocks and
`LatestArbitrumL2Batches`, which differ only in row count — stays out.

## Acceptance criteria

How to verify: `pnpm dev:preset eth` / `optimism` / `arbitrum` / `zetachain`, open `/` at 375px

- [ ] Each of the five widgets renders one row component on every viewport inside `TableContainerScrollable`: no `base`/`lg` `display` split in `LatestTxs`, `LatestTxsDegraded`, `LatestWatchlistTxs` or `LatestZetaChainCCTXs`, and no `isMobile` layout branch in `LatestDeposits`' item.
- [ ] `LatestTxsItemMobile` and `ZetaChainCCTXListItem` are deleted and nothing imports them.
- [ ] `LatestTxsItem`'s `gridTemplateColumns` applies its `lg` value at `base`, so the row keeps its columns inside the scrollable container instead of collapsing to one.
- [ ] `LatestDeposits`' desktop grid carries a `minW` chosen from its columns; the two `truncation={ isMobile ? … }` ternaries in its item are gone.
- [ ] The per-widget row counts are unchanged: `2`/`5` for the transaction and deposit widgets, `3`/`8` for ZetaChain CCTXs.
- [ ] Playwright: the mobile-only `describe` in `LatestTxs.pw.tsx` and `LatestZetaChainCCTXs.pw.tsx` and the `+@mobile` tag on `LatestOptimisticDeposits.pw.tsx` and `LatestArbitrumDeposits.pw.tsx` are dropped with their `*mobile*` screenshots. `LatestArbitrumL2Batches.pw.tsx` keeps its tag.
- [ ] `Home.pw.tsx`'s `mobile` / `base view` baseline is regenerated through the Docker runner, not deleted — it covers the page's mobile layout, not the widget's row style.
- [ ] The remaining Playwright files of these widgets pass under `pnpm test:pw --docker`.
- [ ] `pnpm lint:tsc` and `pnpm lint:eslint:fix` pass.
- [ ] `(human)` At 375px on each preset the widget's row scrolls horizontally, the socket new-items notice and the "view all" link sit where they were, and nothing clips.

## Details

The fixed transform from the parent spec applies, with two differences that come from these widgets not
being tables:

- `LatestTxsItem` already carries the `minW` the transform asks for, but defines its grid only at the `lg`
  and `xl` breakpoints. Without a `base` value the row collapses to a single column at that `minW`.
- `LatestDeposits` has no `hideFrom` / `hideBelow` pair to unwrap. Its item picks a layout with
  `if (isMobile)` in JS, and its desktop grid has no `minW`, so one is chosen from its columns the way the
  table tickets chose theirs.

`LatestDepositsItem.tsx` is dead — `LatestDeposits.tsx` defines its own item inline — and is deleted here
rather than left for ticket 12's sweep.

Deleting `ZetaChainCCTXListItem` removes the last mobile-list row that ticket 12's sweep would otherwise
have to migrate, which is why `T13` is on that ticket's `Blocked by`.

`Q01` does not block this ticket — it is asked once the result is on a preview deployment, as one decision
covering the multichain and single-chain home pages together. An answer of "revert" is a new ticket.

The developer cleared the agent to run the Docker runner with `--update-snapshots` for this task;
reviewing the resulting diff stays with the developer.

## Leaf worklist

- [ ] 1 `[agent]` Convert the five widgets and delete `LatestTxsItemMobile`, `ZetaChainCCTXListItem` and the dead `LatestDepositsItem`
- [ ] 2 `[agent]` Prune the widgets' mobile Playwright coverage, regenerate the home mobile baseline in Docker, run the affected files
- [ ] 3 `[human]` Review the screenshot diff and check `/` at 375px on the four presets
