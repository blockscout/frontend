---
name: create-issue
description: >-
  Create a GitHub issue from the available context. Use when the user asks
  to file an issue from a source they name (Slack thread, notes, document)
  or from this conversation.
---

# Create issue

Turn the provided material into a thin, public-safe GitHub issue. Then stop.

## Step 1 — Resolve the source

Done when one body of material is in hand, or the run has stopped.

- The user named or linked a source → that is the source. Fetch it below.
- They named nothing → this conversation is the source.
- Use only that pointer, or this conversation.

**Fetch a pointer.** Content already in the chat (paste, attachment) is the source. For a URL or an id a connected tool can read, try those tools. To read a Slack thread, follow `.agents/slack-thread.md`. If fetch fails (no tool, auth error, unknown host), ask the user to paste the relevant notes. If they decline or paste nothing useful, stop and tell them the issue cannot be created.

## Step 2 — Pick the topic

Done when exactly one topic is selected, or the run has stopped.

- Several issue-worthy topics → list them in one short round and wait. "All of them" means a separate issue per topic: confirm and create each before starting the next.
- File when the problem or request can be stated in a couple of sentences. Missing repro, acceptance criteria, or technical detail is fine — omit those sections later.
- No request or problem in the source, or the subject itself cannot be named → stop and tell them the issue cannot be created.

## Step 3 — Draft

Done when repository, type, labels, title and body are all decided.

Follow the `check-github-cli` skill before any `gh` command below. Do not proceed with `gh` until `gh auth status` succeeds.

**Repository.** Recommend one: this workspace's `origin` when it is a `blockscout/*` repo and the topic fits; otherwise a best-guess `blockscout/*` repo from the topic. Skip fork remotes. If they say it is the wrong place, list `blockscout` source repos (`gh repo list blockscout --source --no-archived --limit 100 --json name,description`) or take an `owner/name` they type.

**Type.** Infer one of `Bug`, `Task`, or `Feature` from the topic: unexpected broken behavior → `Bug`; new user-facing capability → `Feature`; otherwise `Task`.

**Labels.** `gh label list --repo <owner>/<name> --json name,description --limit 100`. Pick labels that match the topic; zero is fine.

**Title.** Imperative mood ("Fix X", "Add support for Y").

**Body.** Neutral third-person technical language that can stand on a public tracker. From the source, take the ask plus concrete technical facts already established (errors, affected surface) — not the debugging transcript or references to the existing code. Omit empty sections:

```markdown
## Description

[Core problem or request in 2-3 sentences]

## Details

[Technical details, error messages, affected components]

## Steps to Reproduce

[Numbered steps]

## Expected Behavior

[What should happen instead, or acceptance criteria]

## Additional Context

[Any other relevant technical information]
```

**Public-safe.** People unnamed and unattributed; no links to the private source (Slack, Notion, Fireflies, internal docs); no client names; no unreleased dates or roadmap.

## Step 4 — Confirm, create, stop

Present repository, type, title, body, labels (or "None"), and project board (or "None") and wait. Apply requested edits and re-confirm.

Then create:

```bash
gh issue create \
  --repo <owner>/<name> \
  --title "<title>" \
  --body-file <path> \
  --type "<Bug|Task|Feature>" \
  --label "<label>"
```

Omit `--label` when there are none. Repeat `--label` for each label. Pass `--type` for `blockscout/*` repos; on a type-resolution error, retry the same create without `--type`. Write the body to a temp file so shell escaping cannot mangle it.

If the repo is in the table, add the new issue to the specified project board. Before `item-add`, check that `gh auth status` lists a `project` scope; if it does not, tell the user to run `gh auth refresh -s project` and wait until it does:

| Repo | Owner | Project number |
|---|---|---|
| `blockscout/frontend` | `blockscout` | 6 |
| `blockscout/blockscout` | `blockscout` | 8 |

```bash
gh project item-add <number> --owner <owner> --url <issue-url>
```

Unlisted repos skip the board. A board failure does not undo the issue — report it and still show the issue link.

Show a clickable Markdown link to the new issue. The skill is done — no grilling, speccing, or implementing unless they ask in a follow-up.
