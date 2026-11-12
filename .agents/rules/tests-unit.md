---
description: Vitest unit tests — purpose, setup, utilities, and conventions
paths:
  - "**/*.spec.{ts,tsx}"
globs: "**/*.spec.ts,**/*.spec.tsx"
alwaysApply: false
---
# Unit Tests (Vitest)

## Purpose

Unit tests cover logic that is independent of visual presentation: utility functions, custom hooks, and component behavior (state transitions, conditional rendering, event handling). If a change has no visual output to verify, prefer a Vitest test over a Playwright one — it is faster and cheaper.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. 
A good test reads like a specification — "user can checkout with valid cart" tells you exactly what capability exists — 
and survives refactors because it doesn't care about internal structure.

### Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

**Characteristics:**

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW

### Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

**Red flags:**

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Tautological tests**: Expected value restates the implementation, so the test passes by construction.

```typescript
// BAD: Expected value is recomputed the way the code computes it
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: Expected value is an independent, known literal
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

## Mocking guidelines

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

## File naming and location

Test files must be named `*.spec.ts` or `*.spec.tsx` and placed alongside the code they test. A spec that needs its own module registry is named `*.isolated.spec.ts(x)` — see "Isolation" below.

```bash
pnpm test:vitest                         # entire suite
pnpm test:vitest path/to/file.spec.ts    # one file
pnpm test:vitest --changed               # tests related to uncommitted work (staged and unstaged)
pnpm test:vitest --changed origin/main   # tests related to this branch vs origin/main
```

`--changed` uses git, then the Vitest module graph, so editing a source file still runs the spec that imports it. Untracked files are invisible until `git add`. If nothing matches, the command fails unless you add `--passWithNoTests` (CI does this on PRs). Fetch `origin/main` first if that ref is missing locally.

## Isolation

The suite runs as two Vitest projects, and the **file name** decides which one a spec belongs to:

| Project | Files | Module registry |
| --- | --- | --- |
| `shared` | `*.spec.ts(x)` — the default | one per worker, shared by every spec file that worker runs |
| `isolated` | `*.isolated.spec.ts(x)`, `*.primed.spec.tsx` | a fresh one per spec file |

Evaluating the app's module graph once per spec file is the largest single cost of a run, so a spec is `shared` unless it needs a registry of its own. It does when it:

- mocks a module — `vi.mock`, `vi.doMock`, `vi.unmock`, or the `mockSocket` helper;
- resets the module registry itself — `vi.resetModules`, `checkPrimedRequests`;
- asserts on module-level state that must start fresh (a singleton, a registry, a lazy-load cache), unless every test imports a fresh copy inside `withEnvs`.

ESLint fails the first two in a spec that is not named `*.isolated.spec.ts(x)`; the third is on you.

What breaks in a shared worker, and what does not:

- **A module mock** is silently not applied whenever an earlier spec in the same worker already imported the module, and it can reach a later spec that imports the module for real. Either way the failure shows up in some file orders only.
- **A hand-set `process.env`** is ignored once an earlier spec in the worker has evaluated the app config, and then leaks into every spec after it. No spec sets one, and ESLint fails it in a shared spec: override envs with `withEnvs` (below).
- **`withEnvs` is safe.** It resets the registry before and after its callback and restores the envs it set, so it leaves nothing behind. A spec that uses it is a plain `*.spec.ts(x)`.

A third-party SDK needs no module mock to be observed. Spy on a method of its real export in `beforeEach`, with an implementation that does nothing (`src/services/mixpanel/provider.spec.ts`, `src/shared/pagination/usePaginationActions.spec.ts`). Node, not Vitest, loads the package, so `withEnvs` does not re-evaluate it and the spy also reaches code imported inside the callback. Observe the app's analytics event logger the same way, at the SDK it calls (`TokenActionButton.spec.tsx`).

A shared spec leaves nothing behind for the next file. Spies, `vi.stubGlobal` / `vi.stubEnv`, fake timers and `fetchMock` responses are undone after every test by `vitest/setup.ts`, and spies and stubs again before every test by the config, so set them up in `beforeEach` or in the test — one installed in `beforeAll` or at the top of the file is gone before the first test starts and reaches none of them. Anything else a test changes on `window`, `document` or `globalThis` it restores itself.

Before pushing a change to shared specs or to the test setup, run the suite in random file order: `pnpm test:vitest --sequence.shuffle.files` (CI always does). To replay a failing order, pass the printed seed: `--sequence.seed <seed>`.

```bash
pnpm test:vitest --project shared        # one project only
```

### What stays isolated, and why

Every spec in the `isolated` project fits a row here. A new isolated spec fits a row or adds one, with its reason.

| Boundary or category | Specs | Reason |
| --- | --- | --- |
| Wallet stack: `wagmi`, `viem`, Reown AppKit, and the wallet feature's own modules mocked beside them | the isolated specs under `src/features/connect-wallet/`, and `useRevoke.isolated.spec.ts` | Real collaborators mean a real wallet runtime in jsdom |
| `rollbar` | `queue.isolated.spec.ts` | The SDK is a constructor the code under test instantiates. The spec resets the registry around the module-level queue it feeds |
| `next/script` | `AdbutlerBanner.isolated.spec.tsx` | It is a component rendered as JSX, so there is no method call to spy on. Replacing it needs a source change |
| Specify publisher SDK | `SpecifyBanner.isolated.spec.tsx` | The SDK is a class instantiated inside the feature's client factory. Observing it means replacing the constructor |
| `phoenix`, through `mockSocket` | `AddressTokenTransfers.isolated.spec.tsx` | The transport is replaced as a module by design |
| `next/router`, `next/navigation` | `NextRouterProvider.isolated.spec.tsx` | The router adapter's own spec. The adapter is what wraps those modules |
| Module singleton | `metrics.isolated.spec.ts` | A second, fresh instance of the module is the behaviour under test |
| Primed-requests drift specs | every `*.primed.spec.tsx` | The harness resets the registry and mocks the socket transport |

Two of these specs also mock something a shared spec drives for real. Rewriting that mock would not move them, because their row keeps them isolated:

- `src/services/rollbar/queue.isolated.spec.ts` mocks the app config and the Rollbar client config. A shared spec would set the token with `withEnvs`.
- `src/features/connect-wallet/hooks/wallet/useWalletReown.isolated.spec.ts` mocks the analytics event logger. A shared spec would spy on the SDK the logger calls.

## Setup

`vitest/setup.ts` runs before each test file and provides:
- **Environment variables** — loaded from `.env.vitest` via dotenv; accessible as `window.__envs` in test code.
- **Fetch mocking** — `vitest-fetch-mock` is initialized globally; all `fetch` calls are interceptable.
- **Cleanup** — after every test, real timers are restored, `fetchMock` is reset, and spies, `vi.stubGlobal` and `vi.stubEnv` are undone.
- **Viewport** — jsdom has no `matchMedia`, so a stub answers `min-width` / `max-width` queries against a simulated viewport width. The default is the `lg` breakpoint: components render their **desktop** variant (`useIsMobile()` is `false`) unless a test asks otherwise — see `mockViewport` below.

`vitest/global-setup.ts` runs once before the entire test suite and loads `.env.vitest`.

## Rendering components

**Never import from `@testing-library/react` directly.** Use the project's custom wrapper instead:

```tsx
import { render, screen } from 'vitest/lib';
```

`vitest/lib.tsx` re-exports everything from `@testing-library/react` and replaces `render` with a custom version that wraps the component in the full app provider stack — heavy enough to mount whole page slices in jsdom. The stack also mounts the toolkit router provider with a frozen home-page router; `TestApp`'s `router` prop (a `Partial<Router>` of the toolkit router type) overrides it field by field, so a spec never mocks the framework router module — the adapter's own spec (`src/shared/router/NextRouterProvider.isolated.spec.tsx`) is the one exception, since the adapter is what wraps that module.

The `wrapper` export is also available if you need to pass it separately to RTL hooks:

```tsx
import { wrapper } from 'vitest/lib';
const { result } = renderHook(() => useMyHook(), { wrapper });
```

## Utilities

**`vitest/utils/mockRouter.ts`** and **`vitest/utils/routerStandIn.ts`** — router values for the toolkit router provider: `buildRouterMock` is frozen (`push` / `replace` are spies, `query` never changes), `routerStandIn` is live (consumers re-render on `push` / `replace`). Their header comments say when each applies and how to install it.

**`vitest/utils/flushPromises.ts`** — call after an action that triggers async effects (e.g. a state update followed by a data fetch) to flush all pending microtasks before asserting:

```tsx
import flushPromises from 'vitest/utils/flushPromises';

