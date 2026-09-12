# Stop redundant requests and skeleton cycles in paginated list navigation

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3697 |
| Feature branch | `issue-3697` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Every paginated list in the app (address transactions, token transfers, logs, blocks, and ~100 more
call sites) is driven by one shared hook, `useQueryWithPages`. An audit of that hook on the address
transactions tab found that it is not a render-cost hotspot itself, but its design produces
user-visible waste on every navigation: extra API requests, requests for page/filter combinations
the user never asked for, and skeleton passes over data that is already cached.

The root cause is that page, cursor, filter and sort state live in three places at once — the URL,
the hook's own React state, and the calling component's state — and the hook writes the URL first
and then re-syncs its state from the URL through effects. Measured on the address transactions tab:

| Interaction | API requests today | Should be |
| --- | --- | --- |
| "First" from page 3 | 3 (page 3 refetched, page 1 twice; page-3 skeleton flashes first) | 1 |
| Filter change while on page 3 | 2 (first one = old cursor + new filter) | 1 |
| "Prev" from page 2 to page 1 | 1, with skeleton, although page 1 is cached | 0 blocking (background refresh at most) |
| Unrelated `router.query` change | 0, but a full re-render of the list subtree | no re-render |

The goal is to make the URL the single source of truth for list state, so that one user action is
exactly one URL push, one query key, one request and one render; to stop discarding cached pages;
to make the hook's return value stable so the memoization already present in list components and
tab containers actually holds; and to replace the skeleton pass on page changes with keeping the
current rows visible (dimmed) until the next page arrives.

## Functional requirements

