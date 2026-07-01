# Frontend application for Blockscout

## Per-directory context

Some directories have a `CONTEXT.md` documenting non-obvious patterns specific to that area. Read the relevant one before working in (or reaching into) that directory:

- `deploy/scripts/` — how the frontend container is built and starts up (Dockerfile stages, entrypoint).
- `deploy/tools/envs-validator/` — startup validation of `NEXT_PUBLIC_*` envs against yup schemas.
- `src/api/` — how a resource's real request URL is resolved (registry + `config.ts` env vars + a live instance's `/node-api/config`).
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