await userEvent.click(button);
await flushPromises();
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

**`vitest/utils/mockViewport.ts`** — switches a test to another breakpoint. Call it **before** rendering. The default `lg` is restored after every test. Use `base` for the mobile layout:

```tsx
import { mockViewport } from 'vitest/utils/mockViewport';

it('renders no tabs bar on mobile', () => {
  mockViewport('base');
  render(<Blocks/>);
  // …
});
```

Never replace `window.matchMedia` by hand to change the breakpoint. A spec that needs a non-width query (`prefers-color-scheme`, say) still installs its own stub — the shared one matches width queries only. Install it with `vi.stubGlobal('matchMedia', …)`: a stub assigned by hand outlives its spec file and answers the width queries of every later spec in the worker.

**`vitest/utils/mockSocket.ts`** — a fake Phoenix transport whose channels join immediately, for components that keep a query disabled until `useSocketChannel` reports a join, or that react to live socket messages. Only the `phoenix` `Socket` is replaced; `SocketProvider`, `useSocketChannel` and `useSocketMessage` run for real:

```tsx
import { mockSocket, MOCK_SOCKET_URL } from 'vitest/utils/mockSocket';

mockSocket();
const { default: Token } = await import('./Token');
render(<TestApp socketUrl={ MOCK_SOCKET_URL }><Token/></TestApp>);
await flushPromises();
```

