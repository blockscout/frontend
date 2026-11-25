# 10 — Notes

<!-- cspell:ignore cxfr thriftrw -->

## The malformed-header probe

The production build of the `staging` preset, started with `NEXT_OPEN_TELEMETRY_ENABLED=true
OTEL_SDK_ENABLED=true OTEL_PROPAGATORS=jaeger pnpm prod:preset staging --skip-build --port 3300`.
`instrumentation.ts` loads the SDK only when `NEXT_OPEN_TELEMETRY_ENABLED` is `true`, so the probe needs it
next to `OTEL_SDK_ENABLED`. The probe is `curl -H 'uber-trace-id: %' http://localhost:3300/node-api/healthz`,
then a plain request to the same route. Both runs log OTLP export errors to `localhost:4318`, as expected.

- **Before the bump** (`sdk-node` 0.218.0 and 0.217.0, `propagator-jaeger` 2.7.1; the build of
  `788cd47f0`): the probe got no response, and curl gave up after 30 s. The server logged `⨯
  uncaughtException: URIError: URI malformed at decodeURIComponent` once per probe. The process did not
  exit: `next start` logs an uncaught exception and keeps running, so the plain request after each probe
  still got a 200. Under `next start`, the advisory costs the request, which hangs forever. It does not
  stop the process.
- **After the bump** (`sdk-node` 0.223.2, `propagator-jaeger` 2.12.1): the SDK starts and logs that the
  Jaeger propagator is deprecated, which shows it is the active propagator. The probe got a 200 in 5 ms.
  The same header on `/` got a 200 too. Nothing was logged for either request, and the server kept serving.

## How the lockfile was made

- **`auto-instrumentations-node` 0.81.2.** It is the last release that asks for `sdk-node` `^0.223.0`.
  0.82.0 moves to `^0.300.0` and to `@opentelemetry/api` `^1.10.0`.
- **One `@opentelemetry/api`.** With `~1.9.1` in the manifest, a plain `pnpm install` still left 1.10.0
  under `api-logs` and `prom-client`, which take `api` as a dependency, not a peer. It also left the
  resource detectors on `resources` 2.8.0. `pnpm update "@opentelemetry/*"` moved all of them to 1.9.1 and
  2.12.1. `pnpm peers check` lists no OTel package.
- **Two `api-logs` copies are expected.** The registry's `latest` tag for `api-logs` is 0.223.0, and pnpm
  takes the `latest` version whenever it satisfies the range. So the log instrumentations' `^0.223.0`
  resolves to 0.223.0, while `sdk-node` pins 0.223.2.
- **Removed and added.** Dropping `exporter-jaeger` took `jaeger-client`, `thriftrw` and their dependencies
  out of the lockfile. `auto-instrumentations-node` brings in a new
  `@opentelemetry/instrumentation-host-metrics` and its `systeminformation` 5.33.23 (MIT).

## The `protobufjs` floor

`otlp-transformer` 0.223.2 no longer depends on `protobufjs`. The only package still asking for it is
`@grpc/proto-loader` 0.8.1, with `^7.5.5`, and that resolves to the newest 7.x, 7.6.6. The vulnerable 7.x
versions are 7.6.4 and older, so no requester can resolve below the floor, and the entry is gone. After that,
`pnpm audit --prod` reports no `protobufjs` advisory at any severity.

## Local checks on the bumped tree

- `pnpm audit --prod --audit-level high`: no high or critical advisory. GHSA-45rx-2jwx-cxfr is gone, and the
  ignored `zod` one remains.
- `pnpm install --frozen-lockfile`: up to date. The lockfile's `patchedDependencies` and the
  `@lifi/widget-light` entry did not change.
- `pnpm lint:tsc`, `pnpm lint:license:check` and `pnpm test:vitest` (323 files, 3440 tests) pass.
  `instrumentation.node.ts` did not change.
- `pnpm test:smoke`: seven tests pass on the first try.
