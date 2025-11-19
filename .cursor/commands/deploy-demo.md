# Deploy demo

## Overview
Create Github deployment for current branch using `.github/workflows/deploy-review.yml` workflow.

## Steps

_Note_ in the command output, format all URLs as clickable Markdown links: `[Link Text](URL)`

1. **Ensure all changes are pushed to remote**

2. **Check if there is a running deployment workflow for current branch**
    - If yes, abort the command

3. **Detect value for "envs_preset" workflow input**
    - Get all possible options from workflow file
    - Figure out from the prompt with which preset user wants to deploy demo. Examples:
        - "/deploy-demo for base" - preset name "base"
        - "/deploy-demo using main preset" - preset name "main"
        - "/deploy-demo without preset" - preset name "none"
    - Be aware that this input is optional, and if user didn't mention any preset, skip this step completely
    - If the preset is not listed in the worklow input options, notify user and abort the command

4. **Run workflow from the current branch with appropriate inputs**
   - Get the workflow run ID after triggering

5. **Monitor workflow execution**
   - Watch the workflow run until it completes (use `gh run watch`)
   - Track the workflow status (success, failure, cancelled)
   - Once completed, retrieve the workflow outputs and deployment URL

6. **Send system notification with results**
   - On workflow start: notify that deployment has been triggered
   - On workflow completion: notify with final status (success/failure), deployment URL if available, and any relevant outputs
   - On failure: notify about the error with details

