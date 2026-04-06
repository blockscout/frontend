# Client architecture blueprint

---

## 1. Purpose

- **Co-locate** everything that belongs to a **slice** (core explorer domain) or **feature** (optional / config-driven) in one place: UI, hooks, utils, **API response types** for that area, mocks, stubs, etc.
- **Retire** top-level `lib/`, `mocks/`, `stubs/`, `types/` (and `ui/`) as *unscoped* buckets — their contents move under **`/client`** or other agreed homes (see §6).
- Keep **clear boundaries** so the graph stays maintainable (see §8).

---

## 2. Naming conventions (agreed)

Aligned with **Next.js-style** paths: **kebab-case for directories** and for **non-component TS modules** (helpers, parsers, constants files).

| Artifact | Convention | Examples |
|----------|------------|----------|
| **Directories** | `kebab-case` | `slices/tx/`, `features/user-ops/`, `pages/tx-details/` |
| **React components** | `PascalCase.tsx` | `TxDetails.tsx`, `TxIndexTable.tsx` |
| **Hooks** | `use` + `camelCase` in the filename (ecosystem norm) | `useTxQuery.ts`, `useIsMobile.ts` |
| **Helper / util modules** (non-hook) | `kebab-case.ts` | `format-tx-hash.ts`, `get-tab-list.ts` |
| **Role files** | lowercase | `types.ts`, `mocks.ts`, `stubs.ts` |

Same folder may contain `TxDetails.tsx`, `useTxQuery.ts` — hooks stay **`useCamelCase.ts`**; everything else non-component prefers **kebab-case**.

**No re-export-only barrel files inside `/client`.** Deep imports are preferred; dumb barrels (files that only `export * from ...`) slow TypeScript server performance and break tree-shaking at scale. Aggregation files that define or curate their own public surface (e.g. `client/api/services/general/index.ts` acting as a facade for the General API) are acceptable where they provide genuine value.

---

## 3. Top-level repo layout (conceptual)

| Path | Role |
|------|------|
| **`/client`** | Product explorer: shell, API client layer, slices, features, shared. Replaces **`/ui`** and absorbs most of **`lib`**, **`mocks`**, **`stubs`**, **`types`** (see §6). |
| **`/configs`** | Env-derived config and feature flags. **Must not import from `/client`.** Consts + types derived from those consts (e.g. supported ad providers) live here. |
| **`/nextjs`** | Next integration, SSR helpers, server utilities. |
| **`/pages`** | Next.js **file-based routes** only (thin wrappers — a dynamic import and `getServerSideProps` call; nothing else). **404 vs "empty page"** is defined here — invalid routes do not render the page component. |
| **`/toolkit`** | Design system and shared code **published to npm** / reused across company projects — **stays outside** `client`. Referenced as a local path alias during this migration; publishing scope is out of scope for this task. |
| **Root `lib/`** | **Removed** after migration except pieces explicitly moved elsewhere (e.g. monitoring → `nextjs`). |

---

## 4. Inside `/client`

### 4.1 `client/shell`

Application **chrome**: layout, error UI, header, footer, page title, top-bar, and other frame-level concerns.

**`ui/snippets/` split (complete):**

| Source | Destination |
|--------|-------------|
| `header/`, `footer/`, `navigation/`, `topBar/` | `client/shell/` |
| `searchBar/` | `client/slices/search/` |
| `networkLogo/` | `client/shared/` |
| `networkMenu/` | `client/features/multichain/` |
| `auth/`, `user/` | `client/features/account/` |

**Context split from `lib/contexts/`:**

| Source | Destination |
|--------|-------------|
| `app.tsx`, `fallback.tsx` | `client/shell/` |
| `settings.tsx` | `client/shell/top-bar/` (alongside `TopBar` component) |
| `multichain.tsx` | `client/features/multichain/` |
| `rewards.tsx` | `client/features/rewards/` |
| `marketplace.tsx` | `client/features/marketplace/` |
| `addressHighlight.tsx` | `client/slices/address/` |

**Hooks from `lib/hooks/`:**

- `useNavItems` → `client/shell/`
- Everything else generic → `client/shared/hooks/` (see §4.5)

### 4.2 `client/api`

