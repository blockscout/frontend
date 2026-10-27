---
name: process-task-inbox
description: >-
  Fold the pending sections of the task's inbox.md into its questions, spec and tickets.
disable-model-invocation: true
---

# Process task inbox

A task's `inbox.md` holds decisions that arrived from outside any session: a weekly, a thread, a document
(what the file is and who writes it is in [`../../tasks/structure.md`](../../tasks/structure.md)). Each
pending section is context the task has not absorbed yet. This skill decides, with the developer, what
every decision does to the task files, applies it, and marks the section folded. `to-tickets`,
`implement-ticket` and `finalize-task` refuse to start while a section is pending, so this is the way
back into the task.

No arguments; runs on the checked-out feature branch.

## 1. Load

Resolve the task folder from the branch (`issue-<number>`). Read `inbox.md`, `spec.md`, `questions.md`,
`progress.md` and every `tickets/NN-<slug>/spec.md` and `brief.md`. Collect the sections whose status is
`pending`, oldest first. No pending section, or no `inbox.md` at all, is a stop: say the inbox is clean
and end.

**Done when:** every pending section's decisions are in hand, with the task's current questions and tickets.

## 2. The plan

For every decision in every pending section, propose exactly one **disposition**:

- **resolve Q<NN>** when an open question asks what the decision answers. Answer as a phrase plus date.
  The Slack line stays as it is, a permalink or `—`; the link into the source lives in the inbox section.
- **add Q<NN>** when the decision needs something nobody in the task holds yet (a mockup, a backend
  field). Next free id, owner from the spec header, status `pending`, Slack `—`. Posting it is the
  developer's own step, if they post it at all.
- **edit spec** when a Functional Requirement, the UI inventory or Out of scope now says something else.
  This is the rare in-place requirement change `.agents/tasks/concepts.md` allows; show the exact sentence
  before and after.
- **edit ticket** when an unfrozen ticket's What to build, acceptance criteria or leaves change. A frozen
  ticket (every leaf checked) is never edited; the change goes to a new ticket.
- **brief** when the decision is new work. `tickets/NN-<slug>/brief.md` with the next free `NN`, and its
  line in `progress.md`; a later `to-tickets` run scopes it the way it scopes any deferred ticket.
- **no-op** when the task already does what the decision says. Say which FR or ticket covers it.

Show the dispositions as one table (section, decision, disposition, text) and wait for the developer.
**This is the run's one gate.**

**Done when:** the developer has approved every row.

## 3. Apply

Make every approved edit. Then set each processed section's status to `folded`. Commit on the feature
branch with a pathspec of the task files this run changed, `inbox.md` first among them: the index may
already hold a ticket's staged hand-off, and that stays out of this commit. A plain subject naming the
source, the repo's `Co-Authored-By` trailer.

**Done when:** no section is `pending` and the commit holds exactly the folded files.
