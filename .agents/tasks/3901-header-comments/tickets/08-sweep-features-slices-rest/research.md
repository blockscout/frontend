# Worklist — 08-sweep-features-slices-rest

96 comment blocks in 88 files, 318 comment lines, as counted when the tickets were written.
A block is listed when it is at the top of its file, is three lines or longer, or is a `/** */` block.
Line numbers drift as the sweep edits a file: work each file from the bottom up, or re-read it.
Licence headers, `@vitest-environment` pragmas, ESLint and TypeScript directives and single-line
`/** @type … */` annotations are already left out.

| File | Line | Lines | Flags |
| --- | --- | --- | --- |
| `src/config/test-utils/env-presets.ts` | 5 | 5 | top |
| `src/config/types.ts` | 3 | 2 | top |
| `src/features/account/components/auth-modal/guard/AuthGuardAuth0.tsx` | 40 | 3 |  |
| `src/features/account/components/user-profile/common/UserProfileContentWallet.tsx` | 27 | 3 |  |
| `src/features/account/config.spec.ts` | 10 | 3 |  |
| `src/features/account/hooks/useGetCsrfToken.ts` | 24 | 7 |  |
| `src/features/account/pages/verified-addresses/token-info/TokenInfoForm.spec.tsx` | 1 | 2 | top |
| `src/features/ads/banner/components/SpecifyBanner.isolated.spec.tsx` | 1 | 2 | top |
| `src/features/ads/text/components/SevioTextAd.tsx` | 17 | 3 |  |
| `src/features/advanced-filter/pages/index/AdvancedFilter.spec.tsx` | 1 | 2 | top |
| `src/features/advanced-filter/pages/index/AdvancedFilter.tsx` | 116 | 3 |  |
| `src/features/bubblemaps/config.spec.ts` | 12 | 3 |  |
| `src/features/chain-variants/celo/components/entity/EpochEntity.spec.tsx` | 1 | 2 | top |
| `src/features/chain-variants/eden/pages/tx/TxDetailsEden.tsx` | 17 | 1 | jsdoc |
| `src/features/chain-variants/tac/components/TacOperationEntity.spec.tsx` | 1 | 2 | top |
| `src/features/chain-variants/tac/components/TacOperationStatus.tsx` | 27 | 4 | jsdoc |
| `src/features/chain-variants/tac/types/api.ts` | 5 | 5 | jsdoc |
| `src/features/chain-variants/tac/utils/tac-operation.ts` | 7 | 4 | jsdoc |
| `src/features/chain-variants/tac/utils/tac-operation.ts` | 31 | 4 | jsdoc |
| `src/features/chain-variants/tac/utils/tac-operation.ts` | 44 | 4 | jsdoc |
| `src/features/chain-variants/zeta-chain/pages/cctx-index/ZetaChainCCTXsTab.tsx` | 112 | 3 |  |
| `src/features/chain-variants/zilliqa/components/ValidatorEntity.spec.tsx` | 1 | 2 | top |
| `src/features/cross-chain-txs/components/CrossChainMessageEntity.spec.tsx` | 1 | 2 | top |
| `src/features/cross-chain-txs/components/txs/TransactionsCrossChainTable.spec.tsx` | 1 | 2 | top |
| `src/features/csv-export/components/dialog/CsvExportDialog.tsx` | 47 | 3 |  |
| `src/features/csv-export/components/dialog/CsvExportFormDateField.tsx` | 54 | 3 |  |
| `src/features/csv-export/utils/serialize-form-fields.ts` | 8 | 3 |  |
| `src/features/data-availability/components/entity/BlobEntity.spec.tsx` | 1 | 2 | top |
| `src/features/defi-dropdown/components/DeFiDropdown.spec.tsx` | 1 | 2 | top |
| `src/features/defi-dropdown/config.spec.ts` | 15 | 3 |  |
| `src/features/dex-pools/components/entity/PoolEntity.spec.tsx` | 1 | 2 | top |
| `src/features/flashblocks/components/FlashblockEntity.spec.tsx` | 1 | 2 | top |
| `src/features/marketplace/components/MarketplaceAppIframe.tsx` | 119 | 3 |  |
| `src/features/marketplace/hooks/useMarketplace.ts` | 92 | 3 |  |
| `src/features/marketplace/hooks/useMarketplaceWalletActivity.spec.tsx` | 1 | 2 | top |
| `src/features/marketplace/pages/essential-dapp/revoke/Revoke.tsx` | 233 | 3 |  |
| `src/features/marketplace/pages/essential-dapp/revoke/hooks/useRevoke.isolated.spec.ts` | 1 | 2 | top |
| `src/features/marketplace/pages/essential-dapp/swap/SwapWidgetIframe.spec.tsx` | 1 | 2 | top |
| `src/features/marketplace/pages/essential-dapp/swap/useSwapWallet.spec.tsx` | 1 | 2 | top |
| `src/features/multichain/types/client.ts` | 19 | 3 |  |
| `src/features/name-services/clusters/components/ClustersEntity.spec.tsx` | 1 | 2 | top |
| `src/features/name-services/domains/components/EnsEntity.pw.tsx` | 87 | 3 |  |
| `src/features/name-services/domains/components/EnsEntity.spec.tsx` | 1 | 2 | top |
| `src/features/rewards/components/MeritsIcon.tsx` | 6 | 3 |  |
| `src/features/rollup/arbitrum/pages/txn-withdrawals/ArbitrumL2TxnWithdrawalsClaimButton.tsx` | 141 | 3 |  |
| `src/features/rollup/optimism/components/OptimisticL2ClaimButton.tsx` | 50 | 3 |  |
| `src/features/token-action-button/components/TokenActionButton.spec.tsx` | 1 | 2 | top |
| `src/features/tx-interpretation/common/utils/utils.ts` | 3 | 1 | top |
| `src/features/user-ops/components/entity/UserOpEntity.spec.tsx` | 1 | 2 | top |
| `src/features/user-ops/pages/details/UserOpSubHeading.tsx` | 57 | 24 | over-8 |
| `src/pages/_app.tsx` | 110 | 3 |  |
| `src/pages/_app.tsx` | 137 | 3 |  |
| `src/pages/_error.tsx` | 35 | 3 |  |
| `src/pages/api/proxy.ts` | 30 | 3 |  |
| `src/proxy.ts` | 55 | 3 | jsdoc |
| `src/shell/layout/components/index.ts` | 26 | 8 |  |
| `src/shell/metadata/structured-data/index.ts` | 3 | 1 | top |
| `src/slices/address/components/entity/AddressEntity.pw.tsx` | 297 | 3 |  |
| `src/slices/address/components/entity/AddressEntity.spec.tsx` | 1 | 2 | top |
| `src/slices/address/components/icon/AddressIdenticonNouns.tsx` | 40 | 6 |  |
| `src/slices/address/pages/details/Address.spec.tsx` | 1 | 2 | top |
| `src/slices/address/pages/details/Address.spec.tsx` | 102 | 3 |  |
| `src/slices/address/pages/index/AddressesTable.spec.tsx` | 1 | 2 | top |
| `src/slices/contract/pages/contract-verification/ContractVerificationForm.tsx` | 152 | 3 |  |
| `src/slices/contract/pages/details/code/ContractDetailsDeployedByteCode.tsx` | 40 | 4 |  |
| `src/slices/contract/pages/details/methods/ContractAbi.tsx` | 106 | 4 |  |
| `src/slices/contract/pages/details/methods/form/useFormatFieldValue.ts` | 20 | 3 |  |
| `src/slices/contract/pages/details/methods/form/utils.ts` | 105 | 6 |  |
| `src/slices/contract/pages/details/methods/types.ts` | 12 | 6 |  |
| `src/slices/contract/pages/details/methods/useCallMethodWalletClient.ts` | 77 | 7 |  |
| `src/slices/contract/utils/editor-data.ts` | 25 | 5 |  |
| `src/slices/home/hooks/useHomeBlocksData.ts` | 20 | 1 | jsdoc |
| `src/slices/home/pages/index/HeroBanner.tsx` | 3 | 2 | top |
| `src/slices/internal-tx/pages/tx/TxInternals.tsx` | 61 | 6 |  |
| `src/slices/internal-tx/pages/tx/TxInternals.tsx` | 73 | 3 |  |
| `src/slices/internal-tx/pages/tx/TxInternals.tsx` | 87 | 3 |  |
| `src/slices/internal-tx/pages/tx/TxInternals.tsx` | 163 | 4 |  |
| `src/slices/token-transfer/components/table/TokenTransferCellByColumn.spec.tsx` | 1 | 2 | top |
| `src/slices/token-transfer/components/table/TokenTransfersTable.spec.tsx` | 1 | 2 | top |
| `src/slices/token-transfer/components/table/TokenTransfersTable.spec.tsx` | 20 | 3 |  |
| `src/slices/token-transfer/hooks/useTokenTransferColumns.spec.ts` | 1 | 2 | top |
| `src/slices/token-transfer/pages/token/TokenTransfer.tsx` | 41 | 3 |  |
| `src/slices/token/components/entity/NftEntity.spec.tsx` | 1 | 2 | top |
| `src/slices/token/components/entity/TokenEntity.spec.tsx` | 1 | 2 | top |
| `src/slices/token/components/nft-media/utils.ts` | 10 | 4 |  |
| `src/slices/token/pages/details/Token.tsx` | 55 | 4 |  |
| `src/slices/token/pages/details/TokenPageTitle.spec.tsx` | 1 | 2 | top |
| `src/slices/token/pages/details/info/TokenDetails.spec.tsx` | 1 | 2 | top |
| `src/slices/token/structured-data/token.ts` | 19 | 3 |  |
| `src/slices/token/utils/verified-fetch.ts` | 3 | 3 | top |
| `src/slices/tx/components/TxAdditionalInfo.tsx` | 44 | 5 |  |
| `src/slices/tx/components/TxType.spec.tsx` | 1 | 2 | top |
| `src/slices/tx/components/TxType.tsx` | 26 | 3 |  |
| `src/slices/tx/hooks/useTxsSocketTypeAddress.ts` | 100 | 3 |  |
| `src/slices/tx/utils/get-og-description-params.ts` | 17 | 3 |  |
| `src/sprite/SpriteInjector.ts` | 12 | 11 | over-8 |
