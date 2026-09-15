# 04 — Advanced filter: Multiplier column and scaled amounts

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3671 |
| Blocked by | T02, Q01 |

## What to build

The advanced filter table gains a **Multiplier** column showing the factor that applied to each ERC-8056
transfer row, and its Amount column scales those rows with the disclosure tooltip. The column exists in the
column picker only when the instance enables `ERC-8056`; on a regular chain it is neither listed nor shown.
When enabled it is checked by default. Rows that are not ERC-8056 transfers leave the cell empty.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open `/advanced-filter` with a token filter on
`0x6D50E6CBca0e390BbCF82bEA80B31F4c2694395e`

- [x] `TABLE_COLUMNS` gains a `multiplier` column between `to` and `amount`, present only when `ERC-8056`
      is among the additional token types of the focused chain's config in multichain mode, or of
      `config.slices.token.additionalTypes` otherwise; `COLUMNS_CHECKED` defaults it to on; the columns button
      lists it under the same condition.
- [x] `ItemByColumn`'s `amount` case passes the row's `total.ui_multiplier` (via T01's predicate; a `null`
      renders unscaled, no fallback — Q01) to `AssetValue`; the new `multiplier` case renders T01's formatted factor, or
      nothing.
- [x] `TxTableColumn`/`ColumnsIds` types include the new id without loosening them.
- [x] Playwright scaffold: the advanced-filter table test gains an ERC-8056 row with the env override.
- [x] `(human)` With ERC-8056 enabled the column shows `1.69x`-style values on those rows and is empty on
      others; the Amount tooltip discloses scaled/raw/factor. With it disabled the column is absent from the
      picker and the table.

## Details

The mockup shows a plain formatted factor in the cell, not the tag:
[Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6004-40199). Amount treatment reuses
T02's primitive; the transfer-scoped factor and the null case follow T03.

## Leaf worklist

- [x] 1 `[agent]` Column definition, gating and default; `multiplier` + `amount` cases in `ItemByColumn`;
      Playwright scaffold
- [x] 2 `[human]` Style the column to mockup and generate baselines —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6004-40199)
