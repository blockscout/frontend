# 00 — Shared CLI flag parser for `tools/`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 00 of #3706 |
| Blocked by | none |

## What to build

A prefactor. `tools/code-complexity/index.ts` and `tools/mutation-testing/index.ts` each carry a verbatim copy
of the same flag machinery — the `FlagSpec` union, `splitFlag`, `applyArg`, the `parseArgs` cursor loop, and
the `--help` / `-h` switches. The Playwright tool (ticket 01) needs the same machinery plus one behaviour
neither copy has: unknown flags and positionals are **passed through** to `playwright test` rather than
rejected. Extract the parser into one shared module under `tools/` with that hook, and point both existing
tools at it. No behaviour change for either tool: same flags, same errors, same `--help`.

## Acceptance criteria

- [ ] One module (`tools/cli/flags.ts`) exports the `FlagSpec` type and a generic `parseArgs` that takes the
      argv, a `FLAGS` map, the initial options object, and an unknown-token policy: `'reject'` (throw, as
      today) or `'passthrough'` (collect unknown flags and positionals, in order, into an array the caller
      receives).
- [ ] `tools/code-complexity/index.ts` and `tools/mutation-testing/index.ts` import it; the duplicated
      `splitFlag` / `applyArg` / `parseArgs` bodies are gone from both. Their `FLAGS` maps stay local — the
      flag *surface* is per tool, only the *mechanics* are shared.
- [ ] `tools/code-complexity/tsconfig.json` gets `rootDir: ".."` (as `tools/mutation-testing/tsconfig.json`
      already has) and `run.sh` plus the `CLI_ENTRY_PATH` guard in `index.ts` point at the new
      `dist/code-complexity/index.js` location.
- [ ] The existing `index.spec.ts` in both tools pass unchanged; the shared module has its own co-located
      spec covering the three flag kinds, `--flag=value` vs `--flag value`, the "optional never swallows the
      next token" rule, and both unknown-token policies.
- [ ] `pnpm test:code-complexity --help`, `pnpm test:mutation-testing --help`, and a `--changed` run of each
      still work from the repo root.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm lint:doc-links` clean; both tools' `CONTEXT.md` file maps
      mention the shared module in one line where they list `index.ts`.

## Details

- Keep the per-flag comment style of the existing tables (`// 'switch' — no value at all …`) in the shared
  module; the two `index.ts` files lose that comment block.
- The ignore file already lists both tools' `dist/` folders; nothing to add there.

## Leaf worklist

- [ ] 1 `[agent]` Extract the parser into `tools/cli/flags.ts` with `flags.spec.ts`
- [ ] 2 `[agent]` Rewire `tools/code-complexity` (tsconfig `rootDir`, `run.sh`, entry guard) and
      `tools/mutation-testing` onto it; run both tools' specs and `--help`
- [ ] 3 `[agent]` One-line file-map mentions in both `CONTEXT.md`s; lint + doc-links
