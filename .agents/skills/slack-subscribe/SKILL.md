---
name: slack-subscribe
description: >-
  Subscribe this session to replies in a Slack thread, then stop; replies are
  forwarded later as cross-session messages. Use after posting a question or a
  demo link to Slack when the run must resume on the colleague's answer, and to
  unsubscribe at teardown. Local Claude Code only.
---

# Slack subscribe

A session **registers interest** in a thread and stops. One other process — the Honk orchestrator — holds the only Slack Socket Mode connection, reads the registry, and forwards each reply into the registered session as a cross-session message. This skill never opens a socket, never polls Slack, and never runs `slack-watch` (a second socket on the same app token swallows events).

Contract: the tuple `(channel, thread_ts, session)`. The pilot stores it in a local file; a later version carries it in the Slack message's `metadata` instead. The commands below do not change.

Every command below runs with the shell at the **repo or worktree root** — the script records its working directory as the `cwd` a headless resume starts in, so the skill directory is the wrong place to run it from.

## 1. Ready

1. `.claude/skills/slack-subscribe/scripts/slack-subscribe` is executable; Node 22+ on `PATH`.
2. This is a local Claude Code session — the script reads `CLAUDE_CODE_SESSION_ID` from the Bash tool's environment. In Cursor or a cloud agent the variable is absent: stop and tell the developer to run this step in local Claude Code.

**Done when:** both hold, or the run has stopped.

## 2. Subscribe, then stop

The thread is `CHANNEL:THREAD_TS` (channel id + parent `ts` from `slack_send_message`) or a permalink — a reply's permalink works too, its `thread_ts` query names the parent.

```bash
.claude/skills/slack-subscribe/scripts/slack-subscribe C0123ABCD:1700000000.000200
.claude/skills/slack-subscribe/scripts/slack-subscribe "https://blockscout.slack.com/archives/C0123ABCD/p1700000000000200"
```

Prints `SUBSCRIBED <channel>:<thread_ts> session=<id>`. Re-running on the same thread is a no-op overwrite. Several threads to watch: one call each, all in this turn.

Once every thread is registered, **end the turn** — once. Nothing else to launch, nothing to await. The reply arrives as a new turn:

```
<cross-session-message from="honk-…">
  reply text · author · channel · thread_ts · ts
</cross-session-message>
```

Act on it per the skill that subscribed, then end the turn again; the other registered threads stay registered. Read the full thread with `slack_read_thread` when the forwarded text is not enough.

**Leave state findable.** If this session is gone when a reply lands, Honk resumes it headless (`claude -p --resume <session_id>`) in the recorded `cwd`. The resumed run has only the transcript, so every artefact the next step needs — branch name, PR link, demo URL, the pending question — must have been stated in the session before stopping.

**Done when:** a `SUBSCRIBED` line is printed per thread and the turn has ended.

## 3. Unsubscribe

At teardown, or when the question is settled:

```bash
.claude/skills/slack-subscribe/scripts/slack-subscribe --remove C0123ABCD:1700000000.000200
```

Prints `REMOVED …` (or `ABSENT …` when it was never registered — also fine).

**Done when:** the line is printed.

## Options

- `--session <id>` — register on behalf of another session (testing the resume path by hand). Default: `CLAUDE_CODE_SESSION_ID`.
- Registry: `~/.claude/channels/honk/watches.json`, a map keyed `channel:thread_ts`. Written atomically; safe to inspect, pointless to edit by hand.
