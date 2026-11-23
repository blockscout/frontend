---
description: Code quality rules for the Blockscout frontend
paths:
  - "**/*.{ts,tsx}"
globs: "**/*.ts,**/*.tsx"
alwaysApply: false
---
# Code Quality

> **Frozen copy.** The general part of this rule has moved to the home repo, `blockscout/frontend-home`,
> where it is `.agents/rules/code-quality.md`. Edit it there, not here: see
> [Frozen copies](../README.md#frozen-copies).

The lint commands, the quality gates and what this repo adds to the rule or does differently are in
`./code-quality-local.md`, which wins where the two disagree.

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

This applies to hooks, components, functions, and variables alike.

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

### Static empty defaults

In React code, never define empty arrays or objects inline as default values — a new reference is created on every render, causing unnecessary re-renders or stale hook dependencies.

```ts
// BAD
const items = data ?? [];

// GOOD
const EMPTY_ITEMS: Array<Item> = [];
const items = data ?? EMPTY_ITEMS;
```

Define the constant outside the component or hook.

### useMemo for derived arrays

In React code, wrap `.filter()`, `.map()`, or `.reduce()` results in `useMemo` when the result is passed as a prop or used as a hook dependency. Without memoisation, a new array reference is produced on every render.

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

`es-toolkit` is the utility library of every frontend repository. Before writing custom utility logic (clamping, deep cloning, grouping, etc.), check whether `es-toolkit` already provides it. Prefer the library function over a manual implementation. Documentation: https://es-toolkit.dev/llms-full.txt

Use no other utility library, `lodash` included. If the repository does not depend on `es-toolkit` yet, raise adding it with the developer before you write the utility by hand.

### Comments

**Do not write comments. Never. Period.**
Prefer a name or a structure change that makes the comment unnecessary.

The ban has exactly three exceptions: the why-comment, the header comment and the source pointer.

Never write *diff-narration* (what this change replaces). That belongs in the commit and the PR. Test: if the comment would confuse someone who never saw the previous file, delete it.

Do not write JSDoc (`/** */`). The one exception is a single-line `/** @type … */` in a JavaScript file, which TypeScript reads as the declared type. A header comment is an ordinary comment like any other. Do not rewrite comments you did not have to touch. Delete commented-out code; git keeps it. TODOs only with an issue or a concrete follow-up.

#### Why-comments

A why-comment explains *why* the obvious code is wrong — a quirk, workaround, or invariant git cannot show — optionally with a link to the issue. Required mechanical comments (`eslint-disable`, unavoidable double-cast) still explain *why*, in their own sections.

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

#### Source pointers

A source pointer names where code, types, data or a format came from. It is one line, labeled with what the source is. It names the source; it does not retell it.

```ts
// BAD — an unlabeled link, and a retelling of the source
// https://eips.ethereum.org/EIPS/eip-6963
// A wallet announces itself with an `eip6963:announceProvider` event that carries its info and provider.

// GOOD
// The EIP-6963 spec - https://eips.ethereum.org/EIPS/eip-6963
// The types source - node_modules/@wagmi/core/src/connectors/injected.ts
```
