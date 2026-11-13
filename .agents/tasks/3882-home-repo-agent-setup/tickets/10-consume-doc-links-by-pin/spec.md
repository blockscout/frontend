# 10 — `frontend` consumes `doc-links` by pin

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 10 of #3882 |
| Target repo | `frontend` |
| Blocked by | T09 |

## What to build

`frontend` gets `doc-links` as a dependency on home pinned by commit, with no copy of the tool in its
tree. `pnpm lint:doc-links` passes locally and in the Checks workflow, and changing the pin is one
command.

## Acceptance criteria

How to verify: `pnpm install`, `pnpm lint:doc-links`; then run the bump script against a newer home
commit and repeat.

- [ ] `tools/doc-links/` is removed; its `CONTEXT.md` content that is about `frontend`'s use of the tool
  (configuration, what a failure means here) survives in a `frontend` document, the rest lives in home.
- [ ] Home is a dev dependency pinned by commit, and the workspace build allowlist carries the package
  with that exact commit.
- [ ] A bump script changes both places together and reinstalls; it is the one documented way to bump.
- [ ] `pnpm lint:doc-links` runs the installed command and passes locally.
- [ ] The Checks workflow's doc-links step passes on the pull request.
- [ ] Every reference to `tools/doc-links` in the instruction set, docs and configs is updated.
- [ ] `(human)` The new dependency, its build allowlist entry and the install-time cost in CI are
  acceptable.

## Details

- pnpm rejects a name-only allowlist key for a git dependency's `prepare` script; the key carries the
  exact commit, which is why a bump is two edits.
- If CI install time becomes a problem, the fallback is a release tarball built by home's CI; do not
  build it here, record the measured time in `notes.md`.
- `frontend`'s project-specific `doc-links` configuration stays in `frontend`.

## Leaf worklist

- [ ] 1 `[agent]` Add the pinned dependency, allowlist entry and bump script; point `lint:doc-links` at the installed command
- [ ] 2 `[agent]` Remove `tools/doc-links/`, move its `frontend`-specific context, update references
- [ ] 3 `[agent]` Confirm the Checks workflow is green on the pull request and record install time
