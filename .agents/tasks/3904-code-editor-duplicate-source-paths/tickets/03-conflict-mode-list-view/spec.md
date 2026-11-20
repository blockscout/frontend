# 03 — Conflict mode with list view

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3904 |
| Blocked by | T01 |

## What to build

A contract whose sources contain a conflict opens in conflict mode: the editor shows every source the API
returns, under its raw path, in a flat list instead of the folder tree. The data step of the contract slice
detects the conflict and returns the files together with a flag that says whether a tree can be built; the
shared code editor receives the flag and does not detect conflicts itself. Without a conflict the editor
shows the same files as today, in the tree. The switcher between the views is ticket 04; here the layout
follows the flag alone.

## Acceptance criteria

How to verify: `pnpm dev:preset robinhood`, open
`/address/0xd4EB21209C4D6093f80B5b84f5C45cc093EA14a3?tab=contract`

- [ ] `getEditorData` returns the files and the tree-possible flag. No conflict: normalized paths,
      byte-identical repeats dropped, flag on. Conflict: every source with a path and content, raw display
      path, no deduplication, flag off.
- [ ] In conflict mode every file has a unique key. Leaf 1 settles its form: the raw path when Monaco keeps
      `/./contracts/a.sol` and `/contracts/a.sol` as distinct models, an index-based key otherwise.
- [ ] The explorer renders the list component when the flag is off and the tree when it is on, from the same
      file array.
- [ ] A list row shows the file name, then the directory dimmed; the directory is cut at its end when the row
      is too narrow; the row's title is the full path. Rows match the file rows of `CodeEditorFileTree` in
      height, font, hover, selection and main-file indicator, without the nesting indent.
- [ ] The list is sorted alphabetically by normalized path with the raw path as the tiebreak. The main file
      stays in its sorted place.
- [ ] Breadcrumbs show the raw path in conflict mode, so a `./` path starts with a `.` crumb.
- [ ] Entering conflict mode reports nothing to error monitoring.
- [ ] The comment in the data step that calls the case a backend bug is replaced: the case is valid per the
      Solidity path-resolution rules.
- [ ] Unit specs: data step (no conflict, identical repeats only, conflict), list sort order.
- [ ] `(human)` The example contract shows 311 files in the list, twins adjacent, and each twin opens its
      own content.
- [ ] `(human)` A multi-file contract without a conflict looks and behaves as before.

## Details

- `ContractSourceCode` reads `editorData.length` and `editorData[0]` for the copy button and `mainFile`;
  adapt it to the new return shape.
- `Sol2UmlDiagram` reads `additional_sources` itself and is out of scope.
- If the key is index-based, `addExternalLibraryWarningDecoration` can no longer match on `model.uri.path`;
  match on the file's display path instead.
- Tabs and search sections may show indistinguishable twins after this ticket; ticket 05 fixes that.
- No `*.pw.tsx` case here: the existing "verified with multiple sources" case covers the default tree, and
  ticket 07 covers the list view.

## Leaf worklist

- [ ] 1 `[agent]` Check in the running app whether Monaco keeps `/./a.sol` and `/a.sol` as distinct model paths; record the result in `notes.md` and pick the key form
- [ ] 2 `[agent]` Conflict detection and the flag in `getEditorData`, with its unit specs and the replaced comment
- [ ] 3 `[agent]` Pass the flag from `ContractSourceCode` through `CodeEditor` and `CodeEditorSideBar` to the explorer
- [ ] 4 `[agent]` List component and its sort util with a unit spec; the explorer picks list or tree by the flag
- [ ] 5 `[agent]` Raw path in `CodeEditorBreadcrumbs`
