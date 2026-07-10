---
name: to-spec
description: >-
  Convert the current conversation into a product-task spec in .agents/tasks/, or update an existing
  spec — folding in new decisions, harvesting colleague replies from Slack threads, and sending open
  questions to their owners. Use at the end of a grilling session, when the user wants to capture any
  conversation as a spec, or to sync a spec's open questions with Slack.
---

# To spec

Turn the current conversation into a spec file — or merge it into one that already exists. The spec is the
single source of truth for a product task: `implement-task` executes from it, humans work from it, and its
open questions drive the Slack round-trip with PMs, designers, and backend engineers.

This skill is **conversation-agnostic**: it is normally invoked at the end of a `grill-the-task` session,
but works from any conversation that contains decisions worth capturing — including an **empty** one. A
fresh session invoking it on an existing spec (e.g. `/to-spec 3219-cross-chain-txs`) is the normal way to
sync Slack replies: there is nothing to convert, so the run is just harvest (Step 2) plus outreach (Step 4).

## Spec location and structure

- With a GitHub issue: `.agents/tasks/<issue-number>-<slug>/spec.md` (e.g. `.agents/tasks/3219-cross-chain-txs/spec.md`).
- Ad-hoc (no issue): `.agents/tasks/<slug>/spec.md`.
- Large tasks: big steps get sub-specs at `subtasks/<NN>-<slug>.md` next to `spec.md`, written **just-in-time**
  by a `grill-the-task` subtask session — when invoked from one, write the sub-spec, not the main spec.

Use `spec-template.md` (next to this file) for every new spec and sub-spec. Structure by size:

- **small** — one-step task breakdown; the whole task is implementable right after the session.
- **medium** — a flat list of small subtasks in one spec.
- **large** — main spec with the ordered step list; small steps fully specified inline, big steps as
  one-liners pointing at their (future) sub-spec.

Tag every subtask `[agent]` or `[human]` per `.agents/rules/delegation.mdc` (UI work defaults to the
scaffold → style split). Specs merge with the task's PR and accumulate in `.agents/tasks/` as precedent.

## Workflow

### Step 1 — Locate the spec

Derive the path from the issue (or ask for a slug). If the file already exists, this is an **update** run:
read the spec first and treat it as hand-editable — developers edit specs directly between runs.

### Step 2 — Harvest Slack answers (update runs only)

For every open question with status `pending` and a recorded Slack permalink:

1. Read the thread with the Slack MCP tools (`slack_read_thread`; parse `channel_id`/`message_ts` from the
   permalink as in the `create-issue-from-slack-thread` skill).
2. If there are replies, summarize them and propose a resolution to the user.
3. On acceptance: fold the decision into the affected spec section(s), set the question's status to
   `resolved`, and record the answer and date in its entry.
4. If a reply raises a follow-up: draft it (in Russian, like all outreach), get the user's approval, send it
   **into the same thread**, and keep the question `pending`.

The harvest is complete when every `pending` question with a permalink has had its thread read and is now
resolved, followed up, or confirmed still unanswered.

### Step 3 — Write or merge the spec

Extract from the conversation: decisions, requirements, data/API facts, UI inventory, size classification,
task breakdown, and unanswered questions with their owners — the per-team contacts picked during the
session (defaults from `.agents/TEAM.md`), recorded in the header.

**Merge surgically.** On update runs, never regenerate the file: preserve checked boxes, statuses, hand
edits, and resolved-question records; only add or amend what the conversation actually changed. Show the
user a summary of the changes and confirm before moving on.

Status field: a new spec starts as `draft`; set it to `ready` once no `pending` question blocks the first
subtask (per-subtask blocking — unblocked subtasks may proceed while unrelated questions are pending).

### Step 4 — Send open questions (outreach)

For `pending` questions that have **no** Slack permalink yet:

1. Group them by owner.
2. Pick each group's destination:
   - Task has a **dedicated feature channel** (spec header) → **all** questions go there, API ones included.
   - Otherwise, **product questions go to the frontend channel** (see `.agents/TEAM.md`) — never a DM — so
     colleagues from other teams (QA in particular) build the same understanding of the feature.
   - Other questions (API, design) default to a DM with the owner.
   - When posting to a channel, **always mention the addressee** — `<@member ID>` from `.agents/TEAM.md`
     (people missing from the roster: resolve by name via `slack_search_users` and suggest adding them).
3. Draft one message per owner: brief task context (issue link), the questions, and why they block progress.
   Write all Slack messages in **Russian** — the team's internal language (the spec itself stays in English).
4. **Show every draft (with its destination) to the user and wait for explicit approval** — never send
   unreviewed outreach.
5. Send (`slack_send_message`), then record each thread's permalink in the question's entry.

If the Slack MCP tools are unavailable, record the questions with owners anyway and tell the user to route
them manually.

Outreach is complete when every `pending` question has a recorded permalink — or an explicit note that the
developer routes it manually.

### Step 5 — Branch and draft PR (first creation only)

When this run **created** the spec (or sub-spec), bootstrap the workflow's draft-PR-first policy — each
action only with the developer's explicit approval, never unprompted:

1. **Branch** — main spec: `issue-<number>` off `main`; sub-spec (subtask mode): `issue-<number>-step-<N>`
   off the feature branch; **ad-hoc spec** (no issue): the task-dir slug itself (spec in
   `.agents/tasks/<slug>/` → branch `<slug>`). Create/switch if needed and record the branch in the spec
   header.
2. **Commit** — propose committing the spec as the branch's first commit; show what will be committed and
   wait for confirmation.
3. **Draft PR** — suggest opening it right away via the `create-pr` skill (draft-placeholder mode; feature
   branch → `main`, sub-branch → feature branch). Why drafts open this early is documented in
   `.agents/tasks/README.md`; the PR flips to ready when the breakdown's last box is checked (the
   `implement-task` skill nudges at that moment).

For ad-hoc specs the draft PR doubles as a **parking spot**: an idea captured as a spec today can sit in
its draft PR and be picked up, refined, or implemented days later — visible on GitHub instead of only in a
local working tree.
