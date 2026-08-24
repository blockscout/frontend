---
name: to-spec
description: >-
  Turn the current conversation into a product-task spec and publish it as a draft PR: no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

# To spec

Turn the finished conversation into a task's `spec.md` and `questions.md`. **Synthesize what the
conversation already settled; do not interview** — the decisions and the open questions were made in the
session that hands off here. This skill's whole job is writing them down and bootstrapping
the draft PR.

This skill runs **once** per task. The spec is write-once: there is no update or merge mode. What that
means, and why answers never rewrite it, is in [`../../tasks/concepts.md`](../../tasks/concepts.md). Not
every task gets a spec — see "Not every task needs a spec" in
[`../../tasks/README.md`](../../tasks/README.md).

## Step 1 — Write the spec and questions

Derive the task folder from the issue: `.agents/tasks/<issue-number>-<slug>/` (layout in
[`../../tasks/structure.md`](../../tasks/structure.md)). Write two files:

- **`spec.md`** from [`spec-template.md`](spec-template.md).
- **`questions.md`** from [`questions-template.md`](questions-template.md).

Keep the spec an **index of decisions**, not a worklog — what to build and why, pointing at detail (its
Slack thread, the code, the PR) rather than copying it. **Show the user the two files and get their
confirmation of the content — this is the run's one gate.**

## Step 2 — Branch and draft PR

The content confirmation in Step 1 is the only prompt. Once it's given, run this sequence **without asking
again** — it authorizes the branch, commit, push, and draft PR together:

1. **Branch** — `issue-<number>` off `main`. Create/switch if needed and record it in the spec header.
2. **Commit** — commit `spec.md` and `questions.md` as the branch's first commit.
3. **Draft PR** — hand off to the `create-pr` skill (draft-placeholder mode, feature branch → `main`); it
   pushes and opens the draft with no further confirmation. Why the draft opens this early is in
   [`../../tasks/README.md`](../../tasks/README.md).

