---
name: slack-watch
description: >-
  Watch Slack threads (DMs and channels) for new replies over a Socket Mode
  WebSocket, printing one line per genuinely-new reply. Use to be notified
  inside a live local Claude Code or Cursor session (not a cloud agent).
---

<!-- cspell:ignore acks xapp xoxp xoxb WXYZ AwaitShell -->

# Slack watch

A push subscription to replies in specific Slack threads — **DM threads and channel threads both**. The script holds one Socket Mode WebSocket, acks every event, and prints one line per new reply — nothing else. It knows nothing about tasks or questions; it filters a thread list you give it and reports. The caller (a session, a skill) decides what a reply means and reads it via the Slack MCP (`slack_read_thread`).

macOS. Three tokens live in the Keychain; the script reads them and never prints them. It does **not** print message content or event payloads — the underlying `message.im` feed is a DM firehose. DMs are watched with the developer's **user** token; channels are watched with the **bot** token, which only sees channels the Honk bot was invited into (so no firehose there). A single Socket Mode connection carries both the bot and user events.

## 1. Ready

From **this skill's directory** (the folder that contains this `SKILL.md`):

1. `scripts/slack-watch` is executable.
2. Keychain has all three services, metadata only (no `-w`):
   - `security find-generic-password -s slack-orchestrator-app-token`
   - `security find-generic-password -s slack-orchestrator-user-token`
   - `security find-generic-password -s slack-orchestrator-bot-token`
3. Node 22+ is on `PATH` (`node --version`) — the script uses the built-in `WebSocket` and `fetch`, no npm deps.

If 2 fails: give the user **Setup** below and stop. Do not store the tokens yourself.

**Local session only** — the Keychain and the socket both live on this Mac. If you are a cloud agent, stop and tell the developer to run this in local Claude Code or Cursor.

**Done when:** every check passes, or the run has stopped for setup (or cloud).

## 2. Run

Each watched thread is one `CHANNEL:THREAD_TS` argv item — the channel id (a DM is `D…`, a channel `C…`, a private group `G…`) and the parent `ts`, both from the `slack_send_message` / permalink you already hold. The script routes each by its id prefix; channel threads only report if the Honk bot is a member of that channel.

Launch so each stdout line wakes this session. Use the recipe whose tools you have.

### Claude Code

`Monitor` with `persistent: true`. The sandbox cannot read the Keychain or reach `slack.com` — allow both on that Monitor.

```
Monitor(
  command: "scripts/slack-watch C0123ABCD:1700000000.000200 D0456WXYZ:1700000100.000700",
  description: "Slack reply watcher",
  persistent: true,
)
```

Give the absolute path to `scripts/slack-watch` if Monitor's working directory is not this skill's directory.

### Cursor (local IDE)

Background `Shell` (`block_until_ms: 0`) with `notify_on_output` and `required_permissions: ["all"]` (Keychain + `slack.com`). Cursor floors notification debounce at 5s — two `NEW` lines in one burst may arrive as one wake; on wake, read the terminal output and handle every `NEW` line, not only the last.

```
Shell(
  command: "<absolute>/scripts/slack-watch C0123ABCD:1700000000.000200 D0456WXYZ:1700000100.000700",
  description: "Slack reply watcher",
  block_until_ms: 0,
  required_permissions: ["all"],
  notify_on_output: { pattern: "^NEW |^RECONNECTED", reason: "Slack reply" },
)
```

Use the absolute path. Smoke-check the terminal output file once so a failed start is not silent.

### Output lines

- `NEW channel=<C…> thread_ts=<ts> ts=<ts>` — a new reply landed (or was missed during downtime and reconciled on reconnect). Read it with `slack_read_thread` on that `thread_ts`. Our own messages — the developer's **and** the Honk bot's, including agent follow-ups posted as either — and the thread's pre-existing history are **not** reported.
- `RECONNECTED` — the socket re-opened after a drop; a catch-up for every watched thread has just run, so any `NEW` lines around it are the replies missed while it was down.

Diagnostics (auth or reconnect failures) go to stderr — Claude's Monitor output file, or Cursor's terminal file; Read it if the watcher seems quiet.

### Changing the watched set

All state lives in the process (thread list, per-thread last-seen `ts`, `event_id` dedupe). There is no state file. To add or remove a thread, **stop and relaunch** with the new argument list.

- Claude Code: `TaskStop` on that Monitor, then launch again.
- Cursor: kill the PID in that shell's header, `AwaitShell` so the completion ping is consumed, then launch again.

Re-spawning re-baselines to "from now" — earlier replies are already in the session transcript, so nothing is double-reported.

**Done when:** the watcher is running and reporting, or the run has stopped for setup.

## Setup

One private Slack app in the Blockscout workspace (**api.slack.com/apps → your app**), carrying three tokens. Enable the bot user **Honk** 🪿 (`honk`) under **App Home** first — it is both the channel-reading identity and the disclosure identity.

- **App-level token** (`xapp-`), scope `connections:write` — created under **Socket Mode → toggle on → generate token**. Opens the WebSocket.
- **User token** (`xoxp-`), **User Token Scopes** `im:history` + `chat:write`. Under **Event Subscriptions → on behalf of users**, subscribe **`message.im` only** — not `message.channels` / `message.groups` (that is a firehose on a user token). Reads DM replies and posts in the developer's own voice.
- **Bot token** (`xoxb-`), **Bot Token Scopes** `channels:history` (add `groups:history` for private channels) + `chat:write`. Under **Event Subscriptions → bot events**, subscribe **`message.channels`** (and `message.groups` for private channels). Bot events fire only for channels the bot is a member of, so **invite Honk to each question channel** (`/invite @Honk`) — that is what scopes the channel feed instead of firehosing.

Store all three in the Keychain yourself (the script never writes them):

```bash
security add-generic-password -U -s slack-orchestrator-app-token  -a "$USER" -w   # prompts for xapp-…
security add-generic-password -U -s slack-orchestrator-user-token -a "$USER" -w   # prompts for xoxp-…
security add-generic-password -U -s slack-orchestrator-bot-token  -a "$USER" -w   # prompts for xoxb-…
```
