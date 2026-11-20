---
name: implement-task
description: >-
  Run a scoped product task to its landed PR from one orchestrator session — a worker sub-agent per ticket,
  then one for the land step; the developer is asked in only at human touchpoints.
argument-hint: "[--no-finalize]"
disable-model-invocation: true
---

# Implement task

Turn this session into the **orchestrator** of a scoped task, on the already-checked-out feature branch. The
orchestrator delegates: one fresh **worker** sub-agent runs `implement-ticket` per ticket, one after another,
and a last worker runs `finalize-task`. The developer is called in only at a **touchpoint**, a point where a
worker needs a person. The ticket model and the files read below are in
[`../../tasks/concepts.md`](../../tasks/concepts.md) and [`../../tasks/structure.md`](../../tasks/structure.md).

## Invocation

```
/implement-task                  every runnable ticket, then finalize-task
/implement-task --no-finalize    every runnable ticket, then stop
```

A re-run resumes the task. The state is `progress.md` and the tickets' leaf boxes, and this session stores
none of its own.

## What the orchestrator does itself

The orchestrator **reads state, spawns, relays and notifies**. Its whole toolset for a run:

- **Read** the task folder's files, `git status` and `git log`.
- **Spawn** a worker, and **resume** one with `SendMessage`.
- **Print** a worker's text, and fire `PushNotification`.

Every edit, check, commit, push and fix belongs to a worker. When something needs doing that this list does
not hold, hand it to the ticket's worker or stop the run (step 5).

## Step 1 — Readiness

1. Confirm the Agent tool and `SendMessage` are available. Outside Claude Code they are not: say so, point
   the developer at `implement-ticket <NN>` run by hand, and stop.
2. Resolve the task folder from the branch (`issue-<number>`). Read `progress.md`, `questions.md`, `inbox.md`
   if present, and each ticket's `Blocked by` row.
3. If `inbox.md` has a section whose status is `pending`, tell the developer to run `process-task-inbox`
   and stop.

**Done when**: the task folder and every ticket's blockers are known, and no inbox section is pending.

## Step 2 — Pre-flight

Print the progress list as it stands, one line per ticket, and nothing else:

```
- [x] 01 → tickets/01-api-resource/
- [ ] 02 → tickets/02-list-page/          👨‍💻 touchpoint
- [ ] 03 → tickets/03-filters/            ⛔ blocked by Q02
- [ ] 04 → tickets/04-details/            ⛔ not scoped
```

- `👨‍💻 touchpoint` — the ticket's `spec.md` holds an unchecked `[human]` leaf or a `(human)` criterion.
- `⛔ blocked by <ids>` — a `Q<NN>` entry that is not `resolved` or `waived` in `questions.md`.
- `⛔ not scoped` — the folder holds a `brief.md` and no `spec.md`.

Then start step 3 in the same turn. The list tells the developer when they will be needed, and it is not a
question.

## Step 3 — Run the tickets

Repeat until no ticket is runnable:

1. **Pick the ticket.** A ticket is **runnable** when its box is unchecked, it has a `spec.md`, and every
   `Blocked by` entry has cleared. A runnable ticket with a leaf box already checked is half-done from an
   earlier run and goes first. Otherwise take the lowest `NN`.
2. **Spawn one fresh `general-purpose` worker**, in this tree, with this brief: read
   [`worker-brief.md`](worker-brief.md) at its absolute path and follow it, running
   `.agents/skills/implement-ticket/SKILL.md` for ticket `<NN>`. Give the child's absolute path. One worker
   at a time: a ticket's uncommitted work fills the tree until its commit.
3. **Wait** for the worker and read the `STATUS:` line that opens its report.

   | Status | Then |
   | --- | --- |
   | `done` | Verify (below), print one line with the ticket and its commit subject, and pick the next ticket. |
   | `touchpoint` | Relay (step 4), then read the next report from this table. |
   | `not-runnable`, `failed` | Stop the run (step 5). |

**Verify a `done`** with reads only: the ticket's box is checked in `progress.md`, `git log` shows one new
commit, and `git status` is clean apart from an `inbox.md`. Any mismatch stops the run (step 5).

**Done when**: every box in `progress.md` is checked, or no unchecked ticket is runnable.

- Every box checked → step 6.
- Unchecked tickets left, none runnable → stop the run (step 5), naming each ticket and its open blocker.

## Step 4 — Relay a touchpoint

1. Print the worker's report **verbatim**, minus its `STATUS:` line.
2. Fire a `PushNotification`: the ticket and what the developer is asked to do, in one line.
3. End the turn and wait.
4. Send the developer's reply **verbatim** to the **same** worker with `SendMessage`. The worker holds the
   ticket's context, so a hand-fix report, a bug to fix and "record my corrections" all go to it unread.

A ticket keeps one worker until it commits, across any number of these rounds.

Two replies are addressed to the orchestrator, and it acts on them instead of relaying:

- **"abort"** → stop the run (step 5).
- **"stop after this ticket"** → relay as usual until the ticket is `done`, then stop the run (step 5).

## Step 5 — Stop the run

A stop leaves the tree exactly as it is: staged work, the developer's unstaged fixes and the checked leaf
boxes are what the next run resumes from.

1. If a worker is still running, stop it.
2. Send the ticket's worker one message: stop every background process it started, change nothing else,
   and report what is still running. A worker that cannot be resumed is named in the report instead.
3. Print the reason for the stop, the worker's report verbatim when it gave one, and the state: the open
   ticket, its checked leaf boxes, and whether the index holds staged work.
4. Fire a `PushNotification` with the reason in one line, unless the developer asked for the stop.

**Done when**: the report is printed and no worker is running.

## Step 6 — Land

Skip this step under `--no-finalize`, and report that every ticket is committed.

Spawn one fresh `general-purpose` worker with the same [`worker-brief.md`](worker-brief.md), running
`.agents/skills/finalize-task/SKILL.md`. It needs no confirmation: running this skill is the developer's
go-ahead for the push, the ready PR and the demo deploys.

Read its report as in step 3. A `touchpoint` here is a `needs-human` block from the review loop, and step 4
relays it the same way. On `done`, print the worker's report verbatim and fire the `PushNotification`
`finalize-task` step 5 describes: the worker has no notification of its own. On `failed`, stop the run
(step 5).

**Done when**: the land report is printed and the notification is sent.
