# 01 — Preset-list sync tool in TypeScript

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3674 |
| Blocked by | none |

## What to build

`pnpm presets:lint` and `pnpm presets:sync` keep working exactly as they do today — check mode exits 1 on
drift and names the file, write mode rewrites the marker-bracketed alias blocks and prints a line per target
— but the tool behind them is TypeScript under `tools/dev-server/sync-presets/`, type-checked by
`pnpm lint:tsc`, exercised by co-located specs, and inside the complexity gate's caps.

The replaced `tools/dev-server/sync-preset-lists.mjs` is deleted. `registry.json` and `envs-rules.json` stay
where they are at the `tools/dev-server/` root — the env fetcher reads the registry too, and that path is a
contract in the Dockerfile, the container entrypoint, several skills and the contributing guide.

## Acceptance criteria

- [x] `pnpm presets:lint` on a clean tree prints the same per-target `✓` lines and exits 0; with a
      hand-edited alias block it prints the same `✗ out of sync:` line plus the trailing "Run
      `pnpm presets:sync`" message and exits 1.
- [x] `pnpm presets:sync` on a clean tree prints `✓ ok` per target and changes nothing; after a registry
      edit it rewrites both targets, prints `✏️  updated`, and a following `presets:lint` passes.
- [x] `.github/workflows/deploy-review.yml` and `.vscode/tasks.json` are byte-identical after a
      `presets:sync` on an unmodified registry.
- [x] A missing or inverted `presets:start` / `presets:end` marker pair still throws naming the target file.
- [x] `pnpm lint:tsc` type-checks the new sources; `tools/dev-server/sync-preset-lists.mjs` no longer exists.
- [x] `pnpm test:vitest` runs the new co-located specs, and
      `./tools/code-complexity/run.sh tools/dev-server/sync-presets` reports every function inside both caps
      with non-zero coverage.
- [x] The compiled output is git-ignored and nothing under it is committed.
- [x] `pnpm dev:preset`, `pnpm dev:local` and `pnpm prod:preset` still fetch envs — `tools/dev-server/fetch.js`
      is emitted where the Dockerfile's `COPY` expects it.

## Details

**Own tsconfig, not the existing one.** `tools/dev-server/tsconfig.json` has no `outDir`, so `fetch.ts`
emits `fetch.js` beside itself, where `fetch.sh`, the Docker build and the container entrypoint expect it.
Adding an `outDir` there relocates that emit and breaks the image; the sync tool gets its own
`tools/dev-server/sync-presets/tsconfig.json` instead. Precedent for the shape: `tools/code-complexity/tsconfig.json`.

**Compile-on-run wrapper.** `tools/code-complexity/run.sh` and `tools/dev-server/fetch.sh` are the two
precedents — resolve own path, `tsc -p`, then `node` the emitted entry, so the tool is callable from any cwd.
The `package.json` scripts become the wrapper plus the existing `--write` flag for `presets:sync`.

**Entry file separate from the module.** The CLI invocation — reading `--write` off `process.argv`, the
per-target console output, `process.exit(1)` — lives in its own entry file, not behind an entry-point guard
inside the module. That is what lets the specs import the block-building and splicing logic without running
it.

**Gitignore.** The existing `/tools/code-complexity/dist/` and `/tools/dev-server/fetch.js` lines are the
placement precedent; both sit under a comment naming what they are.

**Docs.** `tools/dev-server/CONTEXT.md`'s file table has a `sync-preset-lists.mjs` row and a build-artifacts
row — both need updating for the new location. The registry row stays as it is.

## Leaf worklist

- [x] 1 `[agent]` Create `tools/dev-server/sync-presets/` — the module (registry read, target table, block
      build, marker splice) and a separate CLI entry file
- [x] 2 `[agent]` Add its `tsconfig.json` with its own `outDir`, and the compile-on-run `run.sh`
- [x] 3 `[agent]` Write co-located specs: block building per target style, splice against fixture content,
      drift detection, the malformed-marker throw
- [x] 4 `[agent]` Repoint the `presets:sync` / `presets:lint` scripts in `package.json`, gitignore the
      compiled output, delete `tools/dev-server/sync-preset-lists.mjs`
- [x] 5 `[agent]` Update the `tools/dev-server/CONTEXT.md` file table
- [x] 6 `[agent]` Verify: both commands round-trip, `pnpm lint:tsc`, `pnpm test:vitest`, the complexity gate
      on the new folder, and that `pnpm dev:preset <alias>` still fetches envs