- **Full migration** of today's **`lib/api`** (transport: fetch, resources, URL building, query client wiring, etc.).
- **`client/api` must not import runtime logic** from `client/slices/*` or `client/features/*` (avoids cycles). **`import type`** from slices is permitted when an API service file maps a resource to its response type — the type lives with the slice that owns it, and `client/api` references it for the payload mapping only.
- **Per-resource response types** and view-specific types are **not** centralized under `client/api`; they live in the **slice or feature** that owns the domain (co-location with hooks/components).
- **WebSocket transport** (`lib/socket/`) → `client/api/socket/` — same reasoning as fetch: it is a transport mechanism, not a UI concern.

**`client/api/services/` structure:**

Keep the current organization largely intact. Do not flatten everything into a 1:1 mapping with slices — feature services often have only one or two resources and do not warrant separate files.

`general/` maps to the **Blockscout General API namespace** — it is not restricted to vanilla-EVM resources. Files inside it follow the API grouping, not the slice/feature taxonomy.

```text
client/api/
  services/
    general/          ← Blockscout General API namespace; only split files inside where genuinely needed
      tx.ts
      block.ts
      misc.ts         ← resources with no clear single-domain home stay here
      rollup.ts       ← rollup resources are part of the General API
      v1.ts           ← previous API version; one active resource
      ...
    rewards.ts        ← feature-specific APIs stay flat alongside general/
    stats.ts
    user-ops.ts
    bens.ts
    ...
  types.ts            ← shared API types incl. IsPaginated (absorbs services/utils.ts)
  socket/             ← migrated from lib/socket/
```

### 4.3 `client/slices`

**Core explorer entities** — always part of the product surface (not optional "features" in the `configs/app/features` sense).

**Classification criterion:** *"Can this area exist on a vanilla EVM chain with no feature flag?"* Yes → slice. No (requires a `configs/app/features` flag) → feature.

**Confirmed slices (non-exhaustive):** `tx`, `block`, `search`, `token`, `address`, `contract`, `internal-tx`, `home`, `tokens`, `accounts`, `token-instance`, …

- **`contract` (slice):** **Contract verification** and **SolidityScan** (`lib/solidityScan/`) are **slice** concerns (available on any chain).
- **`internal-tx` (slice):** Own slice; **`tx`** composes **internal-tx** components (e.g. tab content). Prefer **no imports** from `internal-tx` back into `tx` to avoid cycles; share via **`client/shared`** or a **thin types-only surface** if needed.

**Rollup sub-types on slice types:** `slices/tx/types/api.ts` imports feature-specific sub-types (e.g. `ArbitrumTransactionData`) from their respective feature via `import type`. Optional fields fan out at the slice type level — this mirrors the real API contract and is intentional (see §11).

**Typical slice shape:**

```text
client/slices/tx/
  pages/
    tx-index/           # kebab-case folder = one "screen" / route target
      TxIndex.tsx
      TxIndexTable.tsx
      ...
    tx-details/
      TxDetails.tsx
      ...
  components/
  hooks/                 # e.g. useTxQuery.ts
  utils/                 # kebab-case .ts files
  types/
    api.ts               # response / DTO types owned by this slice
  mocks.ts
  stubs.ts
```

**Routing rule:** **One Next route ≈ one folder under** `pages/` inside the slice (or feature). The **file** under root `pages/` stays a thin dynamic import into `client/...`.

### 4.4 `client/features`

**Optional** product areas — **roughly mirrors `configs/app/features`**, but:

- Folders may exist for **readability and maintenance** (e.g. per rollup type) even when not everything is enabled for a given chain; **runtime behavior** still comes from **config/env**, not "folder exists = on."

**Confirmed features (non-exhaustive):** `user-ops`, `data-availability`, `multichain`, `name-domains`, `account`, `stats`, `gas-tracker`, `validators`, `marketplace`, `rewards`, `rollup/*`, `chain-variants/*`, `advanced-filter`, `ad-banner`, `safe-address-tags`, `metasuites`, `csv-export`, …

- **`stats` and `gas-tracker`** are **features** (not slices) — they are config-gated per chain.
- **`validators`** is a **feature** — chain-specific, not present on a vanilla EVM chain.
- **`epochs`** is a sub-concern of the Celo chain variant (`features/chain-variants/celo/`), not a standalone feature.
- **`data-availability`** was previously referred to as `blobs` — use `data-availability` throughout.

