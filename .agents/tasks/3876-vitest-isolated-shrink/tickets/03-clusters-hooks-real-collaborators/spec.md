# 03 — Clusters hooks specs on real collaborators

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3876 |
| Blocked by | T01 |

## What to build

The four specs of the name-services clusters hooks stop mocking the app's own modules. Each hook is
exercised through the real API query hooks, the real app config and the real router facade, driven from
the boundary: queued fetch responses, env overrides, the test router. With no module mock left the specs
run in the `shared` project.

## Acceptance criteria

- [ ] The specs of `useAddressClusters`, `useClusterPagination`, `useClustersData` and
      `useSearchWithClusters` each either are named `*.spec.ts` and contain no module mock, or are listed
      in `notes.md` in this ticket folder with the reason they stay isolated.
- [ ] Every behaviour a spec covered before is still covered: each former test case has a counterpart
      asserting the hook's observable result, or `notes.md` says why the case only made sense against the
      mock.
- [ ] No rewritten test asserts that an internal hook or util was called, or with what arguments. A
      request the hook makes is asserted at the fetch boundary.
- [ ] No file under `src/` other than a spec changes.
- [ ] `pnpm lint:eslint` and `pnpm lint:tsc` pass.
- [ ] `pnpm test:code-complexity` and the mutation-testing gate pass for the four hooks.
- [ ] Five consecutive `pnpm test:vitest --sequence.shuffle.files` runs pass, each on a different seed.

## Details

What each spec mocks today, and the real route:

- **`useAddressClusters`** — the API query hook and the app config. Real query hook answered by
  `fetchMock`; the clusters feature switched on through `withEnvs`.
- **`useClustersData`** — the API query hook and the clusters input-type detector. Real detector fed
  inputs of each type; real query hook answered by `fetchMock`.
- **`useClusterPagination`** — two router utils. Real utils over the test router (`routerStandIn` or the
  `router` prop of the test app; their header comments say which applies).
- **`useSearchWithClusters`** — `@tanstack/react-query`'s `useQuery`, the API fetch hook, the quick-search
  query hook, the debounce hook and the app config. Real query client from the test wrapper, `fetchMock`
  for both requests, `withEnvs` for the feature flags, fake timers for the debounce. The largest rewrite
  of the task.

Notes for the implementer:

- Read "What a good test is" and "Overriding environment variables" in `.agents/rules/tests-unit.md`
  first, the context-split caveat of `withEnvs` in particular: a hook rendered inside the callback needs
  its `wrapper` and router stand-in imported inside the callback too.
- Fake timers and queued fetch responses are undone after every test by the suite setup; set them up per
  test.
- A weaker spec is not an acceptable price for moving it. Fallback (parent spec → "Moving specs"): a spec
  whose rewrite turns out heavy or needs a source change stays isolated and goes into `notes.md` with the
  reason. Ticket 05 reads that list.

## Leaf worklist

- [x] 1 `[agent]` Rewrite the `useAddressClusters` spec
- [x] 2 `[agent]` Rewrite the `useClustersData` spec
- [x] 3 `[agent]` Rewrite the `useClusterPagination` spec
- [x] 4 `[agent]` Rewrite the `useSearchWithClusters` spec
- [x] 5 `[agent]` Verify: lint, complexity and mutation gates, five shuffled full runs; list any spec that stays isolated in `notes.md`
