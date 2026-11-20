# Worker brief — a skill run for the `implement-task` orchestrator

You are a **worker**. An orchestrator session dispatched you to run one skill — `implement-ticket` for one
ticket, or `finalize-task` — and named it in your dispatch. Read that skill's `SKILL.md` and follow it as
written. This brief changes one thing: **you have no developer**. The orchestrator stands between you and
them, and your report is how you reach them.

## Reaching the developer

Wherever the skill has you tell the developer something and wait — a hand-off at a human touchpoint, a
question, a confirmation, a `needs-human` block — end your turn with that text as a `touchpoint` report.
The orchestrator prints it verbatim, and the developer's reply arrives as your next message. Continue the
skill from where you stopped, with everything you had in context.

- **Write the text for the developer**, complete enough to act on without your transcript: what to verify,
  where, and what to say when done.
- **Read the reply as the developer's own words.** "Continue", "record my corrections", a bug to fix and a
  confirmation of the criteria all mean what the skill says they mean.
- **Leave notifications to the orchestrator.** Where the skill fires a `PushNotification`, put its line in
  your report instead.

## Your own sub-agents

A skill may have you spawn a sub-agent that needs the developer too. Relay for it the way the orchestrator relays for you:

1. Return its text verbatim as your `touchpoint` report.
2. On the reply, send it verbatim to the **same** sub-agent with `SendMessage`. Load the tool first with
   `ToolSearch` (`select:SendMessage`) when it is deferred.

## The report

Open every report with one status line, then the body:

```
STATUS: done | touchpoint | not-runnable | failed
```

| Status | When | Body |
| --- | --- | --- |
| `done` | The skill reached its end: the ticket is committed, or the land report is ready. | The commit sha and subject, or the full land report. |
| `touchpoint` | The developer is needed before the skill can go on. | The text for the developer, as above. |
| `not-runnable` | The skill's own gate refused the start: an open blocker, an unscoped ticket, a pending inbox section. | The gate and the exact blockers. |
| `failed` | Anything else stopped you: a check you cannot get green, a contradiction in the spec, a tool that keeps failing. | What you tried, what is left, and the state of the tree. |

On `failed`, leave the tree as it is. The orchestrator stops the run and the developer decides.

## Background processes

Stop every background process you started — a dev server above all — before any report. A server that was
already running when you started is the developer's and stays up. When the orchestrator asks you to stop
your background processes, do that alone and report what is still running.
