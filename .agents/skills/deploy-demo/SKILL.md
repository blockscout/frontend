---
name: deploy-demo
description: Create a GitHub deployment for the current branch using the deploy-review workflow
argument-hint: "[--preset <envs_preset>] [--variant review|review-2] [--no-build]"
disable-model-invocation: true
---
# Deploy demo

## Prerequisites: GitHub CLI

This workflow uses `gh` to trigger and monitor the deployment workflow. **Follow the check-github-cli skill** first (ensure `gh auth status` succeeds; if not, guide the user to install/configure `gh` and do not proceed). The account needs permission to trigger workflows and read the repository.

## Overview

Create a GitHub deployment for the current branch using `.github/workflows/deploy-review.yml` (workflow name: "Deploy review environment").

One run deploys one demo. Deploying the one or two entries a task's `Demo` row lists — slots, image reuse,
sequencing, how a failed run is read — is [`demo-entries.md`](demo-entries.md), which `finalize-task` and
`create-pr` follow.

## Inputs

Nothing here is inferred from prose. Every input maps to a `workflow_dispatch` input of the workflow file,
which is the single source of truth for valid values — never hardcode them in this skill. A value the
workflow does not list stops the run with the valid options shown.

| Input | Values | Default | Workflow flag |
| --- | --- | --- | --- |
| `--preset <p>` | an `on.workflow_dispatch.inputs.envs_preset.options` entry | the workflow default | `-f envs_preset=<p>` |
| `--variant <v>` | an `on.workflow_dispatch.inputs.variant.options` entry | `review` | `-f variant=<v>` |
| `--no-build` | flag | off (builds a fresh image) | `-f build_image=false` |

```
/deploy-demo                                      workflow defaults: fresh build, default preset, review slot
/deploy-demo --preset base                        base preset, review slot, fresh build
/deploy-demo --preset multichain --variant review-2 --no-build
                                                  second slot, reusing the branch's image
```

`--no-build` needs an image for this branch from a prior successful build. The image tag is
`review-<branch-slug>`, preset- and variant-agnostic: re-pointing a demo to another preset, or deploying
the other variant, reuses it. Only the namespace and hostname (`<variant>-<branch-slug>`) differ per
variant, so the two demos coexist. If unsure whether an image exists, build.

## Steps

_Note:_ In the command output, format all URLs as clickable Markdown links: `[Link Text](URL)`.

### 1. Ensure all changes are pushed to remote

- Check status: `git status`. If there are uncommitted changes, ask the user to commit and push, or run `git add` / `git commit` and then push.
- Push the current branch: `git push origin $(git branch --show-current)` (or `git push` if upstream is set). Abort if push fails.

### 2. Check for an already running deployment for the current branch

- Get current branch: `git branch --show-current`.
- List runs for the deploy-review workflow on this branch that are in progress or queued:
  - `gh run list --workflow=deploy-review.yml --branch <BRANCH> --status in_progress`
  - `gh run list --workflow=deploy-review.yml --branch <BRANCH> --status queued`
- If any run is returned, **abort the command** and tell the user a deployment is already running for this branch (include a link to the run).

### 3. Validate the inputs

Read `.github/workflows/deploy-review.yml` and check each given `--preset` and `--variant` against its
options list. An invalid value: show the valid options and **abort**. An input not given passes no flag,
so the workflow default applies.

### 4. Trigger the workflow and capture the run ID

- Run the workflow from the current branch (from step 1/2), passing only the flags for the inputs given:
  - `gh workflow run deploy-review.yml --ref <BRANCH> [-f envs_preset=<PRESET>] [-f variant=<VARIANT>] [-f build_image=false]`
- The CLI does not print the new run ID. To get it: wait a few seconds, then list the latest run for this workflow and branch: `gh run list --workflow=deploy-review.yml --branch <BRANCH> --limit 1`. Use that run’s ID for the next steps.

### 5. Monitor the workflow until it completes

- Watch the run: `gh run watch <RUN_ID>` (polls until completion).
- Track the outcome: success, failure, or cancelled (from the watch output or from `gh run view <RUN_ID>`).
- When completed, get outputs and deployment URL: `gh run view <RUN_ID>` and, if available, `gh run view <RUN_ID> --log` or job outputs. The deployment URL may appear in the workflow summary or in job outputs; extract it and include it in the notification.

### 6. Send system notifications with results

- **When the workflow is triggered:** Notify the user that the deployment has been started (include a link to the run).
- **When the workflow completes:** Notify with the final status (success, failure, or cancelled), the deployment URL if available, and any other relevant outputs.
- **On failure:** Notify with the error and details (e.g. failed job/step from `gh run view <RUN_ID>` or `gh run view <RUN_ID> --log-failed`).
