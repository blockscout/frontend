---
name: finalize-task
description: >-
  Land a finished product task — prune the working files (keep spec.md), then finalize the draft PR into
  ready-for-review.
disable-model-invocation: true
---

# Finalize task

Land a task whose every `progress.md` box is checked. Two steps: prune the disposable working files, then
finalize the PR. Why only `spec.md` survives — the decomposition is preserved in git history, one commit per
ticket — is in [`../../tasks/concepts.md`](../../tasks/concepts.md).

## Step 1 — Prune

Confirm the task is done: every box in `progress.md` is checked. If any is unchecked, stop and report which
ticket is unfinished — there is nothing to land yet.

Then delete the disposable files, keeping only `spec.md` in the task folder:

- `tickets/` — the whole directory.
- `progress.md`.
- `questions.md`.

Commit the deletions on the feature branch as the task's final commit — a plain descriptive subject, the
repo's `Co-Authored-By` trailer, no `#issue` reference. Pruning **before** the PR is finalized is what lets
the whole-task review read the spec and the diff without any ticket files.

## Step 2 — Finalize the PR

Hand off to the `create-pr` skill in **finalize-draft mode** (Mode B).
