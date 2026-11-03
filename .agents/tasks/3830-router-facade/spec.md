# Introduce a framework-neutral router facade and make the toolkit router-agnostic

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3830 |
| Feature branch | `issue-3830` |
| PM | tom (frontend tech task) |
| Demo | staging |

<!-- Header is static identity — no status row: task status is derived from `progress.md` (see
`.agents/tasks/structure.md`). Rows with nothing to say are dropped; `Demo` is always present because it
drives an action. -->

## Context & goal

Application code reaches for Next.js routing primitives directly in hundreds of files: `useRouter` from
`next/router`, `route()` / `Route` from `nextjs-routes`, `usePathname` / `useRouter` from `next/navigation`,
and `next/link` inside the published `@blockscout/ui-toolkit` package. Any future change of router or
framework therefore touches ~400 files, and the toolkit cannot be installed without Next.js.

The task puts a framework-neutral facade between the app and the router so the framework dependency lives in
a handful of modules. It is worthwhile on its own: it shrinks a future router change to ~50 files, frees the
toolkit from a hard `next` dependency, and makes the test infrastructure independent of the framework's
router. Rationale and the wider analysis: `docs/research/tanstack-start-migration.md` (Phase 1).

No user-visible behaviour changes.

## Functional requirements

1. No file outside the facade modules, their framework adapter, and the test infrastructure imports
   `next/router`, `next/navigation`, `next/link` or `nextjs-routes`; ESLint enforces it.
2. The app has one router hook (`useRouter` in `src/shared/router/`) exposing exactly the members the app
   uses — `query`, `pathname`, `asPath`, `push`, `replace` — and one `usePathname` hook with the semantics
   of today's `next/navigation` pathname (changes on every real path change, including same-route
   navigations). All existing router helpers (`useQueryParams`, `updateQueryParam`, `removeQueryParam`,
   `useEtherscanRedirects`, …) consume them.
3. `push` / `replace` take `(url, options?)` where options cover `shallow` and `scroll`; Next's `as`
   argument is gone from the app.
4. `route()` and the `Route`, `Query`, `DynamicRoute` types have one import surface, the existing wrapper
   module in `src/shared/router/`. The generated route map stays the source of truth for typed paths.
5. `@blockscout/ui-toolkit` builds and type-checks with no `next` import and no `next` peer dependency.
   `Link`, `LinkOverlay`, `RoutedTabs` and `useActiveTabFromQuery` obtain navigation from a toolkit-owned
   router context; without a provider, `Link` renders a plain anchor and the router is a no-op.
6. The toolkit `Link` keeps its `scroll`, `shallow`, `prefetch` props; they are forwarded to the injected
   link component through a documented adapter interface.
7. The app supplies the Next.js adapter (link component + router) to the toolkit context at the shell
   level; the facade hooks read the same context, so `next/router` / `next/link` / `next/navigation` are
   imported in exactly one adapter module.
