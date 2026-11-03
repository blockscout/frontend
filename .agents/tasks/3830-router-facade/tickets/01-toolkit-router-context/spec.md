# 01 — Toolkit router context + Next.js adapter mounted in the shell and test apps

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3830 |
| Blocked by | none |

## What to build

`@blockscout/ui-toolkit` stops knowing about Next.js. A new toolkit module `src/toolkit/router/` owns the
router contract: a context, a `RouterProvider`, the adapter types (link component + router), and the
defaults used when no provider is mounted — a plain `<a>` and a no-op router. `Link`, `LinkOverlay`,
`RoutedTabs` and `useActiveTabFromQuery` read that context instead of importing `next/link` / `next/router`.
The toolkit package drops its `next` peer dependency and type-checks and builds with zero `next` imports.

On the app side, one adapter module in `src/shared/router/` builds the Next.js implementation — a link
component over `next/link` forwarding `scroll` / `shallow` / `prefetch`, and a router value over
`next/router` (members `query`, `pathname`, `asPath`, `push`, `replace`, with `push(url, options?)` mapped
onto Next's `(url, undefined, options)`) plus `pathname` over `next/navigation`'s `usePathname`. It is mounted
in `src/pages/_app.tsx`, `vitest/lib.tsx` and `playwright/TestApp.tsx`. Nothing else changes yet: app code
still imports `next/router` directly, and the existing Vitest / Playwright `next/router` mocks keep working
because the adapter reads them.

## Acceptance criteria

How to verify: `pnpm dev:preset eth --port 3001`, drive it with the Playwright MCP browser.

- [ ] `src/toolkit/router/` exports the context, `RouterProvider`, the adapter types and the defaults; the
      package index re-exports them.
- [ ] `grep -rn "from 'next/" src/toolkit --exclude-dir=pages --exclude-dir=node_modules` matches nothing
      (`next-themes` is a different package and stays).
- [ ] `src/toolkit/package/package.json` has no `next` peer dependency; `pnpm --filter @blockscout/ui-toolkit
      typecheck` and `build` pass; the built `dist/index.js` contains no `next/` import.
- [ ] Without a provider, `Link` renders `<a href>` (an object `href` is stringified) and `RoutedTabs` can mount
      with the no-op router; with a provider, `Link` renders the injected component and forwards `href`,
      `scroll`, `shallow`, `prefetch` — covered by a Vitest spec beside the toolkit router module (FR9's link
      adapter spec).
- [ ] The Next adapter module is the only file in `src/` that imports `next/link`; it imports `next/navigation`
      for `usePathname` only — never its `useRouter`, which throws outside an App Router tree (Playwright CT).
- [ ] `_app.tsx`, `vitest/lib.tsx` and `playwright/TestApp.tsx` mount the adapter provider; `pnpm test:vitest`
      and the Playwright suites touching `Link` / `RoutedTabs` (`Link.pw.tsx`, `RoutedTabs`, a tabbed page
      such as `Token.pw.tsx`) pass with unchanged baselines.
- [ ] Agent browser smoke on the dev server: an in-app link click navigates client-side (a `window` marker
      set before the click survives), a tab click updates `?tab=` without reload, a `scroll={ false }` link
      (token select on an address page) keeps the scroll position.
- [ ] `pnpm lint:tsc`, `pnpm lint:eslint` pass.
- [ ] `(human)` The adapter interface (`src/toolkit/router/types.ts` and the toolkit README section) is
      signed off — it is the published package's API.

## Details

**Contract shape (starting point, refine in place).** `Query = Record<string, string | Array<string> |
undefined>`; `Url = string | { pathname?: string; query?: Query | null; hash?: string }`; `NavigateOptions =
{ shallow?: boolean; scroll?: boolean }`; `Router = { query; pathname; asPath; push(url, options?):
Promise<boolean>; replace(url, options?): Promise<boolean> }`; `LinkComponent` = forward-ref component taking
`href: Url`, `scroll?`, `shallow?`, `prefetch?`, anchor attributes and `children`. The context value is
`{ Link: LinkComponent; router: Router; pathname: string | null }`. The toolkit provider is dumb — it takes
the value — so tests can later feed partial stand-ins. The app's adapter module exports the Next link
component, a hook that builds the router value (memoized on the Next router identity so `[router]` effect
deps keep their current cadence), and a `NextRouterProvider` component composing them. Default router methods
resolve `false`.

**`usePathname` semantics.** Keep today's `next/navigation` return type (`string | null`) so `useLogPageView`
and `useNotifyOnNavigation` migrate untouched in ticket 03.

**RoutedTabs.** Its two `router.push(url, undefined, { shallow: true })` calls become `push(url, { shallow:
true })`. Behaviour otherwise unchanged, including the `scroll_to_tabs` mount effect.

**Lint.** `src/toolkit/chakra/**` / `components/**` / `package/**` have `no-restricted-imports` off; the
repo-wide `next/*` ban arrives in ticket 03 and adds a toolkit-scoped ban there. Nothing to do here.

**Toolkit README.** Add a "Routing" section: the provider is required for client-side navigation, the
adapter interface, the no-provider defaults, a minimal Next.js adapter example. Read `.agents/rules/docs.md`
first.

## Leaf worklist

- [x] 1 `[agent]` Create `src/toolkit/router/` — types, context, `RouterProvider`, defaults, `useRouter` /
      `useLink` hooks; export from `src/toolkit/package/src/index.ts`
- [x] 2 `[agent]` Port `Link` / `LinkOverlay` (`src/toolkit/chakra/link.tsx`), `RoutedTabs` and
      `useActiveTabFromQuery` to the context; drop `next` from the toolkit peer deps; toolkit typecheck + build
- [x] 3 `[agent]` Write the Next adapter module in `src/shared/router/` and mount it in `_app.tsx`,
      `vitest/lib.tsx`, `playwright/TestApp.tsx`
- [x] 4 `[agent]` Link-adapter Vitest spec (provider vs. no-provider rendering, prop forwarding)
- [x] 5 `[agent]` Toolkit README "Routing" section
- [x] 6 `[agent]` Run tsc, eslint, vitest, the affected Playwright suites; browser smoke on `dev:preset eth`
