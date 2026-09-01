# 03 — Mutate only behavior code, only on changed lines

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3665 |
| Blocked by | T02 |

## What to build

Narrow what Stryker mutates from whole files down to the lines worth mutating, expressed as Stryker mutation
ranges so this restricts mutant *creation* rather than filtering findings afterwards.

Two independent restrictions compose. Everywhere, mutants inside a `jsx` function body are excluded — sampling
during grilling found those survivors to be visual or idiomatic rather than behavioural, so they are noise by
construction. Additionally, under `--changed` only the lines the diff touched are mutated, so a one-line fix
in a large file does not pay for the whole file. Focused and bare modes still mutate whole files, minus the
`jsx` bodies.

## Acceptance criteria

- [ ] A `.tsx` file whose only logic lives in a render body yields zero mutants; a `behavior` function in the
      same file is still mutated.
- [ ] A `behavior` function declared inside a component (an `onClick` handler, a `useCallback` body) is
      mutated — the exclusion keys off the function's own classification, not its enclosing file.
- [ ] Under `--changed`, mutants appear only on lines the diff added or modified. An untouched conditional
      elsewhere in a changed file produces no mutant.
- [ ] Focused mode (`pnpm test:mutation-testing <path>`) mutates the whole file, minus `jsx` bodies.
- [ ] When the ranges for a file come out empty, that file is dropped from the selection rather than passed
      to Stryker with an empty range.
- [ ] Range computation is unit-tested, including a `jsx` body overlapping a changed hunk.

## Details

**Function classification (FR4)** reuses `computeFunctionComplexities` from
`tools/code-complexity/measure/complexity.ts`, whose `FunctionComplexity` carries `startLine`, `endLine` and
`containsJsx` — the same AST classification the complexity gate applies. `containsJsx` means JSX appears
directly in that function's own body, outside any nested function, which is exactly the `jsx` / `behavior`
split FR4 names.

**Ranges are an include-list.** Stryker's `mutate` accepts `file.ts:startLine[:col]-endLine[:col]`; there is
no exclude form. So a `jsx` body is excluded by emitting the complement — the spans of the file *not* covered
by any `jsx` function — and under `--changed` by intersecting that complement with the changed line ranges
from `getChangedLineRanges`.

**Changed lines** come from the complexity gate's `--unified=0` hunk parsing (`parseHunkNewRanges`), already
resolved against the merge-base in T02.

## Leaf worklist

- [ ] 1 `[agent]` Compute per-file `jsx`-body spans from the complexity gate's classifier and derive their
      complement; specs
- [ ] 2 `[agent]` Intersect with changed line ranges under `--changed`; specs
- [ ] 3 `[agent]` Emit the ranges as Stryker `mutate` entries and drop files whose ranges are empty
