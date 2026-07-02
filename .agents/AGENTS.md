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

## Cursor Cloud specific instructions

This is a Next.js frontend (only service). Dependencies are installed via `pnpm install` (Node/pnpm versions come from `.nvmrc` / `package.json` `engines`; `postinstall` runs chakra typegen + husky). Standard commands live in `package.json` scripts and `docs/CONTRIBUTING.md`.

- Run the app with `pnpm dev:preset <alias>` (e.g. `pnpm dev:preset eth`). This is the reliable way to run it here: it fetches a live instance's public config (with working public keys) from `<url>/node-api/config` into `.env.tmp`, so no manual env setup is needed. Aliases are in `tools/dev-server/registry.json`. Serves on `http://localhost:3000`. Requires outbound internet at startup (config + asset downloads). Plain `pnpm dev` needs a hand-written `.env.local` and is not recommended for a quick run.
- First page load is slow (Turbopack compiles routes on demand); a single `curl localhost:3000` can take ~45s before returning 200. This is expected, not a hang.
- Lint/test/build commands: `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm test:vitest run` (bare `pnpm test:vitest` starts watch mode — pass `run` for one-shot). Playwright component tests (`pnpm test:pw:*`) require Docker to generate CI-correct screenshots.
- `next.config.js` prints a harmless `Unrecognized key(s) in object: 'outDir'` warning on startup; ignore it.
