---
name: release
description: Run one phase of a release — prepare, alpha or publish — through the release CLI, stopping at the operator's checkpoints
disable-model-invocation: true
argument-hint: prepare <vX.Y.Z> | alpha <vX.Y.Z-alpha.N> | publish <vX.Y.Z>
---
# Release

`/release prepare vX.Y.Z` · `/release alpha vX.Y.Z-alpha.N` · `/release publish vX.Y.Z`

Which phase to run, and the release model behind it, is `docs/RELEASING.md`; what a phase does is
`pnpm release --help`. This skill adds only the points where the operator decides. One run is one phase;
the operator invokes the next phase when they are ready for it.

## Prerequisites

- **Follow the `check-github-cli` skill** first; the CLI uses the operator's `gh` auth to read and write
  releases.
- A clean working tree on the operator's checkout: `prepare` and `alpha` switch it to the release branch,
  `publish` also to `main`. The CLI refuses a dirty tree.

Every phase command is a long foreground process: `alpha` and `publish` end by watching a CI run of about
30 minutes. Run them with `run_in_background: true` and report when they exit; the operator keeps the
session.

## A pick conflict — `prepare` and `alpha`

Both phases cherry-pick the `backport` PRs onto the release branch and stop at the first conflict, with the
cherry-pick left in progress and the files named in the error.

1. Show the conflict: the PR, the files, the conflicting hunks.
2. Resolve it, with a one-line reason per file (a modify/delete conflict is usually a refactoring on `main`
   touching a file the branch lacks, resolved by dropping the file).
3. Show the resolved diff (`git diff` of the staged resolution) and **wait for the operator's approval**.
4. After approval only: `git cherry-pick --continue`, then **re-run the same command**, which resumes
   after this pick.

The CLI pushes; the agent never pushes a release branch, a tag or `main` by hand.

## `prepare vX.Y.Z`

Run `pnpm release prepare vX.Y.Z`. When it exits, hand off; the next phase is the operator's to invoke:

- The draft pre-release URL from the command's output, to review and edit the notes on GitHub.
- The docs diff: `git diff <start>..HEAD -- docs/`, `<start>` being the cut point the command printed
  (`origin/main` for a minor, the previous final tag for a patch).
- The PRs the command skipped, from its report, in case one was expected in the release.

## `alpha vX.Y.Z-alpha.N`

Before running, the operator has reviewed the draft release and the docs diff of `prepare` (or of the
previous alpha). Run `pnpm release alpha vX.Y.Z-alpha.N` in the background. When it exits:

- **Tag check failed** — nothing was tagged or pushed. Report the failures; they are the operator's to fix
  on `main` (a PR with the `backport` label, picked by the next run) or on the release branch (docs only).
- **CI run failed** — report the failing job with the run URL and stop. No Slack message.
- **Passed** — request the staging roll-up in Slack, from `./slack-message-template.md` in this directory:
  the alpha tag, the pre-release URL from the command's output, and the breaking-ENV list derived per the
  template's rule from the "Changes in ENV variables" section of the notes (`pnpm release notes
  vX.Y.Z-alpha.N`, or the release page). **Draft first**, show the rendered message and send only once the
  operator approves it.

## `publish vX.Y.Z`

The operator invokes it once QA has approved the staging build; the branch head must be the latest alpha.
Run `pnpm release publish vX.Y.Z` in the background.

- A docs cherry-pick onto `main` can conflict; it is the same stop as a pick conflict above — approve the
  resolved diff, `git cherry-pick --continue`, re-run the same command, which skips the tag and the release
  already on GitHub.
- When it exits, report the release URL and the CI run; on a failed run, the failing job with its URL.

## A hotfix

The same three phases with `Z > 0`; where the branch is cut from, and how a fix found on staging reaches
the open release, is the decision table in `docs/RELEASING.md`.
