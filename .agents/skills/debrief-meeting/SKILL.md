---
name: debrief-meeting
description: >-
  Debrief the latest front-end weekly: route each decision to its issue, file the new ones, post the summary.
disable-model-invocation: true
---

# Debrief meeting

The weekly produces decisions that the task workflow never sees: a session working a task was not in the
room, and an issue nobody has started carries none of what was said. This skill reads the latest weekly
transcript and routes every frontend decision to the place the workflow reads it from, then tells the
team where everything went. It writes nothing until the developer approves the plan in step 4.

No arguments. It picks the latest weekly itself.

## 1. Fetch the transcript

Find the meeting with `fireflies_get_transcripts`: `fromDate` seven days ago, title containing
"front-end weekly". Take the newest match. Fetch it with `fireflies_get_transcript` and read the saved
output to the last line; the transcript is long and the tool truncates, so read it in chunks until the
footer (`Title:`, `Duration:`) is in hand. Keep the meeting id: every decision links back to the
recording as `https://app.fireflies.ai/view/<id>?t=<seconds>`.

No match in seven days is a stop: say so and end.

**Done when:** every sentence of one transcript is read.

## 2. Cut to frontend topics

A **topic** is one subject the meeting settled, asked for, or reported broken. Keep the topics about the
frontend app. [`exclusions.md`](exclusions.md) names the sibling products the same meeting covers; a codename
you do not know resolves through `.agents/GLOSSARY.md`. A topic that touches both a sibling product and the
frontend app stays in with only its frontend part.

Per kept topic, note the **decision** as a phrase, the timestamp of the sentence that settles it, and a
quote of a few words from that sentence.

**Done when:** every topic in the transcript is either kept with a decision and a timestamp, or excluded
with the product it belongs to.

## 3. Match topics to issues

Follow the `check-github-cli` skill, then gather the targets once:

- Open issues: `gh issue list --repo blockscout/frontend --state open --limit 300 --json number,title,labels,body`.
- Open PRs: `gh pr list --repo blockscout/frontend --state open --limit 100 --json number,title,headRefName`.
- Checkouts: `git worktree list`, with the branch each path has checked out.

A list that fails or comes back empty stops the run: say so and end, because every topic would read as
"no issue" and step 5 would file duplicates.

Match each kept topic to one issue by meaning, or to none. The matched issue's PR, if any, is the one
whose head branch is `issue-<n>`; classify on it:

- **WIP** when the PR is open and a checkout, the main one included, is on `issue-<n>`. Target: that
  checkout's `.agents/tasks/<n>-<slug>/inbox.md`.
- **Not WIP** when the issue has no PR. Target: an issue comment, or a body edit when the decision
  contradicts what the body says.
- **Landed** when the PR is merged. The issue is closed history: a follow-up becomes a new-issue candidate,
  nothing is written to the folder.
- **Skip** when the PR is open and no checkout is on `issue-<n>`: say so in the report.

A topic matching no issue is a **new-issue candidate** when the transcript carries an ask or a bug for it.
A topic that matches an open PR with no issue, or matches nothing and carries no ask, is **excluded**.

**Done when:** every kept topic has a target class and, for a matched topic, an issue number.

## 4. The plan

Show one table, rows numbered from 1, one row per kept topic: number, topic, decision, target (issue link
or `new issue` or `excluded`), action (`inbox` / `comment` / `edit body` / `create issue` / `skip` /
`none`), and the text that will be written. `none` is the action of an excluded row and of a Landed row
with no follow-up; step 5 makes no write for it. For a `create issue` row the text is the issue title and
the two or three sentences its Description will open with. Below the table, the excluded topics on one
line each with their product, and the action points the Slack summary will carry, numbered on from the
table.

Wait for the developer. They answer by row number: edit a row, flip `comment` to `edit body`, drop a
candidate, rescue an excluded topic. **This is the run's one gate**: the approval covers every write in
step 5, issue creation and the Slack send included. The Slack message is composed from the approved rows
through a fixed template, so it is sent without a draft round; this sentence is the explicit exception the
Slack rule in `AGENTS.md` asks a skill to name.

**Done when:** the developer has approved every row.

## 5. Execute

In this order, so the Slack message can link what the earlier writes produced:

1. **Inbox sections.** Per WIP target, append a section from
   [`inbox-section-template.md`](inbox-section-template.md) to `<checkout>/.agents/tasks/<n>-<slug>/inbox.md`.
   When the file is absent, create it with the template's file header first. Leave the file uncommitted:
   the session that resumes the task commits it with its folding. A checkout with uncommitted changes is
   mid-ticket; write anyway and name it in the report.
2. **Issue comments and body edits.** `gh issue comment <n> --body-file <path>`. For an approved body edit,
   `gh issue edit` replaces the whole body: read the current one (`gh issue view <n> --json body`), change
   only the sentences the decision contradicts, and pass the full text to `--body-file`. English, with the
   Public-safe rule from the `create-issue` skill in force. A comment opens with "Decisions from the team
   sync on <date>:" followed by the decisions as bullets.
3. **New issues.** Run the `create-issue` skill once per approved `create issue` row, in sequence. Its
   source is the row alone, the title and opening sentences, and it is told the topic is picked and the
   title is given, so its Step 2 round and its own title draft are already settled. It writes the rest of
   the body and creates the issue.
4. **Slack.** Compose the message from [`slack-template.md`](slack-template.md) out of the approved rows,
   with the links from 2 and 3 and names resolved to IDs through `.agents/TEAM.md`, and send it to the
   frontend channel with `slack_send_message`. Language and link rules are in `.agents/slack-message.md`.
   When the send fails, keep the composed text for the report so the developer can post it by hand.

**Done when:** every row of the plan has its write made, or a named failure.

## 6. Report

Print the report from [`report-template.md`](report-template.md): per topic the target and the decision,
the writes with their paths and links, the new issues, the skipped and excluded topics, and every failed
write with its reason. The skill is done.
