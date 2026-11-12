# 04 — Server and multichain specs on real collaborators

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3876 |
| Blocked by | T01, T02 |

## What to build

The remaining specs outside the wallet feature that mock the app's own modules stop doing so. The code
under test runs against the real app config, the real multichain chains config and the real request
checks, driven by env overrides, the runtime inputs those modules read, and request headers. With no
module mock left the specs run in the `shared` project.

## Acceptance criteria

- [ ] The specs of `getAllowedApiOrigins`, the reCAPTCHA CSP policy, the `getServerSideProps` handlers,
      `useChainValue`, the API scope filters and the metadata generator each either are named
      `*.spec.ts(x)` and contain no module mock or direct registry reset, or are listed in `notes.md` in
      this ticket folder with the reason they stay isolated.
- [ ] Every behaviour a spec covered before is still covered: each former test case has a counterpart, or
      `notes.md` says why the case only made sense against the mock.
- [ ] No rewritten test asserts that an internal module was called, or with what arguments.
- [ ] No file under `src/` other than a spec changes.
- [ ] `pnpm lint:eslint` and `pnpm lint:tsc` pass.
- [ ] `pnpm test:code-complexity` and the mutation-testing gate pass for the source files whose specs
      changed.
- [ ] Five consecutive `pnpm test:vitest --sequence.shuffle.files` runs pass, each on a different seed.

## Details

What each spec mocks today, and the real route:

- **`getAllowedApiOrigins`** — the app config, the multichain chains config, the essential-dapps chains
  config. API endpoints through `withEnvs`; the two chains configs through the inputs they really read.
- **reCAPTCHA CSP policy** — the multichain chains config (already uses `withEnvs`).
- **`useChainValue`** — the multichain chains config and `react-scroll`. The scroll call is observed the
  way ticket 02 proved; if ticket 02 found the spy does not work, this spec stays isolated.
- **`getServerSideProps` handlers** — the real-browser check. Drive the real check with request headers
  that make it answer each way.
- **API scope filters** — replaces the resource registry with one that carries a fixture resource.
- **Metadata generator** — replaces the template map with a fixture one and resets the registry.

Notes for the implementer:

- The multichain chains config is a function, not a constant: it returns nothing unless the multichain
  feature is enabled, then reads a global on `window` in the browser and a Node-side value holder
  otherwise. Read it and its Node module before choosing how to feed it; the essential-dapps chains config
  likely follows the same shape. A global set by a test is restored by that test.
- **Expected fallbacks.** The scope-filters and metadata-generator specs inject a fixture *module*, which
  has no real-collaborator route short of a source change. Try the existing real entries first (a real
  resource, a real route's templates) where they exercise the same branch; otherwise the spec stays
  isolated and goes into `notes.md` with the reason. This is the parent spec's fallback, not a failure of
  the ticket. Ticket 05 reads that list.
- Read "What a good test is" and "Overriding environment variables" in `.agents/rules/tests-unit.md`
  first.

## Leaf worklist

- [x] 1 `[agent]` Rewrite the `getAllowedApiOrigins` and reCAPTCHA policy specs over the real chains configs
- [x] 2 `[agent]` Rewrite the `useChainValue` spec
- [x] 3 `[agent]` Rewrite the `getServerSideProps` handlers spec over the real request check
- [x] 4 `[agent]` Rewrite the scope-filters and metadata-generator specs, or record why they stay isolated
- [x] 5 `[agent]` Verify: lint, complexity and mutation gates, five shuffled full runs; list any spec that stays isolated in `notes.md`
