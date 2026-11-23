---
description: TypeScript in the Blockscout frontend — what this repo adds to the general conventions
paths:
  - "**/*.{ts,tsx}"
globs: "**/*.ts,**/*.tsx"
alwaysApply: false
---
# TypeScript in this repo

The general conventions are in `./typescript.md`. This rule holds what this repo adds to them or does
differently, and wins where the two disagree.

## Default exports

The default export of React components is the established convention here (the overwhelming majority of
`.tsx` files in `src/` do this), and Next.js requires it for `src/pages/` files. The only exception is the
`src/toolkit/` where we follow Chakra UI convention of named exports for components.

## Naming conventions

Casing is enforced by `@typescript-eslint/naming-convention`. The one convention it does *not* check is the
`T` prefix of type parameters. File naming lives in `./architecture.md`.

## Window globals

The `declare global { interface Window { ... } }` block is in `global.d.ts`. Declare a third-party global
there.

## Module type declarations

Use `decs.d.ts` exclusively for untyped third-party module declarations.

```ts
// decs.d.ts
declare module 'some-untyped-package';
```

## Type utilities

`NonEmptyArray`, `Pairs` and the other generic type utilities are in `src/shared/types/utils.ts`. Import
them from there, and add a new one there.

```ts
import type { NonEmptyArray } from 'src/shared/types/utils';
```

## API response types

Response types come from the generated `@blockscout/*-types` packages, or from a local `types/api.ts` for the
exceptions; how to find which is `src/api/CONTEXT.md` ("Where a resource's response types come from").
Derive from them, as `./typescript.md` ("Schema-derived types") shows.
