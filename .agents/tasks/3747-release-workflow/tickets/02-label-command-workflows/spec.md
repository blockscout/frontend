# 02 — Commit → PR resolution, the `label` command and the release label workflows

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3747 |
| Blocked by | T01 |

## What to build

Given a tag, the tool knows which PRs it shipped and labels them. `label <tag> --label <name>` resolves
the tag's commit range to PRs (trailer, then `(#N)`, then GitHub association), drops any PR already
carrying a `v*` label, applies the label to the PRs and to their linked issues, and prints the issue list
for the project-cards job. `release.yml`, `pre-release.yml` and `label-issues-in-release.yml` lose their
inline `actions/github-script` logic and call the CLI; the final release removes `pre-release` from PRs
and issues.

## Acceptance criteria

How to verify: `gh workflow run label-issues-in-release.yml --ref issue-3747 -f tag=v2.12.3 -f label_name=v2.12.3 -f dry_run=true`.

- [ ] Pure `resolvePr(commit)` order: `(cherry picked from commit <sha>)` trailer → the source commit's
      `(#N)`; else `(#N)` in the subject; else the association lookup (I/O, injected). Specs cover all three
      and a commit with none.
- [ ] Pure `previousTag(tag, tags)`: `vX.Y.Z` with `Z>0` → `vX.Y.(Z-1)`; `vX.Y.0` → the highest final tag
      with a lower minor; an alpha tag resolves as its final would. Computed from the tag list, not from
      release ordering.
- [ ] `releasePrs(tag)` = PRs of `compare(previousTag...tag)` minus PRs carrying any `v*` label; the
      excluded ones are printed as skipped. Specs cover the exclusion.
- [ ] `label <tag> --label <name> [--description] [--dry-run]` creates the label if missing, labels the PRs
      and their closing issues (keeping today's "issue already in a release" exclusion), prints a JSON issue
      list on stdout for `update-project-cards.yml`.
- [ ] `label <tag> --remove pre-release` removes the label from every PR and issue that carries it.
- [ ] `label-issues-in-release.yml` keeps its `workflow_call` / `workflow_dispatch` contract (inputs, the
      `issues` output) plus a `dry_run` input, and is checkout + install + one CLI call with
      `pull-requests: write`, `issues: write`.
- [ ] `release.yml` calls the remove step and the version-label step; `update_project_cards` still receives
      the issues output. `pre-release.yml` applies `pre-release` only for the initial alpha as today.
- [ ] `(human)` The dry-run dispatch on `v2.12.3` lists the PRs picked into that patch and nothing from
      `main` after the fork.

## Details

- Today's "tag must be the latest release" guard goes away: the previous tag is computed, so a hotfix on
  an older line labels correctly.
- `GH_TOKEN: ${{ github.token }}` on the CLI step; the I/O layer from T01 picks it up.

## Leaf worklist

- [ ] 1 `[agent]` `resolvePr`, `previousTag`, `releasePrs` pure logic + specs
- [ ] 2 `[agent]` `label` subcommand (apply / remove / dry-run)
- [ ] 3 `[agent]` Rewrite `label-issues-in-release.yml`, `release.yml`, `pre-release.yml` around the CLI
