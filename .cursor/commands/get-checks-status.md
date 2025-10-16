# Get Checks Status

## Overview
Fetch the status of the "Checks" workflow run (workflow file `.github/workflows/checks.yml`) for __current branch__.

## Steps

_Note_ in the command output, format all URLs as clickable Markdown links: `[Link Text](URL)`
1. **Fetch the status of the most recent workflow run**
    - Use the GitHub API to get the workflow status for the *current branch*.
    - If the workflow is pending, subscribe to its completion.
    - If the workflow has failed, retrieve the list of all failed jobs and steps.
    - If the workflow was never run for the current branch, report that and skip other steps.

2. **Report the status with a system notification**
   - Upon workflow completion, notify with the final status (success or failure).
   - In case of failure, notify about the error along with the list of failed jobs and steps.