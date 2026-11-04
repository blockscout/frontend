# 06 — Token, Nft and Pool entities hand-assembled

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 06 of #3838 |
| Blocked by | T03 |

## What to build

`TokenEntity` (with its `Symbol` and `Reputation` parts), `NftEntity` and `PoolEntity` rebuilt on the
primitives. Their tail truncation becomes a declared default a caller can override instead of a forced
value after the spread; the token icon's shape rule (round for ERC-20), the NFT media icon and the
pool's two-token icon stay as custom `Icon` parts. Token wrappers (`Interchain`, `External`, `L1`,
`WithAddressFilter`) keep working with no edit.

## Acceptance criteria

- [x] `TokenEntity.pw.tsx`, `NftEntity.pw.tsx` and `PoolEntity.pw.tsx` pass with no baseline change.
- [x] `truncation` defaults to `tail` for all three and a caller's `truncation` wins (unit spec).
- [x] The Token block of `SearchResultTableItem` (`TokenEntity.Icon`, `TokenEntity.Reputation`) renders
      as before.
- [x] Token links are chain-aware inside a multichain context via the resolver; `PoolEntity` keeps its
      current-chain route.
- [x] No `chakra()` remains in the three entity files; the complexity gate passes for every changed file.

## Details

Quirk to preserve (Q03 in `questions.md`): `TokenEntityExternal` only passes the `chain` (and so the
shield) when the multichain feature is enabled. That rule stays in the token wrapper, which ticket 08
keeps as the one surviving token wrapper; this ticket must not move it into the entity or the resolver.

## Leaf worklist

- [x] 1 `[agent]` Rebuild `TokenEntity`, `NftEntity`, `PoolEntity` on the primitives with declared tail defaults
- [x] 2 `[agent]` Unit specs for the defaults and caller-wins; run the three Playwright suites in Docker
