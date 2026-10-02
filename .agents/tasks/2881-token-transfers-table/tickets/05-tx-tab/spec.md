# 05 — Transaction and user-op "Token transfers" tab; delete the shared list table

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #2881 |
| Blocked by | T03, T08 |

## What to build

The transaction page's token-transfers tab (and the user-op page's, which reuses it with a client-side
log-index filter) renders the unified table with the `tx` surface: Txn hash, Method, Timestamp and Block are
unavailable (constant per row, and null in the endpoint), everything else on. The selector sits beside the
type filter in the tabs right slot. With the address tab (T04) and this tab moved, the shared list table
has no consumer: delete it, its item, spec, Playwright file and screenshots, moving the surviving spec
case (a row with `token: null` does not crash) onto the unified table.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open a tx with token transfers, "Token transfers" tab; a user op

- [ ] `TxTokenTransferLocal` renders the unified table with surface `tx`; `tokenTransferFilter` still
      applies client-side (user-op page).
- [ ] Selector in `TxTokenTransfer`'s right slot next to the type filter, with `selected` and
      `onReset` from the hook, as on the index page (T08). This surface has no mobile
      action bar today and FR 5 forbids adding controls, so no action bar is introduced; mobile
      placement follows wherever the type filter renders on mobile.
- [ ] `components/list/TokenTransferTable*.tsx`, its `.spec.tsx`, `.pw.tsx` and `__screenshots__`
      are deleted; the `token: null` case lives in the unified table's spec.
- [ ] `(human)` Tx tab shows Token type, Transfer type, From/To, Token ID, Amount, Asset, Value; the selector offers
      only those; the user-op tab shows the filtered subset.

## Details

Mockup: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3883-4723 (also the user-op tab).
Routes `tx/[hash]` and `op/[hash]` are `ssr:false`, so SSR seeding is moot here but the hook is the same.

T04 and T05 both depend only on T03; whichever lands second does the table A deletion. If T05 lands
first, leave table A in place and move leaf 2 into T04.

## Leaf worklist

- [x] 1 `[agent]` Swap `TxTokenTransferLocal` to the unified table; selector in the right slot
- [x] 2 `[agent]` Delete table A + tests/screenshots; migrate the spec case
- [x] 3 `[human]` Style to mockup —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3883-4723)
