# Primed requests — context

Non-obvious architecture of the early-fetch primer (`src/server/primedRequests/`). Part of the
main-page loading-performance work (issue #3566).

## Why it exists

A page's first-render API requests normally start only after the JS bundle has downloaded,
evaluated, and hydrated — so backend latency stacks on top of the boot instead of overlapping it.
This module emits an inline `<script>` into the HTML `<head>` (via `_document`) that fires those
requests before the bundle boots; the fetch layer then consumes each primed response instead of
issuing it a second time. It is purely a *timing* optimization — see the guarantee below.

## The determinism constraint shapes everything here

The inline script is allowed past the strict CSP by a sha256 hash **computed once at server
startup** (wired through `src/server/csp`), not per request. So the script for a page must be
identical for every visitor under a fixed runtime config, which means **no request-specific value
may be baked into it**. Route params, the active tab, and forwarded URL filters are therefore
resolved in the *browser* (from `location`), and a registry entry is a pure function of `config`.
The corollary is the main limitation: anything that varies per request but can't be derived in the
browser from `location` cannot be primed — e.g. a value embedded *inside* a query-param string
(a JSON-encoded address), which is why some header/enrichment requests are deliberately left to
fetch normally.

## Correctness is guaranteed by construction

The primer can change *when* a request happens, never *whether* it happens or *with what* — so it
cannot alter behavior, only timing:

- **Consume-once**: the fetch layer removes a primed entry from the map on first use; every later
  request for the same resource (refetch, pagination, socket-driven) hits the network as usual.
- **Mismatch falls back to the network**: at consume time the URL and headers are compared against
  the primed entry, and any difference triggers a normal fetch. A wrong or stale registry entry,
  or a URL the browser couldn't reproduce byte-for-byte, costs at most one wasted prefetch — it can
  never serve the wrong data or drop a request.

## Registry ↔ page drift is tested, not assumed

Each registered page has a colocated `*.primed.spec.tsx` that runs the real inline script and
mounts the real page (in its layout) and asserts **primed ⊆ the page's first-render requests**,
byte-identically. The subset direction is deliberate: priming is opt-in per resource, so
*under*-priming is fine, but priming something the page does not actually request on first render
is a bug and fails the test. `index.spec.ts` additionally fails if a registered page lacks its
spec. This is what lets the registry be trusted without a running backend.

## Scope / limits

- GET only.
- One file per page under `pages/`, registered in `registry.ts`; adding a page touches nothing
  else (URL building, headers, CSP allowance, and consumption are all generic).
- Multichain-mode pages are intentionally not primed (a separate optimization track).