It uses `vi.doMock`, so it only affects modules imported **after** the call — pair it with `vi.resetModules()` and dynamic imports, in an `*.isolated.spec` file. Pass `socketUrl` explicitly too: without a url the provider creates no socket at all.

A spec that imports the component statically installs it with a top-level `vi.mock` instead, and delivers server events with `sendSocketMessage`, which throws if nothing subscribes to that topic and event (see `AddressTokenTransfers.isolated.spec.tsx`):

```tsx
vi.mock('phoenix', () => import('vitest/utils/mockSocket').then((m) => m.phoenixModule));

render(<SocketProvider url={ MOCK_SOCKET_URL }><AddressTokenTransfers/></SocketProvider>);
act(() => sendSocketMessage('addresses:0x…', 'token_transfer', { token_transfers: [ … ] }));
```

## Mocking fetch responses

`vitest-fetch-mock` is active globally. Mock responses before the code under test runs:

```tsx
fetchMock.mockResponseOnce(JSON.stringify({ data: 'value' }));
```

Responses are reset after every test, so queue them in the test or in `beforeEach`.

## Overriding environment variables

To exercise a feature-config branch, use `vitest/utils/mockEnvs.ts` (the Vitest counterpart of the Playwright `mockEnvs` fixture) instead of hand-mocking `src/config`:

```tsx
import { ENVS_MAP } from 'src/config/test-utils/env-presets';
import withEnvs from 'vitest/utils/mockEnvs';

await withEnvs(ENVS_MAP.arbitrumRollup, async () => {
  const { default: config } = await import('src/config');
  // …
});
```

`src/config` is a module-level singleton, so `withEnvs` calls `vi.resetModules()` — everything that reads config must be imported **dynamically inside the callback**, not statically at the top of the spec. Curated env bundles live in `src/config/test-utils/env-presets.ts` and are shared with the Playwright suite.

The reset also splits React contexts: a component imported inside the callback holds a fresh toolkit router context, which a statically imported `render` / `wrapper` from `vitest/lib` does not feed — the component silently gets the no-provider default (`pathname: ''`, no-op `push`), and a `routerStandIn` imported statically is never read. When the rendered tree reads the router (`useRouter`, `usePathname`, a non-external `Link`), import `vitest/lib` or `vitest/utils/routerStandIn` inside the callback as well (see `useBridgedTokensQuery.spec.ts`, `DeFiDropdown.spec.tsx`).

## Primed-requests drift tests (`*.primed.spec.tsx`)

Each page registered in the early-fetch primer has a `<Component>.primed.spec.tsx` next to its root component that guards the primer registry against drift from what the page actually requests on first render. What these tests guarantee and why lives in `src/server/primedRequests/CONTEXT.md`.

Write them with the `checkPrimedRequests` harness (`vitest/utils/checkPrimedRequests.tsx`) — see the existing specs for the pattern.
