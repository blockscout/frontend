---
name: slack-watch
description: >-
  Watch Slack threads for new replies over a Socket Mode WebSocket, printing one
  line per genuinely-new reply. Use to be notified — inside a live session, under
  the Monitor tool.
---

<!-- cspell:ignore acks xapp xoxp WXYZ -->

# Slack watch

A push subscription to replies in specific Slack threads. The script holds a Socket Mode WebSocket, acks every event, and prints one line per new reply — nothing else. It knows nothing about tasks or questions; it filters a thread list you give it and reports. The caller (a session, a skill) decides what a reply means and reads it via the Slack MCP (`slack_read_thread`).

macOS. Two tokens live in the Keychain; the script reads them and never prints them. It does **not** print message content or event payloads — the underlying `message.im` feed is a DM firehose.

## 1. Ready

From **this skill's directory** (the folder that contains this `SKILL.md`):

1. `scripts/slack-watch` is executable.
2. Keychain has both services, metadata only (no `-w`):
   - `security find-generic-password -s slack-orchestrator-app-token`
   - `security find-generic-password -s slack-orchestrator-user-token`
3. Node 22+ is on `PATH` (`node --version`) — the script uses the built-in `WebSocket` and `fetch`, no npm deps.

If 2 fails: give the user **Setup** below and stop. Do not store the tokens yourself.

The sandbox cannot read the Keychain or reach `slack.com` — run under the Monitor tool with those allowed.

**Done when:** every check passes, or the run has stopped for setup.

## 2. Run

Each watched thread is one `CHANNEL:THREAD_TS` argv item — the channel id (a DM is `D…`) and the parent `ts`, both from the `slack_send_message` / permalink you already hold. Launch it under **`Monitor` with `persistent: true`** so each printed line becomes an in-session notification for the lifetime of the session:

```
Monitor(
  command: "scripts/slack-watch C0123ABCD:1700000000.000200 D0456WXYZ:1700000100.000700",
  description: "Slack reply watcher",
  persistent: true,
)
```

Give the absolute path to `scripts/slack-watch` if the Monitor's working directory is not this skill's directory.

### Output lines

- `NEW channel=<C…> thread_ts=<ts> ts=<ts>` — a new reply landed (or was missed during downtime and reconciled on reconnect). Read it with `slack_read_thread` on that `thread_ts`. Own messages (the developer's, including agent follow-ups posted as them) and the thread's pre-existing history are **not** reported.
- `RECONNECTED` — the socket re-opened after a drop; a catch-up for every watched thread has just run, so any `NEW` lines around it are the replies missed while it was down.

Diagnostics (auth or reconnect failures) go to stderr — Monitor's output file, not notifications; Read it if the watcher seems quiet.

### Changing the watched set

All state lives in the process (thread list, per-thread last-seen `ts`, `event_id` dedupe). There is no state file. To add or remove a thread, **stop the Monitor (`TaskStop`) and relaunch** with the new argument list. Re-spawning re-baselines to "from now" — earlier replies are already in the session transcript, so nothing is double-reported.

**Done when:** the Monitor is running and reporting, or the run has stopped for setup.

## Setup

One private Slack app in the Blockscout workspace (**api.slack.com/apps → your app**), carrying two tokens:

- **App-level token** (`xapp-`), scope `connections:write` — created under **Socket Mode → toggle on → generate token**. Opens the WebSocket.
- **User token** (`xoxp-`), **User Token Scopes** `im:history` + `chat:write`. Under **Event Subscriptions → on behalf of users**, subscribe **`message.im` only** — not `message.channels` / `message.groups` (that is a firehose on a user token). Reads replies for catch-up and posts in the developer's own voice.

Store both in the Keychain yourself (the script never writes them):

```bash
security add-generic-password -U -s slack-orchestrator-app-token  -a "$USER" -w   # prompts for xapp-…
security add-generic-password -U -s slack-orchestrator-user-token -a "$USER" -w   # prompts for xoxp-…
```

The bot user is **Honk** 🪿 (`honk`) — enable it under **App Home** so the disclosure identity exists.
