# Subtask 1 — productionize the early-fetch primer (lever 1)

Sub-spec for subtask 1 of [the main spec](../spec.md). Status: implementation in the working
tree; review + A/B measurement pending.

## Goal

Fire the home page's first-render API requests from an inline script in the HTML document,
while the JS bundle is still downloading/evaluating, and have the fetch layer consume each
primed response exactly once — so backend latency overlaps the boot instead of adding to it.
No behavior changes: every subsequent request for the same resource (socket-driven refetches,
pagination, etc.) goes to the network as usual. Built as a generic per-page mechanism so the
primer can roll out to other entry pages later with a simple resource descriptor per route.

## Inputs (from the spec/grilling session)

- Starting point: git stash `primed-fetch prototype (lever 1, issue #3566)` on the developer's
  machine (files: `src/server/homePagePrimedRequests.ts`, `src/api/utils/primed-fetch.ts`,
  `_document.tsx` inline script, `useFetch.ts` consumption, `global.d.ts` typing). An older
  near-duplicate stash `perf: primed fetch` (on main) is obsolete.
- Hardening beyond the prototype: skip consuming a primed response when cookie-derived request
  headers would differ (`api-v2-temp-token`, `show-scam-tokens`) — or embed those headers
  server-side in `_document`, which sees the cookies; a unit test keeping the primed resource
  list in sync with the home page widgets (`Home.tsx`); make sure a primed fetch rejection
  behaves identically to a normal fetch failure.
- GET-only, consume-once semantics (delete from the map on take).
- Out of scope for this subtask: extending the primer to other entry pages (address, tx) —
  evaluate only after the home-page version has soaked.

## Design decisions (2026-07-15)

- **Cookie-derived headers** are resolved **in the inline script** from `document.cookie`
  (not embedded server-side — keeps user data out of the HTML), driven by declarative
  descriptors in `src/api/utils/cookie-headers.ts`; **plus** a consume-time header comparison
  in `src/api/utils/primed-fetch.ts` that falls back to a network fetch on any mismatch
  (safety net against drift between the inline script and the client fetch layer).
- **Header building extracted** from `useApiFetch` into `src/api/utils/build-headers.ts`,
  shared by the client and the primer (on the server it yields exactly the cookie-independent
  part). This also fixed the prototype silently dropping the static `updated-gas-oracle: true`
  header of `core:stats`.
- **Generic per-page design** for future rollout: `src/server/primedRequests/registry.ts` maps
  a Next.js page id to a per-route file in `src/server/primedRequests/pages/` with the page's
  resource descriptors; the home page (`pages/home.ts`) is the first entry. Everything else
  (URL building, headers, CSP allowance, consumption in the fetch layer) is generic.
- **CSP**: the strict `script-src` gets the primer scripts' sha256 hashes computed at startup
  (`getPrimerScriptCspHashes`, wired through `src/server/csp`); the inline script is a string
  constant so the Node (`_document`) and edge (CSP hash) copies are byte-identical. Registry
  entries must therefore stay deterministic per runtime config; pages needing route params
  (address, tx) will need per-request hashing or the existing CSP nonce mechanism — see the
  open discussion below.
- Fixed a latent `src/config` ↔ `cookies.ts` circular-import TDZ crash (entering the import
  graph via `cookies` first) by removing the late-initialized `isBrowser` binding use in
  `cookies.get`.
- **Dynamic route params + tab gating** (added 2026-07-15 by developer request, tx page as
  the pilot — pulled into this subtask from the original "other pages later" scope): a
  descriptor's `pathParams` may reference a route param (`{ routeParam: 'hash' }`), which the
  generator turns into an alphanumeric placeholder in the URL template; the inline script
  matches the page's route pattern against `location.pathname`, extracts the raw segment, and
  substitutes it (split/join — `replaceAll` would misread `$` in values). A `tabs` field
  restricts a request to a set of tabs — a resource shared by several tabs lists them all, no
  duplication; the active tab is the `tab` query param, falling back to the page's
  `defaultTab` (declared in its registry entry, matching `useActiveTabFromQuery` semantics)
  when the param is absent. Both are resolved in the browser, so the script stays
  deterministic per config and the startup CSP hashing is unchanged. Unresolvable params or a
  pattern mismatch → the request is simply not primed. `/tx/[hash]` primes `core:tx` plus the
  config-gated interpretation resource (`core:tx_interpretation` / `core:noves_transaction`),
  index tab only.