8. Tests inject the router through the toolkit provider, not module mocks: the Vitest and Playwright test
   apps wrap in the provider; Playwright's `hooksConfig.router` API is unchanged for the 63 tests that use it
   (retyped to the facade's router type); the global Vitest `next/router` mock, the Vitest router utils and
   the 13 specs that mock `next/router` directly move to the provider.
9. Facade specs cover query parsing, `push` / `replace` delegation (including the options mapping) and the
   link adapter.
10. The marketplace auto-connect flag no longer listens to router events: the page that sets it resets it
    on unmount.
11. The unused `eslint-config-next` dev dependency is removed; `@next/eslint-plugin-next` stays.
12. Agent instruction set and rule docs reference the facade instead of `next/router` / `nextjs-routes`:
    `architecture.md`, `code-quality.md` (Links), `tests-visual.md` (router mocking), the `add-new-page`
    skill and its templates.
13. Navigation, query-param filters, shallow routing, pagination and tab switching behave exactly as
    before; Playwright visual baselines are unchanged.
14. Type-check, lint, unit tests, component tests, toolkit typecheck + build and the code-complexity gate
    pass.

## Data & API

None. No endpoints, env vars or feature flags are touched.

## UI inventory

No new or changed UI. Every page that navigates or reads the URL is affected mechanically; the demo deploy on
`staging` exists for a manual regression click-through by the developer.

## Implementation decisions

- **Toolkit owns the router contract.** A new toolkit module (`src/toolkit/router/`) holds the context, the
  provider, the router / link adapter types, and the defaults (plain `<a>`, no-op router). Exported from the
  package index. Toolkit components (`Link`, `LinkOverlay`, `RoutedTabs`, `useActiveTabFromQuery`) read it.
- **Single injection point.** The app facade `useRouter` in `src/shared/router/` reads the toolkit context
  rather than `next/router`. One adapter module in `src/shared/router/` builds the Next.js implementation
  (link component over `next/link`; router over `next/router` + `next/navigation` for the pathname) and is
  mounted in the app shell. This is the one place to swap when the framework changes.
- **Hook naming.** `useRouter`, not `useAppRouter`: in the Pages Router world "app router" reads as the
  other Next.js routing model. The lint ban on `next/router` removes the ambiguity.
- **Router interface.** `{ query, pathname, asPath, push, replace }`; `query` typed as today's string /
  string-array / undefined record; the unused `useRouter<P>()` route generic is dropped. `events` is not on
  the interface (see marketplace below). `push(url, options?)` / `replace(url, options?)` with
  `{ shallow?, scroll? }`; the codemod removes the `undefined` `as` argument at the 13 call sites that pass
  it.
- **`usePathname`** is a facade hook implemented over `next/navigation` today; `useLogPageView` and
  `useNotifyOnNavigation` consume it.
- **AdbutlerBanner** drops its `next/navigation` router effect dependency: the object is stable, so the
  dependency is a no-op today, and wiring pathname in would re-place the ad on every navigation.
- **Marketplace auto-connect flag.** `MarketplaceContextProvider` stops subscribing to `routeChangeStart`;
  `MarketplaceApp`, which already sets the flag from data, resets it in its unmount cleanup. Chosen over a
  pathname effect in the provider because child effects run before parent effects and a cached dapp → dapp
  navigation would otherwise set-then-reset in one commit.
- **`route()` entry.** The existing wrapper in `src/shared/router/routes.ts` (chain / external / absolute
  params) becomes the only `route()`; the 100 raw `nextjs-routes` importers are codemodded to it. The
  `Route`, `Query`, `DynamicRoute` types are re-exported from the same module.
- **Link adapter props.** `scroll`, `shallow`, `prefetch` are kept on the adapter interface (only `scroll`
  is used in-app, 3 places). Zero behaviour change and no break for downstream projects.
- **Lint.** `no-restricted-imports` bans `next/router`, `next/navigation`, `next/link` and `nextjs-routes`
  repo-wide, replacing the existing `next/link`-only ban. Exempt: the Next adapter module in
  `src/shared/router/`, `src/toolkit/router/**`, `vitest/**`, `playwright/**`. `src/pages/_app.tsx`
  imports the `Route` type today and moves to the facade like everyone else.
- **Tests.** Provider-based injection everywhere. Playwright: the `next/router` Vite alias and the module
  mock go away; `hooksConfig.router` feeds the provider value in `TestApp`. Vitest: `vitest/setup.ts` stops
  mocking `next/router`; `mockRouter` / `routerStandIn` become provider values; a small `wrapper` helper for
  `renderHook` specs. The 13 specs mocking `next/router` migrate so they survive a framework change.
- **Codemod.** The bulk rewrite (~150 `useRouter` importers, ~130 `nextjs-routes` importers, 13
  `push`/`replace` signatures) is done with `ast-grep --rewrite`; `tsc` is the regression net.
- **Toolkit versioning.** The toolkit version follows the app version and is published at app release, so
  no version bump and no CHANGELOG in this task. The breaking change (provider required for client-side
  navigation, `next` peer dependency dropped) is recorded in the PR description; the only consumers are
  the team's own projects.
- **Import style.** Direct module paths (`src/shared/router/useRouter`, `src/shared/router/routes`), no
  barrel.
- **Docs.** `architecture.md` gains the facade as the routing entry point; the `nextjs-routes` mention in
  `code-quality.md` and the router-mocking lines in `tests-visual.md` are rewritten; the `add-new-page`
  templates import the facade.

## Out of scope

- Any framework or router migration (TanStack Start or otherwise); the facade is implemented over Next.js.
- Changing `src/pages/**`, `getServerSideProps`, redirects, or anything server-side.
- Removing `@next/eslint-plugin-next` or its rules.
- Toolkit version bump, CHANGELOG, or npm publish; notifying external consumers.
- Adding `isReady`, `prefetch`, `back` or other router members the app does not use.
- Re-placing the Adbutler banner on navigation, or any other behaviour change.
- The issue-text correction for the ESLint claim is an edit on the GitHub issue, not repo work.
