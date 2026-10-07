# 10 — Block and Transfer type off by default

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 10 of #2881 |
| Blocked by | Q04 |

## What to build

Block and Transfer type are now hidden by default on every surface where they are available. Both stay
in the column selector, so a user can turn them back on. The goal is a less crowded laptop-width table.

| Column | Index | Address | Token | Tx |
| --- | --- | --- | --- | --- |
| Block | off (was on) | off (was on) | off | unavailable |
| Transfer type | off (was on) | off (was on) | off | off (was on) |

These are the only changes:

- The column order stays as it is.
- "Transfer type" keeps its name.
- No column is hidden based on the active filters.

Settings are stored as overrides from the defaults. A user who never touched these two columns gets the
new defaults. A user who turned one on explicitly keeps it on. An old stored `false` now matches the
default and does nothing.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`. Open `/token-transfers`, an address token transfers tab and a tx
token transfers tab in a browser with no stored column settings, then reopen them after enabling Block in
the selector.

- [ ] The surface states mark `block` and `transfer_type` as `'off'` on `index` and `address`, and
      `transfer_type` as `'off'` on `tx`. `token` is unchanged, and no state changes for any other
      column.
- [ ] Unit specs that assert the index, address or tx defaults are updated: `columns.spec.ts`,
      `useTokenTransferColumns.spec.ts`, `TokenTransfersTable.spec.tsx` and any page-level spec that
      renders surface defaults. Specs that pass an explicit column list are left alone.
- [ ] `(human)` With nothing stored, the index, address and tx tabs show neither Block nor Transfer type.
      Both are offered unchecked in the selector, and turning one on survives a reload. Reset brings back
      the new defaults.
- [ ] Playwright baselines of the index, address and tx surfaces that render the defaults are
      regenerated. `TokenTransfersTable.pw.tsx` passes every column, so it stays unchanged.

## Details

The spec amendment for this ticket (the FR 2 Block and Transfer type rows) is already in `spec.md`.
T09 edits the same state map, specs and baselines. Implement the two tickets one after the other, not in
parallel.

## Leaf worklist

- [ ] 1 `[agent]` Block and Transfer type `off` in the surface states; unit specs
- [ ] 2 `[human]` Verify defaults and the selector on the index, address and tx tabs; regenerate
      Playwright baselines
