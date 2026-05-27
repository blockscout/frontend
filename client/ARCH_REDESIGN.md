# Application architecture

---

## 1. Purpose

- **Co-locate** everything belonging to a **slice** (core explorer domain) or **feature** (optional / config-driven): UI, hooks, utils, API response types, runtime config, mocks, stubs.
- House all application source under **`/src`** — one directory for everything the bundler processes.
- Keep **clear boundaries** at the two critical points in the dependency graph (see §7).

---

## 2. Naming conventions

Aligned with **Next.js-style** paths: **kebab-case for directories** and for **non-component TS modules**.

| Artifact | Convention | Examples |
|----------|------------|----------|
| **Directories** | `kebab-case` | `slices/tx/`, `features/user-ops/`, `pages/tx-details/` |
| **React components** | `PascalCase.tsx` | `TxDetails.tsx`, `TxIndexTable.tsx` |
| **Hooks** | `use` + `camelCase` | `useTxQuery.ts`, `useIsMobile.ts` |
| **Helper / util modules** | `kebab-case.ts` | `format-tx-hash.ts`, `get-tab-list.ts` |
| **Role files** | lowercase | `types.ts`, `mocks.ts`, `stubs.ts`, `config.ts` |

**No re-export-only barrel files inside `/src`.** Deep imports are preferred; dumb barrels slow TypeScript server performance and break tree-shaking. Aggregation files that define or curate their own public surface (e.g. `src/api/services/general/index.ts` as a General API facade, or `src/config/index.ts` as the config aggregator) are acceptable where they provide genuine value.

---

## 3. Top-level repo layout

| Path | Role |
|------|------|
| **`/src`** | All application source — product UI, server plumbing, routing, config, design system, and assets directly imported by code |
| **`/configs/envs/`** | Env variable declarations — not yet absorbed into `src/`; dedicated refactor tracked separately |
| **`/deploy/`** | CI/CD scripts, Docker, env validator, build tools — operates on the app, not part of it |
| **`/public/`** | Static assets served as-is by the web server (sprite output, etc.) — never processed by the bundler |
| **`/docs/`** | ENVS.md, GLOSSARY.md, CONTRIBUTING.md |
| Root config files | `next.config.js`, `tsconfig.json`, `eslint.config.mjs`, `package.json` — tool configuration, not application code |

---

## 4. Inside `/src`

```text
src/
  api/          Transport, fetch utilities, query client, WebSocket, data-fetching hooks
  shell/        App chrome: layout, header, footer, navigation, top-bar, root contexts
  slices/       Core explorer entities — always present on any EVM chain
  features/     Optional / config-gated product areas
  shared/       Cross-cutting utilities with no single domain owner
  config/       Runtime app configuration (aggregator + cross-cutting parts)
  pages/        Next.js file-based routes — thin wrappers only
  server/       Next.js server plumbing: SSR helpers, middleware, CSP, headers, rewrites
  sprite/       SVG sprite runtime component + icon source files
  toolkit/      Design system (pnpm workspace package — developed in lockstep, publishable)
```

### 4.1 `src/shell`

Application **chrome**: layout, error UI, header, footer, page title, top-bar, and frame-level concerns. Includes root context providers (`app.tsx`, `fallback.tsx`), settings context, and `useNavItems`.

### 4.2 `src/api`

Transport layer — fetch, resources, URL building, query client wiring, WebSocket.

**Rule:** `src/api` must not have runtime imports from `src/slices/*` or `src/features/*`. `import type` is permitted for response-shape typing.

```text
src/api/
  hooks/              ← useApiFetch, useApiQuery, useApiInfiniteQuery, useFetch, …
  services/
    general/          ← Blockscout General API namespace
      tx.ts
      block.ts
      misc.ts
      rollup.ts
      v1.ts
      ...
    rewards.ts        ← feature-specific APIs stay flat alongside general/
    stats.ts
    user-ops.ts
    bens.ts
    ...
  types.ts            ← shared API types incl. IsPaginated
  socket/
```

### 4.3 `src/slices`

**Core explorer entities** — always part of the product surface on any vanilla EVM chain.

**Classification criterion:** *"Can this area exist on a vanilla EVM chain with no feature flag?"* Yes → slice. No → feature.

**Confirmed slices:** `tx`, `block`, `address`, `token`, `contract`, `internal-tx`, `search`, `home`, `token-transfer`, `log`, `gas`.

Notes:
- **`gas`** owns gas-price domain primitives — API types, `GasUnit`, display components, formatting utils. Used unconditionally across `shell/`, `slices/home/`, `slices/tx/`. The config-gated tracker page lives in `features/gas-tracker/`.
- **`internal-tx`** is its own slice; `tx` composes `internal-tx` components. Avoid back-imports (`internal-tx` → `tx`) to prevent cycles.
- **`contract`** includes contract verification and SolidityScan — available on any chain.

