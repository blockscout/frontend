# Notes — 02 Analytics and scroll boundaries observed through spies

## Why a spy on the real export works

Vitest leaves these three packages to Node: `mixpanel-browser` and `posthog-js` resolve to a CommonJS
`main`, `react-scroll` has nothing else. Node caches them, and `vi.resetModules()` resets only Vitest's own
module registry, so `withEnvs` does not re-evaluate them. A throwaway spec checked it: inside a `withEnvs`
callback, a fresh `import()` of each package returned the same `mixpanel-browser` and `posthog-js` default
exports and the same `react-scroll` `animateScroll` and `scroller` objects as the spec's static imports. Only
the `react-scroll` namespace wrapper differs, not the objects on it.

A spy installed on one of those objects in `beforeEach` is therefore what the code under test calls,
whether that code was imported statically or inside `withEnvs`.

## Leaf 1: the spy, proven on one spec per boundary

| Boundary | Proven on | Works | What is spied |
| --- | --- | --- | --- |
| `mixpanel-browser` | Mixpanel provider spec | yes | `init`, `track`, `identify` on the default export, all with an implementation that does nothing |
| `posthog-js` | PostHog provider spec | yes | `init`, `capture`, `identify`, `setPersonProperties` on the default export, which do nothing (`init` returns the SDK object, as the real one does) |
| `react-scroll` | `usePaginationActions` spec | yes | `animateScroll.scrollToTop`, which does nothing |
| Analytics event logger | `TokenActionButton` spec | yes, through the real logger | `mixpanel-browser`'s `init` and `track`; the test enables Mixpanel with `withEnvs`, initializes the analytics queue with the enabled providers and asserts on `track`. A spy on the logger itself was not needed |

One Mixpanel quirk: the SDK's default export has no `people` slot until the real `init` creates it, and
`init` is stubbed. A spec whose code path writes profile props (the Mixpanel provider spec, `HeaderAlert`)
defines a `people` object with `set` and `set_once` mock functions in `beforeEach` and deletes it in
`afterEach`, so nothing reaches a later spec in the worker.

A shared helper in `vitest/utils/` was tried and dropped: ESLint bans the analytics vendor imports in every
file outside the analytics facade, its providers and specs, and `vitest/**` is not exempt. The spies are
inline in each spec instead, two lines for most of them.

## Leaves 2–4: conversions

Every spec in the ticket's "Details" is now named `*.spec.ts(x)` and contains no module mock:

| Boundary | Spec |
| --- | --- |
| `mixpanel-browser` | `src/services/mixpanel/provider.spec.ts`, `useMarketplaceWalletActivity.spec.tsx`, `useSwapWallet.spec.tsx`, `usePersistedColumns.spec.tsx`, `HeaderAlert.spec.tsx`, `useTokenTransferColumns.spec.ts` |
| `posthog-js` | `src/services/posthog/provider.spec.ts` |
| `react-scroll` | `usePaginationActions.spec.ts`, `useApiPaginatedQuery.spec.ts` |
| Analytics event logger | `TokenActionButton.spec.tsx`, `SettingsRpcNode.spec.tsx` |

**None stays isolated.** `useChainValue` (`react-scroll`) is ticket 04's; `useWalletReown` (logger) stays
isolated with the wallet feature.

What each assertion became:

- **Mixpanel and PostHog specs** assert the same calls on the spy that they asserted on the module mock:
  the same arguments, the same call counts.
- **`react-scroll` specs**: `scrollToTop` keeps every count and the `{ duration: 0 }` argument.
- **Logger specs** assert at the SDK, so the logger's arguments arrive translated by the Mixpanel provider:
  `logEvent(type, payload)` is now `track(type, payload, undefined)`, and
  `logEvent(type, payload, { sendImmediately: true })` is now `track(type, payload, { send_immediately: true })`.
  Neither spec asserted a call count before; neither does now.
- `SettingsRpcNode`'s four logging tests now run inside `withEnvs` with a Mixpanel token. They import the
  component and `vitest/lib`'s `render` inside the callback. In a one-file run each took 70–105 ms. The six
  tests that log nothing are unchanged and see the real logger with no provider enabled, which drops the event.

No real network request leaves a converted spec. Where Mixpanel is enabled, its `init` is stubbed, so the SDK
never starts, and every SDK method the code path reaches is stubbed. The PostHog provider spec stubs `init`
and every method the provider calls. A method left without a stub would not send anything either: called before
`init`, Mixpanel's `track`, `register`, `identify` and `reset` throw a `TypeError`, and PostHog's `capture`,
`identify`, `setPersonProperties`, `register` and `reset` return without doing anything (checked in Node).

## For ticket 05

- The unit-test rules do not yet say how to observe a third-party SDK: spy on its real export in
  `beforeEach`. Node, not Vitest, loads it, so the spy also reaches code imported inside `withEnvs`.
  The "Isolation" or "Mocking guidelines" section is the natural place, next to the table of what stays
  isolated.
- The jsdom line `Not implemented: navigation to another Document` printed by `HeaderAlert.spec.tsx` predates
  this ticket (the spec's link clicks); it is not a failure.

## After this ticket

Spec files: 288 `shared`, 34 `isolated` (25 `*.isolated.spec.ts(x)`, 9 `*.primed.spec.tsx`), 10.6% isolated.
Not a timing comparison; that is ticket 05's, against the baseline in ticket 01's `notes.md`.

`pnpm lint:eslint` and `pnpm lint:tsc` pass. Five consecutive `pnpm test:vitest --sequence.shuffle.files` runs
passed, all 322 files and 3530 tests: seeds 1794472838751, 1794472894027, 1794472950481, 1794473011432,
1794473077290 (1-minute load average 3–17).
