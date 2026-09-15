# 04 — CI: no-install gate, five-way matrix, and removal of `deploy/tools/affected-tests`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3706 |
| Blocked by | T02 |

## What to build

On a pull request, `checks.yml` decides in seconds whether Playwright needs to run at all, then runs it
across five balanced jobs that each select their own affected tests with `pnpm test:pw --changed`. The
`pw_affected_tests` job becomes `pw_changes`: checkout with history, no dependency install, one shell step
that diffs the merge-base against the four watched paths and exposes `has_changes`. The matrix becomes an
`include` of `default` ×3 shards, `mobile`, `dark-color-mode`, each skipped when `has_changes` is false,
each without git-lfs or the duplicate pnpm cache. Pre-release (`workflow_call`) and manual dispatch keep
running the full suite. With CI no longer consuming it, `deploy/tools/affected-tests` and everything that
referenced it are deleted.

## Acceptance criteria

- [ ] `pw_changes` job: `if: github.event_name == 'pull_request'`, `actions/checkout@v4` with
      `fetch-depth: 0`, no pnpm/node setup, one step that runs `git diff --name-only $(git merge-base
      origin/main HEAD) -- src playwright playwright-ct.config.ts pnpm-lock.yaml`, prints the list, and
      writes `has_changes=true|false` to `$GITHUB_OUTPUT`; declared as a job `outputs`. A comment above the
      path list pairs it with `FORCE_FULL_PATHS` in `tools/playwright/config.ts`.
- [ ] `pw_tests`: `needs: [code_quality, envs_validation, pw_changes]`; `if:` is `always()` with the two
      upstream successes and `(needs.pw_changes.result == 'skipped' || (needs.pw_changes.result == 'success'
      && needs.pw_changes.outputs.has_changes == 'true'))`.
- [ ] `strategy.matrix.include` has five entries with `name` and `project` (+ `shard` for `default-1..3`,
      `1/3`…`3/3`); the job title uses `matrix.name`; the blob artifact is `blob-report-${{ matrix.name }}`
      so shards do not collide.
- [ ] Run step: `pnpm test:pw ${{ github.event_name == 'pull_request' && '--changed' || '' }}
      --project=${{ matrix.project }} ${{ matrix.shard && format('--shard={0}', matrix.shard) || '' }}
      --pass-with-no-tests`, `HOME: /root` kept. The `PW_PROJECT` env and the `--affected` flag are gone.
- [ ] Matrix checkout is `actions/checkout@v4` with `fetch-depth: 0` and no `lfs`; the "Install git-lfs"
      step is removed; `pnpm/action-setup` has no `cache: true` (the `setup-node` pnpm cache stays). The
      "Download affected tests list" step is removed.
- [ ] `pw_report` unchanged except it still merges whatever `blob-report-*` artifacts exist (the
      `has_reports` guard already handles zero).
- [ ] The comment in `playwright-ct.config.ts` above `projects` ("when adding or deleting a project, update
      the github workflow") still holds; extend it to mention the shard count.
- [ ] `deploy/tools/affected-tests/` deleted; its entry removed from `pnpm-workspace.yaml`, the
      `test:pw:detect-affected` script from `package.json`, `/playwright/affected-tests.txt` from the ignore
      file, the "pw: detect affected" task and the `--affected` input option from `.vscode/tasks.json`;
      `pnpm install --frozen-lockfile` succeeds and `pnpm-lock.yaml` drops the workspace importer.
- [ ] A `workflow_dispatch` run of `Checks` on the branch (`gh workflow run checks.yml --ref issue-3706`,
      then `gh run watch`) shows: five Playwright jobs, no git-lfs step, `pw_changes` skipped (not a PR),
      full run. Recorded in `notes.md` with the run URL. If the PR is already open and not draft, a push also
      shows `pw_changes` succeeding with the changed-file list.

## Details

- A `workflow_call` from `pre-release.yml` inherits the caller's `github.event_name` (`push` /
  `workflow_dispatch`), so the `pull_request` conditions above correctly yield a full run there.
- `git merge-base` in the gate needs `origin/main` to exist locally; `fetch-depth: 0` fetches all branches
  by default, which is what the existing `vitest_tests` job relies on too.
- Runner minutes: the gate is ~20 s; a skipped matrix costs nothing.

## Leaf worklist

- [ ] 1 `[agent]` `checks.yml`: `pw_changes` gate, matrix `include`, run command, lfs/cache removal,
      artifact names
- [ ] 2 `[agent]` Delete `deploy/tools/affected-tests` and its references; reinstall; update the
      `projects` comment in `playwright-ct.config.ts`
- [ ] 3 `[agent]` Dispatch the workflow on the branch, watch it, record the run in `notes.md`; lint
