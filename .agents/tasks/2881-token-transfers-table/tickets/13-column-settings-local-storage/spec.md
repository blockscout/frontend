# 13 — Column settings in localStorage, persisted on the advanced filter too

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 13 of #2881 |
| Blocked by | T12 |

## What to build

Column visibility and order move from the `token_transfer_columns` cookie to localStorage, and the
advanced filter page persists its columns the same way instead of holding them in component state.

The cookie grows with every surface and every future configurable table, is capped at 4 KB (past which the
browser drops it silently), and rides on every same-origin request. localStorage has none of these limits;
the price is that the server cannot read it, so a hard reload renders the default headers over the
placeholder skeleton and switches to the user's columns at hydration. Neither table's data is
server-fetched, so the switch happens before any row data is shown. Client-side navigation reads storage
synchronously and shows the user's columns at once.

The persistence logic becomes table-agnostic and moves to `src/shared/lists/columns/`, together with the
selector components. The token-transfer slice keeps its column registry and per-surface states and wraps
the shared hook; the advanced filter uses the shared hook directly.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`; on `/token-transfers` hide and move a column, hard-reload, then open
an address tab; open a second tab of the same page and change columns in the first; on `/advanced-filter`
hide and move a column, reload, Reset

- [ ] `ColumnsButton`, `ColumnListRow`, `ColumnListSortable`, `ColumnListStatic` and
      `ColumnsButton.spec.tsx` move from `src/shared/filters/` to `src/shared/lists/columns/`; every
      importer is updated; behaviour unchanged.
- [ ] One localStorage key per table + surface, all sharing the `table_columns_` prefix:
      `table_columns_token_transfers_{index|address|token|tx}` and `table_columns_advanced_filter`.
      Each value is `{ visibility?: { [id]: boolean }, order?: Array<id> }` holding only deviations from
      that table's defaults (same omission rules as T12); Reset removes the key. The value carries nothing
      instance-specific.
- [ ] Parsing is tolerant: invalid JSON or a non-object value reads as "no overrides"; unknown ids are
      dropped; available ids missing from a stored order are appended in default order.
- [ ] `usePersistedColumns({ storageKey, columns, states, analytics })` in `src/shared/lists/columns/`
      (name indicative). `columns` is the registry in default order (`{ id, name }`), `states` maps every
      id to `'on' | 'off' | 'unavailable'`, `analytics` is typed as
      `Omit<EventPayload<EventTypes.TABLE_COLUMNS>, 'Column' | 'State'>`. Returns the same shape as
      today's `useTokenTransferColumns` (`columns`, `selectableColumns`, `checkedColumns`, `isCustomized`,
      `onColumnsChange`, `onColumnsReorder`, `onColumnsReset`). The hook has no notion of surface.
- [ ] Storage is read through `useSyncExternalStore`: the server snapshot is "no overrides", so SSR and
      hydration agree (no hydration warning); the client snapshot is cached by the raw string so it is
      referentially stable. Subscribers are notified on same-tab writes (every hook instance using the key
      re-renders) and on the `storage` event (another tab).
- [ ] When localStorage is unavailable (access throws, quota exceeded) reads and writes fall back to an
      in-memory store for the session; no error surfaces to the user.
- [ ] Mixpanel `TABLE_COLUMNS` payload: `Table: 'Token transfers' | 'Advanced filter'`, `Surface?: string`,
      `Column` is the column **id** (was the display name). The shared hook logs
      `{ ...analytics, Column, State }` — one event per toggled column, one per drop that changes an index,
      one per Reset, as today.
- [ ] `useTokenTransferColumns(surface)` becomes a thin wrapper: key
      `table_columns_token_transfers_${surface}`, `TOKEN_TRANSFER_COLUMNS`, `SURFACE_COLUMN_STATES[surface]`,
      analytics `{ Table: 'Token transfers', Surface: surface }`. `NAMES.TOKEN_TRANSFER_COLUMNS` and the
      `useAppContext().cookies` read are removed; the surface-map utils in
      `src/slices/token-transfer/utils/column-overrides.ts` go with them. No migration from the cookie.
- [ ] The advanced filter replaces its `columns` / `columnOrder` state with the shared hook: key
      `table_columns_advanced_filter`, the `And/Or`-renamed `selectorColumns` as `columns`, every column
      `'on'` except `multiplier`, which is `'unavailable'` when the chain's UI multiplier is off. One setting
      for the whole app, regardless of chain. Analytics `{ Table: 'Advanced filter' }`.
- [ ] Unit specs: generic overrides utils (parse / visibility / order / drift merge / omit-when-default);
      the shared hook (server snapshot is the default, reads stored value on the client, write + same-tab
      notify, `storage` event from another tab, invalid JSON, storage throwing, Reset removes the key,
      Mixpanel payload with and without `Surface`); `useTokenTransferColumns` slimmed to wrapper concerns
      (key per surface, states per surface, analytics payload); one advanced-filter Vitest that a stored
      setting is applied to the rendered table and that `multiplier` is neither rendered nor offered on a
      chain without the UI multiplier.
- [ ] `(human)` After a hard reload `/token-transfers` and an address tab show the stored columns once
      hydrated; client-side navigation between surfaces shows them with no switch; a change in one tab
      appears in another; `/advanced-filter` survives a reload and Reset restores the default; a Safari
      private window keeps working within the session.

## Details

Decisions from the developer grilling, 2026-10-07:

- localStorage over the cookie: size grows per table, 4 KB per-cookie cap, sent with every request. The
  first-paint trade-off (FR 4) is accepted as described above.
- One key per table + surface, not one key per table: the shared hook stays surface-agnostic, Reset is a
  key removal, a cross-tab event re-renders only the affected table, and two tabs editing different
  surfaces cannot overwrite each other. The common prefix gives a future cross-instance settings sync
  (draft "Sync theme settings with system default and between instances", project 6) one pattern to
  allowlist; a wildcard-cookie sync could not carry these values anyway.
- Surface stays a token-transfer slice concept: the wrapper derives both the key postfix and the
  analytics `Surface` from it; the shared hook forwards `analytics` without reading it.
- Mixpanel logs column ids: stable across label renames (the T11 "ID / Asset" rename), locale-independent,
  and the advanced filter's `or_and` column has an empty registry name. The event has not shipped, so
  there is nothing to reconcile.
- The advanced filter's setting is global across chains; the multiplier column's availability per chain
  is expressed through `states`, and the order merge already handles a column appearing or disappearing.
- Whether token transfers should get a separate Multiplier column like the advanced filter is an open
  design question (Q07), not part of this ticket.

## Leaf worklist

- [x] 1 `[agent]` Move `ColumnsButton` + `ColumnList*` + spec to `src/shared/lists/columns/`; update
      importers
- [x] 2 `[agent]` Generic overrides utils (single `{ visibility, order }` object, column-agnostic) +
      localStorage store (`useSyncExternalStore` subscribe / snapshot cache / same-tab notify / `storage`
      event / in-memory fallback); specs
- [x] 3 `[agent]` `usePersistedColumns` hook; Mixpanel `TABLE_COLUMNS` payload change (`Table` union,
      optional `Surface`, `Column` = id); spec
- [x] 4 `[agent]` `useTokenTransferColumns` as a wrapper; remove the cookie name, the server-cookie read and
      the surface-map utils; slim its spec
- [x] 5 `[agent]` Advanced filter on the shared hook (multiplier `unavailable` per chain); Vitest
- [x] 6 `[human]` Verify hard reload, client navigation, cross-tab sync and Safari private mode on both
      tables
