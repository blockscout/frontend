# 01 — Merge Message + Timestamp and widen token cells on both cross-chain tables

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3778 |
| Blocked by | none |

## What to build

On the cross-chain token-transfers table and the cross-chain transactions table, the Message and Timestamp
columns become one column: the message id on the first line, the time (with its tooltip, and the time-format
toggle in the header) on a second line in the secondary style, following the two-line pattern the Source tx /
Dest tx cells already use (entity on top, `ChainLabel` below). The Source token and Target token cells get a
larger `maxW` (200px). The change applies everywhere the tables render — index pages, address tabs, tx
details, the home-page latest list — since it is the table components themselves that change. Nothing else
about the tables moves.

## Acceptance criteria

How to verify: `pnpm dev:preset gnosis`, open `/token-transfers?tab=token_transfers_cross_chain` and
`/txs?tab=txs_cross_chain`; `pnpm dev:preset multichain` for the home-page latest list.

- [ ] `TokenTransfersCrossChainTable` and `TransactionsCrossChainTable` have one "Message" column with the
      `TimeFormatToggle` in its header and no separate "Timestamp" column
- [ ] The merged cell renders `CrossChainMessageEntity` on the first line and `TimeWithTooltip` below in the
      secondary two-line style used by the Source tx cell; the transactions table keeps `enableIncrement`
- [ ] Source token and Target token cells on the token-transfers table have `maxW="200px"`
- [ ] Existing `*.pw.tsx` baselines for both tables are regenerated with `--docker` after the developer
      confirms the look
- [ ] `(human)` Token-transfers table matches the mockup at every breakpoint

## Details

- Mockup for the token-transfers table: Figma node `9120-115382`. The transactions table has no mockup; it
  mirrors the same merge on its own Message/Timestamp pair.
- Token cell `maxW` is a spec value to be checked visually; adjust with the developer if 200px fights the
  table's `minW`.

## Leaf worklist

- [x] 1 `[agent]` Merge Message + Timestamp into one column and widen token cells on both tables, to the
      mockup — [Figma](https://www.figma.com/design/GHtMTzWKQGAcVyGdrKuQjD/Blockscout-Multichain-explorer?node-id=9120-115382)
- [x] 2 `[human]` Regenerate the Playwright baselines of `TokenTransfersCrossChain.pw.tsx` and
      `TransactionsCrossChain.pw.tsx` with `pnpm test:pw --docker <file> --update-snapshots` once the look is approved