**Classification rules:**
1. *"Can this area exist on a vanilla EVM chain with no feature flag?"* Yes → slice. No → feature.
2. **Config-gated infrastructure with no user-facing UI** (analytics providers, error monitoring, A/B flag providers) lives in **`client/shared/`**, not `features/` — the presence of a config flag alone is not sufficient to qualify for a feature folder.
3. Every config-gated feature with user-facing UI gets its own folder under `features/`, regardless of size — consistency and discoverability outweigh folder count.

**Chain-specific non-rollup features** — chain variants that are not rollups (ZetaChain, TAC, SUAVE, Celo, MegaETH, Beacon chain, etc.) are grouped under **`features/chain-variants/<name>/`**, parallel to `features/rollup/<type>/`. Example: `features/chain-variants/celo/`, `features/chain-variants/tac/`, `features/chain-variants/zeta-chain/`.

**Variant / chain-specific transaction lists** (e.g. kettle, zeta-specific list UIs) live under **`features/<name>/pages/...`**, **not** as variants inside `slices/tx`.

**Rollups:** `features/rollup/<rollup-type>/` (e.g. `optimism`, `arbitrum`, …) — **organized by rollup type**, because **views and helpers differ by rollup**. Sub-areas (deposits, batches, withdrawals) are **subfolders** under that rollup, not separate top-level rollup taxonomies.

**Chain variants (non-rollup):** `features/chain-variants/<name>/` (e.g. `celo`, `tac`, `zeta-chain`, `mega-eth`, `suave`, `beacon-chain`) — same sub-folder structure as rollups.

**Typical feature shape:** same idea as slices — `pages/`, `components/`, `hooks/`, `utils/`, `types/`, `mocks.ts`, `stubs.ts`.

### 4.5 `client/shared`

**Cross-cutting UI and helpers** with **no single domain owner**.

- **No files directly in `client/shared/`** — only **subfolders** grouped by purpose.
- **No `index.ts` barrel files** (same rule as the rest of `/client`).

**Confirmed subfolders (round 2 decisions):**

| Subfolder | Contents / origin |
|-----------|-------------------|
| `analytics/` | `lib/mixpanel/` |
| `auth/` | `lib/decodeJWT.ts` |
| `chain/` | `lib/networks/` (all `network` → `chain` renamed) + `lib/units.ts` |
| `date-and-time/` | `lib/hooks/useTimeAgoIncrement` and similar date utils |
| `errors/` | `lib/errors/` |
| `feature-flags/` | `lib/growthbook/` (runtime A/B flags — distinct from build-time `configs/`) |
| `hooks/` | Generic hooks from `lib/hooks/` with no single domain owner |
| `i18n/` | `lib/setLocale.ts` |
| `links/utils/` | `lib/utils/stripUtmParams.ts` and URL-related helpers |
| `lists/` | `lib/hooks/useLazyRenderedList`, `lib/hooks/useInitialList`, `lib/getItemIndex.ts` |
| `metadata/` | `lib/metadata/` (centralized — see note below) |
| `monitoring/rollbar/` | `lib/rollbar/` (client-side observability infrastructure) |
| `router/` | `lib/router/` + query-param filter helpers (`getFilterValueFromQuery`, etc.) |
| `storage/` | `lib/cookies.ts` |
| `text/` | `lib/capitalizeFirstLetter.ts`, `shortenString.ts`, `escapeRegExp.ts`, `highlightText.ts` |
| `transformers/` | Hex / bytes / base64 conversion utils (`hexToBytes`, `base64ToHex`, etc.) |
| `utils/` | Tiny misc utilities with no better home (`delay.ts`, `isMetaKey.tsx`) |
| `web3/` | `lib/web3/` |
| *(existing)* | `pagination/`, `charts/`, `entities/`, etc. — keep as-is |

**`client/shared/metadata/` note:** The title/description template map is a routing manifest (`Record<Route['pathname'], string>`) with TypeScript exhaustiveness enforced across all routes. Splitting it into slices/features loses that guarantee. It stays **centralized** in `client/shared/metadata/`. The `ApiData<Pathname>` type within it uses `import type` from the relevant slices (e.g. `TokenInfo` from `slices/token/types/api.ts`) — a shared → slice `import type` is acceptable here (no cycle, no runtime import).

