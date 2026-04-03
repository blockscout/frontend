# Architecture Migration — Task Backlog

Progress tracker for the `client/` architecture redesign.
Blueprint: `client/ARCH_REDESIGN.md`. Terminology: `docs/GLOSSARY.md`.

**Task ID format:** `<stage>-<index>` — stage number + sequential index within that stage.
Adding tasks to a stage: append the next index; no renumbering needed.

**Status:** `[ ]` to do · `[~]` in progress · `[x]` done  
**Base branch:** `main` — each task branches from `main`; PRs target `main`.

> Update status and PR link in the same commit that opens the PR.  
> Change `[~]` → `[x]` (and verify PR link) after the PR is merged.

---

## Stage 0 — Pre-migration

### 0-1 · [ ] Rename `configs/app/features/` files to kebab-case

**Scope:** Rename every `.ts` file under `configs/app/features/` from camelCase to kebab-case
(e.g. `userOps.ts` → `user-ops.ts`, `adsBanner.ts` → `ads-banner.ts`).
Update all import paths repo-wide. Named exports inside files are unchanged — filenames only.  
**PR:** —

---

### 0-2 · [ ] Enable ESLint `import/no-cycle` + `boundaries` rules

**Scope:** Add `eslint-plugin-boundaries` (if not already installed). Configure rules so that:
- Imports within `client/` emit **errors** on violations.
- Imports in legacy `lib/` and `ui/` emit **warnings** only.
Fix all pre-existing errors (there should be none in `client/` yet). Confirm warnings in legacy code are expected and do not block CI.  
**PR:** —

---

## Stage 1 — Foundation

### 1-1 · [ ] Migrate `client/api/`

**Scope:** Move `lib/api/**` → `client/api/**` (preserve `services/` structure).
Additional moves in the same PR:
- `lib/socket/` → `client/api/socket/`
- `lib/hooks/useFetch.ts` → `client/api/`
- `lib/api/services/utils.ts` → `client/api/types.ts`

Update all repo-wide imports. Verify `client/api` has no runtime imports from `client/slices/*` or
`client/features/*` (`import type` is permitted).  
**PR:** —

---

### 1-2 · [ ] Migrate `client/shared/`

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
**PR:** —

---

## Stage 2 — Pilot slice

### 2-1 · [ ] Pilot: migrate `slices/tx` end-to-end

**Scope:** Full migration of the `tx` slice. Canonical template for all subsequent slices.
- `lib/tx/` → `client/slices/tx/utils/`
- `lib/api/services/general/tx.ts` → `client/api/services/general/tx.ts` (if not already done in 1-1)
- `ui/tx/**` → `client/slices/tx/` (restructure into `pages/`, `components/`, `hooks/`, `utils/`, `types/`, `mocks.ts`, `stubs.ts`)
- Move associated `types/api/tx.ts` → `client/slices/tx/types/api.ts`
- Move associated `mocks/` and `stubs/` entries

Cross-slice dependencies (address types, rollup sub-types, etc.) may remain at their old `lib/` paths
after this PR — note each as an explicit follow-up in the PR description.  
**PR:** —

---

## Stage 3 — Core slices

Each slice follows the template established in 2-1.

### 3-1 · [ ] Slice: `block`
**Scope:** `lib/block/` (if any), `ui/block/**`, related `types/api/`, `mocks/`, `stubs/` → `client/slices/block/`  
**PR:** —

### 3-2 · [ ] Slice: `address`
**Scope:** `lib/address/`, `ui/address/**`, related types/mocks/stubs, `lib/hooks/useAddressProfileApiQuery`, `lib/contexts/addressHighlight.tsx` → `client/slices/address/`  
**PR:** —

### 3-3 · [ ] Slice: `search`
**Scope:** `lib/search/`, `ui/snippets/searchBar/`, `lib/recentSearchKeywords.ts`, related types/mocks/stubs → `client/slices/search/`  
**PR:** —

### 3-4 · [ ] Slice: `token`
**Scope:** `lib/token/`, `ui/token/**`, related types/mocks/stubs → `client/slices/token/`  
**PR:** —

### 3-5 · [ ] Slice: `contract`
**Scope:** `lib/contracts/`, `lib/solidityScan/`, `ui/contract/**`, related types/mocks/stubs → `client/slices/contract/`  
**PR:** —

