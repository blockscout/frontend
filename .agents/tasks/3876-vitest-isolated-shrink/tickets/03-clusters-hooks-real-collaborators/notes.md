# Notes — 03 Clusters hooks specs on real collaborators

## Outcome

All four specs are now named `*.spec.ts`, contain no module mock and run in the `shared` project. **None stays
isolated.** Each hook runs through the real API query hooks, the real app config and the real router facade;
requests are answered and asserted at `fetchMock`, the router is `routerStandIn`, and the search debounce runs
on fake timers.

| Spec | Was mocked | Now driven by |
| --- | --- | --- |
| `useAddressClusters` | API query hook, app config | `fetchMock`; `withEnvs` to switch clusters off |
| `useClustersData` | API query hook, input-type detector | `fetchMock` per tRPC procedure; real addresses and names as input |
| `useClusterPagination` | `useQueryParams`, `getQueryParamString` | `routerStandIn`, asserting the URL it holds after each action |
| `useSearchWithClusters` | `useQuery`, `useApiFetch`, `useQuickSearchQuery`, `useDebounce`, app config | the test wrapper's query client, `fetchMock` for the quick search, the redirect check and the clusters lookup, fake timers for the debounce |

**The clusters feature needed no `withEnvs` to switch it on.** `vitest/.env.vitest` sets
`NEXT_PUBLIC_CLUSTERS_API_HOST`, so the default config already has it on, and the mocked config of the old specs
only restated that. `withEnvs` is used where the default is not the case under test: `useAddressClusters` now
also checks that an instance without clusters makes no request, with no name service at all and with ENS only.
Those two tests take about 50 ms each.

## Cases that only made sense against the mock

Every other former case has a counterpart asserting the hook's result or the request it makes.

- **`useClustersData`, "should memoize input type calculation" and "should memoize directory order by logic".**
  Both counted calls inside a render: the detector called once across two renders, `useApiQuery` called four
  times per render. Neither changes what the hook returns or requests, and asserting them means spying on an
  internal util, which this ticket rules out. Dropped.
- **`useClustersData`, "should default to cluster_name" / "should call detectInputType".** They asserted whether
  the detector was called. The counterparts assert which lookup runs: the directory search for no term or a
  name, the address lookup for an address.
- **`useClustersData`, "should return correct data structure".** It combined leaderboard data with loaded cluster
  details, a state the hook cannot reach: details are looked up only in an address search. The counterpart
  asserts the whole return value in an address search.
- **`useSearchWithClusters`, "should return empty results when cluster API returns error".** The mock reported
  `isError: true`. The real hook catches a failed lookup and returns no results, so the counterpart asserts an
  empty list with `isError: false`.
- **`useSearchWithClusters`, the three data-transformation cases.** The mocked `useQuery` returned the already
  transformed result, so the transform never ran. They now go through the real `select`.

## Mutation testing

Focused runs (`pnpm test:mutation-testing <the four hooks>`), which mutate every line of the four files:

| | Mutants | Killed | Survived | No coverage |
| --- | --- | --- | --- | --- |
| Before, on `b65dd58aa` with the isolated specs | 105 | 77 | 13 | 15 |
| After | 105 | 101 | 3 | 1 |

The three survivors and the uncovered mutant are equivalent: no test can tell them apart from the original.

- `useClustersData`, the early `cluster_name` return for an empty term, forced off: the detector returns
  `cluster_name` for an empty input anyway. The old spec killed it only by asserting the detector was not
  called.
- `useSearchWithClusters`, the cluster lookup's `enabled`: `isClustersEnabled && isClusterQuery` forced to `true`
  or turned into `||`. A non-empty cluster name already implies both. These two survived before as well.
- `useSearchWithClusters`, uncovered: the `false` fallback of `isClusterQuery`, reached only with clusters off,
  where the hook returns the plain quick search either way.

Clearing them takes a source change, deleting the redundant guard and operands or suppressing the mutants,
which this task rules out. The gate itself is diff-scoped and this ticket changes no source line:
`pnpm test:mutation-testing --changed` selects nothing in the four hooks and passes.

## Finding for the developer

While an address lookup is pending, `useClustersData` sends a cluster-details request for the id of the stub
row in its placeholder data (`0x1234…1234` from the clusters stubs), then the real one once the lookup
arrives. Production does the same: one wasted request to the clusters API per address search. The spec asserts
the real request with `toContainEqual`, so it neither pins nor hides the extra one. Fixing it is a source change,
outside this task.

## After this ticket

Spec files: 292 `shared`, 30 `isolated` (21 `*.isolated.spec.ts(x)`, 9 `*.primed.spec.tsx`), 9.3% isolated.
Not a timing comparison; that is ticket 05's.

The four specs hold 57 tests, down from 67. Most of the drop is `useClustersData` (25 to 14): one test now
asserts a view's request and its result together, where the old spec checked the request config, the enabled
flag and the returned data in separate tests. The two memoization cases are gone, and the paired flag checks of
`useClusterPagination` share a test. The suite has 3520 tests.

`pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm lint:cspell`, React Doctor on the changed code and
`pnpm test:code-complexity` on the four hooks pass. Five consecutive `pnpm test:vitest --sequence.shuffle.files`
runs passed, all 322 files and 3520 tests: seeds 1794474192100, 1794474249844, 1794474335419, 1794474403076,
1794474473492 (1-minute load average 13–18).
