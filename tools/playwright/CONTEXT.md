# Playwright runner — context

The `pnpm test:pw` entrypoint for Playwright component tests (`*.pw.tsx`). It prepares the browser-side envs and the SVG sprite, then hands the rest of the command line to `playwright test`.

## Where to look

| Question | Answer |
| --- | --- |
| How do I run it? Which flags are the tool's, which reach Playwright? | `pnpm test:pw --help` |
| How do I write a component test? | `../../.agents/rules/tests-visual.md` |
| How do I update screenshots? | `pnpm test:pw --docker <file.pw.tsx> --update-snapshots`, after a one-off `pnpm test:pw --docker-deps`; a screenshot from a plain local run does not match CI's Linux rendering |
| Which tests ran, and with what outcome? | `playwright-results/report.json` after the run |
| Where are the html / blob reports and the screenshot diffs? | `playwright-report/` (local html), `blob-report/` (CI), `playwright-results/` (per-test artifacts) |
| `--changed` ran the full suite. Why? | a changed file is on the force-full list in `./config.ts`; the tool prints which one |
| `--changed` ran zero tests. Why? | the bundler's module graph reaches no registered component from the diff — a type-only file, a server-only module, a doc. If the edit does reach the browser some other way, it belongs on the force-full list |
| Why is selection Playwright's job and not a dependency walk? | `./adr/0001-affected-tests-delegated-to-playwright.md` |
| Which file implements each part? | the file map below |

## Constraints

- **Every run starts with the pre-run steps**: `playwright/envs.js` is regenerated from `playwright/.env.pw` and the sprite is rebuilt under the `pw` app env. Running `playwright test` directly skips both and the harness loads whatever the last run left behind.
- **The json report lives under `outputDir`, not next to the html report.** The html reporter deletes `playwright-report/` when the run ends, so a second reporter writing there loses its file. `outputDir` is cleared when the run starts, so a file written at the end survives.
- **The force-full list in `./config.ts` and the `pw_changes` gate step in `.github/workflows/checks.yml` are one list in two places.** A path added to only one either wastes a matrix run or skips a needed one.
- **`--changed` needs the merge-base, so it needs history.** A shallow clone makes `git merge-base` fail; CI checks out with full history for that reason.
- **`--only-changed --list` reports zero tests in CT mode**, so there is no dry-run of what `--changed` would select. Run it and read `playwright-results/report.json`.
- **`--docker` is the same command line inside the CI image.** The image tag follows the installed `@playwright/test` version and the pnpm version follows `packageManager` in `package.json`; the image name and OS suffix in `./config.ts` are paired with `container.image` in `.github/workflows/checks.yml`. Docker gets `-it` only when stdin is a terminal, so an agent can run it.

## File map

- `./index.ts` — CLI flags, the pre-run steps, the spawn of `playwright test`, and the exit code; the flag mechanics live in `../cli/flags.ts`, the merge-base and changed-file lookup in `../code-complexity/select/diff.ts`
- `./select.ts` — the full-vs-`--only-changed` rule `--changed` applies to the changed files
- `./docker.ts` — the `docker run` argv for `--docker` and `--docker-deps`, and the image / pnpm version derivation
- `./config.ts` — paths, the base ref, the force-full list, the Node heap size Playwright runs with, and the Docker image name and mounts
- `./adr/` — decisions with real alternatives
- `./run.sh` — compile-and-run wrapper
- `./tsconfig.json` — covers this folder and `../cli`

The Playwright configuration itself is `../../playwright-ct.config.ts`; the test harness, fixtures and mocks are under `../../playwright/`.
