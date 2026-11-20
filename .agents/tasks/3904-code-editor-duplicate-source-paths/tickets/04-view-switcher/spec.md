# 04 — Tree/list view switcher

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3904 |
| Blocked by | T03 |

## What to build

The file explorer gets a view switcher with two views, tree and list. The tree is the default and the choice
is not persisted: the view state lives in the explorer and resets when the editor mounts again. In conflict
mode the list is shown and the switcher is disabled, with a tooltip saying the tree view is unavailable
because several source files resolve to the same path.

## Acceptance criteria

How to verify: `pnpm dev:preset robinhood`, open a multi-file contract without a conflict and
`/address/0xd4EB21209C4D6093f80B5b84f5C45cc093EA14a3?tab=contract`

- [ ] The switcher sits in the action bar next to `CodeEditorCollapseButton` and matches it in size and
      hover. It shows the icon of the view it switches to: `codicon codicon-search-list` in the tree view,
      `codicon codicon-search-tree` in the list view. Titles: "View as list", "View as tree".
- [ ] Without a conflict both views show the same files; a list path has no leading slash.
- [ ] In conflict mode the switcher is disabled and carries the tooltip.
- [ ] The "Collapse folders" button is disabled in the list view.
- [ ] Switching the view keeps the selected file selected and scrolls it into view. Switching from list to
      tree shows all folders expanded.
- [ ] Opening a file from an import link or a search result does not change the view.
- [ ] A contract with a single source file has no side bar and no switcher.
- [ ] `(human)` The switcher works as described on a contract without a conflict, and is disabled with the
      tooltip on the example contract.
- [ ] `(human)` List rows of the example contract are readable at the current side bar width. If they are
      not, the developer names the remedy — a wider side bar, horizontal scrolling in it, or a resizable
      side bar — and it is appended as a new ticket.

## Details

- The collapse button today forces a remount through the explorer's `key` counter, and `isCollapsed` is
  derived from it; list → tree must come back expanded, so the collapsed state cannot stay tied to that
  counter alone.
- The action bar is handed to the side bar through `setActionBarRenderer`; the switcher goes through the
  same renderer.
- No `*.pw.tsx` case here: the list view is covered by ticket 07.

## Leaf worklist

- [ ] 1 `[agent]` Switcher button component and the view state in `CodeEditorFileExplorer`
- [ ] 2 `[agent]` Disabled states: the switcher in conflict mode with its tooltip, the collapse button in the list view
- [ ] 3 `[agent]` Keep the selection and scroll it into view on switch; expand all folders on list → tree
