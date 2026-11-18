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
pnpm lint:eslint --fix                       # whole repo
pnpm lint:eslint path/to/file.tsx            # one file or directory
pnpm lint:eslint --changed                   # this branch vs origin/main, including uncommitted and untracked files
pnpm lint:eslint --changed=<ref> --fix       # another base; eslint flags such as --fix pass through
pnpm lint:tsc
pnpm lint:cspell
```

Pull requests also pass a React Doctor gate for React bugs ESLint misses, on changed code only:
`pnpm lint:react-doctor --scope changed --base origin/main`. Reading a failure and suppressing a
finding: `tools/react-doctor/CONTEXT.md`.

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

Name a literal only when a reader would still ask why this value. The name is `UPPER_SNAKE_CASE`, sits above the component or function, and carries a domain rule the surrounding identifiers do not: a limit, threshold, interval, or similar choice.

```ts
// BAD: 4 is a product limit with no name
const visibleItems = items.slice(0, 4);

// GOOD
const MAX_VISIBLE_ITEMS = 4;
const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);
```

Leave the literal when it is the meaning. A constant that restates the value, a nearby identifier, or a universal convention is noise. `1` is the first page, `0` is the first index, a URL is a URL.

```ts
// BAD: the name restates href and page
const URL = 'https://example.com';
const link = <a href={ URL }/>;

const FIRST_PAGE = 1;
if (page !== FIRST_PAGE) return null;

// GOOD
const link = <a href="https://example.com"/>;

if (page !== 1) return null;
```

Apply the same test to strings used as discriminators, keys, or thresholds, and to values in tests. CSS-style props (margin, padding, font weight, color) are already named by the prop.

If the same unexplained value must stay in sync at more than one call site, one constant is the share point.

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

The ban has exactly two exceptions: the why-comment and the header comment.

Never write *diff-narration* (what this change replaces). That belongs in the commit and the PR. Test: if the comment would confuse someone who never saw the previous file, delete it.

Do not write JSDoc (`/** */`). A header comment is an ordinary comment like any other. Do not rewrite comments you did not have to touch. Delete commented-out code; git keeps it. TODOs only with an issue or a concrete follow-up.

#### Why-comments

A why-comment explains *why* the obvious code is wrong — a quirk, workaround, or invariant git cannot show — optionally with a link to the issue. Required mechanical comments (`eslint-disable`, unavoidable double-cast, raw color) still explain *why*, in their own sections.

```ts
// BAD — narrates the change and restates the next line
// Replaces the old useEffect; memoize the filtered list
const active = useMemo(() => items.filter(isActive), [ items ]);

// GOOD — why the obvious approach fails
// Firefox: drag outside the window swallows mouse events until re-entry; see onMouseLeave().
const onMouseMove = useCallback(() => {}, [ ]);
```

#### Header comments

A header comment tells a **caller** what the name and the signature cannot.

An export whose name and signature tell the caller everything gets no header comment. This is the usual case.

**The locality test.** A header comment states only what can become false through an edit to the same file. A statement about the file's own contract breaks in the diff that edits the file, so the author sees it. A statement about another file breaks through an edit elsewhere, and nobody sees it. Examples of the test:

| Allowed | Not allowed |
| --- | --- |
| When the module applies, and when it does not | What the name, the types or the parameters already say |
| What the caller must do around the call: the order of calls, what a required argument means, a requirement on the calling file such as its name or its test project | A walk through the implementation |
| What the call changes outside its return value, and what undoes it | Who calls it today, or how it used to work |
| What the module does that the obvious alternative cannot | How another module or the subsystem works |
| A bare pointer to that alternative, or to the area's `CONTEXT.md` | What the alternative does, or what the `CONTEXT.md` says |
| A call sample, under the test below | A call sample that fails the test below |

**Which modules.** A header comment is allowed only on a module that is imported from outside its own directory: a shared util, a test helper, a setup file, a script. A component or a page gets none.

**Placement.** Write at most one header comment per exported declaration, above it. Write at most one more at the top of the file, for a contract of the module as a whole.

**Pointers.** A header comment may name an alternative module or the area's `CONTEXT.md` as a bare pointer. It does not describe what that file does.

**The call-sample test.** A sample stays only when a reader holding the prose and the signature would still get the call wrong: the setup spans several statements whose order matters, or it goes through a mock factory or a dynamic import. A single call with plain arguments needs none. A sample that repeats a sentence above it is deleted, or the sentence is.

### Links

When links to **application pages** are constructed, verify that `route()` from `src/shared/router/routes` is used instead of string concatenation or template literals. The same module is the only import surface for the `Route` / `Query` / `DynamicRoute` types. The full list of application routes is available in `src/shared/router/nextjs-routes.d.ts`.

### Date and time

Render all dates and times through the shared `Time` or `TimeWithTooltip` components. Do not format timestamps inline.