**Typical slice shape:**

```text
src/slices/tx/
  pages/
    index/
      TxIndex.tsx
      TxIndexTable.tsx
      ...
    details/
      TxDetails.tsx
      ...
  components/
  hooks/
  utils/
  types/
    api.ts        ← response / DTO types (stable external surface for cross-domain imports)
    client.ts     ← frontend-only types
    config.ts     ← zero-import constants needed by src/config/ (no imports — only const/type/interface)
  config.ts       ← slice-level env-derived config; imported by src/config/index.ts
  mocks.ts
  stubs.ts
```

**Routing rule:** one Next.js route ≈ one folder under `pages/` inside the slice or feature. The file under `src/pages/` stays a thin dynamic import.

**Public type surface:** external consumers (other slices, features, `src/api/services/`) must import types only from `<slice|feature>/types/api.ts`, never from deeper internal paths.

**Rollup sub-types:** `slices/tx/types/api.ts` imports feature-specific sub-types (e.g. `ArbitrumTransactionData`) from their respective feature via `import type` — mirrors the real API contract. This is intentional (see §8 example).

### 4.4 `src/features`

**Optional** product areas — config-gated or chain-specific.

**Classification rules:**
1. *"Can this area exist on a vanilla EVM chain with no feature flag?"* Yes → slice. No → feature.
2. Config-gated infrastructure with no user-facing UI (analytics, monitoring, A/B flags) → `src/shared/`, not `features/`.
3. Every config-gated feature with user-facing UI gets its own folder under `features/`, regardless of size.

**Rollups:** `features/rollup/<type>/` organized by rollup type (e.g. `optimism`, `arbitrum`, `scroll`, `zk-sync`, `shibarium`). Deposits, batches, and withdrawals are subfolders within each rollup type.

**Chain variants (non-rollup):** `features/chain-variants/<name>/` (e.g. `celo`, `tac`, `zeta-chain`, `mega-eth`, `suave`, `beacon-chain`).

**Typical feature shape:** same as slices — `pages/`, `components/`, `hooks/`, `utils/`, `types/`, `config.ts`, `mocks.ts`, `stubs.ts`.

### 4.5 `src/shared`

Cross-cutting utilities with no single domain owner.

- No files directly in `src/shared/` — only subfolders grouped by purpose.
- No barrel `index.ts` files.

| Subfolder | Contents |
|-----------|----------|
| `analytics/` | Mixpanel |
| `auth/` | JWT decode |
| `chain/` | Network utilities, units |
| `date-and-time/` | Time formatting hooks and utils |
| `errors/` | Error types + getErrorMessage |
| `feature-flags/` | Growthbook runtime A/B flags (distinct from build-time config) |
| `hooks/` | Generic hooks with no domain owner |
| `i18n/` | Locale utilities |
| `links/utils/` | URL helpers |
| `lists/` | Lazy/initial list hooks, getItemIndex |
| `metadata/` | Centralized route title/description map (see note below) |
| `monitoring/rollbar/` | Client-side error reporting |
| `router/` | Router utilities + query-param filter helpers |
| `storage/` | Cookies |
| `text/` | String utilities |
| `transformers/` | Hex / bytes / base64 conversion |
| `utils/` | Tiny misc utilities |
| `web3/` | Wagmi/Viem utilities |
| `entities/`, `pagination/`, `charts/` | Keep as-is |

**`src/shared/metadata/` note:** The route title/description map is a `Record<Route['pathname'], string>` with TypeScript exhaustiveness enforced across all routes. It stays centralized here to preserve that guarantee. It uses `import type` from relevant slices — a `shared → slice` type-only import is acceptable.

### 4.6 `src/config`

Runtime app configuration.

- **`src/config/index.ts`** — the single aggregator; the only config entry point for the rest of the application and the env validator. Assembles the full config object from cross-cutting parts and from each slice/feature's own `config.ts`.
- Cross-cutting configs with no feature owner live directly under `src/config/`:

```text
src/config/
  index.ts        ← aggregator; exports the full config object
  app.ts          ← app identity (name, logo, home URL, …)
  chain.ts        ← chain info (ID, name, currency, …)
  meta.ts         ← SEO meta defaults
  apis.ts         ← external API endpoint config
  services.ts     ← third-party service config
  ui.ts           ← global UI settings
  ui/             ← per-view UI config (block fields, tx views, address formats, …)
```

Feature and slice configs co-locate with their domain and are imported by the aggregator:

```text
src/features/account/
  config.ts       ← imported by src/config/index.ts

src/slices/tx/
  config.ts       ← imported by src/config/index.ts
  types/
    config.ts     ← zero-import constants (if also needed by configs/envs/ validator directly)
```

