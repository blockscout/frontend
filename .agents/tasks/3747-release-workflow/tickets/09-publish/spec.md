# 09 — `publish`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 09 of #3747 |
| Blocked by | T06 |

## What to build

Finalising a release is one command. `publish vX.Y.Z` tags the approved alpha commit as `vX.Y.Z`, turns
the release's pre-release into the final release marked latest (firing `release.yml`), and cherry-picks the
release's docs commits to `main` with `-x`.

## Acceptance criteria

- [ ] `publish vX.Y.Z [--dry-run]`: requires the latest `vX.Y.Z-alpha.N` tag on `release/vX.Y.Z`; fails on
      `check-tag`; tags that commit, pushes, patches the pre-release to final + latest with the notes
      regenerated.
- [ ] Then cherry-picks with `-x` every docs commit of the release (subject `chore: prepare release
      vX.Y.Z`, in `<previous tag>..vX.Y.Z`) onto `main` and pushes; skips one whose trailer is already on
      `main`, so a re-run after a partial failure is safe; does nothing when the release has none.
- [ ] A docs cherry-pick conflict stops like a pick conflict (T06): non-zero exit naming the commit and the
      files, cherry-pick left in progress, never `--continue`.
- [ ] `--dry-run` against the real repo produces the expected plan.

## Details

- The final release's labels (`vX.Y.Z` added, `pre-release` removed) come from T02's label workflow fired by
  `release.yml`; `publish` never touches labels.

## Leaf worklist

- [x] 1 `[agent]` `publish` subcommand
