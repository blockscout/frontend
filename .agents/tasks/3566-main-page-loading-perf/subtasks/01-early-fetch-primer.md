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

## Verification (2026-07-15)

- Live on a dev preset of a production instance: script embedded for `/` only (proxy-form URLs +
  `x-endpoint`), all 6 primed requests consumed exactly once, later refetches hit the network
  as usual, page renders normally.
- Unit tests: `src/server/primedRequests/index.spec.ts` (script generation, inline-script
  behavior, primer/client header-equality invariant, CSP hash format) and
  `src/api/utils/primed-fetch.spec.ts` (consume-once, mismatch fallback). Expected resources
  are derived from the registry, so the tests cover the default-config behavior rather than
  pinning a hardcoded list.

## Follow-ups

- **Multichain home page**: the primer returns no requests when `multichain` is enabled — the
  multichain home renders a distinct widget set with its own resources. Whether to prime it is
  a product question; the developer will ask the PMs. (2026-07-15)
- **Registry ↔ page drift**: there is deliberately no pact comment in `Home.tsx` (easy to get
  stale). Possible future tooling: an automated check that the primed resource list matches
  the requests the page actually makes on first render (e.g. a Playwright-based assertion).
- **Deterministic registry vs. route params**: how to extend the primer to pages whose request
  URLs depend on the route (address/tx pages) given the CSP hashing strategy — per-request
  hashing in the proxy vs. the existing nonce mechanism. Discussion pending.
