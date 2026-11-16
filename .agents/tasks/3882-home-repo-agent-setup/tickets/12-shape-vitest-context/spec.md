# 12 — Shape `vitest/CONTEXT.md` to the `docs` rule

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 12 of #3882 |
| Target repo | `frontend` |
| Blocked by | T08 |

## What to build

Ticket 08 moved the local half of the unit-test rule into `vitest/CONTEXT.md` whole, so that nothing became
unreachable. The text was written as a rule, and as a `CONTEXT.md` it now falls under `.agents/rules/docs.md`,
whose drop test parts of it fail: they restate what a helper's header comment, a `package.json` script or a
setup file already says, or could say. This ticket takes each such fact to its one home and leaves in
`vitest/CONTEXT.md` only what the code cannot say. A reader who opens the file gets oriented in the
unit-test setup; a reader who opens a helper learns from its header how and when to use it.

## Acceptance criteria

- [ ] Every line of `vitest/CONTEXT.md` passes the drop test of `.agents/rules/docs.md`, and every gotcha
  in it passes that rule's gotcha test.
- [ ] Nothing a reader could learn from `vitest/CONTEXT.md` before this ticket is lost: each removed fact
  is in the header comment of the file it describes, in a spec whose title names it, or already one lookup
  away (`package.json` scripts, the runner's `--help`, the setup file itself). `notes.md` in this folder
  lists each removed part and where it now lives.
- [ ] The header comments added or extended follow the comment rules of `.agents/rules/code-quality.md`,
  in the form the helpers that already have one use (`vitest/utils/mockRouter.ts`,
  `vitest/utils/mockEnvs.ts`).
- [ ] What only a doc can state is kept: which project a spec belongs to and what breaks in a shared
  worker, the table of what stays isolated and why, and the split of React contexts under `withEnvs`.
- [ ] The pointer paragraph in `.agents/rules/tests-unit.md` and the `vitest/` line in the per-directory
  list of `.agents/AGENTS.md` still describe what the file holds. The frozen general half of the rule is
  not touched.
- [ ] No source change beyond comments: `pnpm test:vitest` passes with the same specs as before.
- [ ] No skill with a `Run by Honk` section, and no skill those call, is changed.
- [ ] `pnpm lint:doc-links`, `pnpm lint:eslint` and `pnpm lint:tsc` pass.

## Details

- The candidates ticket 06's `notes.md` named: the Utilities entries, and the `pnpm test:vitest` command
  block. The Setup section (what `vitest/setup.ts` and `vitest/global-setup.ts` provide), Rendering
  components and Mocking fetch responses are the same kind and get the same test. A convention the code
  does not enforce ("never import from `@testing-library/react` directly", "never replace
  `window.matchMedia` by hand") is a constraint and stays, in the shape the rule gives a constraint.
- Helpers with no header comment today, or one that does not say when to use them: `flushPromises.ts`,
  `mockViewport.ts`, `mockSocket.ts`, `lib.tsx`, `setup.ts`. Those that have one (`mockRouter.ts`,
  `routerStandIn.ts`, `mockEnvs.ts`, `mockJsonRpc.ts`, `checkPrimedRequests.tsx`) are checked against the
  doc and extended only where the doc says more.
- Before moving a behavioural gotcha into a comment, check whether a spec already pins it
  (`mockViewport.spec.ts`, `routerStandIn.spec.ts`). A pinned one is dropped from the doc with no comment
  added.
- The file takes the shape of its neighbours where it helps (`tools/playwright/CONTEXT.md`: a
  question-to-location table). The shape is the implementer's call under the rule; the criteria above
  are the bar.
- `diagnose-bug/loops.md` cites the unit-test rule for `render`, `fetchMock`, `withEnvs` and `mockSocket`.
  It is in Honk's footprint and stays as it is; the rule's pointer leads on to `vitest/CONTEXT.md`.

## Leaf worklist

- [ ] 1 `[agent]` Take helper usage and setup facts to header comments; record each move in `notes.md`
- [ ] 2 `[agent]` Cut and reshape `vitest/CONTEXT.md` to the `docs` rule; update the rule's pointer and the `AGENTS.md` line
