---
description: Code quality rules for the Blockscout frontend
paths:
  - "**/*.{ts,tsx}"
globs: "**/*.ts,**/*.tsx"
alwaysApply: false
---
# Code Quality

We use ESLint, cSpell, TypeScript to maintain code quality.

```bash
pnpm lint:eslint:fix
pnpm lint:tsc
pnpm lint:cspell
```

The rest of this file covers code complexity scores and conventions that the linters do not.

## Complexity and CRAP

Two independent per-function gates:

- **COG** (cognitive complexity) — readability. A `BROKE` here means decompose the function (flatten nesting, extract, early-return).
- **CRAP** — under-tested *behavior* (handlers, hooks, utils — not JSX render bodies). A `BROKE` here means add a Vitest spec; simplifying the function does not lower CRAP.

How a score is counted, which functions are gated, and how to read a failure: `tools/code-complexity/CONTEXT.md`.

How to run:

```bash
# The file you are on — every function in it
pnpm test:code-complexity path/to/file.ts

# This branch vs origin/main, including uncommitted edits
pnpm test:code-complexity --changed

# For the full command usage
pnpm test:code-complexity --help
```

## Code Style and Structure

- Structure components logically: exports, subcomponents, helpers, types

### Naming Conventions

- Prefer descriptive names with auxiliary verbs (isLoading, hasError)
- Prefix event handlers with "handle" (handleClick, handleSubmit)

Names should be specific and self-documenting. Vague names hide intent and make the codebase harder to navigate.


```ts
// BAD
const useWidgets = () => { ... };

// GOOD
const useAddress3rdPartyWidgets = () => { ... };
```

This applies to hooks, components, functions, and variables alike..

## Specific rules

### Magic numbers

Extract magic numbers into named `UPPER_SNAKE_CASE` constants, placed above the component or function that uses them. This makes intent clear and avoids silent duplication.

```ts
// BAD
const visibleItems = items.slice(0, 4);

// GOOD
const MAX_VISIBLE_ITEMS = 4;
const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);
```

The same applies to magic strings used as discriminators, keys, or thresholds. In tests, unexplained magic values should also be extracted into named constants so their meaning is clear.

#### Shared unit constants

`src/toolkit/utils/consts.ts` already defines unit constants: `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `YEAR` (milliseconds), `Kb`, `Mb` (bytes), and the BigNumber `ZERO`. Never define local equivalents (e.g. `MS_IN_SECOND = 1_000`) or use raw duration literals — import from there and compose.

```ts
// BAD
const REFETCH_INTERVAL = 2_000;
setTimeout(handleTimeout, 5 * 60 * 1_000);

// GOOD
import { SECOND, MINUTE } from 'src/toolkit/utils/consts';

const REFETCH_INTERVAL = 2 * SECOND;
setTimeout(handleTimeout, 5 * MINUTE);
```

### Static empty defaults

Never define empty arrays or objects inline as default values — a new reference is created on every render, causing unnecessary re-renders or stale hook dependencies.

```ts
// BAD
const items = data ?? [];

// GOOD
const EMPTY_ITEMS: Array<Item> = [];
const items = data ?? EMPTY_ITEMS;
```

Define the constant outside the component or hook.

### useMemo for derived arrays

Wrap `.filter()`, `.map()`, or `.reduce()` results in `useMemo` when the result is passed as a prop or used as a hook dependency. Without memoisation, a new array reference is produced on every render.

```ts
// BAD
const filtered = items.filter(isActive);
return <List items={filtered} />;

// GOOD
const filtered = useMemo(() => items.filter(isActive), [items]);
return <List items={filtered} />;
```

### eslint-disable comments

Every `eslint-disable` comment must include an explanation. Without one, the reason for the suppression is lost and the comment becomes a maintenance hazard.

```ts
// BAD
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// GOOD
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response shape is dynamic and validated at runtime
```

### File path string interpolation

Prefer explicit file names over template literals in asset paths. Explicit names are easier to locate with search tools and eliminate accidental runtime errors.

```ts
// BAD
const src = `streak_${days}.png`;

// GOOD — map variants explicitly
const STREAK_IMAGES: Record<number, string> = {
  30: 'streak_30.png',
  60: 'streak_60.png',
};
```

### Prefer es-toolkit utilities

Before writing custom utility logic (clamping, deep cloning, grouping, etc.), check whether `es-toolkit` already provides it. Prefer the library function over a manual implementation. Documentation: https://es-toolkit.dev/llms-full.txt

### Comments

**Do not write comments. Never. Period.**
Prefer a name or a structure change that makes the comment unnecessary.

A comment in the diff is allowed only when it explains *why* the obvious code is wrong — a quirk, workaround, or invariant git cannot show — optionally with a link to the issue. Required mechanical comments (`eslint-disable`, unavoidable double-cast, raw color) still explain *why*, in their own sections.

Never write *diff-narration* (what this change replaces). That belongs in the commit and the PR. Test: if the comment would confuse someone who never saw the previous file, delete it.

Do not add JSDoc that restates the name or types. Do not rewrite comments you did not have to touch. Delete commented-out code; git keeps it. TODOs only with an issue or a concrete follow-up.

```ts
// BAD — narrates the change and restates the next line
// Replaces the old useEffect; memoize the filtered list
const active = useMemo(() => items.filter(isActive), [ items ]);

// GOOD — why the obvious approach fails
// Firefox: drag outside the window swallows mouse events until re-entry; see onMouseLeave().
const onMouseMove = useCallback(() => {}, [ ]);
```

### Links

When links to **application pages** are constructed, verify that `nextjs-routes` or `src/shared/router/routes` utilities are used instead of string concatenation or template literals. The full list of application routes is available in `src/shared/router/nextjs-routes.d.ts`.

### Date and time

Render all dates and times through the shared `Time` or `TimeWithTooltip` components. Do not format timestamps inline.