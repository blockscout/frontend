# Architecture Migration — Task Backlog

Progress tracker for the `client/` architecture redesign.
Blueprint: `client/ARCH_REDESIGN.md`. Terminology: `docs/GLOSSARY.md`.

**Task ID format:** `<stage>-<index>` — stage number + sequential index within that stage.
Adding tasks to a stage: append the next index; no renumbering needed.

**Status:** `[ ]` to do · `[~]` in progress · `[x]` done  
**Base branch:** `main` — each task branches from `main`; PRs target `main`.  
**Parent issue:** [`blockscout/frontend#3341`](https://github.com/blockscout/frontend/issues/3341)

> `/arch-research <task-id>` creates the sub-issue and marks the task `[~]`.  
> `/arch-migrate <issue>` executes the task and opens a PR.  
> Change `[~]` → `[x]` after the PR is merged.

---

## Stage 0 — Pre-migration

### 0-1 · [x] Rename `configs/app/features/` files to kebab-case · [#3345](https://github.com/blockscout/frontend/issues/3345)

**Scope:** Rename every `.ts` file under `configs/app/features/` from camelCase to kebab-case
(e.g. `userOps.ts` → `user-ops.ts`, `adsBanner.ts` → `ads-banner.ts`).
Update all import paths repo-wide. Named exports inside files are unchanged — filenames only.  

---

### 0-2 · [x] Enable ESLint `import/no-cycle` + `boundaries` rules · [#3348](https://github.com/blockscout/frontend/issues/3348)

**Scope:** Add `eslint-plugin-boundaries` (if not already installed). Configure rules so that:
- Imports within `client/` emit **errors** on violations.
- Imports in legacy `lib/` and `ui/` emit **warnings** only.
Fix all pre-existing errors (there should be none in `client/` yet). Confirm warnings in legacy code are expected and do not block CI.  

---

## Stage 1 — Foundation

### 1-1 · [x] Migrate `client/api/` · [#3369](https://github.com/blockscout/frontend/issues/3369)

**Scope:** Move `lib/api/**` → `client/api/**` (preserve `services/` structure).
Additional moves in the same PR:
- `lib/socket/` → `client/api/socket/`
- `lib/hooks/useFetch.ts` → `client/api/`
- `lib/api/services/utils.ts` → `client/api/types.ts`

Update all repo-wide imports. Verify `client/api` has no runtime imports from `client/slices/*` or
`client/features/*` (`import type` is permitted).  

---

### 1-2 · [x] Migrate `client/shared/` · [#3371](https://github.com/blockscout/frontend/issues/3371)

**Scope:** Move all cross-cutting utilities from `lib/` to `client/shared/<subfolder>/`.
Key moves (see `ARCH_REDESIGN.md §6` for full list):

| Source | Destination |
|--------|-------------|
| `lib/mixpanel/` | `client/shared/analytics/` |
| `lib/rollbar/` | `client/shared/monitoring/rollbar/` |
| `lib/growthbook/` | `client/shared/feature-flags/` |
| `lib/networks/` + `lib/units.ts` | `client/shared/chain/` (rename `network` → `chain` throughout) |
| `lib/router/` + filter-value helpers | `client/shared/router/` |
| `lib/errors/` + `lib/getErrorMessage.ts` | `client/shared/errors/` |
| `lib/web3/` | `client/shared/web3/` |
| `lib/metadata/` | `client/shared/metadata/` |
| `lib/hooks/useTimeAgoIncrement` | `client/shared/date-and-time/` |
| `lib/hooks/useLazyRenderedList`, `useInitialList`, `lib/getItemIndex.ts` | `client/shared/lists/` |
| `lib/cookies.ts` | `client/shared/storage/` |
| `lib/decodeJWT.ts` | `client/shared/auth/` |
| `lib/setLocale.ts` | `client/shared/i18n/` |
| `lib/capitalizeFirstLetter.ts`, `shortenString.ts`, `escapeRegExp.ts`, `highlightText.ts` | `client/shared/text/` |
| `lib/base64ToHex.ts` and other hex/bytes helpers | `client/shared/transformers/` |
| `lib/utils/stripUtmParams.ts` | `client/shared/links/utils/` |
| `lib/delay.ts`, `lib/isMetaKey.tsx` | `client/shared/utils/` |
| Remaining generic hooks from `lib/hooks/` | `client/shared/hooks/` |

Note: `lib/monitoring/` (server-side) → `nextjs/`, not `client/shared/`.  

---

## Stage 2 — Pilot slice

### 2-1 · [x] Pilot: migrate `slices/tx` end-to-end

**Scope:** Full migration of the `tx` slice. Canonical template for all subsequent slices.
- `lib/tx/` → `client/slices/tx/utils/`
- `lib/api/services/general/tx.ts` → `client/api/services/general/tx.ts` (if not already done in 1-1)
- `ui/tx/**` → `client/slices/tx/` (restructure into `pages/`, `components/`, `hooks/`, `utils/`, `types/`, `mocks.ts`, `stubs.ts`)
- Move associated `types/api/tx.ts` → `client/slices/tx/types/api.ts`
- Move associated `mocks/` and `stubs/` entries

Cross-slice dependencies (address types, rollup sub-types, etc.) may remain at their old `lib/` paths
after this PR — note each as an explicit follow-up in the PR description.  

---

## Stage 3 — Core slices

Each slice follows the template established in 2-1.

### 3-1 · [x] Slice: `block` · [#3378](https://github.com/blockscout/frontend/issues/3378)
**Scope:** `lib/block/` (if any), `ui/block/**`, related `types/api/`, `mocks/`, `stubs/` → `client/slices/block/`  

### 3-2 · [x] Slice: `address` · [#3380](https://github.com/blockscout/frontend/issues/3380)
**Scope:** `lib/address/`, `ui/address/**`, related types/mocks/stubs, `lib/hooks/useAddressProfileApiQuery`, `lib/contexts/addressHighlight.tsx` → `client/slices/address/`  

### 3-3 · [x] Slice: `search` · [#3405](https://github.com/blockscout/frontend/issues/3405)
**Scope:** `lib/search/`, `ui/snippets/searchBar/`, `lib/recentSearchKeywords.ts`, related types/mocks/stubs → `client/slices/search/`  

### 3-4 · [x] Slice: `token` · [#3393](https://github.com/blockscout/frontend/issues/3393)
**Scope:** `lib/token/`, `ui/token/**`, `ui/tokens/**`, `ui/tokenInstance/**`, related types/mocks/stubs → `client/slices/token/`  

### 3-5 · [x] Slice: `contract` · [#3401](https://github.com/blockscout/frontend/issues/3401)
**Scope:** `lib/contracts/`, `lib/solidityScan/`, `ui/contract/**`, related types/mocks/stubs → `client/slices/contract/`  

### 3-6 · [x] Slice: `internal-tx` · [#3396](https://github.com/blockscout/frontend/issues/3396)
**Scope:** `ui/internalTxs/**` (and any `lib/` counterparts), related types/mocks/stubs → `client/slices/internal-tx/`  

### 3-7 · [x] Slice: `home` · [#3414](https://github.com/blockscout/frontend/issues/3414)
**Scope:** `ui/home/**`, related types/mocks/stubs → `client/slices/home/`  

### 3-8 · [x] Slice: `log` · [#3403](https://github.com/blockscout/frontend/issues/3403)
**Scope:** `ui/shared/log/**`, related types/mocks/stubs → `client/slices/log/`

### 3-9 · [x] Slice: `token-transfer` · [#3399](https://github.com/blockscout/frontend/issues/3399)
**Scope:** TBD

### 3-10 · [x] Slice: `gas` · [#3418](https://github.com/blockscout/frontend/issues/3418)
**Scope:** Gas-price domain primitives — no tracker page (that belongs to `features/gas-tracker/`).
- `ui/shared/gas/` → `client/slices/gas/components/` and `client/slices/gas/utils/`
- `types/client/gasTracker.ts` (`GasUnit`, `GAS_UNITS`) → `client/slices/gas/types/client.ts`
- `client/slices/gas/types/api.ts` already exists — verify and complete (`GasPrices`, `GasPriceInfo`)
- Update all import paths in `slices/home/`, `slices/tx/`, `client/shell/`, and `features/gas-tracker/`

---

## Stage 4 — Features: rollups

One PR per rollup type. Each goes under `client/features/rollup/<type>/`.

> Enumerate additional rollup tasks when this stage begins, based on what exists under `lib/rollups/` and `ui/`.

### 4-1 · [x] Feature: `rollup/optimism` · [#3421](https://github.com/blockscout/frontend/issues/3421)
**Scope:** All Optimism-specific UI, hooks, utils, types → `client/features/rollup/optimism/`. Includes fault proof system and dispute games.  

### 4-2 · [x] Feature: `rollup/arbitrum` · [#3423](https://github.com/blockscout/frontend/issues/3423)
**Scope:** All Arbitrum-specific UI, hooks, utils, types → `client/features/rollup/arbitrum/`  

### 4-3 · [x] Feature: `rollup/zk-sync` · [#3426](https://github.com/blockscout/frontend/issues/3426)
**Scope:** zkSync-specific UI, hooks, utils, types → `client/features/rollup/zk-sync/`. Check for other zk-based rollup types (scroll, etc.) and add tasks if needed.  

### 4-4 · [~] Feature: `rollup/common` — shared types and utils · [#3432](https://github.com/blockscout/frontend/issues/3432)
**Scope:** Migrate cross-rollup primitives shared by all rollup types.
- `types/client/rollup.ts` (`ROLLUP_TYPES`, `RollupType`, `ParentChain`) → `client/features/rollup/common/types/config.ts`; inline `ArrayElement` to achieve zero imports (required for `configs/` compatibility)
- `client/features/rollup/common/utils/layer.ts` → split: `layerLabels` → `client/features/rollup/common/utils/layer-labels.ts`; `formatZkSyncL2TxnBatchStatus` → `client/features/rollup/zk-sync/utils/format-txn-batch-status.ts` (coordinate with 4-3)
- Update all import paths repo-wide. Delete `client/features/rollup/common/utils/layer.ts` and `types/client/rollup.ts`.

### 4-5 · [~] Feature: `rollup/scroll` · [#3429](https://github.com/blockscout/frontend/issues/3429)
**Scope:** Scroll-specific UI, hooks, utils, types → `client/features/rollup/scroll/`. Includes deposits, withdrawals, and txn batches pages.
- `types/api/scrollL2.ts` → `client/features/rollup/scroll/types/api.ts` (2 files already started there)
- `stubs/scrollL2.ts` → `client/features/rollup/scroll/stubs.ts`
- `mocks/scroll/` → `client/features/rollup/scroll/mocks/`
- `ui/shared/statusTag/ScrollL2TxnBatchStatus.tsx` → `client/features/rollup/scroll/components/`
- `ui/shared/batch/ScrollL2TxnBatchDA.tsx` → `client/features/rollup/scroll/components/`
- `ui/txnBatches/scrollL2/` → `client/features/rollup/scroll/pages/batches/`
- `ui/deposits/scrollL2/` → `client/features/rollup/scroll/pages/deposits/`
- `ui/withdrawals/scrollL2/` → `client/features/rollup/scroll/pages/withdrawals/`
- `ui/pages/ScrollL2TxnBatches.tsx`, `ScrollL2TxnBatch.tsx` → `client/features/rollup/scroll/pages/batches/` and `batch-details/`
- `ui/pages/ScrollL2Deposits.tsx`, `ScrollL2Withdrawals.tsx` → `client/features/rollup/scroll/pages/deposits/` and `withdrawals/`

### 4-6 · [~] Feature: `rollup/shibarium` · [#3431](https://github.com/blockscout/frontend/issues/3431)

---

## Stage 5 — Features: chain variants

One PR per chain variant. Each goes under `client/features/chain-variants/<name>/`.

### 5-1 · [~] Feature: `chain-variants/celo` · [#3434](https://github.com/blockscout/frontend/issues/3434)
**Scope:** All Celo-specific UI and logic including epochs → `client/features/chain-variants/celo/`. See `configs/app/features/celo.ts`.  

### 5-2 · [~] Feature: `chain-variants/tac` · [#3440](https://github.com/blockscout/frontend/issues/3440)
**Scope:** TAC operations and bridge UI → `client/features/chain-variants/tac/`. See `configs/app/features/tac.ts`.  

### 5-3 · [~] Feature: `chain-variants/zeta-chain` · [#3441](https://github.com/blockscout/frontend/issues/3441)
**Scope:** ZetaChain CCTX UI → `client/features/chain-variants/zeta-chain/`. See `configs/app/features/zetachain.ts`.  

### 5-4 · [ ] Feature: `chain-variants/suave`
**Scope:** SUAVE Kettle UI → `client/features/chain-variants/suave/`. See `configs/app/features/suave.ts`.  

### 5-5 · [ ] Feature: `chain-variants/mega-eth`
**Scope:** MegaETH Flashblocks UI → `client/features/chain-variants/mega-eth/`. See `configs/app/features/megaEth.ts` and `flashblocks.ts`.  

### 5-6 · [ ] Feature: `chain-variants/beacon-chain`
**Scope:** Beacon chain deposits/withdrawals UI → `client/features/chain-variants/beacon-chain/`. See `configs/app/features/beaconChain.ts`.  

---

## Stage 6 — Features: standalone

One PR per feature. Features that are pure infrastructure (analytics, monitoring, A/B flags) were
migrated to `client/shared/` in 1-2 and do not appear here.

### 6-1 · [ ] Feature: `user-ops`

### 6-2 · [ ] Feature: `data-availability`

### 6-3 · [ ] Feature: `multichain`
**Scope:** Includes `lib/multichain/`, `lib/contexts/multichain.tsx`, `ui/snippets/networkMenu/` → `client/features/multichain/`  

### 6-4 · [ ] Feature: `name-domains` (BENS)
**Scope:** `configs/app/features/nameServices.ts` — use `name-domains` as folder name.  

### 6-5 · [ ] Feature: `account`
**Scope:** Includes `lib/hooks/useGetCsrfToken`, `ui/snippets/auth/`, `ui/snippets/user/` → `client/features/account/`  

### 6-6 · [ ] Feature: `stats`
**Scope:** `lib/stats/` and stats UI → `client/features/stats/`  

### 6-7 · [ ] Feature: `gas-tracker`
**Scope:** Config-gated tracker page (`NEXT_PUBLIC_GAS_TRACKER_ENABLED`). Depends on task 3-10 (`slices/gas/`) being merged first.
- `ui/gasTracker/` + `ui/pages/GasTracker.tsx` → `client/features/gas-tracker/`
- Imports gas-price primitives from `client/slices/gas/`

### 6-8 · [ ] Feature: `validators`

### 6-9 · [ ] Feature: `marketplace`
**Scope:** Includes `lib/contexts/marketplace.tsx`, `lib/hooks/useGraphLinks` → `client/features/marketplace/`  

### 6-10 · [ ] Feature: `rewards`
**Scope:** Includes `lib/contexts/rewards.tsx`, `lib/hooks/useRewardsActivity` → `client/features/rewards/`  

### 6-11 · [ ] Feature: `advanced-filter`

### 6-12 · [ ] Feature: `ad-banner`
**Scope:** Includes `lib/hooks/useAdblockDetect` → `client/features/ad-banner/`. Covers both `adsBanner.ts` and `adsText.ts` configs.  

### 6-13 · [ ] Feature: `safe-address-tags`
**Scope:** Includes `lib/hooks/useIsSafeAddress` → `client/features/safe-address-tags/`. See `configs/app/features/safe.ts`.  

### 6-14 · [ ] Feature: `metasuites`
**Scope:** Includes `lib/hooks/useNotifyOnNavigation` → `client/features/metasuites/`  

### 6-15 · [ ] Feature: `csv-export`

### 6-16 · [ ] Feature: `pools`

### 6-17 · [ ] Feature: `hot-contracts`

### 6-18 · [ ] Feature: `interchain-indexer`
**Scope:** Cross-chain message indexer (not ZetaChain). See `configs/app/features/crossChainTxs.ts`.  

### 6-19 · [ ] Feature: `mud-framework`

### 6-20 · [ ] Feature: `visualize`
**Scope:** Solidity-to-UML diagrams. See `configs/app/features/sol2uml.ts`.  

### 6-21 · [ ] Feature: `tx-interpretation`

### 6-22 · [ ] Feature: `public-tags`
**Scope:** Community address labels. See `configs/app/features/publicTagsSubmission.ts`.  

### 6-23 · [ ] Feature: `address-widgets`
**Scope:** Third-party widgets on address pages. See `configs/app/features/address3rdPartyWidgets.ts`.  

### 6-24 · [ ] Feature: `address-metadata`

### 6-25 · [ ] Feature: `address-verification`
**Scope:** Covers `addressProfileAPI.ts` and `addressVerification.ts` configs.  

### 6-26 · [ ] Feature: `bridged-tokens`

### 6-27 · [ ] Feature: `web3-wallet`
**Scope:** Includes `blockchainInteraction.ts` config.  

### 6-28 · [ ] Feature: `alternative-explorers`
**Scope:** The "Verify with other explorers" menu shown on tx, block, address, and token pages. Move `ui/shared/NetworkExplorers.tsx` (and its `.pw.tsx` test) → `client/features/alternative-explorers/`. The util `client/features/alternative-explorers/utils/explorers.ts` already exists (landed in 1-2). Config-gated via `NEXT_PUBLIC_NETWORK_EXPLORERS`.  

### 6-29 · [ ] Feature: `get-gas-button`
**Scope:** Gas refuel CTA — independently config-gated (`NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG`), no dependency on `gas-tracker` being enabled.
- `ui/snippets/topBar/GetGasButton.tsx` → `client/features/get-gas-button/`
- `types/client/gasRefuelProviderConfig.ts` → `client/features/get-gas-button/types/`
- See `configs/app/features/get-gas-button.ts`

> Other small features (`externalTxs`, `xStarScore`, `deFiDropdown`, `easterEgg*`, `apiDocs`, `verifiedTokens`, `multichainButton`) — enumerate as separate tasks or group with related features when this stage begins.

---

## Stage 7 — Shell

### 7-1 · [ ] Migrate `client/shell`

**Scope:** Migrate after all slices and features it depends on are in place.
- `ui/snippets/header/`, `footer/`, `navigation/`, `topBar/` → `client/shell/`
- `lib/contexts/app.tsx`, `fallback.tsx` → `client/shell/`
- `lib/contexts/settings.tsx` → `client/shell/top-bar/`
- `lib/hooks/useNavItems` → `client/shell/`  

---

## Stage 8 — Cleanup

### 8-1 · [ ] Remove legacy root directories

**Scope:** Confirm `lib/`, `ui/`, `mocks/`, `stubs/`, `types/` are empty (no remaining unconverted files).
Delete them. Fix any remaining lint warnings that referenced legacy paths.  
