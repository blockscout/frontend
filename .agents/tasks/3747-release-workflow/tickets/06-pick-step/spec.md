# 06 — The pick step and a branch per release

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3747 |
| Blocked by | T05 |

## What to build

`prepare` and `alpha` bring the release branch up to date before they generate notes: they pick every
merged `backport` PR not on the branch yet, then release any `upcoming` the branch carries in a docs commit.
Picking is a step of both commands, not a subcommand. Every release gets its own branch: `prepare vX.Y.Z`
cuts `release/vX.Y.Z` from `main` for a minor or from the line's latest final tag for a patch, so a minor
and a hotfix differ only in the base. `prepare` is the only creator of the pre-release; `alpha` re-points it
and fails when there is none. This reworks T05's `prepare vX.Y` and `alpha`.

## Acceptance criteria

- [ ] Pure `planPicks(backportPrs, branch)` orders by `main` position and counts a PR as on the branch when
      its `main` commit is an ancestor of the branch head or a branch commit's `(cherry picked from commit …)`
      trailer names it; returns picks + skipped. Specs cover ordering, both "on the branch" rules, and
      idempotency (planning again after the picks yields none).
- [ ] `prepare vX.Y.Z [--dry-run]` replaces `prepare vX.Y`: `Z = 0` cuts `release/vX.Y.Z` from `origin/main`;
      `Z > 0` requires the line's latest final tag to be `vX.Y.(Z-1)` and cuts from it. Refuses when the
      branch exists or the line has an open pre-release. Then picks, makes the docs commit, pushes the
      branch, and creates the draft pre-release `vX.Y.Z` with the notes.
- [ ] `alpha <tag> [--dry-run]` infers `release/vX.Y.Z` from the tag, fails before writing anything when the
      release has no pre-release or the line's open pre-release belongs to another version (an open
      `v2.13.0` pre-release is never re-pointed to `v2.13.1-alpha.1`), then picks, makes the docs commit, and runs T05's sequence (check-tag,
      re-point, tag, push branch and tag, watch the run) against the branch head after picking.
- [ ] Both work on the operator's checkout: they require a clean working tree, switch to the release
      branch, and refuse when it has diverged from `origin`. A pick conflict exits non-zero naming the PR
      and the conflicted files and leaves the cherry-pick in progress; the commands never run `--continue`.
      Re-running the same command after the operator continues resumes where it stopped.
- [ ] Picking runs `pnpm lint:tsc` before anything is pushed.
- [ ] The docs commit (`chore: prepare release vX.Y.Z`, `upcoming` → `vX.Y.Z+` in both ENV docs, explicit
      paths, never `git add -A`) is made only when the branch has `upcoming`; a release may get several.
- [ ] Both print the PRs picked and skipped; `--dry-run` prints the planned picks and steps without
      writing. Dry runs against the real repo produce the expected plan for `v2.13.0`.

## Details

- `backport` PRs: merged, labeled `backport`, no `v*` label (T02's exclusion rule), each mapped to its `main`
  squash commit.
- A dry run doesn't cherry-pick, so its notes list only what is already on the branch; the step list
  names the PRs a real run would pick.
- With the branch checked out, the docs commit goes through the checkout; T05's index-only commit was for a
  branch nobody had checked out.
- The `backport` → version-label replacement stays with T02's label workflow at release time; picking never
  touches labels. A PR that was not picked keeps `backport` because the workflow labels only shipped PRs.

## Leaf worklist

- [x] 1 `[agent]` `planPicks` + specs, the pick runner with the conflict stop and the checks
- [x] 2 `[agent]` Branch per release and checkout handling in `prepare` / `alpha`; pick + docs step wired
      into both; `alpha` stops creating a missing pre-release
