# 08 — Inline multiplier history on the Details tab (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 08 of #3671 |
| Blocked by | T07 |

## Goal

The Multiplier row on the token Details tab gains a **View history / Hide history** toggle that expands a
compact table of the most recent changes (txn hash, block, old → new factor, activation date, status),
capped at five, with a **View all** link to the Multiplier history tab when more exist. When history is
unavailable or empty, the row renders alone. Spec FR6.

## Known context

- Reads the first page of the resource T07 declares; the cap is client-side (`slice(0, 5)`), the overflow
  test is "count from counters > 5" or "`next_page_params` present".
- Precedent for "detail row → capped list → link to tab": `TxDetailsTokenTransfers` (`View all` link with
  `route({ pathname, query: { tab } })`).
- The row itself and its hint are T02; this ticket only adds the toggle and the block beneath.
- Mockup: [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-20900), the three
  `Multiplier` row variants (collapsed, two rows, five rows + View all).

## Blocking unknowns

- Everything T07 is blocked on (Q02); this ticket is scoped in the same `to-tickets` run that scopes T07.
