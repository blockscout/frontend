# 02 — Smoke set: read-only pages and the failure rules

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3907 |
| Blocked by | none |

## What to build

A smoke set that drives a real browser against a production build of the app, configured as the `staging`
preset and talking to that instance's real backend. One local command builds the app, starts it, runs the
set and stops the server.

This ticket delivers the runner and the read-only half of the set: the home page shows real stats, a
transaction page and an address page show real data, and the API documentation page renders. Every smoke
test fails on an uncaught page exception and on a failed request to the application's own origin. Known
third-party exceptions sit in one allowlist. Browser console output is not asserted.

## Acceptance criteria

How to verify: `pnpm test:smoke`, with outbound internet

- [ ] `pnpm test:smoke [<alias>]` builds for production, starts the server, runs the set and exits with
      the set's status, leaving no server running. The alias defaults to `staging`.
- [ ] A flag runs the set against an already built app, so CI can keep the build as its own step.
- [ ] The Playwright config is separate from `playwright-ct.config.ts`: Chromium only, retries on, no
      screenshots.
- [ ] Tests for the home page stats, a transaction page, an address page and the API documentation page
      pass against `staging`.
- [ ] The transaction and the address are found at run time from the instance, not hardcoded.
- [ ] An uncaught page exception fails the test that hit it, unless it matches the allowlist.
- [ ] A failed request to the app's own origin fails the test.
- [ ] The allowlist is one module; each entry says which third party throws it.
- [ ] `pnpm test:vitest` and `pnpm test:pw` do not collect the smoke files.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc` and `pnpm lint:cspell` pass.

## Details

**Placement.** `tools/smoke/`, on the pattern of the other tool directories: the Playwright config, the
tests, a shared fixture and a `run.sh` behind the `test:smoke` script. Dotted names for entry points,
snake_case for internals, as `tools/dev-server/CONTEXT.md` states for its own directory.

**File naming.** Vitest collects `*.spec.ts` and the component runner collects `*.pw.tsx`. Give the smoke
tests a suffix neither collects, and match it in the smoke config.

**Build and start.** `tools/dev-server/prod.preset.sh` already fetches the preset, prepares the assets,
builds and starts, but it blocks on the server. Reuse its steps through `tools/dev-server/run_steps.sh`
rather than copying them, and start the server through Playwright's `webServer` or in the background with
a readiness wait. `prod:preset --skip-build` is the existing split between build and start.

**The failure rules** belong in one fixture every test uses: listeners for `pageerror` and for failed or
5xx responses whose URL is on the app's origin. Requests to the backend and to third parties are another
origin and are not asserted here; the page assertions cover the backend.

**Real data.** The home page lists latest transactions; take the transaction and an address from there or
from the instance's API. A hardcoded hash breaks when the testnet instance is re-indexed.

**Fallback preset.** Whether GitHub runners reach `staging` is settled by the first CI run (ticket 06).
Keep the alias a parameter so a switch to `eth_sepolia` is one value.

## Leaf worklist

- [ ] 1 `[agent]` Add the smoke Playwright config, the `run.sh` entry point and the `test:smoke` script
- [ ] 2 `[agent]` Add the shared fixture with the failure rules and the third-party allowlist
- [ ] 3 `[agent]` Add the home, transaction, address and API documentation tests
