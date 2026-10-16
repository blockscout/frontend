# T03 — baseline changes for the PR description

Full suite `pnpm test:pw --docker` on 2026-10-16: 871 passed, 17 skipped, 1 file failing by the unmocked
check (`EpochElectionRewards.pw.tsx`, fixed after), the rest screenshot diffs listed below. `Multisend.pw.tsx`
still times out, the pre-existing failure noted in T01. The 19 files below were regenerated with
`--update-snapshots` in Docker and re-run green (118 passed).

Every change is a screenshot that had captured an accidental state: a request that silently failed and
rendered a fallback. 64 baselines in 19 files.

## Rewards UI gone where the test never opted in (env switched off in `.env.pw`)

The Merits header button, the Merits navigation item, the "participation in the Merits program" line.

- `src/features/account/pages/profile/MyProfile.pw.tsx` (2)
- `src/features/marketplace/pages/dapp/MarketplaceApp.pw.tsx` (1)
- `src/features/multichain/pages/home/MultichainHome.pw.tsx` (2)
- `src/features/multichain/pages/search-results/SearchResults.pw.tsx` (2)
- `src/shell/header/Burger.pw.tsx` (1, auth view: the rewards item left the menu)
- `src/shell/navigation/horizontal/NavigationDesktop.pw.tsx` (5, promo banner cases)
- `src/slices/home/pages/index/Home.pw.tsx` (3: screen xl, degradation, error)

## A request that used to fail now answers

- `src/shell/footer/Footer.pw.tsx` (10) — the backend version line appears in the custom-links and
  indexing-alert cases.
- `src/features/rewards/pages/dashboard/RewardsDashboard.pw.tsx` (9) — streak badges, instances and
  activity-pass data render; the streak card shows "6 days" with the next achievement.
- `src/shell/page/actions-menu/ActionsMenu.pw.tsx` (2) — token-info items reflect the verified-addresses
  and token-info responses.
- `src/features/chain-variants/zeta-chain/pages/cctx-details/ZetaChainCCTX.pw.tsx` (6) and
  `.../cctx-index/ZetaChainCCTXsTab.pw.tsx` (2) — fiat value next to the fee; the transactions stats row.
- `src/features/advanced-filter/components/FilterByColumn.pw.tsx` (2) — the native token icon in the asset
  filter.
- `src/slices/address/pages/details/tokens/AddressTokens.pw.tsx` (7) — the ERC-20 token icon.
- `src/features/chain-variants/celo/pages/block/BlockDetailsBaseFeeCelo.pw.tsx` (2),
  `.../epoch-details/Epoch.pw.tsx` (2), `.../epoch-details/election-rewards/EpochElectionRewards.pw.tsx` (1)
  — the token icon.
- `src/slices/token/pages/details/TokenPageTitle.pw.tsx` (3) — the token icon.
- `src/slices/search/pages/search-results/SearchResults.pw.tsx` (2) — the token icon in the "with apps" and
  "block countdown with results" cases.
