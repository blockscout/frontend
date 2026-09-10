# 11 — Drop the transitional params, finalize types, document the module

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 11 of #3697 |
| Blocked by | T05, T06, T07, T08, T09, T10 |

## What to build

The `filters` / `sorting` override params leave `useQueryWithPages`; tsc becoming green with them gone
is the proof that every caller was migrated. `PaginationParams` and the result type are tidied to
their final shape, and `src/shared/pagination/CONTEXT.md` records the non-obvious contract: URL as the
only list state, the cursor ref, why cache is never removed by prefix, what `isInitialLoading` vs
`isTransitioning` mean, and how a caller composes the pieces itself.

## Acceptance criteria

- [ ] `Params` of the composed hook has no `filters` / `sorting`; tsc green with no caller edits
      needed (any that are needed are a missed migration and get fixed here).
- [ ] `PaginationParams` in `src/shared/pagination/types.ts` reflects the final fields; the hand-built
      `emptyPagination` and the design-system tab's stub match.
- [ ] `src/shared/pagination/CONTEXT.md` exists, follows `.agents/rules/docs.md`, and is listed in
      `.agents/CLAUDE.md`'s per-directory context list.
- [ ] Lint, tsc, unit tests green.

## Leaf worklist

- [ ] 1 `[agent]` Remove the params; fix anything tsc surfaces
- [ ] 2 `[agent]` Finalize `PaginationParams` and the result type
- [ ] 3 `[agent]` Write `CONTEXT.md` and link it from `.agents/CLAUDE.md`
