# Create PR

## Overview
Create a well-structured pull request with proper description, labels, and reviewers.

## Steps

_Note_ in the command output, format all URLs as clickable Markdown links: `[Link Text](URL)`

1. **Check that the pull request is not already open in the remote repository**
   - If it is opened, write only PR summary (see step 3) and skip all other steps

2. **Prepare branch**
   - Ensure all changes are committed
   - Push branch to remote
   - Verify branch is up to date with main

3. **Write PR description**
   - Use template from `./docs/PULL_REQUEST_TEMPLATE.md`
   - Check if the branch name contains an issue number (use the regexp `/issue-\d+/`)
     - If found, fetch the issue details using `gh issue view [issue_number]`
     - Include "Resolves #[issue_number]" at the very beginning of the description (in the "Description and Related Issue(s)" section)
   - Summarize the changes clearly and concisely, using no more than two paragraphs. If necessary, use bullet points to highlight the main changes in the codebase.
   - List any changes in the enviroment variables (look at the `./docs/ENVS.md` file) in a separate section, describe purpose of each variable change
      - Bad example: "Added `NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES` environment variable to the documentation"
      - Good example: "Added `NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES` to group transaction fees into one section on the transaction page"
      - Good example: "Extended possible values for `NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS` with set_max_gas_limit to display the maximum gas price set by the transaction sender"
      - Good example: "Introduced a new option, `"fee reception"`, for the `NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE` variable"

4. **Set up PR**
   - Create a pull request with a descriptive title. Use draft mode for the pull request if specified in the prompt.
   - Add appropriate labels
     - If something has added or changed in `./docs/ENVS.md` file, add label "ENVs"
     - If the `package.json` file has changed, add label "dependencies"
     - If the branch name has the issue number (use the regexp `/issue-\d+/`), copy all tags from the related issue

5. **Monitor checks workflow**
   - Wait for the "Checks" workflow (see `.github/workflows/checks.yml`) to start (triggered automatically by PR creation)
   - Watch the workflow run until it completes (use `gh run watch`)
   - Track the workflow status (success or failure)

6. **Send system notification with results**
   - On workflow completion: notify with final status (success/failure)
   - On failure: notify about the error with brief details

