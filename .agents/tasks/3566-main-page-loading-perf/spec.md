# Main page: improve initial loading performance

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3566 |
| Status | `ready` |
| Size | `large` |
| Feature branch | `issue-3566` |
| PM | — (technical/perf task, no product questions) |
| Designer | — |
| Backend | — (the backend-latency finding is routed separately by the developer) |
| Slack channel | — |

## Context & goal

Profiling the main page of a production instance (desktop, fast network, clean browser profile)
showed first content at ~1.1 s and actual chain data at ~2.5–3 s. Three structural causes, in
order of measured impact:

1. **Data fetching is chained behind the JS boot** — the main-page API requests start only after
   the bundle is downloaded, evaluated, and hydrated (~1 s in), so backend latency adds to the
   boot instead of overlapping it.
2. **The wallet stack gates first render** — `Web3Provider` (`next/dynamic`, `ssr: false`) wraps
   the whole tree in `_app`, so FCP waits for the AppKit + wagmi + viem + zod chunks (~150 KB gz);
   trace evidence: FCP fires ~2 ms after that chunk finishes evaluating. A chunk-load failure
   currently means a blank page.
3. **Analytics/monitoring SDKs sit in the critical bundle** — Mixpanel (~103 KB gz) via static
   imports from shell components, Rollbar (~25 KB gz) via the root provider; both are initialized
   during boot although nothing they do is needed before first paint.

Plus a trivial one: `react-icons` is a dependency for exactly two icons in
`src/toolkit/chakra/menu.tsx` that the app's own SVG sprite already covers.

The goal is to remove all four from the critical path **without behavior changes**: no lost
analytics events, no lost error reports, no wallet UX regressions, no duplicate API requests.
Each subtask is measured with the protocol in `tools/README.md` and reports its numbers into
the Impact tracking section below.

## Functional requirements

- The main page's first-render API requests start at HTML-parse time; the app consumes each
  primed response exactly once, and every subsequent request for the same resource goes to the
  network as usual (socket-driven refetches, pagination, etc. unaffected).
- No analytics event currently sent is lost or reordered by the deferral: events fired before the
  SDK is ready are queued and flushed after `init` + `register` + `identify`, with their original
  call-time timestamps. Page-view semantics (`useLogPageView` gating on init) stay unchanged.
- No error report currently sent is lost: reports fired before Rollbar is ready (error-boundary
  critical, `useFetch` warns) are buffered and flushed on init. `_error.tsx` keeps its own
  standalone instance.
- First render must not depend on the wallet chunks. Wallet features keep working: connect button
  (with a loading state if clicked before the stack loads), auto-reconnect for returning users,
  contract read/write, L2 claim buttons, marketplace dapp wallet bridge, rewards login.
- No visible icon changes from the `react-icons` replacement.

## Data & API

No new API resources. The primed requests reuse the existing registry
(`core:stats`, `core:homepage_indexing_status`, `core:homepage_txs`, `core:homepage_blocks` /
`core:homepage_arbitrum_l2_batches` + `core:homepage_arbitrum_latest_batch`, `stats:pages_main`)
and must build URLs through the real `buildUrl`/`isNeedProxy` so they match the client's requests
byte-for-byte (including the `/node-api/proxy` + `x-endpoint` form in dev/review environments).

## UI inventory

No UI changes. The only visible-adjacent behavior is the wallet button's brief "loading" state
when clicked before the deferred stack has loaded (subtask 4).

## Out of scope

- Backend response time of the main-page endpoints (routed to the backend team separately).
- Below-the-fold render deferral — covered by the list-perf track (#3501, #3557).
- Generic bundle shrinking and a per-route CI size budget — deliberately parked for later.
- SSR of page content — against the product's deployment philosophy (self-hosted instances with
  limited server capacity).

## Impact tracking

Metrics are produced by `tools/trace-metrics.py` (see `tools/README.md` for the recording
protocol; same preset for every run). M3/M4 include backend latency — use medians of 3+ runs.
M5 is also noisy run-to-run locally — median it too.

Baseline and prototype numbers below are single runs from the research session (2026-07-14).
**Re-baseline (median of 3) before starting subtask 1** and correct the first row if needed.

| Checkpoint | M1 FCP | M2 first API req | M3 tx data ready | M4 content rendered | M5 blocking | M6 JS before FCP |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline (single run) | 1526 ms | 916 ms | 2283 ms | 2534 ms | 1059 ms | 1840 KB |
| After 1 (prototype, single run) | 1152 ms | 88 ms | 1894 ms¹ | 2044 ms¹ | 616 ms | 1840 KB |
| After 1 (production impl) | | | | | | |
| After 2 (mixpanel) | | | | | | |
| After 3 (rollbar) | | | | | | |
| After 4 (wallet stack) | | | | | | |
| After 5 (react-icons) | | | | | | |
| **Final (estimate)** | ~750 ms | ~90 ms | ~1500 ms² | ~1700 ms² | ~450 ms | ~1550 KB |
| **Final (measured)** | | | | | | |

¹ The prototype run drew a much slower backend response (1805 ms vs 914 ms in the baseline run)
and still came out ahead — normalized to equal backend latency the M4 gain is ~1.1 s.
² Assuming the instance's median transactions-endpoint latency (~1.3 s); the structural change is
`content-ready = max(boot, backend)` instead of `boot + backend`.

