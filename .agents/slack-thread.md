# Read a Slack thread

Parse a Slack thread URL and read the full conversation, including replies. If the tool is missing, unauthenticated, or errors, ask the user to paste the thread. Stop if they decline.

## Parse the URL

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

Attachments often carry the actual content. The Slack connector reports metadata only — `Files: name.png (ID: F012SSD0KK8, image/png, 393.6 KB)`.

Follow the `slack-file` skill to download each file. If that skill stops (no token, user declined setup), ask the user to paste or upload each file. Stop if they decline.

**Done when:** every message and attachment in the thread is in hand.
