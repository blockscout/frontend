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

Gather the targets once:

- Open issues: `gh issue list --repo blockscout/frontend --state open --limit 300 --json number,title,labels,body`.
- Task folders: for every path in `git worktree list`, the folders under `.agents/tasks/<issue>-<slug>/`.

Match each kept topic to one issue by meaning, or to none. Then classify the match:

- **WIP** when a task folder for the issue exists in a worktree other than the main checkout and the
  branch's PR is open (`gh pr list --head issue-<n> --state open`). Target: that worktree's `inbox.md`.
- **Not WIP** when the issue has no task folder in any worktree. Target: an issue comment, or a body edit
  when the decision contradicts what the body says.
- **Landed** when the task folder exists only in the main checkout and its PR is merged. The issue is
  closed history: a follow-up becomes a new-issue candidate, nothing is written to the folder.
- **No worktree** when a task folder exists on `main` and the PR is open but no worktree holds it:
  skip, and say so in the report.

A topic matching no issue is a **new-issue candidate** when the transcript carries an ask or a bug for it,
and excluded otherwise. A topic that only matches a PR with no issue is excluded.

**Done when:** every kept topic has a target class and, for a matched topic, an issue number.

## 4. The plan

Show one table, rows numbered from 1, one row per kept topic: number, topic, decision, target (issue link
or `new issue` or `excluded`), action (`inbox` / `comment` / `edit body` / `create issue` / `skip: no
worktree`), and the text that will be written. For a `create issue` row the text is the issue title and
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

1. **Inbox sections.** Per WIP target, append a section to `<worktree>/.agents/tasks/<issue>-<slug>/inbox.md`
   from [`inbox-section-template.md`](inbox-section-template.md); create the file from the template when it
   is absent. Leave the file uncommitted. The session that resumes the task commits it with its folding.
2. **Issue comments and body edits.** `gh issue comment <n> --body-file <path>`, or `gh issue edit <n>
   --body-file <path>` for an approved body edit. English, the Public-safe rule from the `create-issue`
   skill in force: nobody named, no recording link, no dates or client names. Open with "Decisions from the
   team sync on <date>:" followed by the decisions as bullets.
3. **New issues.** Run the `create-issue` skill once per approved `create issue` row, in sequence, with
   this conversation as the source and the row as the one topic. The row's title and opening sentences are
   the issue's; the skill writes the rest of the body and creates the issue without another confirmation,
   as its own steps say.
4. **Slack.** Compose the message from [`slack-template.md`](slack-template.md) out of the approved rows,
   with the links from 2 and 3 and names resolved to IDs through `.agents/TEAM.md`, and send it to the
   frontend channel with `slack_send_message`. Language and link rules are in `.agents/slack-message.md`.

**Done when:** every row of the plan has its write made, or a named failure.

## 6. Report

Print the report from [`report-template.md`](report-template.md): per topic the target and the decision,
the writes with their paths and links, the new issues, the skipped and excluded topics. The skill is done.
