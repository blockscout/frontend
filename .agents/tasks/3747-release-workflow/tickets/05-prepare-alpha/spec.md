# 05 — `prepare` and `alpha`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3747 |
| Blocked by | T04 |

## What to build

Cutting a release line and publishing an alpha are each one command. `prepare vX.Y` cuts `release/vX.Y`
from `main`, replaces `upcoming` in `docs/ENVS.md` and `docs/DEPRECATED_ENVS.md` with `vX.Y.0+`, commits
`chore: prepare release vX.Y.0` on the branch, pushes it, generates the notes and creates the draft
pre-release for `vX.Y.0`. `alpha vX.Y.Z-alpha.N` infers the branch from the version, runs `check-tag`
locally, tags the branch head, re-points the line's single pre-release to the tag, regenerates its notes,
pushes the tag (firing `pre-release.yml`), waits for the workflow run and reports its result.

## Acceptance criteria

- [ ] `prepare vX.Y [--dry-run]`: refuses if `release/vX.Y` exists; docs commit only on the branch; draft
      pre-release created with the T03 notes and tag name `vX.Y.0`. Dry run prints every step without
      writing.
- [ ] `alpha <tag> [--dry-run]`: version → branch inference (`v2.13.1-alpha.2` → `release/v2.13`); fails
      on `check-tag` before tagging; pushes the tag; updates the existing pre-release (`tag_name`, notes) rather
      than creating a second one; watches the `pre-release.yml` run with `gh run watch --exit-status` and
      prints the run URL.
- [ ] Pure pieces with specs: version parsing / branch inference, `upcoming` replacement, the pre-release
      lookup by line (one per `vX.Y`).
- [ ] `--dry-run` on both against the real repo produces the expected plan for `v2.13`.

## Details

- git operations are `git` shell-outs on the operator's checkout; never `git add -A`.
- `alpha` re-points the pre-release (`tag_name`, notes) **before** it pushes the tag: `pre-release.yml`'s
  `check_tag` job (T04) looks the release up by tag when the push fires it, and finds nothing — so checks
  no notes — while the draft still names the previous tag. A draft may name a tag that does not exist yet.
- The staging Slack request is not part of the CLI; it stays in the skill (T08), fed by the notes' ENV
  section.

## Leaf worklist

- [x] 1 `[agent]` Version / branch / upcoming pure logic + specs
- [x] 2 `[agent]` `prepare` subcommand
- [x] 3 `[agent]` `alpha` subcommand with the run watch
