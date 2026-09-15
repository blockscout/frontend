# Rework how Playwright component tests are selected and run in CI

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3706 |
| Feature branch | `issue-3706` |
| PM | — (frontend tooling task) |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Playwright component tests (`*.pw.tsx`) run on every PR, scoped by a custom affected-tests tool that walks
the import graph with `dependency-tree`. The walker has known gaps (type-only imports count as dependencies,
the diff is taken against the base-branch tip rather than the merge-base, no forced full run when the test
harness or the lockfile changes), and the CI wiring wastes runner time: the three matrix jobs boot even when
the resolve job found nothing to run, the `default` project alone takes ~16 min while the other two take
4–5 min, and every matrix job spends ~3 min in redundant post-job cache saves plus a git-lfs install nothing
uses. The tooling is also split between `deploy/tools/affected-tests` (a path CI's `paths-ignore` excludes,
so changes to the tool never trigger checks) and `tools/scripts/pw*.sh`.

The goal is one `pnpm test:pw` entrypoint shaped like the sibling gates (`test:code-complexity`,
`test:mutation-testing`), affected-test selection delegated to Playwright's own `--only-changed`, and a CI
layout that skips empty runs and balances the buckets — so an average feature-branch run finishes in a
fraction of today's wall time and a human or agent has one command to reach for.

## Functional requirements

1. A `tools/playwright/` tool, exposed as `pnpm test:pw`, is the single entrypoint for running Playwright
   component tests locally, in Docker, and in CI. It follows the sibling tools' conventions: TypeScript
   compiled on run via a `run.sh` wrapper, a `--help` usage text, co-located specs, and a `CONTEXT.md`.
2. Its own flags are `--changed[=<ref>]`, `--base <ref>`, `--docker`, `--docker-deps`, and `--help`. Every
   other argument (`--project`, `--shard`, `-g`, `--update-snapshots`, `--clear-cache`, file paths, …) is
   passed through to `playwright test` untouched.
3. `--changed` selects affected tests against the **merge-base** of the base ref (default `origin/main`)
   and `HEAD`, including uncommitted working-tree edits — the same semantics as the sibling gates'
   `--changed`. Playwright's bare "uncommitted vs HEAD" mode is not exposed.
4. Under `--changed`, if any changed file falls under a **force-full list** — `src/icons/**`,
   `playwright/**`, `playwright-ct.config.ts`, `pnpm-lock.yaml` — the tool runs the whole suite. Otherwise
   it runs Playwright with `--only-changed=<merge-base sha>`, so the bundler's real module graph decides
   which test files are affected; type-only imports never count because the bundler erases them.
5. Before every run the tool regenerates `playwright/envs.js` from `playwright/.env.pw` and builds the SVG
   sprite for the `pw` app env, as the current script does. The unconditional deletion of Playwright's build
   cache stays in the tool but commented out, with the reason recorded next to it, so it can be flipped back
   on if a stale build is ever observed.
6. `--docker` runs the same command inside the pinned Playwright image with the Linux `node_modules`
   mounted; `--docker-deps` installs those Linux dependencies. The existing `test:pw:docker` and
   `test:pw:docker:deps` package scripts remain as aliases of the flags.
7. Every run writes a JSON report alongside the existing reporter output (`blob` in CI, `html` locally) so
   an agent can read outcomes and screenshot-diff paths without parsing the console reporter.
8. `deploy/tools/affected-tests` and `tools/scripts/pw*.sh` are removed; `package.json` scripts point at
   the new tool.
9. In `checks.yml`, the affected-tests resolve job becomes a **no-install gate**: it computes the
   merge-base and lists changed files under the watched paths (`src/`, `playwright/`,
   `playwright-ct.config.ts`, `pnpm-lock.yaml`); the matrix jobs are skipped when the list is empty. The
   gate's path list and the tool's force-full list are documented as a pair that must stay in sync.
