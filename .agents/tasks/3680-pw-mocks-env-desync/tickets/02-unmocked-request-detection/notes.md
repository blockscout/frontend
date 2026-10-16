# T02 audit — unmocked `localhost` requests under `--strict-mocks`

Input for T03. One full-suite run: `pnpm test:pw --docker --strict-mocks` on 2026-10-16, 32 min.

| | |
| --- | --- |
| Passed | 336 |
| Failed by the unmocked-request check | 536 tests in 183 files (588 results: some files fail in several projects) |
| Failed for another reason | 1 — `Multisend.pw.tsx` base view, the pre-existing timeout noted in T01 |
| Skipped | 34 |

## Read this first

527 of the 536 failing tests fail **only** on `http://localhost:3009/api/v1/config`, the `rewards:config`
resource. `RewardsContextProvider` (`src/features/rewards/context.tsx`) requests it, `playwright/TestApp.tsx`
mounts that provider for every test, and `.env.pw` enables the feature
(`NEXT_PUBLIC_REWARDS_SERVICE_API_HOST=http://localhost:3009`). That is one global source, not 527 per-test
gaps: answer it once in the shared setup (`playwright/lib.ts` `beforeEach`, next to `mockTextAd`) or in the
`render` fixture, and the list below shrinks to the 29 files of the second table.

## Unmocked URLs by test count

Port map from `.env.pw`: 3003 = `NEXT_PUBLIC_API_PORT`, 3009 = rewards service, 3000 = app host,
4003 = the API port of a `mockEnvs`-overridden instance, 3004 / 3007 / 3008 = stats, metadata and
address-lookup services.

| Tests | URL (query dropped) |
| --- | --- |
| 527 | `localhost:3009/api/v1/config` |
| 21 | `localhost:3003/api/v2/stats` |
| 10 | `localhost:3009/api/v1/user/badges` |
| 8 | `localhost:3000/token-icon.png` |
| 8 | `localhost:3003/api/v2/config/backend-version` |
| 7 | `localhost:3003/api/v2/search/check-redirect` |
| 5 | `localhost:3003/api/v2/config/csv-export` |
| 5 | `localhost:3003/api/v2/main-page/indexing-status` |
| 4 | `localhost:3009/api/v1/instances` |
| 4 | `localhost:3009/api/v1/activity/check-pass` |
| 4 | `localhost:3009/api/v1/user/referrals` |
| 4 | `localhost:3003/api/account/v2/user/info` |
| 3 | `localhost:4003/api/v2/addresses/` |
| 3 | `localhost:4003/api/v2/stats` |
| 2 | `localhost:3003/api/v2/addresses/0x6a1041865b76d1dc33da0257582591227c57832c` |
| 2 | `localhost:4003/api/v2/config/csv-export` |
| 2 | `localhost:3007/api/v1/metadata` |
| 2 | `localhost:3008/api/v1/addresses:lookup` |
| 1 | `localhost:3003/api/v2/tokens` |
| 1 | `localhost:3004/api/v1/pages/transactions` |
| 1 | `localhost:3009/api/v1/user/activity/rewards` |
| 1 | `localhost:3009/api/v1/user/balances` |
| 1 | `localhost:3009/api/v1/user/daily/check` |
| 1 | `localhost:3003/api/v2/transactions/0x715fe1474ac7bea3d6f4a03b1c5b6d626675fb0b103be29f849af65e9f1f9c6a` |
| 1 | `localhost:3007/api/v1/addresses:submit` |

## Files with an unmocked request other than `rewards:config`

Every file here also fires `localhost:3009/api/v1/config`; that entry is omitted.

