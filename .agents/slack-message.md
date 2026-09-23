# Compose a Slack message

How to write a message the Slack connector (`slack_send_message`) posts. Who to send it to is up to the skill that sends it. Slack IDs come from `./TEAM.md`.

## Language

Russian — the team's internal language. A reply in an existing thread matches the thread's language.

## Addressing

- **Person** — the *Slack member ID* (`U…`). Mention as `<@U…>`; to DM, pass the ID as the channel to the send tool.
- **Team / group** — the *Slack group ID* (`S…`). Mention as `<!subteam^S…>`.
- **Channel** — the *Channel ID* (`C…`). Pass it as the channel target when sending; refer to it in prose by its `#name`.
- **Permalink** — `https://blockscout.slack.com/archives/<channel-id>/p<message-ts>` (the message timestamp with the dot removed).

## Links

End a bare URL with a space, an empty line, or the end of the message. Slack's link parser runs through a single line break: with `https://example.com` followed by a newline and `Next line`, the next line's first word becomes part of the link, and Cyrillic gets punycoded into the hostname (`…xn--com-…`).

```
Демо:
https://review-foo.k8s-dev.blockscout.com

Посмотри, пожалуйста.
```

## Attribution

The connector appends a *Sent using* footer naming the agent to every message, so a message sent through it already discloses that an agent wrote it.