---

## 5. Config vs client

- **`/configs` never imports `/client`.**
- Types that describe **config shape** (including types **derived from consts** in config, e.g. supported ad banner providers) live **in config** next to the relevant feature/config module.
- **`/client`** imports **`/configs`** for feature flags and app configuration.
- **Runtime feature flags** (Growthbook A/B) live in **`client/shared/feature-flags/`** — they require a React context and cannot live in `configs/`.

---

## 6. Migration map (sources → destinations)

### `ui/` → `client/`

| Current | Destination |
|---------|-------------|
| `ui/**` | `client/**` (restructured into shell / slices / features / shared) |
| `ui/snippets/header/`, `footer/`, `navigation/`, `topBar/` | `client/shell/` |
| `ui/snippets/searchBar/` | `client/slices/search/` |
| `ui/snippets/networkLogo/` | `client/shared/` |
| `ui/snippets/networkMenu/` | `client/features/multichain/` |
| `ui/snippets/auth/`, `user/` | `client/features/account/` |

### `lib/` → destinations

| Current | Destination |
|---------|-------------|
| `lib/api/**` | `client/api/**` (services structure preserved; `services/utils.ts` → `client/api/types.ts`) |
| `lib/socket/` | `client/api/socket/` |
| `lib/monitoring/` | `nextjs/` |
| `lib/rollbar/` | `client/shared/monitoring/rollbar/` |
| `lib/metadata/` | `client/shared/metadata/` |
| `lib/router/` | `client/shared/router/` |
| `lib/web3/` | `client/shared/web3/` |
| `lib/errors/` | `client/shared/errors/` |
| `lib/mixpanel/` | `client/shared/analytics/` |
| `lib/growthbook/` | `client/shared/feature-flags/` |
| `lib/networks/` + `lib/units.ts` | `client/shared/chain/` (rename `network` → `chain` throughout) |
| `lib/hooks/useNavItems` | `client/shell/` |
| `lib/hooks/useTimeAgoIncrement` | `client/shared/date-and-time/` |
| `lib/hooks/useLazyRenderedList` | `client/shared/lists/` |
| `lib/hooks/useInitialList` | `client/shared/lists/` |
| `lib/hooks/useRewardsActivity` | `client/features/rewards/` |
| `lib/hooks/useAddressProfileApiQuery` | `client/slices/address/` |
| `lib/hooks/useFetch` | `client/api/` |
| `lib/hooks/useGetCsrfToken` | `client/features/account/` |
| `lib/hooks/useGraphLinks` | `client/features/marketplace/` |
| `lib/hooks/useAdblockDetect` | `client/features/ad-banner/` |
| `lib/hooks/useIsSafeAddress` | `client/features/safe-address-tags/` |
| `lib/hooks/useNotifyOnNavigation` | `client/features/metasuites/` |
| `lib/hooks/` (remaining) | `client/shared/hooks/` |
| `lib/contexts/app.tsx`, `fallback.tsx` | `client/shell/` |
| `lib/contexts/settings.tsx` | `client/shell/top-bar/` |
| `lib/contexts/multichain.tsx` | `client/features/multichain/` |
| `lib/contexts/rewards.tsx` | `client/features/rewards/` |
| `lib/contexts/marketplace.tsx` | `client/features/marketplace/` |
| `lib/contexts/addressHighlight.tsx` | `client/slices/address/` |
| `lib/tx/` | `client/slices/tx/utils/` |
| `lib/token/` | `client/slices/token/` |
| `lib/address/` | `client/slices/address/` |
| `lib/rollups/` | `client/features/rollup/` |
| `lib/multichain/` | `client/features/multichain/` |
| `lib/search/` | `client/slices/search/` |
| `lib/contracts/` | `client/slices/contract/` |
| `lib/solidityScan/` | `client/slices/contract/` |
| `lib/stats/` | `client/features/stats/` |
| `lib/utils/stripUtmParams.ts` | `client/shared/links/utils/` |
| `lib/capitalizeFirstLetter.ts`, `shortenString.ts`, `escapeRegExp.ts`, `highlightText.ts` | `client/shared/text/` |
| `lib/base64ToHex.ts`, `bytesToBase64.ts`, `bytesToHex.ts`, `hexToBase64.ts`, `hexToBytes.ts`, `hexToAddress.ts`, `hexToDecimal.ts`, `hexToUtf8.ts` | `client/shared/transformers/` |
| `lib/cookies.ts` | `client/shared/storage/` |
| `lib/decodeJWT.ts` | `client/shared/auth/` |
| `lib/setLocale.ts` | `client/shared/i18n/` |
| `lib/delay.ts`, `lib/isMetaKey.tsx` | `client/shared/utils/` |
| `lib/recentSearchKeywords.ts` | `client/slices/search/` |
| `lib/getFilterValueFromQuery.ts`, `getFilterValuesFromQuery.ts`, `getValuesArrayFromQuery.ts` | `client/shared/router/` |
| `lib/getItemIndex.ts` | `client/shared/lists/` |
| `lib/getErrorMessage.ts` | `client/shared/errors/` |

