# 02 — Detect unmocked localhost requests behind an opt-in runner flag

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3680 |
| Blocked by | T01 |

## What to build

When `pnpm test:pw` runs with a strict-mocks flag, any request a test lets through to `localhost` on a
port other than the component-test server and the test socket server fails that test. The failure lists
each unmocked URL, under it the registered matchers that share its pathname (so a query-param drift reads
side by side), then a count of the remaining matchers. Without the flag the suite behaves as today, so this
ticket lands green and a single flagged Docker run produces the audit list ticket 03 works through.

## Acceptance criteria

- [ ] The runner accepts a strict-mocks flag, documented in its `--help` text, and passes it to Playwright
      as an environment variable the shared test setup reads.
- [ ] Under the flag, the existing catch-all route in the shared test setup records every `localhost`
      request whose port is neither the CT port nor the socket-server port; non-`localhost` requests are
      still aborted silently.
- [ ] Both mock fixtures record every matcher URL they register in the test-scoped registry from T01.
- [ ] An `afterEach` assertion fails the test when the recorded unmocked list is non-empty, formatted as:
      each unmocked URL; the registered matchers with the same pathname; `N other matchers registered`.
- [ ] The diagnostic formatter is a pure function with a Vitest spec covering: no same-pathname matcher,
      one query-param drift, several unmocked URLs.
- [ ] Without the flag, `pnpm test:pw --docker` passes exactly as before this ticket.
- [ ] A flagged Docker run of the whole suite has been executed and its failing tests, with the unmocked
      URLs, are written to this ticket's `notes.md` as the input for T03.

## Details

- The runner lives in `tools/playwright/`; its flag parsing, pre-run steps and the env it spawns
  Playwright with are in `index.ts`, with `index.spec.ts` recording spawned steps. Add the flag there and
  cover it in that spec.
- The catch-all route and the per-test `beforeEach` are in `playwright/lib.ts`; the CT port is the
  `ctPort` in `playwright-ct.config.ts`, the socket port is exported from `playwright/utils/socket.ts`.
  Read both from their source rather than restating the numbers.
- The flag is temporary scaffolding for the rollout; T03 removes it. Name it so that reads naturally as a
  removal later.

## Leaf worklist

- [ ] 1 `[agent]` Add the strict-mocks flag to the runner, its `--help` text and `index.spec.ts`
- [ ] 2 `[agent]` Record unmocked localhost requests in the catch-all route and registered matchers in both mock fixtures
- [ ] 3 `[agent]` Write the pure diagnostic formatter with its Vitest spec, and the `afterEach` assertion gated by the flag
- [ ] 4 `[agent]` Run the whole suite in Docker with and without the flag; write the flagged run's unmocked list to `notes.md`
