# Client architecture blueprint (draft — round 1)

Living document: extend after further design rounds. Intended for **human engineers and agents** implementing the migration.

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
| **Role / barrel files** | lowercase | `types.ts`, `mocks.ts`, `stubs.ts`, `index.ts` |

Same folder may contain `TxDetails.tsx`, `use-tx-query.ts` — hooks stay **`useCamelCase.ts`**; everything else non-component prefers **kebab-case**.

---

## 3. Top-level repo layout (conceptual)

| Path | Role |
|------|------|
| **`/client`** | Product explorer: shell, API client layer, slices, features, shared. Replaces **`/ui`** and absorbs most of **`lib`**, **`mocks`**, **`stubs`**, **`types`** (see §6). |
| **`/configs`** | Env-derived config and feature flags. **Must not import from `/client`.** Consts + types derived from those consts (e.g. supported ad providers) live here. |
| **`/nextjs`** | Next integration, SSR helpers, server utilities. |
| **`/pages`** | Next.js **file-based routes** only (thin wrappers). **404 vs “empty page”** is defined here — invalid routes do not render the page component. |
| **`/toolkit`** | Design system and shared code **published to npm** / reused across company projects — **stays outside** `client`. |
| **Root `lib/`** | **Removed** after migration except pieces explicitly moved elsewhere (e.g. monitoring → `nextjs`). |

---

## 4. Inside `/client`

### 4.1 `client/shell`

Application **chrome**: layout, error UI, header, footer, page title, and other frame-level concerns.

Former **`ui/snippets`** that belong to the frame are **split** and moved here or into the right slice/feature:

- **Search bar** → **`slices/search`** (not shell-only).
- **Auth / account entry** → **`features/account`** (or equivalent).
- **Header / footer / layout** composition → **`shell`**.

### 4.2 `client/api`

- **Full migration** of today’s **`lib/api`** (transport: fetch, resources, URL building, query client wiring, etc.).
- **`client/api` must not import runtime logic** from `client/slices/*` or `client/features/*` (avoids cycles). **`import type`** from slices is permitted when an API service file maps a resource to its response type — the type lives with the slice that owns it, and `client/api` references it for the payload mapping only.
- **Per-resource response types** and view-specific types are **not** centralized under `client/api`; they live in the **slice or feature** that owns the domain (co-location with hooks/components).

### 4.3 `client/slices`

**Core explorer entities** — always part of the product surface (not optional “features” in the `configs/app/features` sense).

**Examples (non-exhaustive):** `tx`, `block`, `search`, `token`, `address`, `contract`, `internal-tx`, `home`, …

- **`contract` (slice):** **Contract verification** is a **slice** concern (available on any chain), **not** a `features/*` entry.
- **`internal-tx` (slice):** Own slice; **`tx`** composes **internal-tx** components (e.g. tab content). Prefer **no imports** from `internal-tx` back into `tx` to avoid cycles; share via **`client/shared`** or a **thin types-only surface** if needed.

**Typical slice shape:**

