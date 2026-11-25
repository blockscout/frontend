# 10 — OpenTelemetry on the patched 2.x line

<!-- cspell:ignore cxfr -->

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 10 of #3907 |
| Blocked by | none |

## What to build

The server's OpenTelemetry packages move to the newest release of the 2.x line, which carries the patched
`@opentelemetry/propagator-jaeger`. A malformed Jaeger trace header then no longer takes the server down
when the Jaeger propagator is enabled. Dead weight goes with it: the unused Jaeger exporter, and the
`protobufjs` floor that only an old `sdk-node` copy needed. `instrumentation.node.ts` keeps working as it
is.

## Acceptance criteria

- [ ] `@opentelemetry/sdk-node`, both OTLP exporters and the stable OTel packages are on the newest 2.x
      line. `@opentelemetry/auto-instrumentations-node` is on the newest release that asks for that
      `sdk-node`.
- [ ] `@opentelemetry/propagator-jaeger` resolves to a patched version, and no `sdk-node` 0.217 or 0.218 is
      left in the lockfile.
- [ ] `@opentelemetry/api` is held below 1.10, and `pnpm install` prints no peer warning for it.
- [ ] `@opentelemetry/exporter-jaeger` is no longer a dependency.
- [ ] The `protobufjs` floor is gone, and no vulnerable `protobufjs` is in the lockfile.
- [ ] `instrumentation.node.ts` changes only where a bumped package requires it.
- [ ] A production build started with `OTEL_SDK_ENABLED` set and `OTEL_PROPAGATORS=jaeger` starts the SDK.
      A request carrying `uber-trace-id: %` gets a response, and the server keeps serving. The same probe
      fails on the versions before the bump. Both results are in `notes.md`.
- [ ] `pnpm audit --prod --audit-level high` no longer reports GHSA-45rx-2jwx-cxfr.
- [ ] `pnpm install --frozen-lockfile` succeeds and the `@lifi/widget-light` patch still applies.
- [ ] `pnpm lint:tsc`, `pnpm test:vitest`, `pnpm lint:license:check` and `pnpm test:smoke` pass locally.

## Details

**Why the 2.x line.** The patched `propagator-jaeger` (2.9.0 and later) comes with `sdk-node` 0.220.0 and
later; 0.223.2 is the newest 2.x release. The 3.x line (0.300 and up) is a major on its own request:

- it drops the Jaeger propagator and exporter;
- it renames the `metricReader` option;
- it moves the span processors to another package;
- it needs `@opentelemetry/api` 1.10.

Upstream supports 2.x for a year after 3.0.0 (2026-10-20).

**`@opentelemetry/api`.** Every 2.x package declares a peer of `<1.10.0`. Ticket 06's refresh resolved
`^1.9.1` to 1.10.0.

**`exporter-jaeger`.** Deprecated upstream and imported nowhere, and `sdk-node` never loads it.

**`protobufjs`.** The floor's parent, `@opentelemetry/otlp-transformer` 0.217.0, comes only through
`sdk-node` 0.217.0, which `auto-instrumentations-node` 0.75.0 asks for. Once that copy is gone, check the
remaining requesters (`@grpc/proto-loader` asks for `^7.5.5`) and drop the entry if none can resolve below
the floor.

**Telemetry names change.** From 0.221.0, the HTTP instrumentation emits only the stable HTTP semantic
conventions, so its span attribute and metric names change for whoever reads the exported telemetry.

**The probe.** GHSA-45rx-2jwx-cxfr: `JaegerPropagator.extract()` throws on a bare `%` in the
`uber-trace-id` header, and the exception escapes the request. It only happens when the Jaeger propagator
is active, hence `OTEL_PROPAGATORS=jaeger`. In production mode the metric exporter sends to an OTLP
endpoint that is not running, so its export errors are expected.

**After the commit.** CI runs only on a pushed commit, so it does not gate this ticket; the local checks
cover what the dependency checks run. Once the ticket is committed, the agent pushes and watches the
dependency checks with `gh`. A red run is fixed in a follow-up commit.

## Leaf worklist

- [ ] 1 `[agent]` Run the malformed-header probe against the current production build and note the result
- [ ] 2 `[agent]` Move the OTel packages to the newest 2.x line, hold `@opentelemetry/api` below 1.10, and
      drop `exporter-jaeger` and the `protobufjs` floor
- [ ] 3 `[agent]` Run the probe and the local checks on the bumped build
