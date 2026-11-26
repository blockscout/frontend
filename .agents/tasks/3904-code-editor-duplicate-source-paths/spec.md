# Code editor: list view for sources with conflicting paths

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3904 |
| Feature branch | `issue-3904` |
| PM | Ulyana |
| QA | Yan |
| Demo | robinhood |

## Context & goal

The Contract tab crashes with "Oops! Something went wrong!" for verified contracts whose sources contain
two files that map to the same path after the frontend normalizes it, and whose content differs. Example:
https://robinhoodchain.blockscout.com/address/0xd4EB21209C4D6093f80B5b84f5C45cc093EA14a3?tab=contract

Such sources are valid. Solidity treats source unit names as opaque identifiers, so `contracts/Tick.sol` and
`./contracts/Tick.sol` are two different source units and may carry different code
(https://docs.soliditylang.org/en/latest/path-resolution.html). The backend returns them as stored and will
not deduplicate them. The collision is created by the frontend: it strips the `./` prefix to build a folder
tree, and a folder tree cannot hold two files at one path.

In the example contract, 311 sources have 311 unique raw paths. After normalization 31 pairs collide: 26 are
byte-identical, 5 differ (four in the pragma line only, `Tick.sol` in code as well).

Hiding one of the differing files is not acceptable: an explorer must show every verified source. So the
file explorer gets a second layout, a flat list of full paths, which can show any set of source unit names.
The user can switch between tree and list. When the sources cannot form a correct tree, the list is the only
layout.

## Functional requirements

Terms used below:

- **Normalized path** — the path after the current prefix normalization (`a.sol`, `/a.sol`, `./a.sol` become
  one path).
- **Raw path** — the path exactly as the API returns it.
- **Conflict** — at least two sources share a normalized path and differ in content. Byte-identical repeats
  alone are not a conflict.
- **Conflict mode** — how the editor behaves for a contract that has a conflict.
- **Twins** — two files in conflict mode that share a normalized path.

### Data

1. Without a conflict the editor shows the same set of files as today: paths normalized, byte-identical
   repeats dropped.
2. In conflict mode the editor shows every source the API returns, under its raw path, with no
   deduplication. The example contract shows 311 files.
3. The Contract tab renders for the example contract and for the other contracts named in the issue.

### File explorer

4. The explorer has a view switcher with two views, tree and list. The tree is the default. The choice is
   not persisted: it resets to the default when the editor mounts again.
5. In conflict mode the list is shown, and the switcher is disabled. Its tooltip says the tree view is
   unavailable because several source files resolve to the same path.
6. Without a conflict both views show the same files. In the list a path has no leading slash.
7. A list row shows the file name first, then the directory in a dimmed color. The directory is cut at its
   end when the row is too narrow. Hovering the row shows the full path.
8. The list is sorted alphabetically by normalized path, with the raw path as the tiebreak, so twins are
   adjacent. The main file comes first, ahead of the sorted files, and carries the same main-file
   indicator as in the tree.
9. The "Collapse folders" button is disabled in the list view.
10. Switching the view keeps the selected file selected and scrolls it into view. Switching from list to
    tree shows all folders expanded.
11. Opening a file from an import link or a search result does not change the view.
12. A contract with a single source file has no side bar and no switcher, as today.

### Tabs, breadcrumbs, search

13. A tab shows the file name only. A folder hint is added only while another open tab has the same file
    name, as today. This holds in both modes.
14. When twins are both open, their hints are compact and differ by the raw prefix: `./…/libraries` and
    `…/libraries`.
15. Breadcrumbs show the full path of the open file. In conflict mode it is the raw path, so a `./` path
    starts with a `.` crumb.
16. A search result section shows the file name. The dimmed directory is added only when another result
    section has the same file name. This holds in both modes.

### Import links

17. In conflict mode a relative import opens the file from the importing file's own family, as the
    Solidity compiler resolves it: `./contracts/A.sol` importing `./libraries/Tick.sol` opens
    `./contracts/libraries/Tick.sol`, not `contracts/libraries/Tick.sol`. When no such file exists, the
    first file with the matching normalized path opens.

### Robustness and monitoring

18. The editor never fails on a repeated model path. It skips the repeat and reports a warning to error
    monitoring, because a repeat at that point means a defect in the frontend's own data step.
19. Entering conflict mode reports nothing to error monitoring. It is valid input.

### Human check

20. The side bar starts at its current width. On the demo the developer judges whether list rows are
    readable at that width with the example contract. If they are not, the developer decides the remedy
    there, as part of this task: a wider side bar, horizontal scrolling in it, or a resizable side bar.

## Data & API

- Resource: `core:contract` (`/api/v2/smart-contracts/:hash`), unchanged. Fields used: `file_path`,
  `source_code`, `additional_sources[].file_path`, `additional_sources[].source_code`.
- No API change, no new resource, no env var.
- The example response is reachable only from a browser session: the instance answers `curl` with a
  Cloudflare challenge.

## UI inventory

No mockups. The switcher uses the icons Monaco already ships.

- **Contract tab → code editor → side bar → Explorer tab.**
  - Action bar: the view switcher sits next to the existing collapse button (`CodeEditorCollapseButton`)
    and matches it in size and hover. It shows the icon of the view it switches to: `codicon
    codicon-search-list` in the tree view, `codicon codicon-search-tree` in the list view. Titles: "View as
    list", "View as tree".
  - List view: rows match the file rows of `CodeEditorFileTree` in height, font, hover, selection and
    main-file indicator, without the nesting indent.
- **Tabs** (`CodeEditorTab`): the existing folder hint, with the compact form for twins.
- **Breadcrumbs** (`CodeEditorBreadcrumbs`): raw path in conflict mode.
- **Side bar → Search tab** (`CodeEditorSearchSection`): the dimmed directory for same-name sections.

## Implementation decisions

- **Identity is separate from the displayed path.** Today one string is the Monaco model path, the lookup
  key for tabs, tree and search, and the text on screen. A file gets a unique key used for the model and
  for every lookup, and a display path used for rendering. Without a conflict both hold the normalized
  path, so nothing changes for those contracts.
- **The model key in conflict mode must be unique per raw path.** Expected: Monaco keeps
  `/./contracts/a.sol` and `/contracts/a.sol` as distinct model paths. This is not verified. If Monaco
  collapses them, the key becomes index-based. The behaviour above does not depend on which one is used.
- **Conflict detection lives in the editor-data step of the contract slice**, next to the current
  repeat-dropping rule. It returns the files and a flag that says whether a tree can be built. The shared
  code editor receives the flag and does not detect conflicts itself.
- **The view state lives in the file explorer** and is reset on mount. The explorer renders either the tree
  or the new list component from the same file array.
- **Import resolution gets the importing file's raw path** in conflict mode and tries the same-family path
  before the normalized match.
- **The duplicate-model guard is in the shared editor**, independent of the data step, and reports through
  the existing Rollbar hook.
- **The comment in the data step that calls the case a backend bug is replaced.** The case is valid per the
  Solidity path-resolution rules.
- Unit tests cover the data step (no conflict, identical repeats, conflict), the list sort order, the tab
  hint for twins and import resolution in conflict mode.

## Out of scope

- Persisting the chosen view.
- A diff or compare view for twins, and any marker of which twin the compiler used.
- Analytics events for the switcher.
- The Sol2Uml diagram, which already sends raw paths.
- Changes to the backend response.
