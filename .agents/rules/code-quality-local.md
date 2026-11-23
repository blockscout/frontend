---
description: Code quality in the Blockscout frontend — lint commands, the complexity gate and this repo's conventions
paths:
  - "**/*.{ts,tsx}"
globs: "**/*.ts,**/*.tsx"
alwaysApply: false
---
# Code Quality in this repo

The general conventions are in `./code-quality.md`. This rule holds the commands, the gates and what this
repo adds to those conventions or does differently, and wins where the two disagree.

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

The rest of this file covers code complexity scores and the conventions of this repo.

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

## Shared unit constants

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

## Links

When links to **application pages** are constructed, verify that `route()` from `src/shared/router/routes` is used instead of string concatenation or template literals. The same module is the only import surface for the `Route` / `Query` / `DynamicRoute` types. The full list of application routes is available in `src/shared/router/nextjs-routes.d.ts`.

## Date and time

Render all dates and times through the shared `Time` or `TimeWithTooltip` components. Do not format timestamps inline.
