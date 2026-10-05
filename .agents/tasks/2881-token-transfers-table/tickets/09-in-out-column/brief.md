# 09 — In/Out column (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 09 of #2881 |
| Blocked by | Q03, Q02 |

## Goal

Add an optional "In/Out" column that spells the transfer direction as a word next to the arrow, on the
surfaces where direction has a meaning (address, token, and the contract variant of the address page).

## Known context

- Agreed at the front-end weekly 2026-10-05: a separate column, in addition to the arrow (the arrow stays
  informative); the words are lowercase for now. Precedent: the multichain tables already show in/out words.
- Column vocabulary and per-surface availability live in `TOKEN_TRANSFER_COLUMNS` /
  `SURFACE_COLUMN_STATES` (`src/slices/token-transfer/utils/columns.ts`); the column must be
  `unavailable` on the index and tx surfaces. The override-map parser tolerates unknown ids, so no cookie
  migration is needed.
- Direction is already computed for the arrow on the address tab (current-address highlighting); the
  token surface needs the same for the token's own address.

## Blocking unknowns

- Q03 — Tatyana: position in the order (first column vs next to From / To) and default on/off.
- Q02 — Tatyana: one combined From / To column or two; this decides where the arrow lives, which the
  new column sits beside.
