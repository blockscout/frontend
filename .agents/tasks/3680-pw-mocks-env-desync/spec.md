# Prevent env-derived query params from desyncing Playwright mocks from the app

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3680 |
| Feature branch | `issue-3680` |
| PM | tom |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

The Playwright `mockApiResponse` fixture builds its route matcher by calling the production URL builder
**in Node**, where `src/config` is a frozen singleton evaluated from `playwright/.env.pw`. The component
under test builds the same URL **in the browser**, where `getEnvValue` honours the `localStorage` overrides
written by the `mockEnvs` fixture. Any env that takes part in URL building — API hosts, ports and base
paths, the network id, the multichain flag, and now the interchain scope filters — therefore resolves
differently on the two sides whenever a test overrides it. The matcher misses, the request falls through
to a dead `localhost` port, and the component renders an empty or error state that only surfaces as a
screenshot diff.

The latest instance (PR #3679) was patched per call site by restating the derived query params by hand and
aligning a mock's chain id with `.env.pw`, which duplicates production derivation logic in test setup.

Goal: a test that overrides an env used in URL building keeps matching its mocks with no per-call-site
restatement, and any request a test fails to mock fails that test with a diagnostic that names the
mismatch.

The planned migration to Playwright's stateful-stories model does not remove the trap on its own: test
code and `page.route` still run in Node while the story runs in the browser. The fix below moves URL
computation to the browser page, which the stories gallery can own just as well, so it carries over.

## Functional requirements

1. A `mockApiResponse` or `mockConfigResponse` registered after `mockEnvs` overrides matches the request
   the component actually sends, for every env that participates in URL building, including the
   `interchainIndexer` scope filters. The caller passes only the path and query params the component
   itself passes; env-derived params are never restated at the call site.
2. Both fixtures keep returning the matcher URL as a string.
3. Calling `mockEnvs` after a mock has been registered in the same test fails that test immediately with a
   message naming both calls and the required order.
4. A request to `localhost` on any port other than the component-test server and the test socket server
   that no registered mock handled fails the test. The failure lists each such URL, then the registered
   matchers sharing its pathname, then a count of the remaining matchers. Requests to non-`localhost`
   hosts stay silently aborted as today.
5. There is no per-test opt-out of requirement 4. A test that needs an API call to fail mocks it with an
   error status.
6. The cross-chain-txs visual tests no longer restate `home_chain_id`, `include_unindexed_chains` or
   `bridge_ids` by hand, and no longer carry a mock whose chain id must match `.env.pw`.
7. The full suite passes in Docker with requirement 4 enforced: every previously unmocked request is
   either mocked or deliberately answered with an error status.
8. The visual-test rules and the Playwright runner context describe the browser-side URL resolution, the
   fixture ordering rule, and the unmocked-request failure.

## Data & API

No API changes. Env vars involved are only those `buildUrl`, `getResourceParams`, `isNeedProxy`,
`resolveScopeFilters` and `buildExternalAssetFilePath` already read. `playwright/.env.pw` is not changed
to switch any feature on.

## UI inventory

None. Test infrastructure only; no product UI changes.

## Implementation decisions

- **One env source: the browser.** The harness entry loaded by the component-test page exposes a
  window-level builder that dynamically imports the production URL builder and the external-asset path
  helper on first use. `mockApiResponse` and `mockConfigResponse` call it through `page.evaluate` instead
  of importing the production modules in Node. Evaluating `src/config` in the page at that moment is
  correct because the component shares the same module graph and would evaluate it with the same
  `localStorage` state at mount. Arguments cross the boundary as plain data; the `chainConfig` option is
  already serialisable mock data.
- **Ordering guard.** A per-test fixture state records whether any mock has been registered; `mockEnvs`
  throws when that flag is set. This is what makes the browser-side singleton safe.
- **Unmocked-request detection** lives in the existing catch-all route in the shared test setup: it is
  consulted last, so anything reaching it with a `localhost` host and a port outside the CT server and
  socket server is unmocked by definition. Those URLs are recorded per test; the mock fixtures record every
  matcher they register; an `afterEach` assertion compares the two and formats the diagnostic.
- **Fail, not warn.** Warnings go unread; the target state of the task is a failing test. The audit of
  currently unmocked requests is unknown in size, which is why it is its own ticket.
- **Proof of the fix** is reverting the PR #3679 workaround in the cross-chain-txs tests: drop the
  hand-written scope-filter query params and the `homeChain` mock aligned with `.env.pw`, and re-override
  the network id via `mockEnvs` where the test needs it.
- Rejected: re-evaluating Node-side config under overrides (fragile in Playwright's module loader), and a
  lenient matcher that ignores extra query params (hides real bugs).

## Out of scope

- Migrating to Playwright's stateful-stories model and off the removed experimental CT packages.
- Changing how production code reads envs or builds URLs.
- Flagging aborted non-`localhost` requests (ads, third-party scripts, remote images).
