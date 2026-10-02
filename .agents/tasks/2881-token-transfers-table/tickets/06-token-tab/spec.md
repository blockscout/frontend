# 06 — Token and token-instance "Token transfers" tab; delete the token table

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 06 of #2881 |
| Blocked by | T03, T08 |

## What to build

The token page's token-transfers tab and the token instance page's transfers tab render the unified table
with the `token` surface: Asset is unavailable, Token type, Transfer type and Block are off by default but
selectable, the rest on. The selector joins the action bar next to the advanced-filter link. On the instance page the row whose
token id equals the current instance is not linked and the instance data overrides the entity, as today;
the Value column keeps its symbol in the header. The token-page table, its row and Playwright file are
deleted; the `TokenTransfer.pw.tsx` page cases (erc20, erc721, erc1155, erc8056) stay.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open an ERC-20 token and an ERC-721 token instance, transfers tab

- [ ] `pages/token/TokenTransfer.tsx` renders the unified table with surface `token`, passing `tokenId`,
      `token`, `instance` so `NftEntity` gets `noLink` on the current id and the instance override; its
      `TableContainerScrollable` wrapper and `top` prop are removed (the table scrolls itself).
- [ ] Token ID shows the id for NFT rows and a dash for fungible rows (not hidden by token type as
      today — the column is selectable per FR 2).
- [ ] Selector added to the `ActionBar` beside `TokenAdvancedFilterLink`, with `selected` and `onReset`
      from the hook, as on the index page (T08); choices persist under the `token` surface key, shared
      by token and instance pages.
- [ ] `pages/token/TokenTransferTable*.tsx` deleted; `TokenTransfer.pw.tsx` keeps its four cases.
- [ ] Token page routes render on the server: no flash of the default columns after a toggle + reload.
- [ ] `(human)` Token and instance tabs show the FR 2 token defaults; Token type, Transfer type and Block
      appear when toggled on; the current instance id is not a link; a reload keeps the chosen columns from first paint.

## Details

The unified table owns its horizontal scroll container (`TableContainerScrollable` with
`onlyMobile={ false }`, scrollable on every viewport) and has no sticky header, so it takes no `top` prop:
the surface drops its own `TableContainerScrollable` wrapper and the `top={ ACTION_BAR_HEIGHT_DESKTOP }`
it passes today. Type is two columns since T02 (Q01): Token type (standard tag) and Transfer type
(mint/burn badge).

Mockup: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3883-4329 (token and instance).
The old table hid Token ID and Value by token type (`hasTokenIds`, `hasTokenTransferValue`); the unified
table shows the column whenever the surface config says so and renders a dash where the row has no value.

## Leaf worklist

- [ ] 1 `[agent]` Swap `TokenTransfer.tsx` to the unified table (token + instance props); selector in the
      action bar
- [ ] 2 `[agent]` Delete table C + its pw file/screenshots
- [ ] 3 `[human]` Style to mockup —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3883-4329); regenerate
      `TokenTransfer.pw.tsx` baselines