After completing each subtask, run the A/B measurement, fill the row, and note anomalies under
the table. When the last box is checked, fill "Final (measured)" and post the completed table to
issue #3566.

## Task breakdown

- [ ] 1 `[agent]` Productionize the early-fetch primer (lever 1)
  - inputs:
    - Starting point: git stash `primed-fetch prototype (lever 1, issue #3566)` on the developer's
      machine (files: `src/server/homePagePrimedRequests.ts`, `src/api/utils/primed-fetch.ts`,
      `_document.tsx` inline script, `useFetch.ts` consumption, `global.d.ts` typing). An older
      near-duplicate stash `perf: primed fetch` (on main) is obsolete.
    - Hardening beyond the prototype: skip consuming a primed response when cookie-derived request
      headers would differ (`api-v2-temp-token`, `show-scam-tokens`) — or embed those headers
      server-side in `_document`, which sees the cookies; add a comment-pact + unit test keeping
      the primed resource list in sync with the home page widgets (`Home.tsx`); make sure a primed
      fetch rejection behaves identically to a normal fetch failure.
    - GET-only, consume-once semantics (delete from the map on take).
    - Out of scope for this subtask: extending the primer to other entry pages (address, tx) —
      evaluate only after the home-page version has soaked.
- [ ] 2 `[agent]` Defer Mixpanel behind first paint (lever 2a)
  - inputs:
    - `import('mixpanel-browser')` from `useMixpanelInit` after first paint / on idle; the SDK gets
      its own async chunk.
    - Queue in the `src/services/mixpanel` wrapper (it already owns every call site): buffer
      `logEvent`/`userProfile`/`reset` calls until init completes, flush after
      `init` + `register` + `identify` so super-props and identity apply; pass call-time `time`
      property on replayed events.
    - `EXPERIMENT_STARTED` fires from GrowthBook's `trackingCallback` during startup — it must go
      through the queue (it is the only known pre-ready producer besides PAGE_VIEW).
    - Route the stray direct SDK usage in `src/features/account/pages/login/Login.tsx` through the
      wrapper.
    - Consent (Usercentrics) and private-mode gating stay where they are (they null the token
      before init).
- [ ] 3 `[agent]` Defer Rollbar behind first paint (lever 2b)
  - inputs:
    - Replace the `@rollbar/react` root provider with a thin context holding `Rollbar | undefined`
      plus a wrapper that buffers `warn/error/critical` payloads (with call-time timestamps) until
      the lazily-imported instance is ready. All call sites already tolerate an absent instance
      (the `FallbackProvider` pattern).
    - Note: the main app currently has NO `captureUncaught`/`captureUnhandledRejections` (only
      `_error.tsx` does). Optionally add tiny early `window.addEventListener('error'/'unhandledrejection')`
      buffers replayed into Rollbar on load — this makes coverage strictly better than today.
      Decide with the developer whether to include it in this subtask.
    - `checkIgnore`/`ignoredMessages` config moves into the lazy module. `_error.tsx` unchanged.
    - The lever-1 primed requests fail inside the deferral window — their `useFetch` warns must
      go through the buffer.
- [ ] 4 `[agent]` Defer the wallet stack (lever 3) — sub-spec: `subtasks/04-wallet-stack.md`
      (write just-in-time via a `grill-the-task` subtask session)
  - inputs (constraints discovered in research, for the sub-spec session):
    - `Web3Provider` at the app root currently blocks first render entirely; a chunk-load failure
      blanks the page. Stage 1 = stop gating render on it; stage 2 = feature-local providers.
    - Do NOT swap fallback→real provider at the root — the element-type change remounts the whole
      tree (state loss, query refetches). Use feature-local `WagmiProvider` islands and/or a
      permanent lightweight context fed by wagmi's non-React core API (`getAccount`/`watchAccount`).
    - `createAppKit` runs at module scope (`ReownProvider.tsx`) — the deferral boundary is the
      `import()`, not component mounting.
    - Auto-reconnect flicker for returning users: mitigate with optimistic UI read synchronously
      from wagmi's persisted `localStorage` state (`wagmi.store`).
    - Route-based eager loading for flows that need the wallet at page load: marketplace dapp pages
      (`useAutoConnectWallet`, iframe bridge), rewards login, contract pages opened on a write tab.
    - "Connect wallet" clicked before the stack loads → trigger import, show loading state, open
      the modal when ready.
    - ~14 files import wagmi hooks directly (contract methods, revoke, L2 claims, rewards context,
      sign-in-with-wallet) — enumerate and cover in the sub-spec.
- [ ] 5 `[agent]` Replace `react-icons` with sprite icons and drop the dependency
  - inputs: only usage is `LuCheck` / `LuChevronRight` in `src/toolkit/chakra/menu.tsx`; the sprite
    already has check/chevron icons (see `src/sprite/`). Remove the package from `package.json`.
- [ ] 6 `[agent]` Final measurement and report
  - inputs: full protocol per `tools/README.md`, median of 3 runs; fill "Final (measured)" in the
    Impact tracking table; post the completed table as a comment on issue #3566.

## Open questions

None — the research session resolved the design questions, and the backend-latency finding is
handled outside this task by the developer.