| File | Other unmocked URLs |
| --- | --- |
| `src/features/advanced-filter/components/FilterByColumn.pw.tsx` | `localhost:3003/api/v2/tokens` |
| `src/features/advanced-filter/pages/index/AdvancedFilter.pw.tsx` | `localhost:3003/api/v2/config/csv-export` |
| `src/features/chain-variants/celo/pages/block/BlockDetailsBaseFeeCelo.pw.tsx` | `localhost:3000/token-icon.png` |
| `src/features/chain-variants/celo/pages/epoch-details/Epoch.pw.tsx` | `localhost:3000/token-icon.png` |
| `src/features/chain-variants/zeta-chain/pages/cctx-details/ZetaChainCCTX.pw.tsx` | `localhost:3003/api/v2/stats` |
| `src/features/chain-variants/zeta-chain/pages/cctx-index/ZetaChainCCTXsTab.pw.tsx` | `localhost:3004/api/v1/pages/transactions` |
| `src/features/chain-variants/zilliqa/pages/validator-details/ValidatorDetails.pw.tsx` | `localhost:3003/api/v2/stats` |
| `src/features/dex-pools/pages/details/Pool.pw.tsx` | `localhost:3003/api/v2/addresses/0x6a1041865b76d1dc33da0257582591227c57832c` |
| `src/features/marketplace/pages/essential-dapp/revoke/Revoke.pw.tsx` | `localhost:4003/api/v2/addresses/`, `localhost:4003/api/v2/stats` |
| `src/features/multichain/pages/address/MultichainAddressTokenTransfers.pw.tsx` | `localhost:4003/api/v2/config/csv-export` |
| `src/features/multichain/pages/address/MultichainAddressTxs.pw.tsx` | `localhost:4003/api/v2/config/csv-export` |
| `src/features/multichain/pages/search-results/SearchResults.pw.tsx` | `localhost:3003/api/v2/main-page/indexing-status` |
| `src/features/rewards/pages/dashboard/RewardsDashboard.pw.tsx` | `localhost:3009/api/v1/activity/check-pass`, `localhost:3009/api/v1/instances`, `localhost:3009/api/v1/user/activity/rewards`, `localhost:3009/api/v1/user/badges`, `localhost:3009/api/v1/user/balances`, `localhost:3009/api/v1/user/daily/check`, `localhost:3009/api/v1/user/referrals` |
| `src/features/user-ops/pages/details/UserOp.pw.tsx` | `localhost:3003/api/v2/transactions/0x715fe1474ac7bea3d6f4a03b1c5b6d626675fb0b103be29f849af65e9f1f9c6a` |
| `src/shell/footer/Footer.pw.tsx` | `localhost:3003/api/v2/config/backend-version`, `localhost:3003/api/v2/main-page/indexing-status` |
| `src/shell/header/Burger.pw.tsx` | `localhost:3003/api/account/v2/user/info` |
| `src/shell/navigation/horizontal/NavigationDesktop.pw.tsx` | `localhost:3009/api/v1/user/referrals` |
| `src/shell/page/actions-menu/ActionsMenu.pw.tsx` | `localhost:3003/api/account/v2/user/info` |
| `src/slices/address/pages/details/Address.pw.tsx` | `localhost:3003/api/v2/stats`, `localhost:3007/api/v1/addresses:submit`, `localhost:3007/api/v1/metadata`, `localhost:3008/api/v1/addresses:lookup` |
| `src/slices/address/pages/details/info/AddressDetails.pw.tsx` | `localhost:3003/api/v2/stats` |
| `src/slices/address/pages/details/internal-txs/AddressInternalTxs.pw.tsx` | `localhost:3003/api/v2/config/csv-export` |
| `src/slices/address/pages/details/tokens/AddressTokens.pw.tsx` | `localhost:3000/token-icon.png`, `localhost:3003/api/v2/stats` |
| `src/slices/address/pages/details/txs/AddressTxs.pw.tsx` | `localhost:3003/api/v2/config/csv-export` |
| `src/slices/home/pages/index/HeroBanner.pw.tsx` | `localhost:3009/api/v1/user/referrals` |
| `src/slices/search/components/search-bar/SearchBarDesktop.pw.tsx` | `localhost:3003/api/v2/search/check-redirect` |
| `src/slices/search/components/search-bar/SearchBarMobile.pw.tsx` | `localhost:3003/api/v2/search/check-redirect` |
| `src/slices/search/pages/search-results/SearchResults.pw.tsx` | `localhost:3003/api/v2/config/backend-version`, `localhost:3003/api/v2/main-page/indexing-status` |
| `src/slices/token/pages/details/TokenPageTitle.pw.tsx` | `localhost:3000/token-icon.png` |

## Every failing file

183 files. An entry that is only `localhost:3009/api/v1/config` is cleared by the global fix above.

