---
description: TypeScript conventions for the Blockscout frontend
paths:
  - "**/*.{ts,tsx}"
globs: "**/*.ts,**/*.tsx"
alwaysApply: false
---
# TypeScript Usage

## "any" inside generic function

When building generic functions, you may need to use any inside the function body.

This is because TypeScript often cannot match your runtime logic to the logic done inside your types.

One example:

```ts
const youSayGoodbyeISayHello = <
  TInput extends "hello" | "goodbye",
>(
  input: TInput,
): TInput extends "hello" ? "goodbye" : "hello" => {
  if (input === "goodbye") {
    return "hello"; // Error!
  } else {
    return "goodbye"; // Error!
  }
};
```

On the type level (and the runtime), this function returns `goodbye` when the input is `hello`.

There is no way to make this work concisely in TypeScript.

So using `any` is the most concise solution:

```ts
const youSayGoodbyeISayHello = <
  TInput extends "hello" | "goodbye",
>(
  input: TInput,
): TInput extends "hello" ? "goodbye" : "hello" => {
  if (input === "goodbye") {
    return "hello" as any;
  } else {
    return "goodbye" as any;
  }
};
```

Outside of generic functions, use `any` extremely sparingly. Prefer `unknown` with proper narrowing instead:

```ts
// BAD
function process(value: any) {
  return value.name;
}

// GOOD
function process(value: unknown) {
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return (value as { name: string }).name;
  }
}
```


## Default exports

**React components are exported as default** — that is the established convention here (the overwhelming
majority of `.tsx` files in `src/` do this), and Next.js requires it for `src/pages/` files. The only
exception is the `src/toolkit/` where we follow Chakra UI convention of named exports for components.

```tsx
// GOOD
export default function MyPage() {
  return <div>Hello</div>;
}
```

**Everything else is a named export** — hooks, utils, types, constants. A named export keeps the imported
name honest and easy to search for:

```ts
// BAD
import myFunction from "./myFunction";

// GOOD
import { myFunction } from "./myFunction";
```


## Discriminated unions

Proactively use discriminated unions to model data that can be in one of a few different shapes.

For example, when sending events between environments:

```ts
type UserCreatedEvent = {
  type: "user.created";
  data: { id: string; email: string };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: { id: string };
};

type Event = UserCreatedEvent | UserDeletedEvent;
```

Use switch statements to handle the results of discriminated unions:

```ts
const handleEvent = (event: Event) => {
  switch (event.type) {
    case "user.created":
      console.log(event.data.email);
      break;
    case "user.deleted":
      console.log(event.data.id);
      break;
  }
};
```

Use discriminated unions to prevent the 'bag of optionals' problem.

For example, when describing a fetching state:

```ts
// BAD - allows impossible states
type FetchingState<TData> = {
  status: "idle" | "loading" | "success" | "error";
  data?: TData;
  error?: Error;
};

// GOOD - prevents impossible states
type FetchingState<TData> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: Error };
```


## ENUMs

Do not introduce new enums into the codebase. Retain existing enums.

If you require enum-like behavior, use an `as const` object:

```ts
const backendToFrontendEnum = {
  xs: "EXTRA_SMALL",
  sm: "SMALL",
  md: "MEDIUM",
} as const;

type LowerCaseEnum = keyof typeof backendToFrontendEnum; // "xs" | "sm" | "md"

type UpperCaseEnum =
  (typeof backendToFrontendEnum)[LowerCaseEnum]; // "EXTRA_SMALL" | "SMALL" | "MEDIUM"
```


## Interface extends

ALWAYS prefer interfaces when modelling inheritance.

The `&` operator has terrible performance in TypeScript. Only use it where `interface extends` is not possible.

```ts
// BAD

type A = {
  a: string;
};

type B = {
  b: string;
};

type C = A & B;
```

```ts
// GOOD

interface A {
  a: string;
}

interface B {
  b: string;
}

interface C extends A, B {
  // Additional properties can be added here
}
```


## JSDoc

