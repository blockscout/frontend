# Slack thread pointer

Parse a Slack thread URL and read it with the Slack MCP. If the tool is missing, unauthenticated, or errors, return to the parent skill's paste fallback — Slack is not a hard gate.

## Parse the URL

Patterns:

- `https://<workspace>.slack.com/archives/<channel_id>/p<timestamp_without_dot>`
- `https://app.slack.com/client/<workspace_id>/<channel_id>/thread/<channel_id>-<timestamp_without_dot>`

- **channel_id** — the segment starting with `C` (e.g. `C04XXXX5DAT`).
- **message_ts** — take the `p`-prefixed number, drop the `p`, insert a dot before the last 6 digits. `p1709834567890123` → `1709834567.890123`.

If the URL cannot be parsed, ask for `channel_id` and `message_ts`.

## Read the thread

```
Tool: slack_read_thread
Arguments:
  channel_id: "<channel_id>"
  message_ts: "<message_ts>"
  limit: 200
```

If the thread has more than 200 messages, paginate with `cursor` until the full conversation is read.
