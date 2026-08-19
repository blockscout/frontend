# 0003 — Turbopack for production builds

| | |
| --- | --- |
| Status | accepted |
| Date | 2026-08-18 |
| Deciders | @tom2drum |
| Supersedes | 0001 |

## Decision

**Production builds use Turbopack (the Next.js default — `next build`, no flag). Dev already uses
Turbopack.** This reverses [0001](0001-webpack-for-production-builds.md), which forced
`next build --webpack` because Turbopack miscompiles the Dynamic-labs SDK.

Two things stay on webpack, because they depend on the webpack pipeline specifically:

| Entry point | Bundler | Why |
| --- | --- | --- |
| `pnpm build`, `pnpm build:next` — the shipped image | Turbopack | default |
| `pnpm prod:preset <alias>` | Turbopack | matches the image |
| `pnpm dev`, `pnpm dev:preset`, `pnpm dev:local` | Turbopack | default |
| `pnpm build:analyze` | webpack | `@next/bundle-analyzer` is a webpack plugin |
| `pnpm prod:preset <alias> --profile` | webpack | `--profile`'s `react-dom/profiling` alias is guaranteed on webpack, undocumented on Turbopack (see `tools/profiling/CONTEXT.md`) |

`next.config.js` keeps both the `turbopack` and `webpack()` sections — the webpack section is still
live for the two exceptions above, and the two must stay in sync.

## Why

### The crash that forced webpack is fixed

0001's whole case was a Turbopack scope-hoisting bug that mis-bound `UserFieldEditorContext` inside
the Dynamic-labs SDK and hard-crashed every page of any `NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER=dynamic`
instance — in production only, invisible in dev. It was reported upstream and fixed in
**Next 16.3.1**.

Verified on this version: a Turbopack production build served against the `rootstock` preset (which
uses the dynamic provider) loads clean — home page renders, the Dynamic login modal opens, and the
console shows zero `DynamicContextProvider` errors. The exact failure 0001 documented no longer
reproduces.

### Turbopack is now faster to build *and* faster at runtime

0001 kept webpack partly because, back then, webpack also produced the lighter, faster-executing
bundle. That is no longer true. Re-measured on Next 16.3.1 with the `rootstock` preset — medians of
3 headless runs via `.agents/tasks/3566-main-page-loading-perf/tools/`, same machine and method, so
only the within-comparison deltas are meaningful:

| Metric | webpack | **Turbopack** | Δ |
| --- | --- | --- | --- |
| M1 FCP | 2047 ms | **1049 ms** | −49% |
| M2 first API request | 123 ms | **55 ms** | −55% |
| M5 blocking time | 1444 ms | **453 ms** | −69% |
| M6 JS before FCP | 2235 KB gz | 2575 KB gz | +15% |
| Bundling time (`next build`) | 186 s | **87 s** | −53% |

Turbopack ships ~15% more JS before FCP (M6) yet halves FCP and cuts blocking time by roughly
two-thirds — the cost that used to live in execution is gone, so the extra bytes do not hurt load
here. This is the inverse of 0001's table, where disabling scope hoisting (its stand-in for the fix)
*tripled* blocking time. Whatever changed in the hoisting fix flipped the runtime result, not just
the correctness one. M6 alone would have called this a regression; M1 and M5 are why it is not.

Build time is the motivation: webpack's bundling step had grown slow enough to drag out CI. Turbopack
bundles in less than half the wall-clock (the type-check phase is bundler-agnostic and unchanged).

## Consequences

- **`experimental.useTypeScriptCli: false` is now required** in `next.config.js`. Next 16.3 defaults
  build-time type-checking to the `tsc` CLI, which needs a `typescript/bin/tsc` binary; this repo
  runs the native TypeScript compiler via the `@typescript/typescript6` alias, which ships `bin/tsc6`
  only. The compiler-API path (this flag `false`) checks against `lib/typescript.js`, which the alias
  does provide, so type-checking runs normally. Without it the build aborts claiming `typescript` is
  missing — on **both** bundlers, since the check runs before bundling.
- **Dev and production are on the same bundler again.** 0001's "a production-only bug can't be caught
  in dev" caveat is lifted for the default path — though the two webpack exceptions (`build:analyze`,
  `--profile`) still exercise a second pipeline.
- **The `@react-native-async-storage/async-storage` fallback** that 0001 added to `resolve.fallback`
  only applies to the webpack section. Turbopack silently tolerates that optional import, so no
  Turbopack-side equivalent is needed.
- **CI and image builds get faster** — the reason for the change.
- **`outputFileTracingIncludes` now force-includes `@swc/helpers`.** Turbopack's standalone tracer
  copies only `@swc/helpers/cjs` and drops the `esm/` entry points that Next's `require-hook` loads
  at runtime, so the shipped image's `node server.js` crashed on boot (`Cannot find module
  '@swc/helpers/esm/_interop_require_default.js'`). webpack traced the package fully, so this only
  surfaced after the switch — and only on the standalone path, not under `next start`, so it was
  invisible until a demo deploy. The `next.config.js` include is a workaround; drop it once the
  Turbopack tracer is fixed upstream.

## Follow-ups

- Watch for a regression of the scope-hoisting class on future Next upgrades — the trigger was never
  reducible to a single import, so any large change to the dynamic-mode provider graph could
  re-surface a similar defect. `src/features/connect-wallet/CONTEXT.md` carries the standing rule to
  verify graph changes against a dynamic-provider production build.
- The `useTypeScriptCli: false` workaround exists because Next's CLI type-check path does not
  recognize the `@typescript/typescript6` alias's `bin/tsc6`. If a later Next release accepts the
  native compiler's binary (or the alias ships a `bin/tsc`), the flag can be dropped.
