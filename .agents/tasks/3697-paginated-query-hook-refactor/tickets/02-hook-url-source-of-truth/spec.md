# 02 — Rewrite the hook with the URL as the single source of truth

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3697 |
| Blocked by | T01 |

## What to build

`useQueryWithPages` keeps its name, call shape and return shape, but is rebuilt as the composition in
the parent spec's Implementation decisions: `usePaginationParams` (pure derivation of page, cursor,
filters, sorting from `router.query`), `usePaginationActions` (stable next / prev / first / filter /
sorting callbacks reading the latest router through a ref, one shallow `router.push` each), and the
composed hook that builds the query key, calls `useApiQuery` and returns one memoized object. No React
state mirrors a URL value; no effect re-syncs from the URL; no `isMounted` timers; no `.then`
callbacks; no `removeQueries` by resource prefix.

Observable result on the address transactions tab: one action is one request for the query the user
asked for; "Prev" onto a cached page shows it with no skeleton (page 1 refreshes in the background);
an unrelated `router.query` change does not re-render a memoized consumer. All 106 callers keep
compiling and behaving as today.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open an address with many transactions, Transactions tab,
DevTools network tab filtered to `/transactions`.

- [ ] `src/shared/pagination/` contains `usePaginationParams.ts`, `usePaginationActions.ts` and the
      rebuilt `useQueryWithPages.ts`; the composed hook has no `useState`, no `useEffect`, and no
      `queryClient.removeQueries` / `cancelQueries`.
- [ ] Previous-page cursors live in one ref keyed by page number, populated on "next" and from the
      URL's `next_page_params` on mount; `canGoBackwards` reads it.
- [ ] Filters are derived from the URL by the resource's `filterFields`, sorting by `SORTING_FIELDS`;
      both are returned as `filters` / `sorting`, typed `PaginationFilters<R>` / `PaginationSorting<R>`,
      as raw URL values keyed by field name (domain validation stays with the caller as a pure
      derivation).
- [ ] The `filters` and `sorting` params are still accepted and, when passed, override the URL-derived
      values in the query key (transitional; removed in T11). A caller that passes neither behaves the
      same as one whose URL carries the same values.
- [ ] The returned object, `pagination`, and every callback are referentially stable across renders
      whose inputs did not change (asserted in the spec with `toBe` across a re-render).
- [ ] `isInitialLoading` and `isTransitioning` are returned; in this ticket `isInitialLoading ===
      isPlaceholderData` and `isTransitioning` is always `false` (placeholder stays the caller's stub;
      the previous-data placeholder is T13). `pagination.isLoading` keeps its meaning.
- [ ] `queryHash` is still returned and changes only on identity changes (resource, path params,
      page/cursor, filters, sorting, chain).
- [ ] Page 1 keeps `staleTime: 0`, deeper pages `Infinity`; no query outside this list's exact keys is
      touched.
- [ ] `chainValue` / `onChainValueChange` are still returned for callers that pass `isMultichain` or
      sit in a multichain context, derived from the URL on each render with no state;
      `onChainValueChange` always pushes `chain_id` and strips page params (the `enabled === false`
      state-only branch is gone).
- [ ] The T01 count scenarios now assert the target numbers: "First" from page 3 = 1 request; filter
      change on page 3 = 1 request for filter + page 1 only; "Prev" to cached page 1 = rows shown at
      once with `isPlaceholderData` false; unrelated query change = no re-render of a memoized consumer.
- [ ] `pnpm lint`, tsc, unit tests green; the code-complexity gate passes for the new files.
- [ ] `(human)` On the address transactions tab: "First" from page 3 issues one request; a filter change
      on page 3 issues one request; "Prev" from page 2 shows page 1 without a skeleton while a background
      refresh happens; next / prev / first, filter, sort, reload-with-URL, tab switch behave as before.

## Details

**Callers that must keep working unchanged:** the two that pick the resource from a path param
(`TokenHolders`, `TokenTransfer`), `useBlockTxsQuery` which hand-builds a `QueryWithPagesResult` for
its RPC fallback (add the new fields there), and every caller that passes `filters` / `sorting` from its
own state.

**Chain value** stays inside the composed hook for now so the 14 multichain callers keep compiling; T04
extracts it into `useChainValue`. Derive it with `getChainValueFromQuery` on each render; drop the
`useState` + effect pair.

**`hasPages`** becomes `page > 1` from the URL. **`resetPage`** is "first page": one push that strips
`page` and `next_page_params`.

**Scroll-to-top** stays in the actions hook, called once per handler, honouring `scrollRef` / `noScroll`.

## Leaf worklist

- [ ] 1 `[agent]` `usePaginationParams`: URL → page, cursor, filters, sorting; unit spec
- [ ] 2 `[agent]` `usePaginationActions`: stable handlers, one push each, cursor ref; unit spec
- [ ] 3 `[agent]` Rebuild `useQueryWithPages` as the composition, keeping name, params and return shape,
      adding `filters`, `sorting`, `isInitialLoading`, `isTransitioning`; adapt `useBlockTxsQuery`'s
      hand-built result
- [ ] 4 `[agent]` Flip the T01 count scenarios to the target numbers; add stability assertions
- [ ] 5 `[human]` Verify the address transactions tab per the `(human)` criterion
