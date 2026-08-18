---
name: slack-file
description: >-
  Download Slack attachments by file ID, or upload local files into a Slack thread.
  Use when a Slack message lists Files: whose contents matter, or when posting a
  file to Slack; the MCP connector reports metadata only. Guides Keychain token
  setup if missing.
---

# Slack file

The Slack MCP connector reports attachment metadata only. This skill's script is the download and upload path. Other skills that need Slack file bytes follow this skill.

macOS. The token lives in the Keychain (service `slack-files-token`); the script reads it. Do not print, echo, or pass the token — including via `security … -w`.

## 1. Ready

From **this skill's directory** (the folder that contains this `SKILL.md`):

1. `scripts/slack-file` is executable.
2. Keychain has the service, metadata only: `security find-generic-password -s slack-files-token` (no `-w`).
3. `jq` and `curl` are on `PATH`.

If 2 fails: give the user **Setup** below and stop. Do not store the token yourself.

The sandbox cannot read the Keychain or reach `slack.com` — run the script with those allowed.

**Done when:** every check passes, or the run has stopped for setup.

## 2. Run

File IDs come from `slack_read_thread` as `Files: name.png (ID: F012SSD0KK8, image/png, 393.6 KB)`.

Download — prints local paths; then Read them:

```bash
scripts/slack-file -d <dir> FILE_ID [FILE_ID ...]
```

Upload — `slack_send_message` is text-only; this posts the files. Prints the new file IDs:

```bash
scripts/slack-file up -c CHANNEL_ID [-t THREAD_TS] [-m COMMENT] FILE [FILE ...]
```

If the command fails: ask the user to paste or upload each file. Stop if they decline.

**Done when:** every requested file is a local path (download) or a printed file ID (upload), or the run has stopped.

## Setup

A Slack app with `files:read` (and `files:write` to upload). The Blockscout workspace: [Files Reader](https://blockscout.slack.com/marketplace/A0BMY22GBQR-files-reader).

Then the user stores the token themselves:

```bash
security add-generic-password -a "$USER" -s slack-files-token
```

It prompts. Already exists: add `-U`. `jq`: `brew install jq`.
