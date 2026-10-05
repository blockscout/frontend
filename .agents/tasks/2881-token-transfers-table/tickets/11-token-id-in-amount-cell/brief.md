# 11 — Token ID folded into the Amount / Asset cells (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 11 of #2881 |
| Blocked by | Q05 |

## Goal

Render the token id inside the amount / asset cells ("1 × <NFT #id>", "30 × <NFT #id>") instead of a
separate Token ID column, so one more column leaves the default set and NFT rows read as one thing.

## Known context

- Proposed by the developer, taken by Tatyana for a mockup at the weekly 2026-10-05.
- Rules agreed so far: ERC-721 (and ERC-404) always show amount "1"; when a token id is present the asset
  image is the NFT instance image, otherwise the token icon. The open design risk is ERC-1155, where amount
  and id are both numbers.
- Touches the `amount`, `asset` and `token_id` entries of the vocabulary and the cell renderers in
  `src/slices/token-transfer/components/table/`; FR 6 (token instance tab does not link the current
  token id; fungible rows show a dash) must keep holding.

## Blocking unknowns

- Q05 — Tatyana: the merged cell design and whether the Token ID column disappears or stays optional.
