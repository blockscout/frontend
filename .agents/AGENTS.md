# Frontend application for Blockscout

## Domain terminology

Product and feature codenames used throughout the codebase (e.g. `tac`, `bens`, `cctx`, `kettle`, `epoch`) are defined in `.agents/GLOSSARY.md` — consult it whenever you encounter an unfamiliar term.

## Architecture

See `./rules/architecture.mdc` for project overview, tech stack, and directory layout.

## Design System Rules

See `./rules/design-system.mdc` for Chakra UI v3 design system configuration and styling rules.

## Code Style & Quality

See `./rules/code-quality.mdc` for code style, lint commands plus conventions linters don't catch.

## TypeScript Conventions

See `./rules/typescript.mdc` for established rules how to write Typescript code.

## Environment Variables

See `./rules/env-vars.mdc` for where environment variables live, how they're delivered at runtime, validated, and how to add or deprecate them.

## Testing

- Vitest unit tests (`*.spec.ts` / `*.spec.tsx`): See `./rules/tests-unit.mdc` for purpose, setup, utilities, and conventions.
- Playwright component visual tests (`*.pw.tsx`): See `./rules/tests-visual.mdc` for purpose, setup, fixtures, and conventions.

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
- `src/slices/` — slice ownership model (who owns an entity's rendering).
- `src/sprite/` — SVG sprite build pipeline and which outputs are tracked vs. generated.
- `src/toolkit/` — the `@blockscout/ui-toolkit` workspace package structure.
- `tools/dev-server/` — how the dev server and demo deploy get their env vars from a running instance config.

If you encounter a `CONTEXT.md` not listed here, read it too (and consider adding it to this list).

## Product task workflow

Product tasks (GitHub issues) are worked through a spec-driven workflow: the `grill-the-task` skill
interviews the developer to fill the issue's gaps, `to-spec` writes the spec into `.agents/tasks/` and
routes open questions to their owners via Slack, and `implement-task` executes the spec one subtask at a
time. See `.agents/tasks/README.md` for the lifecycle, `.agents/rules/delegation.mdc` for what agents may
implement vs. what stays human, and `.agents/TEAM.md` for who answers open questions.

## Cursor Cloud specific instructions

The Cursor Cloud VM refreshes deps on startup via its update script (`pnpm install`); there are no Cursor-only runtime steps. See "Running locally" above.
