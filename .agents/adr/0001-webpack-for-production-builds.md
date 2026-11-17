# 0001 — webpack for production builds, Turbopack for dev

| | |
| --- | --- |
| Status | superseded by 0003 |
| Date | 2026-08-04 |
| Deciders | @tom2drum |
| Supersedes | — |

## Decision

**Production builds use webpack (`next build --webpack`). Dev keeps Turbopack (the Next 16 default).**

Applies to every entry point that emits a production bundle:

| Entry point | Bundler |
| --- | --- |
| `pnpm build` — what the `Dockerfile` runs for the shipped image | webpack |
| `pnpm build:next` | webpack |
| `pnpm prod:preset <alias>` — local production build, incl. perf measurements | webpack |
| `pnpm build:analyze`, `pnpm prod:preset <alias> --profile` | webpack (already were) |
| `pnpm dev`, `pnpm dev:preset`, `pnpm dev:local` | Turbopack |

Dev stays on Turbopack because it is roughly 3× faster to compile and the crash class below only
manifests in a minified production build. Production-build regressions are caught in QA rather than
by making every local dev start slower.

## Why

### Turbopack miscompiles the Dynamic-labs SDK

Turbopack's scope hoisting emits code that reads the SDK's `UserFieldEditorContext` through the
wrong binding. `useContext` therefore receives a non-context value, returns `undefined`, and the SDK
throws from its own `useUpdateUserWithModal`:

```
useUserUpdateRequest can only be used inside the context of DynamicContextProvider
```

The throwing component is the SDK's internal `SyncAuthFlow`, which the SDK itself renders *inside*
`UserFieldEditorContextProvider` — so in a correct build the context cannot be missing. It is a
bundler defect, not a provider-tree bug in our code.

Impact: **a hard crash on the initial load of every page**, for any instance configured with
`NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER=dynamic`. It is invisible in dev (unminified, no hoisting) and
was found only by running the `v2.10.0` image locally. The v2.10.0 release would have broken every
dynamic-auth instance on rollout; deployed instances were still on v2.9.4 and unaffected.

Bisected to [#3574](https://github.com/blockscout/frontend/pull/3574) (wallet-stack deferral,
subtask 4 of [#3566](https://github.com/blockscout/frontend/issues/3566)) — parent commit good, that
commit bad. The trigger could **not** be reduced to a single import: reverting the lazy `import()`
wrappers, the `_app.tsx` provider restructure, and the `@wagmi/core` dependency each left it broken.
That fits the mechanism — scope hoisting groups modules across the whole graph, so the trigger is an
emergent property of how #3574 reshaped it, and any future graph change could re-trigger it
somewhere else. Next 16.3.0 does not fix it.

### webpack is also the faster bundle

Two options fixed the crash: `--webpack`, or `experimental.turbopackScopeHoisting: false`. The flag
turned out to be the expensive one. Production builds of `main`, medians of 3
automated traces:

| Metric | Turbopack | Turbopack, hoisting off | **webpack** |
| --- | --- | --- | --- |
| M1 FCP | 432 ms | 790 ms | **501 ms** |
| M2 first API request | 60 ms | 142 ms | **57 ms** |
| M5 blocking time | 133 ms | 408 ms | **155 ms** |
| M6 JS before FCP | 1038 KB | 1064 KB | **697 KB** |
| Emitted chunk bytes | 49.2 MB | 53.4 MB | **21.4 MB** |
| Build time | 48 s | 41 s | 2.4 min |

Disabling scope hoisting nearly doubles FCP and triples blocking time while barely moving M6 (+2.5%)
— the cost lands in execution, not transfer, so M6 alone would not have caught it. webpack instead
*improves* pre-FCP JS by 341 KB (−33%) over the Turbopack build, more than any single lever in #3566
delivered on its own.

The measurement harness lives in
`.agents/tasks/3566-main-page-loading-perf/tools/` (see its README). Absolute values come from
headless Chromium on a local server and are not comparable to the numbers in that task's spec table;
the within-comparison deltas are what the decision rests on.

## Consequences

- **CI and image builds get slower** — webpack's compile step measured 84 s to 2.4 min across
  machines and cache states, against 41–48 s for Turbopack, so budget roughly 2–3×. Accepted:
  correctness plus a materially smaller bundle outweigh build latency.
- **Dev and production now use different bundlers.** A bug in either pipeline can only be caught on
  that pipeline; production-only breakage will not appear in dev. QA runs against a real image.
- `next.config.js` must keep **both** the `webpack()` and `turbopack` sections in sync — it already
  does, and this decision makes that non-optional.
- webpack surfaces one unresolvable import Turbopack silently tolerates:
  `@react-native-async-storage/async-storage` inside `@metamask/sdk`, reached via
  `@wagmi/connectors` → `@reown/appkit-adapter-wagmi` → `wagmi-config.ts`. It is an optional peer
  dependency of a React Native code path a browser bundle never takes, so `next.config.js` maps it
  to `false` in `resolve.fallback` (an empty module) and the build is warning-free. If a future
  dependency bump introduces a similar optional import, extend that map rather than silencing
  warnings wholesale.
- `next build --webpack` is a compatibility path in Next 16 and may eventually be removed. If that
  happens before Turbopack is fixed, the fallback is `experimental.turbopackScopeHoisting: false`
  and its performance cost.

## Follow-ups

- Report the miscompilation upstream to `vercel/next.js` with a minimal reproduction; the bisect
  boundary and the flag that toggles it are the material.
- Re-test Turbopack on each Next upgrade. If a release fixes it, revisit — Turbopack's build speed
  is worth reclaiming, but only with the M1/M5/M6 numbers above re-measured, not on the release
  notes alone.
