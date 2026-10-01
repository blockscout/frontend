# 04 — `check-tag` and the CI gates before the image build

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3747 |
| Blocked by | T03 |

## What to build

A tag that would ship stale ENV docs or re-ship a released PR fails early. `check-tag <tag>` fails when
`docs/ENVS.md` or `docs/DEPRECATED_ENVS.md` at the tag still contain `upcoming`, or when the tag's GitHub
release body lists a PR that already carries a `v*` label. `pre-release.yml` and `release.yml` run it
before `publish_image`; the local commands (T05, T06) run it before pushing.

## Acceptance criteria

- [ ] Pure `findUpcoming(docs)` and `findVersionedPrs(releaseBody, prLabels)` with specs; PR numbers are
      parsed from `/pull/<N>` links and `#N` references in the body.
- [ ] `check-tag <tag>` reads the docs from the checkout, fetches the release by tag (draft or published),
      prints each failure and exits non-zero on any. A tag without a release passes the notes check.
- [ ] `pre-release.yml` and `release.yml` have a `check_tag` job that `publish_image` `needs`.
- [ ] The release body is available when each job runs: `release.yml` fires on `released`; `pre-release.yml`
      fires on the tag push, after T05's `alpha` has re-pointed the draft.

## Leaf worklist

- [ ] 1 `[agent]` Pure checks + specs, `check-tag` subcommand
- [ ] 2 `[agent]` `check_tag` jobs in both workflows
