# 07 — Side bar visual tests

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3904 |
| Blocked by | T04, T05 |

## What to build

The code editor's side bar gets its own visual suite, `CodeEditorSideBar.pw.tsx`, with two cases: the list
view of the file explorer and the search view. Until now the side bar appeared only inside the Contract tab
screenshot, in its default tree view; the list rows and the search sections are layout no screenshot covers.

## Acceptance criteria

- [ ] `CodeEditorSideBar.pw.tsx` sits next to the component and screenshots the side bar only.
- [ ] List view case, packed into one shot: conflict-mode data with twins adjacent, the main-file indicator,
      a selected row, a directory long enough to be cut, and the disabled switcher and collapse button.
- [ ] Search view case, packed into one shot: a query that matches several files, two of them with the same
      file name so the dimmed directory shows, next to a section without it.
- [ ] The tree view gets no case here: `ContractCode.pw.tsx` "verified with multiple sources" covers it.
- [ ] Mock data for the suite lives with the code editor, not in the contract slice mocks.
- [ ] `(human)` Baselines generated with `pnpm test:pw --docker` and eyeballed.

## Details

- The side bar's search needs live Monaco models, so the suite mounts `CodeEditor` with conflict-mode data
  and takes the screenshot of the side bar, not `CodeEditorSideBar` alone with stubbed props.
- Monaco loads from the CDN; route it the way `ContractCode.pw.tsx` does.
- The side bar has no test id or role to select it by; add what the suite needs, per the Selectors section of
  `.agents/rules/tests-visual.md`.
- Tags: `+@dark-mode` on one of the two cases at most. No `+@mobile`: the side bar is a closed drawer there.

## Leaf worklist

- [ ] 1 `[agent]` Scaffold `CodeEditorSideBar.pw.tsx` with its mock data: the list view case and the search view case
- [ ] 2 `[human]` Generate the baselines in Docker and eyeball them
