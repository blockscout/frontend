---
description: Vitest unit tests — purpose and conventions; the setup and utilities are in vitest/CONTEXT.md
paths:
  - "**/*.spec.{ts,tsx}"
globs: "**/*.spec.ts,**/*.spec.tsx"
alwaysApply: false
---
# Unit Tests (Vitest)

> **Frozen copy.** The general half of this rule, everything from Purpose down, has moved to the home repo,
> `blockscout/frontend-home`, where it is `.agents/rules/tests-unit.md`. Edit it there, not here: see
> [Frozen copies](../README.md#frozen-copies).

The unit-test runner here is Vitest, and a test that renders in a browser is a Playwright one. The local
setup is in `vitest/CONTEXT.md`: which specs are isolated and why, what breaks in a shared worker,
overriding environment variables, the conventions no linter checks, and where each part of the setup is
described. Rendering (`render`), mocking fetch (`fetchMock`) and each helper under `vitest/utils/`
(`withEnvs`, `mockSocket` and the rest) are described in the header comment of their file; the doc says
which. Read it before writing or changing a spec. It is edited here.

## Purpose

Unit tests cover logic that is independent of visual presentation: utility functions, custom hooks, and component behavior (state transitions, conditional rendering, event handling). If a change has no visual output to verify, prefer a unit test over a test that renders in a browser — it is faster and cheaper.

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

At a boundary, replace as little as the test needs. A spy on one method of the real export is enough to
observe a third-party SDK; replacing the whole module is for a boundary that cannot be reached any other
way.

## Independence

A test passes alone and in any file order. It sets up what it needs in the test or its per-test setup, and
leaves nothing behind: whatever it changes outside itself (a global, the environment, a timer, module
state) is restored before the next test runs.
