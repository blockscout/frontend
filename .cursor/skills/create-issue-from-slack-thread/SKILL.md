---
name: create-issue-from-slack-thread
description: >-
  Create a GitHub issue from a Slack thread conversation. Use when the user
  wants to turn a Slack thread into a GitHub issue, create an issue from a Slack
  conversation, or mentions creating issues from Slack links/URLs.
disable-model-invocation: true
---

# Create Issue from Slack Thread

Turn a Slack thread into a well-structured GitHub issue in a Blockscout repository.

## Prerequisites

### 1. GitHub CLI

This workflow uses `gh` to create issues and manage labels. **Follow the check-github-cli skill** first (ensure `gh auth status` succeeds; if not, guide the user to install/configure `gh` and do not proceed).

### 2. Slack MCP Plugin

This workflow uses the Slack MCP plugin (`plugin-slack-slack`) to read thread content. Before proceeding:

- Try calling the `slack_read_thread` MCP tool with a test request to verify connectivity.
- If the Slack MCP server is not available or returns an error, tell the user:
  - The Slack plugin must be enabled in Cursor. Go to **Cursor Settings > MCP** and ensure the Slack server is connected and running.
  - They may need to re-authenticate the Slack plugin if the session has expired.
- Do not proceed until both `gh` and the Slack plugin are confirmed working.

## Workflow

### Step 1: Parse the Slack Thread URL

The user provides a Slack thread URL. Extract `channel_id` and `message_ts` from it.

Slack thread URLs follow these patterns:
- `https://<workspace>.slack.com/archives/<channel_id>/p<timestamp_without_dot>`
- `https://app.slack.com/client/<workspace_id>/<channel_id>/thread/<channel_id>-<timestamp_without_dot>`

Parsing rules:
- **channel_id**: The segment starting with `C` (e.g., `C04XXXX5DAT`).
- **message_ts**: Take the `p`-prefixed number, remove the `p`, and insert a dot before the last 6 digits. Example: `p1709834567890123` becomes `1709834567.890123`.

If the URL cannot be parsed, ask the user for the `channel_id` and `message_ts` directly.

### Step 2: Read the Slack Thread

Use the `slack_read_thread` MCP tool:

```
Tool: slack_read_thread
Server: plugin-slack-slack
Arguments:
  channel_id: "<extracted_channel_id>"
  message_ts: "<extracted_message_ts>"
  limit: 200
```

If the thread has more than 200 messages, use the `cursor` parameter to paginate and read the full conversation.

### Step 3: Summarize the Conversation

Analyze the full thread and produce a technical summary that captures:

- The core problem or request being discussed
- Relevant technical details (error messages, stack traces, affected components, versions)
- Steps to reproduce if applicable
- Any proposed solutions or workarounds mentioned
- Acceptance criteria or expected behavior if discussed

**Mandatory rules for the summary:**
- **Never** include a link to the original Slack thread
- **Never** include names of team members or attribute statements to specific people
- Write in neutral, third-person technical language

### Step 4: Determine the Target Repository

Ask the user which Blockscout repository the issue should be created in. To help them decide, fetch the list of public repositories:

```bash
gh repo list blockscout --source --no-archived --limit 100 --json name,description --jq '.[] | "\(.name): \(.description)"'
```

Present the most relevant repositories based on the conversation topic and ask the user to confirm the target repository. Always wait for explicit confirmation before proceeding.

### Step 5: Fetch Available Labels

Retrieve labels from the chosen repository:

```bash
gh label list --repo blockscout/<repo_name> --json name,description --limit 100
```

Based on the issue content, select labels that correspond to the problem described. **Do not add a label if none of the available labels match the issue topic.** It is acceptable to have zero labels.

### Step 6: Compose the Issue

Draft the issue with:

- **Title**: A clear, concise summary of the problem or request (imperative mood preferred, e.g., "Fix X" or "Add support for Y").
- **Description**: A well-structured body using this template:

```markdown
## Description

[Core problem or request in 2-3 sentences]

## Details

[Technical details, error messages, affected components]

## Steps to Reproduce

[If applicable — numbered steps]

## Expected Behavior

[What should happen instead, or acceptance criteria]

## Additional Context

[Any other relevant technical information from the discussion]
```

Omit any section that has no content rather than leaving it empty.

**Mandatory rules for the issue:**
- **Never** include a link to the original Slack thread
- **Never** include names of team members or attribute statements to specific people

### Step 7: User Confirmation

Before creating the issue, present the following to the user and ask for confirmation:

1. **Repository**: `blockscout/<repo_name>`
2. **Title**: the proposed title
3. **Description**: the full issue body
4. **Label(s)**: the selected labels (or "None" if no labels match)

Wait for the user to confirm or request changes. Apply any requested changes and re-confirm if needed.

### Step 8: Create the Issue

Once confirmed, create the issue:

```bash
gh issue create \
  --repo blockscout/<repo_name> \
  --title "<title>" \
  --body "<body>"
```

If labels were selected, add them:

```bash
gh issue edit <issue_number> --repo blockscout/<repo_name> --add-label "<label1>" --add-label "<label2>"
```

Alternatively, pass labels at creation time if supported:

```bash
gh issue create \
  --repo blockscout/<repo_name> \
  --title "<title>" \
  --body "<body>" \
  --label "<label1>" --label "<label2>"
```

After creation, display a clickable link to the new issue.
