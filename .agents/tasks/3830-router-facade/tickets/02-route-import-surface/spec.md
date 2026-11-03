# 02 — Single import surface for `route()` and the route types

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3830 |
| Blocked by | none |

## What to build

`src/shared/router/routes.ts` — the existing wrapper that adds chain / external / absolute handling to
`nextjs-routes`' `route()` — becomes the only module that imports `nextjs-routes`. It re-exports the `Route`,
`Query` and `DynamicRoute` types, and every other importer (about 130 files, including the type-only imports
in `src/pages/**` and `src/server/**`) is codemodded to it with `ast-grep --rewrite`. `nextjs-routes` joins
`no-restricted-imports`, exempting the wrapper. The generated `nextjs-routes.d.ts` stays the source of truth.
No runtime change.

## Acceptance criteria

- [x] `grep -rln "from 'nextjs-routes'" src vitest playwright` lists only `src/shared/router/routes.ts`
      (plus the generated `nextjs-routes.d.ts`).
- [x] `routes.ts` exports `route`, `routeParams`, `RouteParams` and re-exports `Route`, `Query`,
      `DynamicRoute` as types.
- [x] ESLint bans `nextjs-routes` repo-wide with a message pointing at `src/shared/router/routes`; the wrapper
      is exempt via a `files` override.
- [x] Call sites that used the raw `nextjsRoute()` now go through the wrapper with no params — same output for
      every non-chain, non-external, non-absolute call. The wrapper returns `string`, not the branded
      `RouteLiteral`; if a call site needed the brand, tsc shows it — widen the consumer's type, do not brand.
- [x] `pnpm lint:tsc`, `pnpm lint:eslint`, `pnpm test:vitest`, `pnpm test:code-complexity --changed` pass.

## Details

Import variants seen today: `import { route } from 'nextjs-routes'` (100), `import type { Route }` (32),
`import type { Query }` (2), `import type { DynamicRoute }` (1), `import { route, type Route }` (1). The
server-side `src/server/getServerSideProps/guards.ts` uses `route()` too; the wrapper imports `src/config`,
which that layer already consumes. Run `pnpm lint:eslint --fix` after the rewrite for import ordering.

The parent spec's "Out of scope: changing `src/pages/**`" refers to behaviour; the type-import swap is in,
and `src/pages/_app.tsx` is named in the spec as moving like everyone else.

## Leaf worklist

- [x] 1 `[agent]` Re-export the route types from `src/shared/router/routes.ts`
- [x] 2 `[agent]` `ast-grep --rewrite` the `nextjs-routes` importers to the wrapper; `eslint --fix`; `tsc`
- [x] 3 `[agent]` Add `nextjs-routes` to `no-restricted-imports` with the wrapper exempt
- [x] 4 `[agent]` Run tsc, eslint, vitest, code-complexity