**`config.ts` rule:** A `config.ts` inside a slice/feature handles env-derived parsing for that domain. It may import from `configs/envs/` and from its own slice/feature's `types/config.ts` constants. It must **not** import React, browser APIs, or code from other slices/features — it is imported by the Node.js env validator.

**`types/config.ts` rule:** A `types/config.ts` inside a slice/feature has **zero imports** — only `const` arrays, derived `type` aliases, and pure interfaces. Used when the same constants must be shared between the `config.ts` parser and browser UI code without pulling in any dependencies.

### 4.7 `src/pages`

Next.js file-based routes. **Thin wrappers only** — a dynamic import and optionally an inline `getServerSideProps`. No UI components, business logic, or SEO metadata inline. SEO metadata lives in the slice/feature page folder.

**404 vs empty page:** invalid routes are handled here — they do not render the page component.

### 4.8 `src/server`

Next.js server plumbing: `getServerSideProps` factories, middleware, CSP configuration, HTTP headers, rewrites, redirects, route type generation, and server-side monitoring setup.

### 4.9 `src/sprite`

SVG sprite system.

```text
src/sprite/
  SpriteIcon.tsx    ← runtime component; reads sprite hash from config
  icons/            ← SVG source files; processed by svg:build-sprite; some imported directly as components
    brands/
    arrows/
    ...
  pages/            ← dev sprite preview page
```

The `svg:build-sprite` script reads `src/sprite/icons/` and outputs the generated sprite to `public/icons/`.

### 4.10 `src/toolkit`

Design system — Chakra UI wrappers, theme tokens, shared hooks and components. Published as `@blockscout/ui-toolkit` (pnpm workspace entry: `src/toolkit/package`). Internal structure is unchanged from the original `toolkit/` location.

---

## 5. Testing

Playwright visual tests (`*.pw.tsx`) stay co-located next to the implementation.

---

## 6. Dependency rules

Two hard boundaries, enforced as ESLint **errors**:

**1. `src/api` must not have runtime imports from `src/slices/*` or `src/features/*`.**
`import type` is permitted for response-shape typing. Rationale: keeps the transport layer free of UI logic and avoids circular instantiation.

**2. `config.ts` files and `types/config.ts` files must not import React, browser APIs, or code from other slices/features.**
They are executed by the Node.js env validator. Violations cause build-time failures in the validator.

All other cross-layer imports (slice → feature, feature → slice, feature → feature, shared → slice `import type`) are permitted. Use judgment to avoid cycles; prefer composition at the page level when optional UI plugs into a core screen.

---

## 7. Migration status

Stages 0–8 are complete. The remaining work is structural.

### Stage 9 — Config co-location

**9-1:** Create `src/config/index.ts` aggregator. Move cross-cutting configs from `configs/app/` to `src/config/`. Move each `configs/app/features/<name>.ts` → `client/features/<name>/config.ts` (interim path until stage 10). Wire into the aggregator. Update the env validator. Delete `configs/app/`.

### Stage 10 — Move everything into `src/`

**10-1:** Move `pages/` → `src/pages/`, `nextjs/` → `src/server/`, `icons/` → `src/sprite/icons/`, `toolkit/` → `src/toolkit/`. Rename `client/` → `src/`. Codemod all import paths. Update `pnpm-workspace.yaml`, `tsconfig.json`, `next.config.js`, and ESLint boundary patterns. Simplify boundary rules to the two critical rules from §6 in the same PR.

---

## 8. Example: rollup-specific field on tx page

Core tx UI stays in `slices/tx`. Arbitrum-specific presentation lives in `features/rollup/arbitrum/`. Compose at the `TxDetails` level so rollup imports are localized and cycles remain unlikely.

Types: `Transaction` in `slices/tx/types/api.ts` imports `ArbitrumTransactionData` via `import type` from the feature because the backend includes these fields unconditionally when the rollup is enabled — the frontend type must mirror the full API contract.

```text
src/
  api/
    services/
      general/
        tx.ts
          └─ import type { Transaction } from 'src/slices/tx/types/api'
  slices/
    tx/
      pages/
        details/
          TxDetails.tsx
            └─ import TxDetailsArbitrum from 'src/features/rollup/arbitrum/components/TxDetailsArbitrum'
      types/
        api.ts
          └─ import type { ArbitrumTransactionData } from 'src/features/rollup/arbitrum/types/api'
          export interface Transaction {
            // ... base tx fields ...
            arbitrum?: ArbitrumTransactionData
            optimism?: OptimismTransactionData
            scroll?: ScrollTransactionData
          }
  features/
    rollup/
      arbitrum/
        types/
          api.ts                       # owns ArbitrumTransactionData
        components/
          TxDetailsArbitrum.tsx
```
