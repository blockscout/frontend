# TypeScript 7 for type-checking, TypeScript 6 for tooling

| | |
| --- | --- |
| Status | Accepted |

## Decision

TypeScript 7 ships `tsc` without the compiler API that `typescript-eslint`, `vite-plugin-dts` and Next's build-time check need, so `@typescript/native` (TS 7) backs `pnpm lint:tsc` while the `typescript` name stays on the `@typescript/typescript6` alias. To have one checker instead of two, `pnpm build` runs `lint:tsc` first and Next's own check is off (`typescript.ignoreBuildErrors`); pointing Next at the CLI instead would not help, since it resolves the binary through the `typescript` name and would run `tsc6`. Collapse to a single `typescript@7` once TS 7.1 is stable and `typescript-eslint` ([#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)) and `vite-plugin-dts` support it. Replaces the `useTypeScriptCli: false` consequence of [0003](0003-turbopack-for-production-builds.md).