### Other sources

| Current | Destination |
|---------|-------------|
| `mocks/**`, `stubs/**` | Co-located **`mocks.ts` / `stubs.ts`** under the relevant **slice/feature**; shared test data → `client/shared/...` if truly cross-domain |
| `types/api/*`, `types/client/*`, etc. | **Slice/feature `types/`** (and config-owned types → `configs`) — **not** a single global `types/` tree at repo root after migration |

**Migration process:** **incremental PRs/tasks** — update all imports in the **same PR** as the move. **No long-lived re-export shims.** Import path updates for test files can be scripted with a codemod.

---

## 7. Testing

- **Playwright / visual tests:** stay **next to** the implementation (e.g. `*.pw.tsx` alongside components), same as today.

---

## 8. Dependency rules (high level)

- **ESLint rules (`import/no-cycle` + explicit `boundaries` rules for `client/api`, `configs`, `toolkit`) must be enabled _before_ the migration starts.** Running them against the existing code surfaces real problem areas cheaply, before they become migration blockers.
- **Enforcement strategy: warn on legacy, error on new.** Configure boundary rules to emit **errors** only within `client/`; legacy `lib/` and `ui/` paths receive **warnings** only. This avoids a costly upfront clean-up of the entire codebase while ensuring every migrated file is immediately held to the new standard.
- **Guidelines:**
  - **`client/api`** allows **`import type`** from slices/features for response-shape typing; **no runtime imports** (no logic, hooks, or components — types only).
  - **Slice → feature type imports** are intentional: the backend includes feature-specific fields (e.g. `arbitrum?`, `scroll?`) in API responses unconditionally when the rollup is enabled — the frontend type must mirror the full API contract. UI component imports follow the same direction (e.g. `TxDetails` imports `TxDetailsArbitrum`).
  - **`client/shared` → slice `import type`** is acceptable where shared infrastructure genuinely needs a slice-owned type (e.g. `client/shared/metadata/` referencing `TokenInfo` from `slices/token/types/api.ts`). No runtime imports from shared → slice.
  - **Avoid circular graphs** between slices/features; use **composition at a shallow level** (page or a single container component) when optional UI plugs into a core screen.
  - **`internal-tx` → `tx`:** avoid **`tx` → `internal-tx` → `tx`** cycles; lift shared bits to **`shared`** or **types-only** exports.

---

## 9. Config ↔ feature folder naming

- **Feature directories** under `client/features/`: **`kebab-case`** (`user-ops`, `name-domains`).
- **Config files** under `configs/app/features/`: **migrate to `kebab-case`** in a **single dedicated pre-migration PR** (before feature folder migration starts), so config file names and feature folder names share one mental model.

---

## 10. Migration execution plan

### Order of operations

1. **Pre-migration PR:** rename `configs/app/features/` files to kebab-case.
2. **Pre-migration PR:** enable ESLint `import/no-cycle` + `boundaries` rules; fix existing violations.
3. **Bottom-up migration:** start with `client/api` and `client/shared` (lowest in the dependency graph, most imported). Establishes the foundation without touching any UI.
4. **Pilot slice — `tx`:** migrate `lib/tx/`, the `tx` API service, `ui/tx/**`, hooks, types, mocks end-to-end. Use the result as the canonical template for all subsequent slices.
5. **Remaining slices** in parallel (one PR per slice).
6. **Features** in parallel (one PR per feature or logical group).
7. **`client/shell`** — migrate after slices/features it depends on are in place.
8. **Remove root `lib/`** — confirm empty, delete.

