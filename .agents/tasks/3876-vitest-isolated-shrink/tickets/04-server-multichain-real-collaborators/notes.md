# Notes — 04 Server and multichain specs on real collaborators

## Outcome

All six specs are now named `*.spec.ts`, contain no module mock and no direct registry reset, and run in the
`shared` project. **None stays isolated**, including the two the ticket expected to fall back.

| Spec | Was mocked | Now driven by |
| --- | --- | --- |
| `getAllowedApiOrigins` | app config, multichain chains config, essential-dapps chains config | `withEnvs` for the instance APIs and the two features; `vi.stubGlobal` for the two chains globals |
| reCAPTCHA CSP policy | multichain chains config | `withEnvs` for the site key and multichain; `vi.stubGlobal('__multichainConfig', …)` |
| `useChainValue` | multichain chains config, `react-scroll` | `withEnvs(ENVS_MAP.multichain)` plus the chains global; a spy on `animateScroll.scrollToTop` (ticket 02's route) |
| `getServerSideProps` handlers | the real-browser check | request headers: a browser user agent with browser headers, a crawler, a browser user agent alone; the pageview ping is asserted at `fetchMock` |
| API scope filters | the resource registry (fixture resources) | the two fixture cases call the module's own `resolveScopeFilters` with the filter list a resource would declare |
| Metadata generator | the template map, with registry resets | real routes' templates; `withEnvs` for `NEXT_PUBLIC_OG_DESCRIPTION` |

## How the chains configs are fed

Both chains configs read `window.__multichainConfig` / `window.__essentialDappsChains` in the browser and a Node-side
value holder otherwise. The holder has no setter: it reads `public/assets/…/*.json` from disk, and only when
`NEXT_RUNTIME` is `nodejs`, so feeding it means writing a file into `public/` or spying on `fs`. The two server specs
therefore run in jsdom (`getAllowedApiOrigins` and the reCAPTCHA policy were Node specs) and set the globals with
`vi.stubGlobal`, which `unstubGlobals` restores after every test. The chains configs return nothing unless their
feature is on, so each test that feeds one switches the feature on with `withEnvs`:

- multichain: `ENVS_MAP.multichain`;
- essential dapps: `NEXT_PUBLIC_MARKETPLACE_ENABLED=true` and an `NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG`; the
  rest the marketplace needs (config URL, submit form, a wallet connect project id) is already in `.env.vitest`.

`getAllowedApiOrigins` caches its set in the module, so every test imports a fresh copy inside `withEnvs`.

`useChainValue` imports the hook and `routerStandIn` once, in `beforeAll`, inside one `withEnvs` callback: the hook
needs the multichain flag at evaluation time and must read the router context of the same graph as the stand-in.
The 12 tests then share that graph; a per-test load would re-evaluate the `vitest/lib` provider stack 12 times.

## Cases whose counterpart changed shape

Every former case has a counterpart. Where the real collaborator could not produce the mocked input, the case is
now driven by the closest real input:

- **`getAllowedApiOrigins`, "collects origins from local, multichain and essential dapps config".** Split into three
  tests, one per source, each asserting the whole set. The mock's "undefined api" entry is the real config's unset
  APIs (`bens`, `metadata`, …); the mock's "chain without app_config" is an essential-dapps chain with none.
- **`getAllowedApiOrigins`, "ignores endpoints that are not valid URLs".** `NEXT_PUBLIC_NAME_SERVICE_API_HOST=not-a-url`
  puts the invalid endpoint into the real `config.apis`; the set comes out equal to the default one.
- **Handlers, "skips the pageview ping for a bot".** The mock passed the browser heuristics and flagged the request as a
  known bot at once. With real headers, a crawler fails both checks (Googlebot's user agent), so it is now two tests:
  a crawler, and a browser user agent sent without the other headers a browser sends. A real user agent that passes the
  heuristics and still names a known bot belongs to a person's browser that carries one of those names (the DuckDuckGo
  browser's has carried `DuckDuckGo/…`), so a test with one would pin that browser as a bot; none does. The mutation run below kills every mutant of that condition
  anyway.
- **Scope filters, the two fixture-resource cases.** No registered resource declares an unresolvable filter (the
  registry tests above them forbid it) and none outside `interchainIndexer` declares any, so no real resource reaches
  either branch. The cases call `resolveScopeFilters` with the declared list instead and assert the filters it returns;
  `buildUrl` appending that result is covered by the rest of the spec.
- **Metadata generator, the "og template layer".** The stand-in map's comment said no route declared OG templates;
  three real shapes exist now, and the cases run on them:
  - no `og` at all (`/txs/kettle/[hash]`): title, description and image fall back;
  - `og` with a description and an image, no title (`/txs`, the root-page OG): the title falls back, the description
    comes from `NEXT_PUBLIC_OG_DESCRIPTION` and differs from the page one;
  - `og` with a title and an `enhanced`-only description (`/tx/[hash]`): "compiles the og title with the title
    postfix and the og description independently" is the spec's existing "transaction route with enhanced og data"
    test, so it got no second copy. "Picks the enhanced og description only when all its params are present" uses a
    complete and a partial set of tx params; the partial one falls back to the inherited page description, a branch
    the stand-in map never reached.

No rewritten test asserts on an internal module. The remaining call assertions are on boundaries: the response's
`setHeader`, `fetchMock`, the router stand-in's `push`, the `react-scroll` spy and a scroll target's
`scrollIntoView`.

## Mutation testing

Focused runs (`pnpm test:mutation-testing <the six source files>`), which mutate every line of the six files:

| | Mutants | Killed | Survived | No coverage |
| --- | --- | --- | --- | --- |
| Before, on `4c01f548b` with the isolated specs | 103 | 89 | 14 | 0 |
| After | 103 | 89 | 14 | 0 |

The outcome of every mutant is the same before and after: the 14 survivors are the same mutants on the same lines,
none of them in a line a rewritten case covers differently (`handlers.ts` L45, 48–49, 102: the onion-location,
ad-banner provider and referrer fallbacks; `scope-filters.ts` L30, 37, 46; `getAllowedApiOrigins.ts` L19, the dead
`!endpoint` guard, and L43, the cache). Clearing them is out of this task. The gate itself is diff-scoped and this
ticket changes no source line: `pnpm test:mutation-testing --changed` selects nothing and passes.

The first "before" run failed in Stryker's initial test run on an untouched tree, in a spec this ticket does not
touch: `vitest/utils/mockViewport.spec.ts` › "is the desktop breakpoint by default", `expected true to be false`.
The retry passed. See "For ticket 05".

## For ticket 05

- Nothing from this ticket stays isolated.
- The non-wallet specs still isolated after this ticket each fit a row of the parent spec's table: `AdbutlerBanner`
  (`next/script`), `SpecifyBanner` (Specify SDK), `useRevoke` (`wagmi` / `viem`, wallet stack outside the wallet
  feature's folder), `metrics` (module singleton, `vi.resetModules`), `rollbar/queue`, `NextRouterProvider`,
  `AddressTokenTransfers` (`phoenix`).
- The `mockViewport.spec.ts` failure above happened once, under Stryker's Vitest config (the base config minus the
  primed specs), and did not recur in the retry, the "after" run or this ticket's shuffled runs. Ticket 05's mutation check
  runs the same dry run; if it recurs there, it is an order dependence on the default viewport.

## After this ticket

Spec files: 298 `shared`, 24 `isolated` (15 `*.isolated.spec.ts(x)`, 9 `*.primed.spec.tsx`), 7.5% isolated.
Not a timing comparison; that is ticket 05's.

The six specs hold 103 tests, up from 100: `getAllowedApiOrigins` 3 → 5, the handlers 7 → 8. The suite has 3523
tests.

`pnpm lint:eslint` (no errors), `pnpm lint:tsc`, `pnpm lint:cspell` on the six specs, `pnpm lint:doc-links`, React
Doctor on the changed code and `pnpm test:code-complexity` on the six source files pass. Five consecutive
`pnpm test:vitest --sequence.shuffle.files` runs passed, all 322 files and 3523 tests: seeds 1794475455492,
1794475510456, 1794475566699, 1794475638385, 1794475725872 (1-minute load average 10–15).