```text
client/slices/tx/
  pages/
    tx-index/           # kebab-case folder = one “screen” / route target
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

- Folders may exist for **readability and maintenance** (e.g. per rollup type) even when not everything is enabled for a given chain; **runtime behavior** still comes from **config/env**, not “folder exists = on.”

**Examples:** `user-ops`, `blobs`, `multichain`, `name-domains`, `account`, …

**Variant / chain-specific transaction lists** (e.g. kettle, zeta-specific list UIs) live under **`features/<name>/pages/...`**, **not** as variants inside `slices/tx`.

**Rollups:** `features/rollup/<rollup-type>/` (e.g. `optimism`, `arbitrum`, …) — **organized by rollup type**, because **views and helpers differ by rollup**. Sub-areas (deposits, batches, withdrawals) are **subfolders** under that rollup, not separate top-level rollup taxonomies.

**Typical feature shape:** same idea as slices — `pages/`, `components/`, `hooks/`, `utils/`, `types/`, `mocks.ts`, `stubs.ts`.

### 4.5 `client/shared`

**Cross-cutting UI and helpers** with **no single domain owner**.

- **No files directly in `client/shared/`** — only **subfolders** grouped by purpose (`pagination`, `charts`, `entities`, `hooks`, `router`, …).
- Examples to migrate from current `lib` / `ui/shared`: `useQueryWithPages` → e.g. `shared/pagination/`; very generic hooks → `shared/hooks/` or a dedicated subfolder.

---

## 5. Config vs client

- **`/configs` never imports `/client`.**
- Types that describe **config shape** (including types **derived from consts** in config, e.g. supported ad banner providers) live **in config** next to the relevant feature/config module.
- **`/client`** imports **`/configs`** for feature flags and app configuration.

---

## 6. Migration map (sources → destinations)

| Current | Destination |
|---------|-------------|
| `ui/**` | `client/**` (restructured into shell / slices / features / shared) |
| `ui/snippets/**` | `client/shell`, `client/slices/search`, `client/features/account`, etc. |
| `lib/api/**` | `client/api/**` |
| Other `lib/**` (hooks, router, errors, web3, …) | `client/shared/**` or the **slice/feature** that owns the usage — case by case |
| `lib/monitoring/**` | **`nextjs/`** (used from Next server / `pages/api`, not browser) |
| `mocks/**`, `stubs/**` | Co-located **`mocks.ts` / `stubs.ts`** (or folders) under the relevant **slice/feature**; shared test data → `client/shared/...` if truly cross-domain |
| `types/api/*`, `types/client/*`, etc. | **Slice/feature `types/`** (and config-owned types → `configs`) — **not** a single global `types/` tree at repo root after migration |

**Monitoring:** no client-side monitoring in scope for now; server metrics stay in **nextjs**.

**Migration process:** **incremental PRs/tasks**; update imports in each task. **No** long-lived re-export shim unless the team later decides otherwise.

---

## 7. Testing

- **Playwright / visual tests:** stay **next to** the implementation (e.g. `*.pw.tsx` alongside components), same as today.

---

## 8. Dependency rules (high level)

- Prefer **eslint** enforcement over a long written matrix: e.g. **`import/no-cycle`**, and optionally **boundaries** rules.
- **Guidelines:**
  - **`client/api`** allows **`import type`** from slices/features for response-shape typing; **no runtime imports** (no logic, hooks, or components — types only).
  - **Slice → feature type imports** are intentional: the backend includes feature-specific fields (e.g. `arbitrum?`, `scroll?`) in API responses unconditionally when the rollup is enabled — the frontend type must mirror the full API contract. UI component imports follow the same direction (e.g. `TxDetails` imports `TxDetailsArbitrum`).
  - **Avoid circular graphs** between slices/features; use **composition at a shallow level** (page or a single container component) when optional UI plugs into a core screen.
  - **`internal-tx` → `tx`:** avoid **`tx` → `internal-tx` → `tx`** cycles; lift shared bits to **`shared`** or **types-only** exports.

---

## 9. Config ↔ feature folder naming

- **Feature directories** under `client/features/`: **`kebab-case`** (`user-ops`, `name-domains`).
- **Config files** under `configs/app/features/`: keep **consistent** with existing repo style (`userOps.ts` vs `user-ops.ts`) — align in a **single** convention pass to avoid mixed mental models.

---

## 10. Next rounds (open topics)

Use this list for follow-up design passes:

- [ ] **Full inventory of slices** — classify ambiguous areas (`stats`, `gas-tracker`, `epochs`, `validators`, marketplace, rewards, …) as slice vs feature vs `shared`.
- [ ] **Exact `lib/*` split** — each remaining module: `client/api` vs `shared/*` vs specific slice/feature.
- [ ] **ESLint config** — enable `import/no-cycle`; add explicit boundary rules for `client/api`, `configs`, `toolkit`.
- [ ] **Path aliases** — `client/*` imports; document in TS config / CONTRIBUTING.
- [ ] **Public type surfaces** — if a feature needs types from a slice, document **thin** exports (e.g. `slices/tx/types/index.ts`) to avoid deep imports and cycles.
- [ ] **Storybook / toolkit** — if any stories live under `client`, how they resolve paths to `toolkit`.

---

## 11. Example: rollup-specific field on tx page

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

*End of round 1 blueprint.*