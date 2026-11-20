# 01 — Separate file identity from displayed path

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3904 |
| Blocked by | none |

## What to build

A prefactor with no visible change. Today one string, `file_path`, is the Monaco model path, the lookup key
for tabs, tree, search and import clicks, and the text on screen. Split it: a file of the shared code editor
carries a unique key, used for the Monaco model and for every lookup, and a display path, used for rendering
only. The contract data step fills both with the normalized path, so every contract renders exactly as
before. See "Identity is separate from the displayed path" in the parent spec.

## Acceptance criteria

- [ ] The editor's `File` type has a key and a display path; `getEditorData` and `CodeEditorSnippet` fill
      both.
- [ ] The Monaco model path, the tab list and active tab, the selected and main file match, the tree row
      click, the search result click and the import-link lookup all go through the key.
- [ ] Tabs, breadcrumbs, tree rows and search sections render from the display path.
- [ ] No behaviour change: existing unit specs pass with only the fixture shape updated, and
      `ContractCode.pw.tsx` needs no new baseline.

## Details

- Consumers to cover: `CodeEditor`, `CodeEditorSideBar`, `CodeEditorFileExplorer`, `CodeEditorFileTree`,
  `CodeEditorTabs`, `CodeEditorTab`, `CodeEditorBreadcrumbs`, `CodeEditorSearch`, `CodeEditorSearchSection`,
  `composeFileTree`, `SearchResult`.
- `CodeEditorSearch` and the editor's close-tab action read the identity back from `model.uri.path`; keep
  that round trip on the key.
- `addExternalLibraryWarningDecoration` compares `model.uri.path` with a file name; it stays correct while
  the key is the normalized path. Ticket 03 revisits it, because the key may change there.

## Leaf worklist

- [ ] 1 `[agent]` Add the key and the display path to `File`, fill them in `getEditorData` and `CodeEditorSnippet`
- [ ] 2 `[agent]` Move every lookup in the shared code editor to the key and every rendering to the display path
- [ ] 3 `[agent]` Update the unit spec fixtures to the new shape
