# 09 — In / Out column on the address token transfers tab

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 09 of #2881 |
| Blocked by | Q03 |

## What to build

The address token transfers tab gets a new "In / Out" column. It is the first column, or the first after
the fixed chain column in multichain context. The column sits alongside the From / To arrow and does not
replace it. Each row gets a tag that says how the transfer relates to the page's address: "In" (teal),
"Out" (yellow), or "Self" (gray) when the address is both sender and recipient. A row where the address
is neither side shows a dash. The tag looks like the cross-chain transfers' In / Out tag.

The column is a regular entry in the vocabulary, so it can be hidden and moved like any other column.
It is `on` by default on the address surface, which covers plain, contract and multichain address pages.
It is unavailable on the index, token and tx surfaces, where there is no address to measure against. It
stays when the address in/out filter is set.

There is now one tag component for both tables. The cross-chain `CrossChainFromToTag` badge becomes a
shared address-slice `AddressFromToTag` driven by a `TxCourseType`, the same type `AddressFromToIcon` uses
for the arrow. The cross-chain tag keeps its own direction logic, including its fallback that shows
"Self" for an unrelated address, and renders through the shared component. Its look does not change.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`. Open the token transfers tab of an EOA with incoming and outgoing
transfers, then a contract address's tab, then `/token-transfers`, a token's transfers tab and a tx's
token transfers tab. Also open a cross-chain transfers table that shows the In / Out tag (address page,
cross-chain tab) on a preset that has the interchain indexer.

- [ ] `AddressFromToTag` lives in `src/slices/address/components/from-to/`. It takes
      `type: Exclude<TxCourseType, 'unspecified'>`, `isLoading` and the rest of `BadgeProps`, and renders
      the `Badge` with the label, palette, `minW` and centring that `CrossChainFromToTag` has today.
      `CrossChainFromToTag` keeps its props and direction logic and renders `AddressFromToTag`.
- [ ] `in_out` is added to `TokenTransferColumnId` and as the **first** entry of
      `TOKEN_TRANSFER_COLUMNS`, named "In / Out". Its width fits the widest tag
      (`TODO (design):` to confirm).
- [ ] The surface states return `in_out: 'on'` on `address` and `'unavailable'` on `index`, `token` and
      `tx`. No other column's state changes.
- [ ] `InOutCell` in `TokenTransferCellByColumn` computes
      `getTxCourseType(item.from.hash, item.to?.hash, baseAddress)`. It renders `AddressFromToTag` for
      `in` / `out` / `self` and the shared `Dash` for `unspecified`, which includes the case where there
      is no `baseAddress`.
- [ ] `FromToCell` drops the stale "one combined column pending Q02" part of its `TODO (design):`
      comment.
- [ ] Unit specs:
      - `columns.spec.ts`: the vocabulary names and order, the address surface offering `in_out` first,
        and the other surfaces not offering it.
      - `TokenTransferCellByColumn.spec.tsx`: In, Out, Self, a dash for an unrelated address, and a dash
        without `baseAddress`.
      - `useTokenTransferColumns.spec.ts`: the address defaults.
      - `TokenTransfersTable.spec.tsx`: header lists, wherever an address-surface case exists or is
        needed.
      - A stored custom order without `in_out` puts it back first, which is `getOrderedColumns`'
        default-slot rule from T14.
- [ ] `(human)` On the address tab of an EOA and of a contract, In / Out is the first column, after the
      chain icon on the multichain address page. It shows In / Out / Self tags that agree with the From /
      To arrow, and a dash for rows where the address is neither side. The column can be hidden and
      dragged in the selector. It is absent from the table and the selector on the index, token and tx
      tabs. The cross-chain tables' tags look as before.
- [ ] Playwright baselines that render the address surface's default columns are regenerated, for
      example `MultichainAddressTokenTransfers.pw.tsx`. The cross-chain baselines stay unchanged.

## Details

- Style reference: `CrossChainFromToTag` (cross-chain token transfers and txs tables). There is no
  separate Figma node, because the tag copies that component exactly. The words are capitalised as
  there; the weekly's "lowercase for now" was superseded by the copy-as-is decision.
- `baseAddress` already reaches the table on the address surface, from `AddressTokenTransfersLocal` and
  the multichain address page, so no new prop is needed.
- Spec amendments for this ticket (FR 1 vocabulary, FR 2 In / Out row, FR 6 direction tag) are already
  in `spec.md`.
- T10 edits the same surface-state map, specs and baselines. Implement the two tickets one after the
  other, not in parallel.

## Leaf worklist

- [ ] 1 `[agent]` `AddressFromToTag` extracted from `CrossChainFromToTag`; cross-chain tag renders
      through it
- [ ] 2 `[agent]` `in_out` column id, registry entry and surface states; `InOutCell`; stale From / To
      TODO trimmed; unit specs
- [ ] 3 `[human]` Column width and tag alignment checked against the cross-chain table; availability
      verified on every surface; Playwright baselines regenerated
