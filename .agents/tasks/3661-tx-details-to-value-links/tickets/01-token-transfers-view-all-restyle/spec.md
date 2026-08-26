# 01 — Restyle token-transfer "View all" link

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 01 of #3661 |
| Blocked by | none |

## What to build

On the transaction Details tab, the token-transfer detail rows (**Tokens transferred / minted / burnt /
created**) show a "View all" link when the embedded list overflows. Drop the leading
`navigation/tokens` icon (the one carrying the existing `FIXME use non-navigation icon`) and restyle the
link to match the mockup's link style. The link's show-condition (`token_transfers_overflow`) and its target
(the Token-transfers tab) stay exactly as they are — this ticket is presentation only. Q01 is resolved: no
per-section max-5 cap (that would need a backend change), restyle only.

## Acceptance criteria

How to verify: `pnpm dev:preset eden_testnet`, open a tx with overflowing token transfers at
`/tx/[hash]?tab=index`

- [x] The `SpriteIcon name="navigation/tokens"` before "View all" is removed
- [x] The link still renders only when `isOverflow` is true and still points at the Token-transfers tab
      (`/tx/[hash]?tab=token_transfers`)
- [x] `(human)` The "View all" link matches the mockup's link style

## Details

- File: `src/slices/tx/pages/details/info/parts/TxDetailsTokenTransfers.tsx`.
- Figma screen `txn_details` node `5940:4556`. No dedicated node for this link in the spec; match the grey
  "View all" link style used by the "To" recipient list (see ticket 02, Figma `5940:8800` / `5940:8801`).

## Leaf worklist

- [x] 1 `[agent]` Remove the `navigation/tokens` icon and its FIXME; wire the plain `Link`, leaving the
      exact style as `TODO (design):`
- [x] 2 `[human]` Style the "View all" link to the mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5940-4556)
