---
name: finalize-task
description: >-
  Land a finished product task — prune the working files (keep spec.md), flip the draft PR to ready, run
  the review loop, deploy the spec's demos, report.
disable-model-invocation: true
---

# Finalize task

Land a task whose every `progress.md` box is checked. Five steps, in order, each a handoff: prune the
disposable working files, finalize the PR, run the review loop, deploy the demos, report. Why only `spec.md`
survives — the decomposition is preserved in git history, one commit per ticket — is in
[`../../tasks/concepts.md`](../../tasks/concepts.md). The developer returns to a PR that is reviewed, green
and deployed, with the review history on its threads.

## Step 1 — Prune

Confirm the task is done: every box in `progress.md` is checked. If any is unchecked, stop and report which
ticket is unfinished — there is nothing to land yet. An `inbox.md` with a section whose status is `pending`
is a stop as well: context the task never absorbed cannot land. Tell the developer to run
`process-task-inbox`.

Then delete the disposable files, keeping only `spec.md` in the task folder:

- `tickets/` — the whole directory, review files included.
- `progress.md`.
- `questions.md`.
- `inbox.md`, if any outer-loop context was debriefed into the task.
- `design-readout.md`, if a design readout was written.
- `review.md` / `review-<tag>.md`, if a task-level review ran in `md` mode.

Commit the deletions on the feature branch as the task's final commit — a plain descriptive subject, the
repo's `Co-Authored-By` trailer, no `#issue` reference. Pruning **before** the PR is finalized is what lets
the whole-task review read the spec and the diff without any ticket files.

**Done when**: the task folder holds `spec.md` alone and the prune commit exists.

## Step 2 — Finalize the PR

Hand off to the `create-pr` skill in **finalize-draft mode** (Mode B). It pushes, writes the real
description, and flips the draft to ready, which starts the Checks workflow.

**Done when**: the PR is ready for review and `HEAD` equals its `headRefOid`.

## Step 3 — Review loop

Hand off to [`../review-loop/SKILL.md`](../review-loop/SKILL.md) on the PR, with no reviewer or model
override unless the developer gave one for this run. The loop reviews, resolves, waits for CI and pushes,
round by round, and pauses only on a `needs-human` finding — that pause is the loop's, not this skill's:
answer it as the loop says and let the loop continue.

The loop ends one of two ways, and the way decides step 4:

- **Cleared and green** — the review outcome is `cleared` and the Checks run for the pushed `HEAD` is
  green. Continue to step 4.
- **Stopped short** — a bound hit, a reviewer failure after its retry, a timeout. Skip step 4: a demo of
  unreviewed code is what the loop exists to avoid. Carry the loop's report into step 5.

**Done when**: the loop has reported, and the PR is in the consistent pushed state its report confirms.

## Step 4 — Deploy the demos

Only after a loop that ended cleared and green. Read the `Demo` row from `spec.md` and run it as
[`../deploy-demo/demo-entries.md`](../deploy-demo/demo-entries.md) says: nothing for `none`, otherwise one
`deploy-demo` run per entry, sequentially, with the inputs its table gives, reading a failed first run the
way it describes.

**Done when**: every entry has a successful run and a URL, or the row said `none`, or the report names
each entry that did not deploy and its failed run.

## Step 5 — Report

Fire a `PushNotification` with the PR url and one line: the loop outcome (cleared and green, or why it
stopped) and the number of demos deployed.

Then report in the terminal, as clickable Markdown links where there is a url:

- The PR.
- The review outcome and the number of rounds, from the loop's report.
- The CI status: the Checks run for the final `HEAD` and its conclusion.
- The demo URLs, one per deployed entry, or that none deployed and why (`none`, or the loop stopped short).
- Anything left open: `deferred` nits and `answered` human threads on the PR, a loop stop and its reason.

**Done when**: the notification is sent and the report is printed.
