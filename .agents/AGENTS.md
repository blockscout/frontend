# Frontend application for Blockscout

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

## Architecture

See `./rules/architecture.mdc`.

## Design System Rules

See `./rules/design-system.mdc`.

## Code Style & Quality

See `./rules/code-quality.mdc`.

## TypeScript Conventions

See `./rules/typescript.mdc`.

## Environment Variables

See `./rules/env-vars.mdc`.

## Testing

- Unit tests (`*.spec.ts` / `*.spec.tsx`): See `./rules/tests-unit.mdc`.
- Visual component tests (`*.pw.tsx`): See `./rules/tests-visual.mdc`.

## Running locally — gotchas

Commands are defined in `package.json` `scripts`. Agent-facing references: the `./rules/*.mdc` files and per-directory `CONTEXT.md` files (`tools/dev-server/CONTEXT.md` covers the env/dev-server model). Deps install with `pnpm install`. Non-obvious runtime caveats:

- `pnpm dev:preset <alias>` (e.g. `eth`) needs outbound internet at startup — it fetches the instance config + assets over HTTP. Plain `pnpm dev` needs a hand-written `.env.local`, so a preset is the quickest way to get a running app.
- First page load is slow because Turbopack compiles routes on demand; a single `curl localhost:3000` can take ~45s before returning 200. Expected, not a hang.
- `pnpm test:vitest` starts watch mode — pass `run` (`pnpm test:vitest run`) for a one-shot run.
- `next.config.js` prints a harmless `Unrecognized key(s) in object: 'outDir'` warning on startup; ignore it.

## Cursor Cloud specific instructions

The Cursor Cloud VM refreshes deps on startup via its update script (`pnpm install`); there are no Cursor-only runtime steps. See "Running locally — gotchas" above.
