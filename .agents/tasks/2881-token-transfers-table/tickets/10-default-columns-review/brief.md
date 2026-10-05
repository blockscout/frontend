# 10 — Default column set and order review (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 10 of #2881 |
| Blocked by | Q04 |

## Goal

Re-cut the FR 2 defaults and the column order so a laptop-width screen shows Amount / Asset / Value
without horizontal scrolling, and drop from the defaults what rarely matters (Block, Transfer type).

## Known context

- Raised by the developer at the weekly 2026-10-05 and accepted in principle; the final set is parked
  until the team tries the demo on heavy-portfolio wallets.
- Candidates: Block off everywhere, Transfer type off everywhere, Amount / Asset / Value moved before
  Method, Method pushed towards the end. "Transfer type" may be renamed; filter-driven hiding of Token ID /
  Amount / Value is undecided and may be dropped.
- Changing a default is a one-line change in `SURFACE_COLUMN_STATES`; changing the order is a reorder
  of `TOKEN_TRANSFER_COLUMNS`. Overrides are stored as diffs from the defaults, so a changed default does
  not resurrect stale selections — but the unit specs and Playwright screenshots of every surface change.
- Q01's answer already anticipated "Transfer type may become off by default later".

## Blocking unknowns

- Q04 — Nikita: the final defaults, order, name, and the filter-driven-hiding decision.
