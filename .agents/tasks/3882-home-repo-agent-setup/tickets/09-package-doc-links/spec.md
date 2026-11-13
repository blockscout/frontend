# 09 — Package `doc-links` for install from home

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 09 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T01 |

## What to build

Home is installable as a pnpm git dependency that exposes a `doc-links` command. The command is built by
the package's `prepare` script at install; no build output is committed. Home's version of the tool is
current with `frontend`'s, so ticket 10 can delete `frontend`'s copy without losing behaviour.

## Acceptance criteria

- [ ] Home's `doc-links` source and specs include every change `frontend`'s `tools/doc-links` has that
  home's does not.
- [ ] The package declares the `doc-links` binary and a `prepare` script that builds it; `dist` is
  ignored and not tracked.
- [ ] In a scratch consumer, installing home by commit from its GitHub URL (with the build allowlist
  entry) builds the tool, and `pnpm exec doc-links` checks that consumer's documents and reports a
  deliberately broken link.
- [ ] The tool resolves the consumer's root from where it is run, not from its own location in
  `node_modules`.
- [ ] Home's Checks workflow runs type-check, the tool's specs and `doc-links` on home itself, and is green.

## Details

- pnpm prepares a git dependency with npm when the package has a `package-lock.json`; keep or drop the
  lockfile deliberately and note which in the tool's `CONTEXT.md`.
- The tool has no runtime dependencies; keep it that way (the parent spec excludes tools that have them).
- Findings from the earlier delivery probe are in `.ai/handoffs/2026-11-13-home-repo-probes.md` (main
  developer's notes).

## Leaf worklist

- [ ] 1 `[agent]` Sync the tool from `frontend`; untrack the build output
- [ ] 2 `[agent]` Binary, `prepare` build, and root resolution from the consumer
- [ ] 3 `[agent]` Verify in a scratch consumer from the GitHub URL; home Checks green
