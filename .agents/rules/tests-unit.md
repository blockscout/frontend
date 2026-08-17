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

Test files must be named `*.spec.ts` or `*.spec.tsx` and placed alongside the code they test. Run all tests:

```bash
pnpm test:vitest
```

Run a single file:

```bash
pnpm test:vitest path/to/file.spec.ts
```

## Setup

`vitest/setup.ts` runs before each test file and provides:
- **Environment variables** — loaded from `.env.vitest` via dotenv; accessible as `window.__envs` in test code.
- **Fetch mocking** — `vitest-fetch-mock` is initialized globally; all `fetch` calls are interceptable.

`vitest/global-setup.ts` runs once before the entire test suite and loads `.env.vitest`.

## Rendering components

**Never import from `@testing-library/react` directly.** Use the project's custom wrapper instead:

```tsx
import { render, screen } from 'vitest/lib';
```

`vitest/lib.tsx` re-exports everything from `@testing-library/react` and replaces `render` with a custom version that wraps the component in the full app provider stack (mirroring `playwright/TestApp.tsx`): Chakra, `QueryClientProvider` (no retry, no window-focus refetch), Socket (inert by default — see below), `AppContextProvider`, Marketplace, Settings, GrowthBook, Wagmi (mock connector), Rewards, and CsvExport — heavy enough to mount whole page slices in jsdom.

The `wrapper` export is also available if you need to pass it separately to RTL hooks:

```tsx
import { wrapper } from 'vitest/lib';
const { result } = renderHook(() => useMyHook(), { wrapper });
```

## Utilities

**`vitest/utils/flushPromises.ts`** — call after an action that triggers async effects (e.g. a state update followed by a data fetch) to flush all pending microtasks before asserting:

```tsx
import flushPromises from 'vitest/utils/flushPromises';

await userEvent.click(button);
await flushPromises();
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

**`vitest/utils/mockSocket.ts`** — a fake Phoenix transport whose channels join immediately, for components that keep a query disabled until `useSocketChannel` reports a join. Only the `phoenix` `Socket` is replaced; `SocketProvider`, `useSocketChannel` and `useSocketMessage` run for real:

```tsx
import { mockSocket, MOCK_SOCKET_URL } from 'vitest/utils/mockSocket';

mockSocket();
const { default: Token } = await import('./Token');
render(<TestApp socketUrl={ MOCK_SOCKET_URL }><Token/></TestApp>);
await flushPromises();
```

It uses `vi.doMock`, so it only affects modules imported **after** the call — pair it with `vi.resetModules()` and dynamic imports. Pass `socketUrl` explicitly too: without a url the provider creates no socket at all. Server-sent events are not simulated yet.

## Mocking fetch responses

`vitest-fetch-mock` is active globally. Mock responses before the code under test runs:

```tsx
fetchMock.mockResponseOnce(JSON.stringify({ data: 'value' }));
```

Reset mocks between tests using `beforeEach` / `afterEach` if needed.

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

## Primed-requests drift tests (`*.primed.spec.tsx`)

Each page registered in the early-fetch primer has a `<Component>.primed.spec.tsx` next to its root component that guards the primer registry against drift from what the page actually requests on first render. What these tests guarantee and why lives in `src/server/primedRequests/CONTEXT.md`.

Write them with the `checkPrimedRequests` harness (`vitest/utils/checkPrimedRequests.tsx`) — see the existing specs for the pattern.
