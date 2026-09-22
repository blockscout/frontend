# 12 — Delete the shared mobile-list primitives

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 12 of #3722 |
| Blocked by | `T01`, `T02`, `T03`, `T04`, `T05`, `T06`, `T07`, `T08`, `T09`, `T10`, `T11`, `T13` |

## What to build

With no consumer left, the shared mobile-list primitives and the mobile variant of the socket new-items
notice are deleted, and the codebase is swept to prove requirement 4 of the spec: no list layout remains.

## Acceptance criteria

- [ ] `ListItemMobile` and `ListItemMobileGrid` are deleted, with any Playwright file and screenshots of their own.
- [ ] `SocketNewItemsNotice` has no `Mobile` variant; its mobile case in `SocketNewItemsNotice.pw.tsx` and that case's screenshots are deleted.
- [ ] A sweep of `src/` finds no `*ListItem.tsx` that was a mobile-list row, no `*List.tsx` mobile container, and no `hideFrom` / `hideBelow` pair that splits a table from a list. Anything the sweep does find is migrated here with the fixed transform and named in the commit message.
- [ ] The `add-new-page` skill scaffolds a table-only index page: its `List` and `ListItem` templates are deleted, the index `Content` template follows the fixed transform, and `SKILL.md` / `wiring.md` no longer mention a mobile list.
- [ ] `pnpm lint:tsc`, `pnpm lint:eslint:fix` and `pnpm test:pw --docker --changed` pass.

## Details

The sweep must not catch the out-of-scope card surfaces: the home page's latest blocks widget,
`LatestArbitrumL2Batches`, and the marketplace dapp cards. The home page's transaction widgets are no
longer among them — ticket 13 converts them, which is why it is on the `Blocked by` list.

Read `.agents/README.md` before editing the skill.

## Leaf worklist

- [ ] 1 `[agent]` Delete the primitives and the notice's mobile variant
- [ ] 2 `[agent]` Sweep for leftovers and make the `add-new-page` index templates table-only
