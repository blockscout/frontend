# 01 — Shared `clusterConfig()` accessor

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 01 of #3855 |
| Blocked by | none |

## What to build

A behaviour-preserving prefactor. The read of the generated cluster config (browser global or server file)
moves out of the Multichain explorer feature into the shared external-chains module as `clusterConfig()`,
with its Node.js half beside it. It returns a value whenever the config exists and knows neither feature
flag. `multichainConfig()` stays at its import path and becomes a wrapper that returns `clusterConfig()`
only when the Multichain explorer is enabled, so every existing call site behaves as before and it stays
`undefined` on a single-chain instance. The startup script that preloads the config follows the move.

## Acceptance criteria

- [x] `clusterConfig()` lives in `src/shared/external-chains`, with the Node.js file reader beside it, and
      branches on no feature flag.
- [x] `multichainConfig()` keeps its import path and returns `undefined` unless the Multichain explorer is
      enabled; no call site of it changes.
- [x] `startup.node.ts` preloads through the moved Node.js module.
- [x] Unit tests cover both accessors: config present / absent, Multichain explorer on / off.
- [x] Existing unit tests that stub `__multichainConfig` pass unchanged.

## Details

- The spec's "Implementation decisions" → "Shared accessor" and "Types stay put" govern: the cluster config
  types remain in the Multichain explorer feature (#3909).
- Today's implementation: `src/features/multichain/chains-config` (`index.ts`, `config.nodejs.ts`).
- The browser global's name and the generated file's path do not change.

## Leaf worklist

- [x] 1 `[agent]` Move the accessor and its Node.js half to shared, turn `multichainConfig()` into the wrapper, repoint `startup.node.ts`
- [x] 2 `[agent]` Unit tests for `clusterConfig()` and the wrapper
