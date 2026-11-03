# 04 — Test infrastructure injects the router through the toolkit provider

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3830 |
| Blocked by | T03 |

## What to build

Neither test runner mocks `next/router` any more. Vitest: `vitest/setup.ts` drops the global `vi.mock`;
`TestApp` in `vitest/lib.tsx` takes an optional `router` prop and feeds the provider with
`buildRouterMock('/', '/')` by default; `checkPrimedRequests` passes the page's router as that prop instead of
`vi.doMock` / `vi.doUnmock`. Playwright: the `next/router` Vite alias and `playwright/mocks/modules/next/router.ts`
go; `hooksConfig.router` is kept as the test-facing API (retyped to the facade's `Router`), stored by
`beforeMount` and read by `TestApp`, which renders the provider with `{ Link: <Next link adapter>, router:
{ ...defaults, ...overrides }, pathname }`. The 63 tests using `hooksConfig.router` are retyped; the 22 that set
`isReady` drop it. No runtime change; Playwright baselines are untouched.

## Acceptance criteria

- [ ] `grep -rn "next/router" vitest playwright playwright-ct.config.ts` matches nothing; the Playwright
      module mock file is deleted.
- [ ] `vitest/lib.tsx` `TestApp` accepts `router?: Partial<Router>` (facade type) merged over
      `buildRouterMock('/', '/')`; `checkPrimedRequests` builds the page router via `buildRouterMock(page, url)`
      and passes it as the prop; `mockNextRouter` is gone; `vi.doUnmock('next/router')` is gone.
- [ ] `playwright/index.ts` `beforeMount` types `hooksConfig.router` as `Partial<Router>` and stores it;
      `playwright/TestApp.tsx` reads it and mounts the provider; the default router matches today's
      `DEFAULT_ROUTER` plus `asPath: ''`.
- [ ] The 63 `*.pw.tsx` files type-check against the facade `Router`; no `isReady` key remains in any
      `hooksConfig.router`.
- [ ] Header comments of `vitest/utils/mockRouter.ts` and `vitest/utils/routerStandIn.ts` describe the
      provider-based install (no `vi.mock` instructions left).
- [ ] `pnpm test:vitest` passes, including every `*.primed.spec.tsx`.
- [ ] Full `pnpm test:pw` run (forced full — the CT config changed) is green with zero screenshot diffs; no
      baseline file is modified or added in the diff.
- [ ] `pnpm lint:tsc`, `pnpm lint:eslint` pass.

## Details

**Where the Playwright override lives.** `beforeMount` (`playwright/index.ts`) is the only place that sees
`hooksConfig`; `TestApp` is rendered by the `render` fixture (`playwright/fixtures/render.tsx`). Keep the
existing pattern: a small module-level store (`setRouterOverrides` / `getRouterOverrides`) in `playwright/utils/`,
written in `beforeMount`, read in `TestApp`. Both run in the same browser bundle.

**Link component in tests.** Both test apps reuse the Next link adapter from the app's adapter module (ticket
01) so `Link` renders as in production; only the router value is a stand-in. `playwright/**` and `vitest/**`
are lint-exempt for the `next/*` bans, but the adapter import keeps them from needing it.

**`isReady`.** Not on the facade interface (parent spec: out of scope). The 22 occurrences were inert
(nothing reads it through a mocked router) — remove the key, nothing else.

## Leaf worklist

- [ ] 1 `[agent]` Vitest: drop the global mock, `TestApp` `router` prop over `buildRouterMock`,
      `checkPrimedRequests` via the prop; delete `mockNextRouter`; rewrite the two header comments
- [ ] 2 `[agent]` Playwright: remove the alias and module mock; override store + `TestApp` provider;
      retype `hooksConfig.router`
- [ ] 3 `[agent]` Codemod the 63 `*.pw.tsx` files (type import, drop `isReady`)
- [ ] 4 `[agent]` Run tsc, eslint, vitest, full `pnpm test:pw`; confirm zero baseline changes
