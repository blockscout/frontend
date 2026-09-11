# 12 — Rename `useQueryWithPages` to `useApiPaginatedQuery`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 12 of #3697 |
| Blocked by | T11 |

## What to build

A purely mechanical commit: the hook file, its spec, the `QueryWithPagesResult` type and every import
and call site are renamed so the hook sits next to `useApiQuery` and `useApiInfiniteQuery` (FR10). No
behaviour change; the diff should be reviewable as a rename only.

## Acceptance criteria

- [ ] `src/shared/pagination/useApiPaginatedQuery.ts` and `.spec.ts` exist; no file named
      `useQueryWithPages*` remains.
- [ ] `QueryWithPagesResult` → `ApiPaginatedQueryResult`; `grep -r "QueryWithPages\|useQueryWithPages" src .agents`
      finds only the parent spec's historical mentions.
- [ ] Rename done with `ast-grep --rewrite` for imports and identifiers, `git mv` for files; the commit
      touches nothing else.
- [ ] Lint, tsc, unit tests green.

## Leaf worklist

- [x] 1 `[agent]` `git mv` the files; `ast-grep` rewrite of identifiers and import paths; verify green
