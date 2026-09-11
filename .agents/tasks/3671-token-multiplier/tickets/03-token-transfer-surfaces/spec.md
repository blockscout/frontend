# 03 — Token transfer surfaces

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3671 |
| Blocked by | T02, Q01 |

## What to build

Every place a token transfer's amount is rendered shows the scaled amount, the multiplier tag and the
disclosure tooltip, using the factor that applied to *that transfer* (`total.ui_multiplier`), not the token's
current one. Surfaces: the token-transfers index page, the token's Token transfers tab, the address Token
transfers tab (all share the same table/list items), and the transfer rows inside transaction details (the
snippet). The `ERC-8056` filter option in the type filter needs no work — it comes from the env list — but
this ticket verifies it against the live API's `?type=ERC-8056`.

Q01 decides what a transfer with `total.ui_multiplier: null` does (the two live transfers are both null);
fold its answer into the predicate call for transfers before starting.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open `/token-transfers` filtered to ERC-8056,
`/token/0x6D50E6CBca0e390BbCF82bEA80B31F4c2694395e?tab=token_transfers`, an address holding it with
`?tab=token_transfers`, and the tx page of one of its transfers

- [ ] Transfer rows pass `total.ui_multiplier` (through T01's predicate, so the env gate still applies) to
      `AssetValue`/`TokenValue` in: `components/list/TokenTransferTableItem` + `ListItem`,
      `pages/token/TokenTransferTableItem` + `ListItem`, `pages/index/TokenTransfersTableItem` + `ListItem`,
      and `TokenTransferSnippetFiat`.
- [ ] A transfer with `total.ui_multiplier: null` behaves as Q01's answer says; the behaviour is a single
      branch in one place, not repeated per row.
- [ ] The tag is rendered beside the amount on every one of those rows, including the tx-details snippet.
- [ ] `TokenTransferSnippet` routes an ERC-8056 transfer to the fiat snippet (fungible), never the NFT one.
- [ ] Playwright scaffolds: `TokenTransferTable.pw.tsx` / `TokenTransferList.pw.tsx` and
      `pages/token/TokenTransfer.pw.tsx` gain an ERC-8056 case from T01's `erc8056` mock; the tx-details
      transfers test gains one.
- [ ] `(human)` Selecting `ERC-8056` in the type filter returns only that token's transfers, and selecting
      `ERC-20` no longer returns them.
- [ ] `(human)` Table, mobile list and tx-details rows match the mockups: tag left of the amount, tooltip
      text as designed.

## Details

**Factor source.** Spec, Implementation decisions: a transfer shows the multiplier that applied to it. Only
the row's `total` carries it; `data.token.ui_multiplier` is the *current* factor and must not be used here.

**Rows that already have the token object** (`pages/index/*`) use `TokenValue`; the rest use `AssetValue`
with `total.decimals`. Either way the multiplier is a prop; the predicate runs once per row.

Mockups: [token transfers table](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28720),
[address token transfers tab](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28716).

## Leaf worklist

- [ ] 1 `[agent]` Wire the six transfer table/list items and the fiat snippet; Q01 null-handling in one place
- [ ] 2 `[agent]` Playwright scaffolds for the ERC-8056 cases
- [ ] 3 `[human]` Style rows to mockup and generate baselines —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28720),
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28716)
