# Notes — ticket 12

What left `vitest/CONTEXT.md`, and where each fact is now. "Before" is the file as of `d31b38b74`.

## Removed, and where it lives

| Part of the doc before | Now in |
| --- | --- |
| File naming: the `*.spec.ts(x)` and `*.isolated.spec.ts(x)` patterns | The project table under Isolation, which already had them. Co-location stays, as a constraint |
| The `pnpm test:vitest` command block (whole suite, one file, `--changed`, `--changed origin/main`) | `package.json` (`test:vitest` is `vitest run`) and `pnpm test:vitest --help`. The doc's opening paragraph says so |
| `--changed` follows the module graph from a changed source file to its spec | `--help`: "Run tests that are affected by the changed files" |
| `--changed` fails with no matching test unless `--passWithNoTests`; CI passes it | Vitest's own exit message, `--help`, and the Vitest step of `.github/workflows/checks.yml` |
| "Fetch `origin/main` first if that ref is missing locally" | git's own error for the missing ref |
| `pnpm test:vitest --project shared` | `--help` |
| Setup: envs from `.env.vitest` as `__envs`, global fetch mock, cleanup after every test, the `matchMedia` stub | Header comment of `vitest/setup.ts`, added. The cleanup and the stub already had their own comments there |
| Setup: the default viewport is `lg`, so components render the desktop variant | `mockViewport.spec.ts`, "is the desktop breakpoint by default". No comment added beyond the one word in the `setup.ts` header |
| Setup: `vitest/global-setup.ts` loads `.env.vitest` once | The file itself, five lines |
| Rendering: `vitest/lib.tsx` re-exports RTL with a wrapping `render`; the `wrapper` export for `renderHook`, with both examples | Header comment of `vitest/lib.tsx`, added |
| Rendering: the provider stack, the frozen home-page router, the `router` prop overriding it field by field | The comment on `TestApp` in `vitest/lib.tsx` and the header of `vitest/utils/mockRouter.ts`, both there before |
| Utilities: `mockRouter.ts` and `routerStandIn.ts`, frozen and live | Their headers, there before. The doc keeps one row for the choice between them |
| Utilities: `flushPromises.ts`, when to call it, the example | Header comment, added |
| Utilities: `mockViewport.ts`, call before rendering, `base` for mobile, the example | Header comment, added |
| Utilities: "the default `lg` is restored after every test" | `mockViewport.spec.ts`, "returns to the desktop breakpoint after a test that switched it". No comment |
| Utilities: the shared `matchMedia` stub matches width queries only | `mockViewport.spec.ts`, "matches no query that is not about the viewport width". No comment. The convention built on it (install your own with `vi.stubGlobal`) stays in the doc |
| Utilities: `mockSocket.ts`, what it replaces and what runs for real, both ways to install it, the `socketUrl` gotcha, both examples | Header comment, added |
| Utilities: `sendSocketMessage` throws when nothing subscribes | Its own comment in `mockSocket.ts`, there before |
| Mocking fetch: active globally, `fetchMock.mockResponseOnce`, queue responses in the test or `beforeEach` | Header comment of `vitest/setup.ts` |
| "One installed in `beforeAll` or at the top of the file is gone before the first test starts" | Header comment of `vitest/setup.ts` |
| Overriding envs: the `withEnvs` example with `ENVS_MAP` | Header comment of `vitest/utils/mockEnvs.ts`, extended with the example |
| Overriding envs: `src/config` is a singleton, so everything that reads config is imported inside the callback; where the presets live | Header of `mockEnvs.ts`, there before. The presets path is also a row in the doc |
| Primed-requests: each registered page has a `*.primed.spec.tsx` next to its root component; write them with `checkPrimedRequests` | `src/server/primedRequests/CONTEXT.md` and the header of `vitest/utils/checkPrimedRequests.tsx`, both there before. The doc keeps one row |

## Dropped as false

- **"Untracked files are invisible to `--changed` until `git add`."** Probed on 2026-11-17 with Vitest 5.0.0:
  an untracked spec under `src/` was picked up and run by `pnpm test:vitest --changed`. Only the plain
  form was probed; `--changed origin/main` was not, because on this branch it runs the whole suite
  (`package.json` changed).

## Kept, and in what shape

- **Isolation**, whole: the project table, when a spec needs its own registry, what breaks in a shared
  worker, and the table of what stays isolated. The SDK-spy paragraph became a fourth bullet of the
  shared-worker list.
- **The `withEnvs` split of React contexts**, under "Overriding environment variables".
- **Conventions no linter checks**, gathered into a Constraints section, each with what breaks:
  co-location, `vitest/lib` over `@testing-library/react`, no mock of the framework router,
  `mockViewport` over a hand-set `matchMedia`, restoring what the setup does not, the random-order run.
- **The headings "Isolation" and "Overriding environment variables" keep their names.** Two ESLint
  messages in `eslint.config.mjs` cite them.

## Stale pointers

Ticket 08 moved the sections but four places still sent the reader to `.agents/rules/tests-unit.md` for
them.

- Fixed, being comments: `vitest.config.ts` and `eslint.config.mjs` ("Isolation"), and
  `vitest/utils/checkPrimedRequests.tsx` ("Primed-requests drift tests", now
  `src/server/primedRequests/CONTEXT.md`).
- **Left: the two ESLint messages** (`ISOLATED_SPEC_MESSAGE`, `HAND_SET_ENV_MESSAGE` in
  `eslint.config.mjs`). They are strings, not comments, and the ticket allows no source change beyond
  comments. They still resolve in two steps, through the rule's pointer paragraph. Repointing them at
  `vitest/CONTEXT.md` is a one-line follow-up each.
- `diagnose-bug/loops.md` is untouched, as the ticket says. The rule's pointer paragraph now names
  `render`, `fetchMock`, `withEnvs` and `mockSocket`, the four it cites, and says they are in header
  comments.