- `src/api/socket/SocketNewItemsNotice.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/account/pages/verified-addresses/address-verification/steps/AddressVerificationStepAddress.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/account/pages/verified-addresses/address-verification/steps/AddressVerificationStepSignature.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/account/pages/verified-addresses/token-info/TokenInfoForm.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/address-metadata/components/AppActionButton.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/address-metadata/components/tag/MetadataTag.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/address-metadata/components/tag/MetadataTags.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/address-metadata/pages/tag-submition/TagSubmitionForm.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/address-metadata/pages/tag-submition/TagSubmitionResult.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/advanced-filter/components/FilterByColumn.pw.tsx` — `localhost:3003/api/v2/tokens`, `localhost:3009/api/v1/config`
- `src/features/advanced-filter/pages/index/AdvancedFilter.pw.tsx` — `localhost:3003/api/v2/config/csv-export`, `localhost:3009/api/v1/config`
- `src/features/chain-stats/pages/details/ChainStatsDetails.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/chain-variants/celo/pages/address/AddressCeloAccount.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/chain-variants/celo/pages/block/BlockDetailsBaseFeeCelo.pw.tsx` — `localhost:3000/token-icon.png`, `localhost:3009/api/v1/config`
- `src/features/chain-variants/celo/pages/epoch-details/Epoch.pw.tsx` — `localhost:3000/token-icon.png`, `localhost:3009/api/v1/config`
- `src/features/chain-variants/tac/pages/operation-details/TacOperation.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/chain-variants/zeta-chain/components/AddressEntityZetaChain.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/chain-variants/zeta-chain/pages/cctx-details/ZetaChainCCTX.pw.tsx` — `localhost:3003/api/v2/stats`, `localhost:3009/api/v1/config`
- `src/features/chain-variants/zeta-chain/pages/cctx-index/ZetaChainCCTXsTab.pw.tsx` — `localhost:3004/api/v1/pages/transactions`, `localhost:3009/api/v1/config`
- `src/features/chain-variants/zeta-chain/pages/home/LatestZetaChainCCTXs.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/chain-variants/zilliqa/pages/block/BlockDetailsZilliqaQuorumCertificate.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/chain-variants/zilliqa/pages/validator-details/ValidatorDetails.pw.tsx` — `localhost:3003/api/v2/stats`, `localhost:3009/api/v1/config`
- `src/features/cross-chain-txs/pages/token-transfers/TokenTransfersCrossChain.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/cross-chain-txs/pages/tx/TxCrossChain.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/cross-chain-txs/pages/tx/TxCrossChainDetailsLifecycle.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/cross-chain-txs/pages/tx/TxDetailsCrossChainMessages.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/cross-chain-txs/pages/txs/TransactionsCrossChain.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/data-availability/pages/blob-details/Blob.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/dex-pools/components/entity/PoolEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/dex-pools/pages/details/Pool.pw.tsx` — `localhost:3003/api/v2/addresses/0x6a1041865b76d1dc33da0257582591227c57832c`, `localhost:3009/api/v1/config`
- `src/features/dex-pools/pages/index/Pools.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/gas-tracker/components/GasTrackerPriceSnippet.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/gas-tracker/pages/index/GasTracker.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/marketplace/pages/dapp-info/MarketplaceAppInfoPage.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/marketplace/pages/dapp/info/MarketplaceAppInfo.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/marketplace/pages/essential-dapp/multisend/Multisend.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/marketplace/pages/essential-dapp/revoke/Revoke.pw.tsx` — `localhost:3009/api/v1/config`, `localhost:4003/api/v2/addresses/`, `localhost:4003/api/v2/stats`
- `src/features/marketplace/pages/essential-dapp/revoke/components/Content.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/marketplace/pages/index/Marketplace.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/address/MultichainAddress.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/address/MultichainAddressPortfolio.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/address/MultichainAddressTokenTransfers.pw.tsx` — `localhost:3009/api/v1/config`, `localhost:4003/api/v2/config/csv-export`
- `src/features/multichain/pages/address/MultichainAddressTxs.pw.tsx` — `localhost:3009/api/v1/config`, `localhost:4003/api/v2/config/csv-export`
- `src/features/multichain/pages/address/portfolio/MultichainAddressPortfolioNetWorth.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/address/portfolio/MultichainAddressPortfolioTokens.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/ecosystems/MultichainEcosystems.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/home/MultichainHome.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/multichain/pages/search-results/SearchResults.pw.tsx` — `localhost:3003/api/v2/main-page/indexing-status`, `localhost:3009/api/v1/config`
- `src/features/name-services/clusters/components/ClustersEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/name-services/clusters/pages/details/Cluster.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/name-services/common/pages/NameServices.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/name-services/domains/components/EnsEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/name-services/domains/pages/address/AddressEnsDomains.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/name-services/domains/pages/details/NameDomain.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/op-interop/components/AddressEntityInterop.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/op-interop/components/TxEntityInterop.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/op-interop/pages/messages/InteropMessages.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rewards/pages/dashboard/RewardsDashboard.pw.tsx` — `localhost:3009/api/v1/activity/check-pass`, `localhost:3009/api/v1/config`, `localhost:3009/api/v1/instances`, `localhost:3009/api/v1/user/activity/rewards`, `localhost:3009/api/v1/user/badges`, `localhost:3009/api/v1/user/balances`, `localhost:3009/api/v1/user/daily/check`, `localhost:3009/api/v1/user/referrals`
- `src/features/rewards/pages/dashboard/streakModal/RewardsStreakModal.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/batch-details/ArbitrumL2TxnBatch.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/batches/ArbitrumL2TxnBatches.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/deposits/ArbitrumL2Deposits.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/home/LatestArbitrumDeposits.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/home/LatestArbitrumL2Batches.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/txn-withdrawals/ArbitrumL2TxnWithdrawals.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/arbitrum/pages/withdrawals/ArbitrumL2Withdrawals.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/batch-details/OptimisticL2TxnBatchDetails.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/batches/OptimisticL2TxnBatches.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/deposits/OptimisticL2Deposits.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/dispute-games/OptimisticL2DisputeGames.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/home/LatestOptimisticDeposits.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/output-roots/OptimisticL2OutputRoots.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/tx/TxDetailsWithdrawalStatusOptimistic.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/optimism/pages/withdrawals/OptimisticL2Withdrawals.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/scroll/pages/batch-details/ScrollL2TxnBatch.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/scroll/pages/batches/ScrollL2TxnBatches.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/scroll/pages/deposits/ScrollL2Deposits.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/scroll/pages/withdrawals/ScrollL2Withdrawals.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/shibarium/pages/deposits/ShibariumDeposits.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/shibarium/pages/withdrawals/ShibariumWithdrawals.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/zk-sync/pages/batch-details/ZkSyncL2TxnBatch.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/rollup/zk-sync/pages/batches/ZkSyncL2TxnBatches.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/solidity-scan/components/SolidityscanReport.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/user-ops/components/entity/UserOpEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/features/user-ops/pages/details/UserOp.pw.tsx` — `localhost:3003/api/v2/transactions/0x715fe1474ac7bea3d6f4a03b1c5b6d626675fb0b103be29f849af65e9f1f9c6a`, `localhost:3009/api/v1/config`
- `src/features/user-ops/pages/index/UserOps.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/errors/AppError.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/lifecycle/steps/VerificationSteps.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/pagination/Pagination.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/stats/LineChartWidget.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/stats/StatsWidget.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/tags/select/TagGroupSelect.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/tags/status-tag/StatusTag.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/values/entity/AssetValue.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shared/values/utilization/Utilization.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shell/footer/Footer.pw.tsx` — `localhost:3003/api/v2/config/backend-version`, `localhost:3003/api/v2/main-page/indexing-status`, `localhost:3009/api/v1/config`
- `src/shell/header/Burger.pw.tsx` — `localhost:3003/api/account/v2/user/info`, `localhost:3009/api/v1/config`
- `src/shell/header/HeaderDesktop.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shell/header/HeaderMobile.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shell/navigation/horizontal/NavigationDesktop.pw.tsx` — `localhost:3009/api/v1/config`, `localhost:3009/api/v1/user/referrals`
- `src/shell/navigation/vertical/NavigationDesktop.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shell/page/actions-menu/ActionsMenu.pw.tsx` — `localhost:3003/api/account/v2/user/info`, `localhost:3009/api/v1/config`
- `src/shell/page/title/PageTitle.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shell/top-bar/TopBar.pw.tsx` — `localhost:3009/api/v1/config`
- `src/shell/top-bar/chain-menu/ChainMenu.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/components/entity/AddressEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/components/from-to/AddressFromTo.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/components/from-to/AddressFromToIcon.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/Address.pw.tsx` — `localhost:3003/api/v2/stats`, `localhost:3007/api/v1/addresses:submit`, `localhost:3007/api/v1/metadata`, `localhost:3008/api/v1/addresses:lookup`, `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/coin-balance/AddressCoinBalance.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/info/AddressAlerts.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/info/AddressDetails.pw.tsx` — `localhost:3003/api/v2/stats`, `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/info/AddressNetWorth.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/info/AddressQrCode.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/info/token-select/TokenSelect.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/internal-txs/AddressInternalTxs.pw.tsx` — `localhost:3003/api/v2/config/csv-export`, `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/tokens/AddressTokens.pw.tsx` — `localhost:3000/token-icon.png`, `localhost:3003/api/v2/stats`, `localhost:3009/api/v1/config`
- `src/slices/address/pages/details/txs/AddressTxs.pw.tsx` — `localhost:3003/api/v2/config/csv-export`, `localhost:3009/api/v1/config`
- `src/slices/address/pages/index/Accounts.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/block/components/entity/BlockEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/block/pages/countdown-index/BlockCountdownIndex.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/block/pages/details/Block.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/block/pages/details/BlockDetails.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/block/pages/index/Blocks.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/chain/logo/NetworkIcon.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/chain/logo/NetworkLogo.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/contract-verification/ContractVerificationForm.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/Contract.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/code/ContractCode.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/code/ContractDetailsDeployedByteCode.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/code/alerts/ContractDetailsAlertProxyPattern.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/code/alerts/ContractDetailsAlerts.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/code/info/ContractDetailsInfo.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/methods/ContractMethodsProxy.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/methods/ContractMethodsRegular.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/methods/form/ContractMethodForm.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/contract/pages/details/methods/form/ContractMethodResultWalletClient.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/home/pages/index/HeroBanner.pw.tsx` — `localhost:3009/api/v1/config`, `localhost:3009/api/v1/user/referrals`
- `src/slices/home/pages/index/blocks/LatestBlocks.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/home/pages/index/charts/ChainIndicators.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/home/pages/index/highlights/Highlights.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/home/pages/index/stats/HomeStats.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/home/pages/index/txs/LatestTxs.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/log/components/LogDecodedInputData.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/log/components/LogItem.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/log/components/LogTopic.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/search/components/search-bar/SearchBarDesktop.pw.tsx` — `localhost:3003/api/v2/search/check-redirect`, `localhost:3009/api/v1/config`
- `src/slices/search/components/search-bar/SearchBarInput.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/search/components/search-bar/SearchBarMobile.pw.tsx` — `localhost:3003/api/v2/search/check-redirect`, `localhost:3009/api/v1/config`
- `src/slices/search/pages/search-results/SearchResults.pw.tsx` — `localhost:3003/api/v2/config/backend-version`, `localhost:3003/api/v2/main-page/indexing-status`, `localhost:3009/api/v1/config`
- `src/slices/token/components/nft-media/NftMedia.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/token/pages/details/TokenPageTitle.pw.tsx` — `localhost:3000/token-icon.png`, `localhost:3009/api/v1/config`
- `src/slices/token/pages/details/info/TokenMultiplierHistoryInline.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/token/pages/details/inventory/TokenInventory.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/token/pages/index/Tokens.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/token/pages/instance/TokenInstancePageTitle.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/token/pages/instance/info/TokenInstanceDetails.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/token/pages/instance/metadata/TokenInstanceMetadata.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/tx/components/TxAdditionalInfo.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/tx/components/entity/TxEntity.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/tx/pages/details/TxSubHeading.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/tx/pages/details/info/TxDetails.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/tx/pages/index/list/TxsTable.pw.tsx` — `localhost:3009/api/v1/config`
- `src/slices/tx/pages/index/stats/TxsStats.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Alert.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Badge.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Button.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Checkbox.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/DatePicker.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Field.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/IconButton.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Link.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Pagination.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/ProgressCircle.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Radio.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Select.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Switch.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Tabs.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Tag.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/Textarea.pw.tsx` — `localhost:3009/api/v1/config`
- `src/toolkit/pages/design-system/tabs/TimePicker.pw.tsx` — `localhost:3009/api/v1/config`
