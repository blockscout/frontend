# Playwright runner — context

The `pnpm test:pw` entrypoint for Playwright component tests (`*.pw.tsx`). It prepares the browser-side envs and the SVG sprite, then hands the rest of the command line to `playwright test`.

## Where to look

| Question | Answer |
| --- | --- |
| How do I run it? Which flags are the tool's, which reach Playwright? | `pnpm test:pw --help` |
| How do I write a component test? | `../../.agents/rules/tests-visual.md` |
| Which tests ran, and with what outcome? | `playwright-results/report.json` after the run |
| Where are the html / blob reports and the screenshot diffs? | `playwright-report/` (local html), `blob-report/` (CI), `playwright-results/` (per-test artifacts) |
| Which file implements each part? | the file map below |

## Constraints

- **Every run starts with the pre-run steps**: `playwright/envs.js` is regenerated from `playwright/.env.pw` and the sprite is rebuilt under the `pw` app env. Running `playwright test` directly skips both and the harness loads whatever the last run left behind.
- **The json report lives under `outputDir`, not next to the html report.** The html reporter deletes `playwright-report/` when the run ends, so a second reporter writing there loses its file. `outputDir` is cleared when the run starts, so a file written at the end survives.

## File map

- `./index.ts` — CLI flags, the pre-run steps, the spawn of `playwright test`, and the exit code; the flag mechanics live in `../cli/flags.ts`
- `./config.ts` — paths, the base ref, and the Node heap size Playwright runs with
- `./run.sh` — compile-and-run wrapper
- `./tsconfig.json` — covers this folder and `../cli`

The Playwright configuration itself is `../../playwright-ct.config.ts`; the test harness, fixtures and mocks are under `../../playwright/`.