10. The matrix is five jobs via `include`: `default` split into three shards, `mobile`, and
    `dark-color-mode`. Each runs `pnpm test:pw --changed --project=<name> [--shard=<n>/3]
    --pass-with-no-tests`, checks out with full history (the merge-base needs it), and uploads its blob
    report as today; the report-merge job is unchanged.
11. The matrix jobs no longer install git-lfs or check out with LFS, and the duplicate dependency cache
    (`cache: true` on the pnpm setup action, alongside `setup-node`'s pnpm cache) is dropped.
12. `.agents/rules/tests-visual.md` and the tool's `CONTEXT.md` document the new commands; a
    module-scoped ADR under `tools/playwright/adr/` records why selection is delegated to Playwright rather
    than a custom dependency walk.
13. An upstream Playwright issue is filed for `--only-changed --list` reporting zero tests in
    component-testing mode (list mode never sets up the CT plugin, so no component dependencies are
    populated), and linked from the tool's `CONTEXT.md`.

## Data & API

None. No endpoints, resources, env vars, or feature flags.

## UI inventory

None. This is CI/tooling only.

## Implementation decisions

- **Playwright's `--only-changed` replaces the custom walker.** Verified in this repo: with
  `@playwright/experimental-ct-react` the CT plugin builds the Vite bundle, records each registered
  component's module graph, and maps changed files to test files through it. Touching a type-only file
  selected 0 tests; touching a leaf component selected only its 31 dependents; touching a theme recipe, a
  toolkit component, or `TestApp` selected the full project, because `TestApp` is registered as a
  component through the render fixture. The custom walker with `dependency-tree` could be patched
  (`detective: { ts, tsx: { skipTypeImports: true } }` cuts ~20% of edges) but stays a parallel model of
  what the bundler already knows.
- **Icons are the one blind spot, hence the force-full list.** SVG icons reach the browser as a sprite
  built at run time, not through the module graph. `playwright/**` covers template files (`index.ts`,
  `index.html`, `.env.pw`, fonts) that are not component dependencies; the config and the lockfile cover
  build-shape and dependency changes. `package.json` needs no special handling: under `--frozen-lockfile`
  any dependency change also changes `pnpm-lock.yaml`, while script/metadata edits do not.
- **Merge-base, not base-tip.** A two-dot diff against `origin/main` reports files that only changed on
  main since the branch forked, over-selecting on stale branches. The tool resolves `git merge-base
  <base> HEAD` and passes that sha to Playwright, matching `tools/code-complexity`'s diff scoping.
- **The empty-run gate is plain shell in the workflow, not the tool.** The gate is one `git diff
  --name-only <merge-base> -- <paths>`; running the TypeScript tool there would cost a dependency install
  (~1.5 min serial) on every PR. The four paths are duplicated between the workflow step and the tool's
  config and documented as such; if drift ever bites, the gate moves into the tool.
- **Sharding, not workers.** `default` runs every test not tagged `-@default` (~720 tests) versus ~150–180
  in the other two projects. Three shards bring it to the others' size deterministically; raising
  `workers` above 1 is left for a later, measured change because the flake rate is already non-trivial.
- **Agent surface is the JSON report, not a dry-run.** Playwright's `--list` is the natural "which tests
  would run" answer but is broken with `--only-changed` in CT mode. A bespoke dry-run would have to
  drive Playwright internals and would break on upgrade; the JSON report plus the upstream bug report
  is the chosen shape for now.
- **Full runs stay on pre-release and manual dispatch.** Two years of this cadence have surfaced few broken
  tests on `main`; adding a push-to-main full run is deferred.

## Out of scope

- The vitest gate's `--changed=origin/main` selection: vitest already diffs `<ref>...HEAD` (merge-base
  semantics), so it has no equivalent bug and needs no change.
- Raising Playwright `workers` in CI or tuning `retries`.
- A scheduled or push-to-main full Playwright run.
- Sharding `mobile` or `dark-color-mode`.
- A dry-run / "list affected tests" command.
- Any change to the tests themselves, screenshots, or the `playwright/` harness (fixtures, mocks, `TestApp`).