JSDoc is a comment. Same rule as [Comments](./code-quality.md#comments): omit it unless it explains *why*. Never restate the name or types. If a JSDoc block already earned its place, `@link` is fine for same-file references.

## Naming conventions

Casing is enforced by `@typescript-eslint/naming-convention`. The one convention it does *not* check:
prefix type parameters with `T` (e.g. `TKey`, `TValue`). File naming lives in
`.agents/rules/architecture.md`.

```ts
type RecordOfArrays<TItem> = Record<string, TItem[]>;
```


## Optional properties

Use optional properties extremely sparingly. Only use them when the property is truly optional, and consider whether bugs may be caused by a failure to pass the property.

In the example below we always want to pass user ID to `AuthOptions`. This is because if we forget to pass it somewhere in the code base, it will cause our function to be not authenticated.

```ts
// BAD
type AuthOptions = {
  userId?: string;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```

```ts
// GOOD
type AuthOptions = {
  userId: string | undefined;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```


## Read-only properties

Use `readonly` properties for object types by default. This will prevent accidental mutation at runtime.

Omit `readonly` only when the property is genuinely mutable.

```ts
// BAD
type User = {
  id: string;
};

const user: User = {
  id: "1",
};

user.id = "2";
```

```ts
// GOOD
type User = {
  readonly id: string;
};

const user: User = {
  id: "1",
};

user.id = "2"; // Error
```


## Return types

When declaring functions on the top-level of a module,
declare their return types. This will help future AI
assistants understand the function's purpose.

```ts
const myFunc = (): string => {
  return "hello";
};
```

One exception to this is components which return JSX.
No need to declare the return type of a component,
as it is always JSX.

```tsx
const MyComponent = () => {
  return <div>Hello</div>;
};
```


## Throwing

Think carefully before implementing code that throws errors.

If a thrown error produces a desirable outcome in the system, go for it. For instance, throwing a custom error inside a backend framework's request handler.

However, for code that you would need a manual try catch for, consider using a result type instead:

```ts
type Result<T, E extends Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

For example, when parsing JSON:

```ts
const parseJson = (
  input: string,
): Result<unknown, Error> => {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};
```

This way you can handle the error in the caller:

```ts
const result = parseJson('{"name": "John"}');

if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```


## Type assertions and satisfies

Prefer `satisfies` over `as` when you are declaring a value and want it checked against a type: `as`
silently widens or narrows, `satisfies` validates without losing inference. Note that `satisfies` only
*checks* a value that already has a compatible type — it cannot narrow an `unknown` (an unvalidated API
response, say), so it is not a drop-in replacement for `as` there. Validate that data instead.

Avoid double-cast coercions (`as unknown as MyType`). If a cast is unavoidable, add a comment explaining why it is safe:

```ts
// BAD
const el = ref.current as unknown as HTMLInputElement;

// GOOD — explain why the double cast is safe
// The portal always renders an <input>, so this cast is guaranteed at runtime.
const el = ref.current as unknown as HTMLInputElement;
```


## Window globals

Never access third-party globals via `(window as any)`. Declare the property inside the existing `declare global { interface Window { ... } }` block in `global.d.ts`:

```ts
// BAD
const analytics = (window as any).analytics;

// GOOD — in global.d.ts
declare global {
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}
```


## Module type declarations

Use `decs.d.ts` exclusively for untyped third-party module declarations. Do not put other type definitions there.

```ts
// decs.d.ts
declare module 'some-untyped-package';
```

## Constructive modeling

Build the type from parts that are all legal instead of restricting a loose type with runtime checks.

Non-empty, via a variadic tuple:

```ts
import type { NonEmptyArray } from 'src/shared/types/utils';

// BAD: Array<T> plus a length check every caller must repeat
function pickWinner(entries: Array<string>): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// GOOD: an empty value of the type can't exist
function pickWinner(entries: NonEmptyArray<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

Where a plain `Array<T>` arrives, narrow once with a guard. The fact then travels in the type:

```ts
const isNonEmpty = <T>(arr: Array<T>): arr is NonEmptyArray<T> => arr.length > 0;
```

Even length, as pairs:

```ts
import type { Pairs } from 'src/shared/types/utils';
const entities: Pairs<string> = [ [ 'foo', 'bar' ] ];
```

A time range, as start plus duration:

```ts
// BAD: a comment holds the invariant
type TimeRange = { start: Date; end: Date }; // start <= end

// GOOD: one field to validate at the boundary instead of a relation between two; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

`durationMs` still admits a negative number; the gain is that the invariant is a single field checked once where the value is built, not `start <= end` re-checked wherever both are read. Pick the representation that leaves the fewest bad states, then expose the reading you need on top (`pairs.flat()`, a `rangeEnd()` helper).

## Simplest total type

Don't strengthen everything. Keep `Array<T>` when every operation on it is total:

```ts
const sum = (xs: Array<number>) => xs.reduce((a, b) => a + b, 0); // [] is 0, fine
```

Strengthen when the loose type forces a lie at a use site. The tells are `!`, `arr[0] as T`, and a "should never happen" throw:

```ts
// BAD: partiality smuggled past the compiler
function newestSession(sessions: Array<Session>): Session {
  return sessions.at(0)!;
}

// GOOD: strengthen the input; the assertion disappears
function newestSession(sessions: NonEmptyArray<Session>): Session {
  return sessions[0];
}
```

Weakening the result to `Session | undefined` is the other total signature.

## Narrowing hierarchy

From best to last-resort:

1. **Discriminated union switch / if.** Compiler narrows automatically.
2. **`in` operator.** `"key" in obj` narrows to variants containing that key.
3. **`typeof` / `instanceof`.** For primitives and class instances.
4. **User-defined type guard.** When the above aren't enough.
5. **`as` cast.**.

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // narrowed to circle
  return s.width * s.height; // narrowed to rect
}
```

## Type guards

A guard is for a claim the compiler can't check from the shape alone (see the narrowing hierarchy above; a discriminant needs no guard). It must actually verify the claim. A lying guard is worse than `as`.

```ts
// A string's shape says nothing about its content; the guard checks it.
const isHex = (s: string): s is `0x${string}` => s.startsWith("0x");

// BAD: claims the full shape, checks one key
const isUser = (v: unknown): v is User => typeof v === "object" && v !== null && "id" in v;
```

## Schema-derived types

When an API response type already defines a shape, derive from it instead of duplicating it. Response types come from the generated `@blockscout/*-types` packages, or from a local `types/api.ts` for the exceptions; how to find which is `src/api/CONTEXT.md` ("Where a resource's response types come from"). Reach for `Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof` before writing a new interface.

```ts
// BAD. Duplicate shape, drifts when the schema changes.
type BlockTimeStats = {
  average_block_time?: { value: string; units?: string };
};
function renderBlockTime(s: BlockTimeStats) {
  /* ... */
}

// GOOD. Derive from the generated type.
import type { MainPageStats } from '@blockscout/stats-types';
function renderBlockTime(s: Pick<MainPageStats, 'average_block_time'>) {
  /* ... */
}
```
