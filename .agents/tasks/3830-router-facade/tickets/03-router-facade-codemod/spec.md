# 03 — App facade `useRouter` / `usePathname`, codemod of every importer, lint ban

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3830 |
| Blocked by | T01, T02 |

## What to build

The app gets its one router hook. `src/shared/router/useRouter.ts` returns the toolkit context's router,
typed for the app: `push` / `replace` accept the typed `Route` (from `routes.ts`) or a string, plus
`{ shallow?, scroll? }`; `query` is today's string / string-array / undefined record; the unused
`useRouter<P>()` generic is gone. `src/shared/router/usePathname.ts` returns the context's pathname. The
router helpers (`useQueryParams`, `updateQueryParam`, `removeQueryParam`, `useEtherscanRedirects`) consume
them, and every other importer is codemodded: ~147 `next/router` files, the 13 `push` / `replace` call sites
passing Next's `undefined` `as` argument, the 3 `next/navigation` files, the one `router.route` read. Two
behaviour-preserving tweaks the interface forces: `AdbutlerBanner` drops its router effect dependency, and
the marketplace auto-connect flag stops listening to `routeChangeStart` — `MarketplaceApp` resets it in an
unmount cleanup instead.

Vitest's `routerStandIn` becomes a provider value with a `wrapper` for `renderHook`, and the 13 specs that
mock `next/router` move to it (they break otherwise: the facade no longer imports `next/router`). The global
`next/router` mock in `vitest/setup.ts` stays for now — it still feeds the Next adapter inside `TestApp`;
ticket 04 retires it. Finally `no-restricted-imports` bans `next/router`, `next/navigation` and `next/link`
repo-wide, and the unused `eslint-config-next` dev dependency goes.

## Acceptance criteria

How to verify: `pnpm dev:preset eth --port 3001`, drive it with the Playwright MCP browser.

- [ ] `grep -rln "from 'next/router'\|from 'next/navigation'\|from 'next/link'" src` lists only the Next
      adapter module from ticket 01.
- [ ] `useRouter()` exposes exactly `query`, `pathname`, `asPath`, `push`, `replace`; `push(url, options?)` /
      `replace(url, options?)` with `url: Route | string` and `options: { shallow?, scroll? }`. No call site
      passes a second `undefined` argument; no `useRouter<...>()` generic remains.
- [ ] `usePathname()` has today's `next/navigation` semantics; `useLogPageView` and `useNotifyOnNavigation`
      consume it.
- [ ] `MarketplaceContextProvider` has no router import; `MarketplaceApp` resets `isAutoConnectDisabled` to
      `false` in an unmount-only effect cleanup (separate from the data effect, so a data refetch does not reset
      it). `vitest/lib.tsx` / `playwright/TestApp.tsx` still provide the marketplace context value as before.
- [ ] `AdbutlerBanner` no longer imports `next/navigation`; its placement effect runs once per mount as before.
- [ ] Facade specs cover: query parsing (string / array / undefined through the provider), `push` / `replace`
      delegation with the options mapping onto Next's `(url, undefined, options)` in the adapter, and the
      no-provider defaults.
- [ ] `vitest/utils/routerStandIn.ts` installs through the toolkit provider (`routerStandIn.wrapper` or
      equivalent), not `vi.mock('next/router')`; `routerStandIn.spec.ts` and the 13 migrated specs pass;
      their `push` / `replace` expectations drop the `undefined` middle argument.
- [ ] ESLint: `next/router`, `next/navigation`, `next/link`, `nextjs-routes` banned repo-wide with messages
      pointing at the facade; exempt only the Next adapter module, `src/shared/router/routes.ts`,
      `src/toolkit/router/**`, `vitest/**`, `playwright/**`. The toolkit override that turns
      `no-restricted-imports` off now bans the `next/*` modules instead.
- [ ] `eslint-config-next` is gone from `package.json` and the lockfile; `@next/eslint-plugin-next` and its
      rules are untouched; `pnpm lint:eslint` passes.
- [ ] Agent browser smoke: txs list pagination (next / prev, `?page=`), a filter on the address token
      transfers tab (`?filter=`), tab switching, the search bar result navigation, back button after a
      shallow push, the `/stats` route and a dapp page open and navigate away — all client-side (window marker
      survives), URLs identical to before.
- [ ] `pnpm lint:tsc`, `pnpm lint:eslint`, `pnpm test:vitest` (incl. `*.primed.spec.tsx`),
      `pnpm test:code-complexity --changed`, `pnpm lint:react-doctor --scope changed` pass.

## Details

**Facade typing.** The toolkit `Router` is loose (`Url`); the app facade narrows `push` / `replace` to
`Route | string` so the typed route map keeps guarding call sites — `nextjs-routes.d.ts` augments
`next/router` the same way today. Implement as a typed view over the context value (an interface extending
the toolkit `Router` with narrowed method signatures plus a cast in one place), not a second router object.

**Codemod rules (ast-grep, `--rewrite`).** `import { useRouter } from 'next/router'` → facade;
`import type { NextRouter } from 'next/router'` → the facade `Router` type (`updateQueryParam`,
`removeQueryParam` signatures and any other annotation); `$R.push($URL, undefined, $OPTS)` → `$R.push($URL,
$OPTS)` and the same for `replace` and bare-function `push(…)` in `useChainValue`; `useRouter<$T>()` →
`useRouter()`; `import { usePathname } from 'next/navigation'` → facade. `router.route` in
`useEtherscanRedirects` → `router.pathname` (identical in the Pages Router). Then `eslint --fix` and `tsc`.

**Vitest stand-in.** Keep the store, the version-settled `push` promise and the public surface (`reset`,
`setQuery`, `setPathname`, `pathname`, `query`, `push`, `replace`); replace `nextRouterModule` with a
`wrapper` component that calls the stand-in's `useRouter` and renders `RouterProvider` with `{ router,
pathname, Link }` (Link from the adapter module or the toolkit default). Spec usage becomes
`renderHook(fn, { wrapper: routerStandIn.wrapper })`. Any other `renderHook` spec that relied on the global
default mock and now sees the no-op router wraps in `vitest/lib`'s `wrapper` or the stand-in's.

**Marketplace.** `MarketplaceApp` already sets the flag from data; add
`React.useEffect(() => () => setIsAutoConnectDisabled(false), [ setIsAutoConnectDisabled ])`. The parent spec
explains why this beats a pathname effect in the provider.

**Lint config.** Replace the `next/link` entry in `RESTRICTED_MODULES` with the four bans; add a `files`
override for the exempt paths that removes those entries (keep the rest of the list active there).

## Leaf worklist

- [ ] 1 `[agent]` Facade `useRouter.ts` / `usePathname.ts` in `src/shared/router/` with the typed `Route`
      narrowing; migrate the four router helpers
- [ ] 2 `[agent]` Marketplace flag reset in `MarketplaceApp`; `MarketplaceContextProvider` and `AdbutlerBanner`
      drop their router imports
- [ ] 3 `[agent]` `ast-grep --rewrite` the `next/router` / `next/navigation` importers, the `as` argument, the
      generic; `eslint --fix`; `tsc`
- [ ] 4 `[agent]` `routerStandIn` as provider value + `wrapper`; migrate its spec and the 13 specs
- [ ] 5 `[agent]` Facade specs (query parsing, delegation + options mapping, defaults)
- [ ] 6 `[agent]` Lint ban + exemptions; remove `eslint-config-next`
- [ ] 7 `[agent]` Run the gates; browser smoke on `dev:preset eth`
