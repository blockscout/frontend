# 07 — Side bar visual tests

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3904 |
| Blocked by | T04, T05 |

## What to build

The code editor's side bar gets its own visual suite, `CodeEditorSideBar.pw.tsx`, with two cases: the list
view and the tree view of the file explorer. Until now the side bar appeared only inside the Contract tab screenshot, in its
default tree view; the list rows are layout no screenshot covers.

The search view gets no case: it needs live Monaco models, and a suite that loads Monaco is not stable
(developer's decision, 2026-11-20).

## Acceptance criteria

- [ ] `CodeEditorSideBar.pw.tsx` sits next to the component and screenshots the side bar only.
- [ ] List view case, packed into one shot: conflict-mode data with twins adjacent, the main-file indicator,
      a selected row, a directory long enough to be cut, and the disabled switcher and collapse button.
- [ ] Tree view case, one shot: data without a conflict, nested folders expanded, the main-file indicator and
      a selected row (added on the developer's request, 2026-11-20).
- [ ] Mock data for the suite lives with the code editor, not in the contract slice mocks.
- [ ] `(human)` Baselines generated with `pnpm test:pw --docker` and eyeballed.

## Details

- The suite mounts `CodeEditorSideBar` alone, without Monaco, so the action bar icons render without the
  codicon font, as they do in the `ContractCode.pw.tsx` baselines.
- The side bar has no test id or role to select it by; add what the suite needs, per the Selectors section of
  `.agents/rules/tests-visual.md`.
- Tags: `+@dark-mode` on the list view case only. No `+@mobile`: the side bar is a closed drawer there.

## Leaf worklist

- [x] 1 `[agent]` Scaffold `CodeEditorSideBar.pw.tsx` with its mock data: the list view case and the tree view case
- [x] 2 `[human]` Generate the baselines in Docker and eyeball them
