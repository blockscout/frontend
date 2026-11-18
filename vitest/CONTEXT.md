# Unit-test setup (Vitest) — context

Which project a spec runs in, what a spec must keep true, and where each part of the setup is described.
What a good test is and what to mock is in `.agents/rules/tests-unit.md`, which loads on any spec file.
`pnpm test:vitest` is `vitest run`, so every flag is Vitest's own: `pnpm test:vitest --help`.

## Where to look

| Question | Answer |
| --- | --- |
| What does a spec have without setting it up, and what is undone after each test? | the header comment of `vitest/setup.ts` |
| How is a component or a hook rendered? | the header comment of `vitest/lib.tsx` |
| When does a helper apply, and how is it installed? | the header comment of its file under `vitest/utils/` |
| Which envs does a spec start with? | `vitest/.env.vitest`. Bundles for a feature's config branch: `src/config/test-utils/env-presets.ts`, shared with the Playwright suite |
| A hook must see the URL it pushed, and `query` never changes. | the router `vitest/lib.tsx` mounts is frozen (`vitest/utils/mockRouter.ts`); the live one is `vitest/utils/routerStandIn.ts` |
| A spec passes alone and fails in CI. | CI runs the files in random order. See the last constraint |
| What does a `*.primed.spec.tsx` guard, and why? | `src/server/primedRequests/CONTEXT.md`. The existing specs are the pattern |
| Where are the projects, the timeouts and the excluded paths set? | `vitest.config.ts` at the repo root |

## Isolation

The suite runs as two Vitest projects, and the **file name** decides which one a spec belongs to:

| Project | Files | Module registry |
| --- | --- | --- |
| `shared` | `*.spec.ts(x)` — the default | one per worker, shared by every spec file that worker runs |
| `isolated` | `*.isolated.spec.ts(x)`, `*.primed.spec.tsx` | a fresh one per spec file |

Evaluating the app's module graph once per spec file is the largest single cost of a run, so a spec is
`shared` unless it needs a registry of its own. It does when it:

- mocks a module — `vi.mock`, `vi.doMock`, `vi.unmock`, or the `mockSocket` helper;
- resets the module registry itself — `vi.resetModules`, `checkPrimedRequests`;
- asserts on module-level state that must start fresh (a singleton, a registry, a lazy-load cache), unless
  every test imports a fresh copy inside `withEnvs`.

ESLint fails the first two in a spec that is not named `*.isolated.spec.ts(x)`; the third is on you.

What breaks in a shared worker, and what does not:

- **A module mock** is silently not applied whenever an earlier spec in the same worker already imported
  the module, and it can reach a later spec that imports the module for real. Either way the failure shows
  up in some file orders only.
- **A hand-set `process.env`** is ignored once an earlier spec in the worker has evaluated the app config,
  and then leaks into every spec after it. ESLint fails it in a shared spec.
- **`withEnvs` is safe.** It resets the registry before and after its callback and restores the envs it
  set, so a spec that uses it is a plain `*.spec.ts(x)`.
- **A third-party SDK needs no module mock to be observed.** Spy on a method of its real export in
  `beforeEach`, with an implementation that does nothing (`src/services/mixpanel/provider.spec.ts`,
  `src/shared/pagination/usePaginationActions.spec.ts`). Node, not Vitest, loads the package, so `withEnvs`
  does not re-evaluate it and the spy also reaches code imported inside the callback. Observe the app's
  analytics event logger the same way, at the SDK it calls (`TokenActionButton.spec.tsx`).

### What stays isolated, and why

Every spec in the `isolated` project fits a row here. A new isolated spec fits a row or adds one, with its
reason.