### Rules during migration

- Update **all imports in the same PR** as the file move — no shims. For high-fanout files use an automated codemod as a dedicated commit within the branch.
- **Rename to kebab-case at move time** — file moves and naming convention changes happen in one pass, never two separate PRs.
- Each PR leaves ESLint green within `client/`; do not merge with new cycle/boundary violations inside `client/`.
- **`types/api.ts` is the stable external type surface** for each slice/feature. External consumers (other slices, features, `client/api/services/`) must import types only from `<slice|feature>/types/api.ts`, never from deeper internal paths. Enforced via ESLint `boundaries`.
- `pages/` thin wrappers: **no UI component or business logic** — a dynamic import and, if needed, a `getServerSideProps` inline (per-page logic may stay inline; only shared/reusable SSR helpers move to `nextjs/`). SEO metadata lives in the slice/feature page folder.
- **Tx pilot PR strategy:** migrate the tx slice end-to-end (UI, hooks, utils, types, mocks) while leaving cross-slice dependencies (address, rollup types, etc.) at their old `lib/` paths. Every remaining old-path import in `client/slices/tx/` after the pilot becomes an explicit migration task for the relevant slice/feature PR.

---

## 11. Open topics (round 4)

- [x] ~~**Path aliases**~~ — `baseUrl: "."` in `tsconfig.json` makes `client/**` absolute imports work without explicit `paths` entries. No action needed.
- [x] ~~**Public type surfaces**~~ — `types/api.ts` is the stable external surface per slice/feature; documented in §10. Cross-slice `types/client.ts` imports left as an open question to resolve with real examples during implementation.
- [x] ~~**Storybook / toolkit**~~ — project does not use Storybook. Topic closed.
- [x] ~~**`lib/hooks/` full audit**~~ — all hooks explicitly placed; see §6 migration map.
- [x] ~~**`lib/api/services/general/` audit**~~ — all files stay under `general/` (General API namespace). No splits needed beyond existing file boundaries.
- [x] ~~**Project glossary**~~ — a `GLOSSARY.md` (or section in CONTRIBUTING) mapping internal codenames to their product/feature meaning (e.g. `tac` → Ton Application Chain, `blobs`/`data-availability`, `cctx` → cross-chain transactions, `epochs` → Celo epoch pages). Aids both engineers and agents navigating the codebase.

---

## 12. Example: rollup-specific field on tx page

- **Core** tx UI stays in **`slices/tx`**.
- **Arbitrum-only** (or other rollup) presentation lives in **`features/rollup/arbitrum/`**.
- **Compose** at a **high level** (`tx-details` page or `TxDetails` section) so rollup-specific imports are localized and **cycles** remain unlikely.
- **Types:** the `Transaction` type in `slices/tx/types/api.ts` imports feature-specific sub-types (e.g. `ArbitrumTransactionData` from `features/rollup/arbitrum/types/api.ts`) because the backend includes these fields in the response unconditionally when the rollup is enabled — the frontend type must reflect the full API contract. `client/api` then references `Transaction` via `import type` from the slice. UI component imports follow the same direction: `TxDetails` imports `TxDetailsArbitrum`.

### File layout for this example

```text
client/
  api/
    services/
      general/
        tx.ts
          └─ import type { Transaction } from 'client/slices/tx/types/api'
  slices/
    tx/
      pages/
        tx-details/
          TxDetails.tsx
            └─ import TxDetailsArbitrum from 'client/features/rollup/arbitrum/components/TxDetailsArbitrum'
      types/
        api.ts                         # owns the Transaction interface
          └─ import type { ArbitrumTransactionData } from 'client/features/rollup/arbitrum/types/api'
          export interface Transaction {
            // ... base tx fields ...
            arbitrum?: ArbitrumTransactionData
            optimism?: OptimismTransactionData
            scroll?: ScrollTransactionData
            // ... other rollup optional fields ...
          }
  features/
    rollup/
      arbitrum/
        types/
          api.ts                       # owns ArbitrumTransactionData
        components/
          TxDetailsArbitrum.tsx
```

---
