---
name: deploy-demo
description: Create a GitHub deployment for the current branch using the deploy-review workflow
disable-model-invocation: true
---
# Deploy demo

## Prerequisites: GitHub CLI

This workflow uses `gh` to trigger and monitor the deployment workflow. **Follow the check-github-cli skill** first (ensure `gh auth status` succeeds; if not, guide the user to install/configure `gh` and do not proceed). The account needs permission to trigger workflows and read the repository.

## Overview

Create a GitHub deployment for the current branch using `.github/workflows/deploy-review.yml` (workflow name: "Deploy review environment").

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

### 3. Resolve the workflow inputs (all optional)

**Always read `.github/workflows/deploy-review.yml` as the single source of truth for valid option values — never hardcode them in this skill.** The workflow has three `workflow_dispatch` inputs:

**a. `envs_preset`** — which chain's config the demo fetches at startup.
- Allowed values: `on.workflow_dispatch.inputs.envs_preset.options`.
- Infer from the prompt: "deploy a demo for base" / "with base preset" → `base`; "spin up a demo using staging" → `staging`.
- If no preset is mentioned: skip the flag (workflow default).
- Validate against the options list; if invalid, show the valid options and **abort**.

**b. `variant`** — which demo flavor (`on.workflow_dispatch.inputs.variant.options`, e.g. `review` / `review-2`). `review-2` disables ENVs validation (used for multichain).
- Pass `-f variant=review-2` only if the user clearly asks for it ("review-2", "validation-disabled / multichain variant", "second demo"). Otherwise skip (default `review`).
- Validate against the options list; if invalid, **abort**.

**c. `build_image`** — whether to build & publish a fresh image (default `true`).
- The image is preset-agnostic, so **re-pointing an existing demo to a different chain does not need a rebuild**. If the user asks to *redeploy / re-point / switch an existing demo to another preset* ("redeploy it for celo", "switch the demo to base without rebuilding", "re-point to gnosis"), pass `-f build_image=false` — this skips the multi-minute image build and just re-runs the deploy (~1–2 min), changing `ENVS_PRESET` so the pods roll.
- For a first/normal deploy, skip the flag (default `true`, builds fresh).
- **Caveat:** `build_image=false` only works if an image for this branch + `variant` already exists (a prior successful build). If unsure, prefer building. Keep `variant` the same as the original deploy when re-pointing — the image tag and namespace are `<variant>-<branch-slug>`.

### 4. Trigger the workflow and capture the run ID

- Run the workflow from the current branch (from step 1/2), passing only the flags resolved in step 3:
  - `gh workflow run deploy-review.yml --ref <BRANCH> [-f envs_preset=<PRESET>] [-f variant=<VARIANT>] [-f build_image=false]`
  - Examples:
    - First deploy for base: `gh workflow run deploy-review.yml --ref <BRANCH> -f envs_preset=base`
    - Re-point existing demo to celo (no rebuild): `gh workflow run deploy-review.yml --ref <BRANCH> -f build_image=false -f envs_preset=celo`
- The CLI does not print the new run ID. To get it: wait a few seconds, then list the latest run for this workflow and branch: `gh run list --workflow=deploy-review.yml --branch <BRANCH> --limit 1`. Use that run’s ID for the next steps.

### 5. Monitor the workflow until it completes

- Watch the run: `gh run watch <RUN_ID>` (polls until completion).
- Track the outcome: success, failure, or cancelled (from the watch output or from `gh run view <RUN_ID>`).
- When completed, get outputs and deployment URL: `gh run view <RUN_ID>` and, if available, `gh run view <RUN_ID> --log` or job outputs. The deployment URL may appear in the workflow summary or in job outputs; extract it and include it in the notification.

### 6. Send system notifications with results

- **When the workflow is triggered:** Notify the user that the deployment has been started (include a link to the run).
- **When the workflow completes:** Notify with the final status (success, failure, or cancelled), the deployment URL if available, and any other relevant outputs.
- **On failure:** Notify with the error and details (e.g. failed job/step from `gh run view <RUN_ID>` or `gh run view <RUN_ID> --log-failed`).
