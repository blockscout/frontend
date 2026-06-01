# Slices — context

## Child-slice ownership

The slice that owns an entity owns its **rendering** — tables, lists, detail
panels, types. Other slices or features that surface the entity as a tab,
section, or sub-page import those views; they never reimplement them.

Default placement of parent-specific tab content: `<child>/pages/<parent>/`.
The parent imports it whole and mounts it as a tab.

```
src/slices/internal-tx/pages/tx/TxInternals.tsx     ← lives in internal-tx
src/slices/tx/pages/details/Transaction.tsx         ← imports and mounts it
```

**Escape hatch** — when the parent needs custom orchestration (parent-shaped
filters or queries), a thin wrapper page may live in the parent slice, but
it must compose the child's components, never reimplement them. Example:
`address/pages/details/internal-txs/AddressInternalTxs.tsx` composes
`InternalTxsTable` + `InternalTxsList` from `internal-tx/components/`.

**Direction rule** — child slices must remain unaware of their parents:
receive parent data via props/hooks, never `import` from a parent slice.
This keeps the dependency graph acyclic.

## API contract mirror

A slice's `types/api.ts` may `import type` feature- or chain-specific
sub-types from `src/features/...`. This looks like a layering violation but
is intentional: the backend response includes those fields unconditionally
when the matching feature is enabled, so the frontend type must mirror the
full contract.

Canonical example — `src/slices/tx/types/api.ts`:

```ts
import type { TransactionArbitrum }   from 'src/features/rollup/arbitrum/types/api';
import type { TransactionOptimistic } from 'src/features/rollup/optimism/types/api';
import type { TransactionCelo }       from 'src/features/chain-variants/celo/types/api';
import type { TransactionOpInterop }  from 'src/features/op-interop/types/api';

export interface Transaction extends
  TransactionArbitrum, TransactionOptimistic, TransactionCelo, TransactionOpInterop, /* … */ {
  // base tx fields
}
```

Do not "fix" this by moving sub-types into the slice — the feature owns the
sub-type because the feature owns the rendering.

## Per-slice quirks

- **`gas`** owns gas-price domain primitives (API types, `GasUnit`,
  formatters, display components) used unconditionally across `shell/`,
  `slices/home/`, `slices/tx/`. The config-gated tracker page is the
  separate `src/features/gas-tracker/` — different scope, do not merge.