1. Each pagination action — next page, previous page, first page, filter change, sorting change —
   issues exactly one API request, for the query the user asked for, and never a request for a
   transient combination (for example the previous page's cursor combined with a new filter).
2. Navigating back to a page whose data is cached shows that data immediately, with no skeleton.
   Page 1 may refresh in the background while its cached rows are displayed; it is never dropped
   from the cache before being displayed.
3. Cache operations performed by the hook affect only the queries of the list it drives (that
   resource with those path params), never other addresses, chains, or lists sharing the resource
   name.
4. Page, cursor, filters, sorting and (on multichain instances) selected chain are read from the
   URL on every render. The hook keeps no React state that mirrors a URL value, and no effect
   re-syncs state from the URL. Reloading, sharing or navigating back to a URL restores the same
   list state as today (page number, `next_page_params`, filter and sort params keep their current
   names and encoding).
5. Callers no longer keep their own copy of filter or sort state; they read typed values from the
   hook and call its change handlers. Tab switches, which strip list params from the URL, therefore
   reset filters and sorting without caller-side bookkeeping.
6. The hook's return value, its `pagination` object and every callback it exposes are referentially
   stable between renders when their inputs have not changed, so a memoized consumer does not
   re-render on an unrelated route change or on a socket-driven cache update.
7. When the user moves to another page of the same list (same filters and sorting, different
   cursor), the current rows stay rendered in a dimmed, non-interactive state until the new page's
   data arrives, then are replaced in one commit. Pagination controls are disabled during the
   transition; the sticky table header and sorting controls remain usable.
8. Skeleton rows are still shown on first load of a list and after a filter or sorting change. The
   lazy-render window of long lists resets on every dataset change as it does today.
9. All existing pagination behaviour that is not named above is preserved: the "next page" button
   hides when the API returns no cursor, the "first" and "previous" buttons stay disabled on page 1,
   scroll-to-top (or to the configured element) happens on every navigation, the socket-driven
   "new items" notices keep prepending into page 1, and CSV export and count/label props keep
   reading the same values.
10. The composed hook is renamed to `useApiPaginatedQuery` to sit next to `useApiQuery` and
    `useApiInfiniteQuery`; the rename is applied to every call site.
11. The multichain-only capabilities (selected chain value and its change handler) are provided by
    a separate opt-in hook; single-chain callers neither receive nor pay for them.
12. The existing unit test coverage for the hook is kept or extended, with a realistic router
    stand-in that re-renders on push so that the number of requests and renders per action is
    asserted, not only the final state.

## Data & API

None. No endpoints, resources, env vars or feature flags change. Pagination params (`page`,
`next_page_params`), filter and sorting query parameter names and encodings stay exactly as they are
so that existing links keep working.

## UI inventory

- Every paginated list page and tab in the app (the ~106 call sites of the current hook), with the
  address details page transactions tab (single chain) as the reference integration: `RoutedTabs`
  → tab content → sorting wrapper → list content → table/list rows → `Pagination`.
- No new screens. One new visual state: a **page-transition** state for the list body — current
  rows dimmed and non-interactive, pagination buttons disabled, action bar and table header
  unchanged. Exact opacity and transition to be agreed with the designer (see `questions.md`,
  Q01); until then use the app's existing disabled-content look.
- Skeleton state stays as is for first load and filter/sort changes.

## Implementation decisions

- **URL is the single source of truth.** All list state is derived from `router.query` on each
  render; the previous-page cursors needed for "previous" are kept in a ref keyed by page number,
  populated on "next", and are the only in-memory list state. Handlers perform one shallow
  `router.push` each and nothing else; there are no `.then` callbacks, no `isMounted` timers, no
  router-sync effects.
- **Split into single-responsibility hooks, composed by a thin public hook.** `usePaginationParams`
  reads page, cursor, filters and sorting from the URL (pure derivation, no state, no effects).
  `usePaginationActions` returns stable next/prev/first/filter/sorting callbacks that read the
  latest router through a ref. The composed `useApiPaginatedQuery` builds the query key, calls
  `useApiQuery`, and returns a memoized object; it is what the vast majority of callers use with
  the same call shape as today. `useChainValue` is the opt-in multichain piece. A caller that
  needs only part (resource chosen from the filter, chain selection) composes the pieces itself.
- **No prefix-scoped cache removal.** The `removeQueries([resourceName])` calls go away. Page 1 keeps
  `staleTime: 0` so it refreshes in the background on return; deeper pages keep `staleTime:
  Infinity`. If a forced refresh is ever needed it targets the exact query key.
- **Placeholder strategy decided inside the hook.** `placeholderData` is a function that keeps the
  previous data when the previous query key differs from the new one only by cursor (page change),
  and falls back to the caller's stub otherwise (first load, filter/sort change). The hook exposes
  two flags derived from that decision: `isInitialLoading` (placeholder is the stub → rows render
  skeletons) and `isTransitioning` (placeholder is previous data → body is dimmed).
  `pagination.isLoading` stays true in both cases for button disabling.
- **Dimming is one global wrapper, not per-row.** The shared list wrapper (`DataList`) gains an
  `isTransitioning` prop and applies opacity, `pointer-events: none` and `aria-busy` to the body
  it already wraps, leaving the action bar outside. Row and cell components keep their `isLoading`
  prop with its current meaning (skeleton). List content components wire two props:
  `isLoading={ isInitialLoading }` to rows and `isTransitioning` to the wrapper.
- **Row keys no longer depend on loading state** for real data: the index suffix on keys applies
  only while rendering the stub, so during a page transition the previous rows keep their keys and
  the new rows replace them in a single commit.
- **Rename last, mechanically.** `useQueryWithPages` → `useApiPaginatedQuery` is a separate
  codemod commit after the behavioural change, so the behavioural diff stays reviewable.
- **Migration is per call-site family.** The reference integration (address transactions tab) is
  migrated first and reviewed; the remaining call sites follow in groups by shared list component
  (transactions lists, token transfers, logs, blocks, and the long tail), each group removing its
  duplicated filter/sort state.

## Out of scope

- Row-level render cost (cell components, `TxsTableItem` and siblings) and the lazy-render window
  mechanics; those were addressed in the previous list-view optimization and are unchanged here.
- Changing pagination URL parameter names or encoding.
- The infinite-scroll hook (`useLazyLoadedList`) and its callers.
- Backend or API changes.
- Any redesign of the pagination controls themselves.