### 3-6 · [ ] Slice: `internal-tx`
**Scope:** `ui/internalTxs/**` (and any `lib/` counterparts), related types/mocks/stubs → `client/slices/internal-tx/`  
**PR:** —

### 3-7 · [ ] Slice: `home`
**Scope:** `ui/home/**`, related types/mocks/stubs → `client/slices/home/`  
**PR:** —

### 3-8 · [ ] Slice: `tokens` (token list)
**Scope:** `ui/tokens/**`, related types/mocks/stubs → `client/slices/tokens/`  
**PR:** —

### 3-9 · [ ] Slice: `accounts`
**Scope:** `ui/accounts/**`, related types/mocks/stubs → `client/slices/accounts/`  
**PR:** —

### 3-10 · [ ] Slice: `token-instance`
**Scope:** `ui/tokenInstance/**`, related types/mocks/stubs → `client/slices/token-instance/`  
**PR:** —

---

## Stage 4 — Features: rollups

One PR per rollup type. Each goes under `client/features/rollup/<type>/`.

> Enumerate additional rollup tasks when this stage begins, based on what exists under `lib/rollups/` and `ui/`.

### 4-1 · [ ] Feature: `rollup/optimism`
**Scope:** All Optimism-specific UI, hooks, utils, types → `client/features/rollup/optimism/`. Includes fault proof system and dispute games.  
**PR:** —

### 4-2 · [ ] Feature: `rollup/arbitrum`
**Scope:** All Arbitrum-specific UI, hooks, utils, types → `client/features/rollup/arbitrum/`  
**PR:** —

### 4-3 · [ ] Feature: `rollup/zk-sync`
**Scope:** zkSync-specific UI, hooks, utils, types → `client/features/rollup/zk-sync/`. Check for other zk-based rollup types (scroll, polygon-zk-evm, etc.) and add tasks if needed.  
**PR:** —

---

## Stage 5 — Features: chain variants

One PR per chain variant. Each goes under `client/features/chain-variants/<name>/`.

### 5-1 · [ ] Feature: `chain-variants/celo`
**Scope:** All Celo-specific UI and logic including epochs → `client/features/chain-variants/celo/`. See `configs/app/features/celo.ts`.  
**PR:** —

### 5-2 · [ ] Feature: `chain-variants/tac`
**Scope:** TAC operations and bridge UI → `client/features/chain-variants/tac/`. See `configs/app/features/tac.ts`.  
**PR:** —

### 5-3 · [ ] Feature: `chain-variants/zeta-chain`
**Scope:** ZetaChain CCTX UI → `client/features/chain-variants/zeta-chain/`. See `configs/app/features/zetachain.ts`.  
**PR:** —

### 5-4 · [ ] Feature: `chain-variants/suave`
**Scope:** SUAVE Kettle UI → `client/features/chain-variants/suave/`. See `configs/app/features/suave.ts`.  
**PR:** —

### 5-5 · [ ] Feature: `chain-variants/mega-eth`
**Scope:** MegaETH Flashblocks UI → `client/features/chain-variants/mega-eth/`. See `configs/app/features/megaEth.ts` and `flashblocks.ts`.  
**PR:** —

### 5-6 · [ ] Feature: `chain-variants/beacon-chain`
**Scope:** Beacon chain deposits/withdrawals UI → `client/features/chain-variants/beacon-chain/`. See `configs/app/features/beaconChain.ts`.  
**PR:** —

---

## Stage 6 — Features: standalone

One PR per feature. Features that are pure infrastructure (analytics, monitoring, A/B flags) were
migrated to `client/shared/` in 1-2 and do not appear here.

### 6-1 · [ ] Feature: `user-ops`
**PR:** —

### 6-2 · [ ] Feature: `data-availability`
**PR:** —

### 6-3 · [ ] Feature: `multichain`
**Scope:** Includes `lib/multichain/`, `lib/contexts/multichain.tsx`, `ui/snippets/networkMenu/` → `client/features/multichain/`  
**PR:** —

### 6-4 · [ ] Feature: `name-domains` (BENS)
**Scope:** `configs/app/features/nameServices.ts` — use `name-domains` as folder name.  
**PR:** —

