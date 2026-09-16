# 08 — Inline multiplier history on the Details tab

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 08 of #3671 |
| Blocked by | T07 |

## What to build

The Multiplier row on the token Details tab gets a **View history / Hide history** toggle beside the factor.
Expanding it fetches the first page of the multiplier history and shows a compact table of the most recent
changes beneath the row: txn hash, block, old → new factor, activation date, status (Active / Inactive /
Scheduled, from T07's helper). The table is capped at five rows. When the token has more than five changes,
a **View all** link to the Multiplier history tab follows the table. The toggle exists only when the
counters report at least one change. Otherwise the row renders alone, as T02 left it. Collapsed, the
Details tab makes no request beyond what it makes today.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open `/token/0xE1C0a83Ab03e4498Fad1f833fA484E2cfc68dE7b`
(GTB8056, two changes), then `/token/0x907C9A3Dd7a2eBE292d831A352Adb39aE202A193` (NVDA, no changes)

- [ ] The toggle renders only when the Multiplier row renders and `ui_multiplier_changes_count` is above
      `0`. While the counters are placeholder data, it is not shown.
- [ ] `core:token_ui_multiplier_changes` is requested only after the first expand (query `enabled` on the
      expanded state). Collapsing keeps the cached data, and re-expanding does not refetch.
- [ ] The compact table shows at most five rows (named constant) and no Timestamp column. The Activation
      date header carries `TimeFormatToggle`. Rows reuse T07's factor cell, status tag and status helper,
      with the helper treating this as the first page.
- [ ] **View all** renders when `ui_multiplier_changes_count` is above five. It links to the
      `multiplier_history` tab built with `route()` and the multichain `chain` context, as
      `TxDetailsTokenTransfers` does.
- [ ] While the history loads, the table shows skeleton rows. A failed request shows nothing beneath the row
      and leaves the factor visible.
- [ ] Playwright scaffold: `Token.pw.tsx` (or a component-level spec for the new block) gains ERC-8056 cases
      for expanded with two changes and expanded with more than five changes (View all visible).
      Baselines are generated only in the style leaf.
- [ ] `(human)` GTB8056: `1.04x View history`. Expanding shows two rows (`1.05x → 1.04x` Active,
      `1x → 1.05x` Inactive) and no View all. The label flips to Hide history, and the network tab shows
      the history request only after the first expand.
- [ ] `(human)` NVDA shows `4x` with no toggle. An ERC-20 token has no Multiplier row.

## Details

**Where it sits.** Extend the Multiplier row in `TokenDetails.tsx`. Put the new block in its own component
under `src/slices/token/pages/details/info/`, so `TokenDetails` only passes the token hash, the multiplier
and the count. The counters are already a prop of `TokenDetails`.

**Overflow test.** The overflow test uses the count from the counters (`> 5`), not `next_page_params`,
because the first page holds up to 50 items and would not signal overflow at 6.

**No live token has more than five changes**, so the View all path is verified through the Playwright mock
only.

**Mockup.** Node 5995:20900, three `Multiplier` row variants: collapsed, two rows, five rows with View all.
The compact table sits on a tinted panel under the value column. The toggle is a dashed-underline text link.

## Leaf worklist

- [ ] 1 `[agent]` Inline history block scaffold: toggle, lazy query, capped table reusing T07 cells, View all
      link, states; wire into the Multiplier row; Playwright scaffold (placeholder presentation,
      `TODO (design):` markers)
- [ ] 2 `[human]` Style the toggle, compact table panel and View all link to mockup; generate baselines —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-20900)