## Verification (2026-07-15)

- Live on a dev preset of a production instance, home page: script embedded for `/` only
  (proxy-form URLs + `x-endpoint`), all 6 primed requests consumed exactly once, later
  refetches hit the network as usual, page renders normally.
- Same setup, tx page: the embedded script is request-independent (URL
  templates with placeholders, no hash anywhere); the browser substitutes the hash from
  `location.pathname` (map keys match `buildUrl` byte-for-byte); primed 200s are consumed and
  the page renders; on `?tab=logs` the script primes nothing; a primed 500 (flaky dev proxy)
  behaved exactly like a normal fetch failure — the app retried over the network.
- Unit tests: `src/server/primedRequests/index.spec.ts` (script generation, inline-script
  behavior, primer/client header-equality invariant, CSP hash format) and
  `src/api/utils/primed-fetch.spec.ts` (consume-once, mismatch fallback). Expected resources
  are derived from the registry, so the tests cover the default-config behavior rather than
  pinning a hardcoded list.

## Follow-ups

- **Multichain home page**: the primer returns no requests when `multichain` is enabled — the
  multichain home renders a distinct widget set with its own resources. Whether to prime it is
  a product question; the developer will ask the PMs. (2026-07-15)
- **Registry ↔ page drift** — **implemented** 2026-07-15 as `*.primed.spec.tsx` drift tests
  (see the unit-testing rules for the convention). Each registered page has a spec next to its
  root component that executes the real inline script, mounts the real page component with its
  layout in jsdom, and asserts every primed request is fired by the page byte-identically
  (URL + headers); responses are kept pending forever, so "first render" needs no response
  stubs. A completeness test in `src/server/primedRequests/index.spec.ts` fails when a
  registered page lacks its spec. Feature-config variants run through a new
  `vitest/utils/mockEnvs.ts` utility (`vi.resetModules()` + dynamic imports) reusing the
  Playwright env bundles, which moved to `src/config/test-utils/env-presets.ts` (the pw
  fixture re-exports them). Enabling jsdom page mounts required stubbing `.svg` imports in
  `vitest.config.ts` (the Next build runs them through @svgr/webpack). The check caught a real
  registry bug on its first run: `core:homepage_indexing_status` is requested by the shell
  header's indexing alert and is config-gated (`chain.indexingStatus.blocks.isHidden`) — the
  registry now mirrors that gate instead of priming it unconditionally.
- **Deterministic registry vs. route params** — investigated and **implemented** 2026-07-15
  (see the design decision above; `/tx/[hash]` is the pilot). Rationale kept for the record:
  no param validation — components don't validate router params before requesting either, and
  the failure mode is benign (a param whose encoded pathname form differs from the client's
  decode→re-encode round-trip yields a primed URL the consumer never looks up — one wasted
  request; `compile()` keeps hex hashes and block numbers verbatim, so realistic params are
  byte-identical). Browser-side substitution costs ~1 µs per page load for 6 requests
  (measured), i.e. noise. Per-request server cost of the rejected alternatives (vitest bench,
  Node, mean per page request):
  | strategy | mean | notes |
  | --- | --- | --- |
  | static registry (chosen) | ~0 µs | cached policy, no per-request work |
  | nonce, template-replace | ~0.5 µs | needs nonce threading + per-request policy string |
  | nonce, naive regeneration | ~10 µs (max 44 ms) | today's sevio code path |
  | per-request script hash | ~30 µs | route matching + script regeneration in the middleware |
  Side finding: the existing sevio nonce path regenerates the full policy per request; a
  prebuilt template with string replace would cut it ~20× and remove the fat tail — tracked
  as https://github.com/blockscout/frontend/issues/3571.
