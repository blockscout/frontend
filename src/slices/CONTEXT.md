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

## Per-slice quirks

- **`gas`** owns gas-price domain primitives (API types, `GasUnit`,
  formatters, display components) used unconditionally across `shell/`,
  `slices/home/`, `slices/tx/`. The config-gated tracker page is the
  separate `src/features/gas-tracker/` — different scope, do not merge.

