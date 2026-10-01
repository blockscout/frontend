# 06 — `pick` and `publish`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3747 |
| Blocked by | T04 |

## What to build

Backporting and finalising are each one command. `pick vX.Y` lists merged PRs labeled `backport` with no
`v*` label, cherry-picks their `main` squash commits with `-x` in `main` order onto `release/vX.Y`, skips
the ones whose trailer is already on the branch, stops at the first conflict with instructions, and
otherwise runs the checks and pushes. `publish vX.Y.Z` tags the approved alpha commit as `vX.Y.Z`,
turns the line's pre-release into the final release marked latest (firing `release.yml`), and cherry-picks
the prepare docs commit to `main` with `-x`.

## Acceptance criteria

- [ ] Pure `planPicks(backportPrs, branchCommits)` orders by `main` position, marks already-picked PRs
      by trailer, returns picks + skipped; specs cover idempotency and ordering.
- [ ] `pick vX.Y [--dry-run]`: prints skipped PRs; on conflict exits non-zero naming the PR and the
      files, leaving the cherry-pick in progress and never running `--continue`; on success runs `pnpm lint:tsc`
      and pushes.
- [ ] `publish vX.Y.Z [--dry-run]`: requires the latest `vX.Y.Z-alpha.N` tag on the branch; fails on
      `check-tag`; tags that commit, pushes, patches the pre-release to final + latest with the notes
      regenerated; then `git cherry-pick -x` of the prepare docs commit onto `main` and push.
- [ ] `publish` for a patch (`Z>0`) skips the docs cherry-pick when the commit is already on `main`.
- [ ] `--dry-run` on both against the real repo produces the expected plan.

## Details

- The `backport` → version-label replacement is done by T02's label workflow at release time; `pick`
  never touches labels. A PR that was not picked keeps `backport` because the workflow labels only shipped
  PRs.

## Leaf worklist

- [ ] 1 `[agent]` `planPicks` + specs, `pick` subcommand
- [ ] 2 `[agent]` `publish` subcommand