### 6-5 · [ ] Feature: `account`
**Scope:** Includes `lib/hooks/useGetCsrfToken`, `ui/snippets/auth/`, `ui/snippets/user/` → `client/features/account/`  
**PR:** —

### 6-6 · [ ] Feature: `stats`
**Scope:** `lib/stats/` and stats UI → `client/features/stats/`  
**PR:** —

### 6-7 · [ ] Feature: `gas-tracker`
**PR:** —

### 6-8 · [ ] Feature: `validators`
**PR:** —

### 6-9 · [ ] Feature: `marketplace`
**Scope:** Includes `lib/contexts/marketplace.tsx`, `lib/hooks/useGraphLinks` → `client/features/marketplace/`  
**PR:** —

### 6-10 · [ ] Feature: `rewards`
**Scope:** Includes `lib/contexts/rewards.tsx`, `lib/hooks/useRewardsActivity` → `client/features/rewards/`  
**PR:** —

### 6-11 · [ ] Feature: `advanced-filter`
**PR:** —

### 6-12 · [ ] Feature: `ad-banner`
**Scope:** Includes `lib/hooks/useAdblockDetect` → `client/features/ad-banner/`. Covers both `adsBanner.ts` and `adsText.ts` configs.  
**PR:** —

### 6-13 · [ ] Feature: `safe-address-tags`
**Scope:** Includes `lib/hooks/useIsSafeAddress` → `client/features/safe-address-tags/`. See `configs/app/features/safe.ts`.  
**PR:** —

### 6-14 · [ ] Feature: `metasuites`
**Scope:** Includes `lib/hooks/useNotifyOnNavigation` → `client/features/metasuites/`  
**PR:** —

### 6-15 · [ ] Feature: `csv-export`
**PR:** —

### 6-16 · [ ] Feature: `pools`
**PR:** —

### 6-17 · [ ] Feature: `hot-contracts`
**PR:** —

### 6-18 · [ ] Feature: `interchain-indexer`
**Scope:** Cross-chain message indexer (not ZetaChain). See `configs/app/features/crossChainTxs.ts`.  
**PR:** —

### 6-19 · [ ] Feature: `mud-framework`
**PR:** —

### 6-20 · [ ] Feature: `visualize`
**Scope:** Solidity-to-UML diagrams. See `configs/app/features/sol2uml.ts`.  
**PR:** —

### 6-21 · [ ] Feature: `tx-interpretation`
**PR:** —

### 6-22 · [ ] Feature: `public-tags`
**Scope:** Community address labels. See `configs/app/features/publicTagsSubmission.ts`.  
**PR:** —

### 6-23 · [ ] Feature: `address-widgets`
**Scope:** Third-party widgets on address pages. See `configs/app/features/address3rdPartyWidgets.ts`.  
**PR:** —

### 6-24 · [ ] Feature: `address-metadata`
**PR:** —

### 6-25 · [ ] Feature: `address-verification`
**Scope:** Covers `addressProfileAPI.ts` and `addressVerification.ts` configs.  
**PR:** —

### 6-26 · [ ] Feature: `bridged-tokens`
**PR:** —

### 6-27 · [ ] Feature: `web3-wallet`
**Scope:** Includes `blockchainInteraction.ts` config.  
**PR:** —

> Other small features (`externalTxs`, `xStarScore`, `deFiDropdown`, `getGasButton`, `easterEgg*`, `apiDocs`, `verifiedTokens`, `multichainButton`) — enumerate as separate tasks or group with related features when this stage begins.

---

## Stage 7 — Shell

### 7-1 · [ ] Migrate `client/shell`

**Scope:** Migrate after all slices and features it depends on are in place.
- `ui/snippets/header/`, `footer/`, `navigation/`, `topBar/` → `client/shell/`
- `lib/contexts/app.tsx`, `fallback.tsx` → `client/shell/`
- `lib/contexts/settings.tsx` → `client/shell/top-bar/`
- `lib/hooks/useNavItems` → `client/shell/`  
**PR:** —

---

## Stage 8 — Cleanup

### 8-1 · [ ] Remove legacy root directories

**Scope:** Confirm `lib/`, `ui/`, `mocks/`, `stubs/`, `types/` are empty (no remaining unconverted files).
Delete them. Fix any remaining lint warnings that referenced legacy paths.  
**PR:** —
