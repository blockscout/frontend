# 0001 — affected-test selection is delegated to Playwright's `--only-changed`

| | |
| --- | --- |
| Status | accepted |
| Date | 2026-09-15 |
| Deciders | @tom2drum |
| Supersedes | — |

## Decision

**Under `--changed`, the tool passes the merge-base sha to `playwright test --only-changed` and lets the
component-testing plugin decide which `*.pw.tsx` files are affected.** The tool keeps one rule of its
own, the force-full list in `../config.ts`: a change under it runs the whole suite instead. There is no
custom dependency walk.

## Why

**The bundler already holds the real module graph.** With `@playwright/experimental-ct-react` the CT
plugin builds the Vite bundle, records every registered component's module graph, and maps the changed
files onto test files through it. Measured in this repo, before this decision:

| Change | Tests selected |
| --- | --- |
| a type-only module | 0 — the bundler erases type imports, so they never form an edge |
| a leaf component | only its dependents (31 files) |
| a theme recipe, a toolkit component, or `playwright/TestApp.tsx` | the full project — `TestApp` is registered as a component through the render fixture, so anything it reaches, reaches every test |

**The rejected alternative was patching the walker.** The previous tool walked imports with
`dependency-tree`. Its gaps were that type-only imports counted as edges, the diff ran against the base
tip rather than the merge-base, and nothing forced a full run when the harness or the lockfile changed.
The first could be cut with `detective: { ts, tsx: { skipTypeImports: true } }` (about 20% fewer
edges), the others were small fixes — but the result stays a second, hand-maintained model of what the
bundler already knows, and drifts with every Vite or path-alias change.

**Icons are the blind spot the force-full list exists for.** SVG icons reach the browser as a sprite
built at run time, not through the module graph, so an icon edit selects nothing under `--only-changed`.
The other entries cover the harness template files (`playwright/**`), the config, and the lockfile —
build-shape and dependency changes with no module edge either. `package.json` is deliberately absent:
under `--frozen-lockfile` any dependency change also changes `pnpm-lock.yaml`, and script or metadata
edits do not affect the tests.

## Consequences

- Selection quality is Playwright's: an upgrade can change which tests a diff selects, and the fix for a
  mis-selection is an upstream report, not a local patch. `--only-changed --list` reporting zero tests
  in CT mode is one such report; `../CONTEXT.md` links it.
- The force-full list must stay a mirror of the `pw_changes` gate step in
  `.github/workflows/checks.yml`; a path added to one without the other either wastes a matrix run or
  skips a needed one.
- A file that reaches the browser outside the module graph and is not on the list is invisible to
  `--changed`. Adding to the list is the answer; a dependency walk is not.
