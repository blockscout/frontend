# 01 — Resolve mock URLs in the browser and guard fixture order

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3680 |
| Blocked by | none |

## What to build

A visual test that overrides an env taking part in URL building keeps matching its mocks without
restating anything: `mockApiResponse` and `mockConfigResponse` compute their matcher URL inside the test
page, through a `window`-level builder the harness entry exposes, which dynamically imports the production
URL builder and external-asset path helper on first use. Because that evaluates the browser `config`
singleton at the first mock registration, `mockEnvs` called afterwards in the same test throws with a
message naming both calls and the required order. The cross-chain-txs tests patched in PR #3679 drop
their hand-written `home_chain_id` / `include_unindexed_chains` / `bridge_ids` query params and the
`homeChain` mock aligned with `.env.pw`, overriding the network id through `mockEnvs` again where a test
needs a specific chain. Their screenshots do not change.

## Acceptance criteria

- [ ] Neither fixture imports `src/api/utils/build-url`, `src/config` or `buildExternalAssetFilePath`
      in Node; both resolve the URL through `page.evaluate` against the harness builder and still return
      it as a string.
- [ ] The harness builder imports the production modules lazily, so loading the test page alone does not
      evaluate `src/config` before `mockEnvs` has run.
- [ ] `mockEnvs` after a registered mock in the same test throws; the message names `mockEnvs`, the mock
      fixture, and that env overrides must come first.
- [ ] The `interchainIndexer` scope filters reach the matcher from production code: a cross-chain-txs test
      that passes only the component's own params matches the request.
- [ ] `src/features/cross-chain-txs/mocks/chains.ts` and every hand-written scope-filter `queryParams` in
      the cross-chain-txs and chain-stats visual tests are gone; the affected tests set the network id via
      `mockEnvs` where the mock data requires it.
- [ ] `pnpm test:pw --docker` passes for the whole suite with no baseline updated.
- [ ] The `mockEnvs` / `mockApiResponse` / `mockConfigResponse` entries in `.agents/rules/tests-visual.md`
      state the ordering rule and that URLs resolve in the browser; nothing else in the doc restates the
      mechanism.

## Details

- The harness entry is the module `playwright/index.html` loads after `envs.js`; the builder goes on
  `Window` in `global.d.ts` next to `__envs`.
- Arguments cross `page.evaluate` as plain data. The `chainConfig` option is mock data and already
  serialisable; the `pathParams`/`queryParams` are primitives.
- The ordering guard needs per-test state shared by the three fixtures: a small test-scoped fixture both
  mock fixtures mark and `mockEnvs` checks. Ticket 02 reuses the same state to record registered matchers.
- The file-wide audit during grilling found tests where a later `mockEnvs` follows an earlier
  `mockApiResponse` in a *different* test of the same file; those are fine. Only same-test order matters.
  If the Docker run hits the guard in an existing test, reorder that test.

## Leaf worklist

- [ ] 1 `[agent]` Expose the lazy URL builder on `window` from the harness entry and type it in `global.d.ts`
- [ ] 2 `[agent]` Add the test-scoped mock-registry fixture; switch `mockApiResponse` and `mockConfigResponse` to the browser builder; make `mockEnvs` throw after a registration
- [ ] 3 `[agent]` Revert the PR #3679 workaround in the cross-chain-txs and chain-stats visual tests
- [ ] 4 `[agent]` Update the fixture entries in `.agents/rules/tests-visual.md`
- [ ] 5 `[agent]` Run `pnpm test:pw --docker` for the whole suite; fix any test the ordering guard catches
