# Playwright runner — context

The `pnpm test:pw` entry point runs Playwright component tests (`*.pw.tsx`) locally, in Docker, and in CI. To learn how to use it, run `pnpm test:pw --help`.

## Where to look

| Question | Answer |
| --- | --- |
| Which tests ran, with what outcome, and where is each screenshot diff? | `playwright-results/report.json` after the run — the agent-readable surface, no console parsing needed |
| Where are the html / blob reports? | `playwright-report/` (local html), `blob-report/` (CI) |
| `--changed` ran the full suite. Why? | a changed file is on the force-full list in `./config.ts`; the tool prints which one |
| `--changed` ran zero tests. Why? | the bundler's module graph reaches no registered component from the diff — a type-only file, a server-only module, a doc. If the edit does reach the browser some other way, it belongs on the force-full list |
| Why is selection Playwright's job and not a dependency walk? | `./adr/0001-affected-tests-delegated-to-playwright.md` |
| Why no dry-run of what `--changed` would select? | `--only-changed --list` lists zero tests in CT mode; see the constraint below and the ADR's consequences |

## Constraints

- **The force-full list in `./config.ts` and the `pw_changes` gate step in `.github/workflows/checks.yml` move together.** The gate's paths are the force-full paths plus `src/`. A path added to only one either wastes a matrix run or skips a needed one.
- **`--only-changed` cannot see icons.** The sprite is built at run time from `src/sprite/icons/`, outside the bundler's module graph, so an icon edit selects zero tests. The force-full list exists for this; anything else that reaches the browser outside the module graph belongs on it too.
- **`--only-changed --list` reports zero tests in CT mode** (list mode never sets up the CT plugin), so there is no dry-run of what `--changed` would select. Run it and read `playwright-results/report.json`.
- **Running `playwright test` directly skips the pre-run steps**, so the harness loads whatever `playwright/envs.js` and sprite the last `pnpm test:pw` run left behind.
- **The json report lives under `outputDir`, not next to the html report.** The html reporter deletes `playwright-report/` when the run ends, so a second reporter writing there loses its file.
- **The Docker image name and OS suffix in `./config.ts` are paired with `container.image` in `.github/workflows/checks.yml`**, so a Mac `--docker` run renders with the same browsers as CI. The tag follows the installed `@playwright/test` version on its own.

## File map

- `./index.ts` — CLI flags, the pre-run steps, the spawn of `playwright test`, and the exit code
- `./select.ts` — the full-vs-`--only-changed` rule `--changed` applies to the changed files
- `./docker.ts` — the `docker run` argv for `--docker` and `--docker-deps`, and the image / pnpm version derivation
- `./config.ts` — paths, the base ref, the force-full list, the Node heap size Playwright runs with, and the Docker image name and mounts
- `./run.sh` — compile-and-run wrapper

The Playwright configuration itself is `../../playwright-ct.config.ts`; the test harness, fixtures and mocks are under `../../playwright/`.
