# 04 — implementation notes

## Manual dispatch of `Checks` on the branch

Run: https://github.com/blockscout/frontend/actions/runs/34971982720 (`gh workflow run checks.yml --ref
issue-3706`). Conclusion: success. `pw_changes` skipped (not a `pull_request` event), so every matrix job
ran the full project without `--changed`; no "Install git-lfs" step in any matrix job; the five blob
artifacts merged into one report.

| Job | Command | Tests | Wall time |
| --- | --- | --- | --- |
| default-1 | `pnpm test:pw --project=default --shard=1/3 --pass-with-no-tests` | 241 (238 passed, 2 flaky, 1 skipped) | 9m16s |
| default-2 | `… --shard=2/3 …` | 240 (232 passed, 8 skipped) | 8m55s |
| default-3 | `… --shard=3/3 …` | 240 (238 passed, 2 skipped) | 9m17s |
| mobile | `pnpm test:pw --project=mobile --pass-with-no-tests` | 151 (145 passed, 1 flaky, 5 skipped) | 8m05s |
| dark-color-mode | `pnpm test:pw --project=dark-color-mode --pass-with-no-tests` | 182 (175 passed, 3 flaky, 4 skipped) | 6m05s |

Wall time is job start to end, including container pull, checkout, and install (~3 min of each). The
Playwright run itself was 6.0m / 5.8m / 6.2m for the shards versus 4.9m and 3.4m for the other two.

## What was not verified here

The `pull_request` path of the gate (`pw_changes` succeeding and printing the changed-file list, then the
matrix running with `--changed`) needs a push to a non-draft PR; #3707 is still a draft, so that run
happens when the PR is marked ready for review.
