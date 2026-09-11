# Pagination — context

Everything a paginated list needs that is not the list itself. Two paging models live here and do not share code: cursor pages
driven by the URL (most lists) and infinite scroll (`useLazyLoadedList.ts`). 

## Cursor model

### Files

| File | Role |
|---|---|
| `types.ts` | `PaginationParams`, the object a hook returns and a control consumes. |
| `Pagination.tsx`, `StickyPaginationWithText.tsx` | The controls. |
| `utils.ts` | `generateListStub` (a placeholder page from one stub row, for `placeholderData`) and `emptyPagination` (a `PaginationParams` for lists that page locally or not at all). |
| `usePaginationParams.ts` | URL → page, cursor, filters, sorting. Pure derivation; filters come from the resource's `filterFields`. |
| `usePaginationActions.ts` | The next / prev / first / filter / sorting handlers. Each is one shallow `router.push`. |
| `useQueryWithPages.ts` | Composes the two above with `useApiQuery` into the object list components consume. |
| `useDebouncedFilterChange.ts` | Search-box-to-URL debounce, shared by the lists with a free-text filter. |

### What an editor of the cursor hooks must keep true

- **The URL is the only list state.** Page, cursor, filters, sorting and (multichain) selected chain are
  read from `router.query` on every render. No hook here holds React state that mirrors a URL value and no
  effect re-syncs from the URL. A handler pushes once and returns; anything it needs afterwards is read on
  the next render.
- **The previous-page cursors are the one in-memory exception.** The API only hands out the *next* cursor,
  so "Prev" needs the cursors of the pages already visited. They live in a ref keyed by page number inside
  `usePaginationActions.ts`, filled on "Next" and seeded from the URL on mount. After a reload on page 3
  the ref knows page 3 only, so "Prev" goes to page 1; that is expected, not a bug.
- **The returned object is referentially stable.** `pagination`, every handler and the result itself keep
  their identity while their inputs are unchanged, and the spec asserts it.
- **`isInitialLoading` and `isTransitioning` are the two placeholder cases.** The first means the caller's
  stub is on screen (first load, filter or sort change) and rows render skeletons. The second means the
  previous page's rows are on screen while the next page loads, and the `DataList` body dims them. Rows
  take `isLoading={ isInitialLoading }`; the wrapper takes `isTransitioning`; `pagination.isLoading` is
  true in both cases and only drives the buttons.
- **Fixed filters go in `queryParams`, not the URL.** A value the user cannot change is passed as `queryParams` and wins over a URL field of the same name. Only user-changeable
  values belong in the resource's `filterFields`.

## Composing the pieces yourself

Most callers use `useQueryWithPages` unchanged. When a list needs a URL value *before* it can call the
hook — the resource depends on a filter, or another query keys on a filter — call `usePaginationParams`
with the same resource name to read that value on the same render, then pass the result on. The value is
derived from the same `router.query`, so both reads agree.

The selected chain on multichain instances is the same shape as a filter but is not one: it is read and
pushed by `src/features/multichain/hooks/useChainValue.ts`, and only lists that opt in pay for it.

## Gotchas

- **A caller must not keep its own copy of a filter or sort value.** The tab switch strips list params
  from the URL to reset the list; a local copy survives the switch and the next push re-applies the stale
  value. Read `filters` / `sorting` from the hook and call its handlers.
- **Row keys use the index only while the stub renders.** A key that mixes in the loading flag for real
  data remounts every row on a page transition, which is what the dimmed state exists to avoid.
- **`queryHash` is the reset key for the lazy-render window.** It changes on page, filter, sort and chain
  changes and stays put on a socket prepend into page 1 — the two cases the window must and must not reset
  on. Do not key the window on `data`.
