# Frontend application for Blockscout

## Domain terminology

Product and feature codenames used throughout the codebase (e.g. `tac`, `bens`, `cctx`, `kettle`, `epoch`) are defined in `.agents/GLOSSARY.md` — consult it whenever you encounter an unfamiliar term.

## Architecture

See `./rules/architecture.md` for project overview, tech stack, and directory layout.

## Design System Rules

See `./rules/design-system.md` for Chakra UI v3 design system configuration and styling rules.

## Code Style & Quality

See `./rules/code-quality.md` for code style, lint commands plus conventions linters don't catch, and the complexity/CRAP scores.

## TypeScript Conventions

See `./rules/typescript.md` for established rules how to write Typescript code.

## Environment Variables

See `./rules/env-vars.md` for where environment variables live, how they're delivered at runtime, validated, and how to add or deprecate them.

## Testing

- Vitest unit tests (`*.spec.ts` / `*.spec.tsx`): See `./rules/tests-unit.md` for purpose, setup, utilities, and conventions.
- Playwright component visual tests (`*.pw.tsx`): See `./rules/tests-visual.md` for purpose, setup, fixtures, and conventions.

## Running locally

Three ways to start the dev server:

- `pnpm dev:preset <alias>` (e.g. `eth`) — the quickest way to a running app. Fetches a live instance's config over HTTP at startup, so it needs outbound internet. Aliases are defined in `tools/dev-server/registry.json`; how the fetch and env layering work is documented in `tools/dev-server/CONTEXT.md`.
- `pnpm dev:local` — runs against a locally running Blockscout backend, using the committed `tools/dev-server/.env.localhost`.
- `pnpm dev` — plain Next.js dev; needs a hand-written `.env.local` with the instance config.

Both `dev:preset` and `dev:local` accept `--port <number>` to run on a port other than 3000 (it overrides `NEXT_PUBLIC_APP_PORT`, keeping the generated `envs.js` consistent).

Gotchas:

- First page load is slow because Turbopack compiles routes on demand; a single `curl localhost:3000` can take ~45s before returning 200. Expected, not a hang.
- `next.config.js` prints a harmless `Unrecognized key(s) in object: 'outDir'` warning on startup; ignore it.

## Per-directory context

Some directories have a `CONTEXT.md` documenting non-obvious patterns specific to that area. Read the relevant one before working in (or reaching into) that directory:

- `deploy/scripts/` — how the frontend container is built and starts up (Dockerfile stages, entrypoint).
- `deploy/tools/envs-validator/` — startup validation of `NEXT_PUBLIC_*` envs against yup schemas.
- `src/api/` — how a request URL is assembled (resource registry, runtime config, `/node-api/config`) and where resource response types come from.
- `src/features/connect-wallet/` — why the wallet stack is loaded lazily (off the critical path), how account state reaches boot-time consumers before a provider exists, and the connector-mode differences.
- `src/server/primedRequests/` — the early-fetch primer: why it exists, the CSP-driven determinism constraint, its correctness guarantee, and the drift-test contract.
- `src/slices/` — slice ownership model (who owns an entity's rendering).
- `src/sprite/` — SVG sprite build pipeline and which outputs are tracked vs. generated.
- `src/toolkit/` — the `@blockscout/ui-toolkit` workspace package structure.
- `tools/code-complexity/` — the cognitive-complexity / CRAP code-quality gate: what a failure means and how to fix it.
- `tools/dev-server/` — how the dev server and demo deploy get their env vars from a running instance config.
- `tools/profiling/` — React render profiling: production profiling build and DevTools trace aggregation.

If you encounter a `CONTEXT.md` not listed here, read it too (and consider adding it to this list).

## Architecture decision records (ADRs)

See `./rules/adr.md` when proposing or adding a new record.

The repo-wide records index:

- `0002-layer-shaped-ticket-leaves.md` — why a product task's tickets cut vertically while the leaves inside them run along layers.
- `0003-turbopack-for-production-builds.md` — why production builds moved back to Turbopack.

## Product task workflow

Product tasks (GitHub issues) are worked through a spec-driven workflow — interview, spec, agent
implementation, code review. Specs accumulate in `.agents/tasks/` as a permanent record. See
`./tasks/README.md` for the lifecycle, the skills that run it, and the spec conventions.

## Editing this instruction set

Before changing anything under `.agents/`, read `./README.md` — it owns the layout, the dual-frontmatter
rules contract, the per-file symlink Cursor needs, and how references here are checked.

## Reaching people & channels on Slack

To reach anyone or any channel on Slack, resolve the Slack IDs from `./TEAM.md`. Draft and get approval
before sending anything — unless the skill you are running names an explicit exception.