| Boundary or category | Specs | Reason |
| --- | --- | --- |
| Wallet stack: `wagmi`, `viem`, Reown AppKit, and the wallet feature's own modules mocked beside them | the isolated specs under `src/features/connect-wallet/`, and `useRevoke.isolated.spec.ts` | Real collaborators mean a real wallet runtime in jsdom |
| `rollbar` | `queue.isolated.spec.ts` | The SDK is a constructor the code under test instantiates. The spec resets the registry around the module-level queue it feeds |
| `next/script` | `AdbutlerBanner.isolated.spec.tsx` | It is a component rendered as JSX, so there is no method call to spy on. Replacing it needs a source change |
| Specify publisher SDK | `SpecifyBanner.isolated.spec.tsx` | The SDK is a class instantiated inside the feature's client factory. Observing it means replacing the constructor |
| `phoenix`, through `mockSocket` | `AddressTokenTransfers.isolated.spec.tsx` | The transport is replaced as a module by design |
| `next/router`, `next/navigation` | `NextRouterProvider.isolated.spec.tsx` | The router adapter's own spec. The adapter is what wraps those modules |
| `helia` | `useLoadImageViaIpfs.isolated.spec.ts` | The failure under test is the package throwing while it evaluates, which only a module mock produces |
| Module singleton | `metrics.isolated.spec.ts` | A second, fresh instance of the module is the behaviour under test |
| Primed-requests drift specs | every `*.primed.spec.tsx` | The harness resets the registry and mocks the socket transport |

Two of these specs also mock something a shared spec drives for real. Rewriting that mock would not move
them, because their row keeps them isolated:

- `src/services/rollbar/queue.isolated.spec.ts` mocks the app config and the Rollbar client config. A
  shared spec would set the token with `withEnvs`.
- `src/features/connect-wallet/hooks/wallet/useWalletReown.isolated.spec.ts` mocks the analytics event
  logger. A shared spec would spy on the SDK the logger calls.

## Overriding environment variables

A spec reaches a feature-config branch with `withEnvs` (`vitest/utils/mockEnvs.ts`), never by mocking
`src/config` or setting `process.env`: the first makes the spec isolated for nothing, the second is the
leak described under Isolation.

**`withEnvs` splits React contexts.** Its registry reset gives a component imported inside the callback a
fresh toolkit router context, which a statically imported `render` / `wrapper` from `vitest/lib` does not
feed: the component silently gets the no-provider default (`pathname: ''`, no-op `push`), and a
`routerStandIn` imported statically is never read. When the rendered tree reads the router (`useRouter`,
`usePathname`, a non-external `Link`), import `vitest/lib` or `vitest/utils/routerStandIn` inside the
callback as well (`useBridgedTokensQuery.spec.ts`, `DeFiDropdown.spec.tsx`).

## Constraints

None of these is checked by a linter.

- **A spec sits next to the code it tests.** The file name is all that puts it in a project, so nothing
  flags a spec parked elsewhere, and the complexity gate reads a function with no co-located spec as
  untested.
- **A spec imports `render`, `screen` and the rest from `vitest/lib`, never from `@testing-library/react`.**
  The direct import renders with no provider at all, so the component fails on the first context it reads,
  or passes on a default no page has. `src/toolkit/router/context.spec.tsx` is the exception: the
  no-provider defaults are what it tests.
- **A spec never mocks `next/router` or `next/navigation`.** The route goes in through the `router` prop of
  the wrapper or through `routerStandIn`. The adapter's own spec is the exception, and has its row above.
- **A spec never replaces `window.matchMedia` by hand to change the breakpoint**: `mockViewport` does that.
  A spec that needs a query the shared stub does not answer (`prefers-color-scheme`, say) installs its own
  with `vi.stubGlobal('matchMedia', …)`. A stub assigned by hand outlives its spec file and answers the
  width queries of every later spec in the worker.
- **A shared spec restores what the setup does not.** `vitest/setup.ts` undoes spies, stubs, fake timers
  and `fetchMock` responses. Anything else a test changes on `window`, `document` or `globalThis` stays
  for the next spec file in the worker unless the test puts it back.
- **A change to shared specs or to the setup is run in random file order before it is pushed**:
  `pnpm test:vitest --sequence.shuffle.files`, as CI always does. A leak between files fails in some
  orders only; the run prints its seed, and `--sequence.seed <seed>` replays that order.
