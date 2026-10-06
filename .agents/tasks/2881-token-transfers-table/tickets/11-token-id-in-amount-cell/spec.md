# 11 — Token ID folded into the "ID / Asset" column

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 11 of #2881 |
| Blocked by | T06 |

## What to build

The separate Token ID column disappears from every surface and from the column selector. The Asset column
becomes "ID / Asset" and carries the token id when a row has one: NFT rows show the instance image (or the
NFT shield when there is no image) followed by the token id and the token symbol, each a link; fungible
rows keep today's token icon + symbol. The Amount column shows `1` for an NFT row that carries no value
(ERC-721, ERC-404 with an id) instead of a dash, so every row has an amount. Value stays a dash for rows
without a USD value. ERC-1155 rows, which carry both a value and an id, show the value as the amount and
the id in "ID / Asset" — the NFT icon between the two numbers is what tells them apart, per the mockup.
The token instance tab keeps not linking the current token id (FR 6).

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/token-transfers` and an ERC-721 token instance page; for
ERC-404 rows use the Optimism preset and `/token-transfers?type=ERC-404`

- [ ] `token_id` is removed from `TokenTransferColumnId`, `TOKEN_TRANSFER_COLUMNS` and every
      `SURFACE_COLUMN_STATES` entry; `asset` is named "ID / Asset" and widened so the id and the symbol
      each get half of the cell.
- [ ] `AssetCell` renders, for a row with an NFT token id (`getNftTokenId`), `NftEntity` (id, `instance`
      = page instance ?? the row's `token_instance`, `noLink` when the id equals the page `tokenId`) and
      beside it the token symbol as a `TokenEntity` link without icon or copy button; text falls back
      symbol → name → "Unnamed token", as `TokenEntity onlySymbol` does today. Rows without an id render
      today's `TokenEntity onlySymbol`. Id and symbol each take 50% of the cell width and truncate
      independently.
- [ ] `AmountCell` renders `1` when the row has no fungible amount but has an NFT token id; the
      confidential-value and dash branches are unchanged otherwise.
- [ ] An ERC-404 row with `token_id: null` renders exactly as an ERC-20 row (amount, icon + symbol, value).
- [ ] A stale `token_id` key in the column cookie is ignored (already the behaviour of
      `parseColumnOverrides`; covered by a unit spec).
- [ ] Unit specs: the `token id` describe block in `TokenTransferCellByColumn.spec.tsx` moves under
      `asset` (id link, current-instance id not linked, fungible row shows symbol only); `amount` gains
      the NFT `1` case and the ERC-1155 value case; `columns.spec.ts` / `column-overrides.spec.ts`
      updated for the removed id.
- [ ] Playwright screenshots of the unified table and of the surfaces that still carry their own
      table cases are regenerated once the cell matches the mockup.
- [ ] `(human)` Desktop and mobile tables match the mockup: no Token ID column anywhere, "ID / Asset"
      header, NFT rows read `1 | [image] 289295  SYMBOL | -`, fungible rows unchanged; the selector no
      longer offers Token ID.

## Details

Mockup: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-31747 (two rows: ERC-721 and
ERC-20). The id and the symbol use the same link style as the other entity links; one icon only, 8px gaps.

Decisions folded in from Q05 (2026-10-06):

- Token ID column is removed, not kept optional. The persisted cookie needs no migration.
- ERC-404 rows carry either a `token_id` or a `value`, never both (checked against the Optimism
  explorer): with an id they render as NFT rows, without one as fungible rows.
- ERC-1155 rows carry both; follow the mockup rules as-is (value in Amount, id + symbol in ID / Asset).
- Second text is the token **symbol**, not the collection name the mockup labels it with — keeps parity
  with the token symbol shown for fungible rows and with production today.
- NFT Value is a dash; there are no NFT prices.
- No `×` notation; Amount stays its own numeric column.

This ticket is independent of T10 (defaults review): it removes a column from the vocabulary; T10
re-cuts whatever is left.

Spec amendments made with this ticket (genuine requirement change): FR 1 vocabulary and FR 2 table drop
Token ID and rename Asset; FR 6 last clause restated for the merged cell; the "combined amount/token-id
cells" bullet leaves Out of scope.

## Leaf worklist

- [ ] 1 `[agent]` Remove `token_id` from the vocabulary / surface states; rename and widen `asset`;
      update column specs
- [ ] 2 `[agent]` `AssetCell` NFT branch (`NftEntity` + symbol link, 50/50) and `AmountCell` `1`
      fallback; move and extend the cell specs
- [ ] 3 `[human]` Style the cell to the mockup and regenerate the Playwright baselines —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3882-31747)
