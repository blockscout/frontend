# 02 — Analytics and scroll boundaries observed through spies

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3876 |
| Blocked by | T01 |

## What to build

The specs that replace `mixpanel-browser`, `posthog-js`, `react-scroll` or the app's analytics event
logger with a module mock observe the same calls through a spy on the real export instead. With the
module mock gone they need no registry of their own and run in the `shared` project.

## Acceptance criteria

- [ ] For each of the four boundaries, `notes.md` in this ticket folder records whether the spy approach
      works, proven on one spec before the rest are converted.
- [ ] Every spec in "Details" either is named `*.spec.ts(x)` and contains no module mock, or is listed in
      `notes.md` with the reason it stays isolated.
- [ ] A converted spec asserts what it asserted before: the same events, arguments and call counts. No
      assertion is dropped to make the conversion pass.
- [ ] No real network request leaves a converted spec: the SDK methods that would send one are the ones
      spied, with an implementation that does nothing.
- [ ] No file under `src/` other than a spec changes.
- [ ] `pnpm lint:eslint` and `pnpm lint:tsc` pass.
- [ ] Five consecutive `pnpm test:vitest --sequence.shuffle.files` runs pass, each on a different seed.

## Details

The specs, by boundary:

- **`mixpanel-browser`** — `useMarketplaceWalletActivity`, `useSwapWallet`, the Mixpanel provider spec,
  `usePersistedColumns`, `HeaderAlert`, `useTokenTransferColumns`.
- **`posthog-js`** — the PostHog provider spec.
- **`react-scroll`** — `useApiPaginatedQuery`, `usePaginationActions`. (`useChainValue` mocks it too and
  is ticket 04's.)
- **Analytics event logger** — `TokenActionButton`, `SettingsRpcNode`. Prefer the real logger with a spy at
  the SDK export it reaches; spy on the logger itself only if that does not work. (`useWalletReown` mocks
  it too and stays isolated with the wallet feature.)

Notes for the implementer:

- These packages export an object whose methods the app calls, so a spy on that object's method is seen by
  every caller without replacing the module. This is unverified; leaf 1 verifies it.
- Spies are undone after every test by the suite setup, so install them in `beforeEach` or in the test —
  see "Isolation" in `.agents/rules/tests-unit.md`.
- The two provider specs replace the whole SDK object and are the likeliest to resist. They also use
  `withEnvs`, so the provider module is imported inside the callback while the SDK, a dependency Vitest
  does not re-evaluate, can be imported statically and spied.
- Fallback (parent spec → "Moving specs"): a conversion that turns out heavy or needs a source change is
  dropped; the spec stays isolated and goes into `notes.md` with the reason. Ticket 05 reads that list.

## Leaf worklist

- [ ] 1 `[agent]` Prove the spy on one spec per boundary; record the outcome in `notes.md`
- [ ] 2 `[agent]` Convert the remaining `mixpanel-browser` specs and the `posthog-js` spec
- [ ] 3 `[agent]` Convert the remaining `react-scroll` spec
- [ ] 4 `[agent]` Convert the remaining analytics-logger spec
- [ ] 5 `[agent]` Verify: lint, five shuffled full runs; list any spec that stays isolated in `notes.md`
