---
name: review-loop
description: >-
  Run the review loop on an open PR — a headless reviewer round, an autonomous resolver, repeated until the
  review is cleared; pauses only on a `needs-human` finding.
argument-hint: "[<PR url>] [--reviewer <name>] [--model <id>]"
disable-model-invocation: true
---

# Review loop

Close the loop between `review-changes` and `resolve-review` on one PR. Each **round**: the reviewer
reviews the PR from its own CLI, the orchestrator reads the outcome from the PR, and while the outcome is
`blocked` a fresh resolver fixes and pushes. The loop ends `cleared`, or stops with a report. The one
decision it never makes alone is a `needs-human` finding: that pauses the round for the developer.

In the product-task workflow `finalize-task` hands off here after the PR is flipped to ready. The skill
also runs by hand on any open PR; `create-pr` never offers it.

## Inputs

| Input | Values | Default | Meaning |
| --- | --- | --- | --- |
| `target` *(positional)* | PR url | the current branch's open PR | the PR under review |
| `--reviewer <name>` | a file in [`reviewers/`](reviewers/) | `cursor` | which reviewer runs the rounds |
| `--model <id>` | a model id the reviewer's CLI accepts | the reviewer's default | model override, passed through |

```
/review-loop                                     the current branch's PR, reviewed by cursor
/review-loop https://github.com/o/r/pull/12      that PR
/review-loop --model gpt-5                       cursor, on the named model
```

**The reviewer file is the provider seam.** Everything specific to one provider — binary, flags, time
limit, failure detection, retry — lives in `reviewers/<name>.md`, and the reviewer's **tag** is its name.
This file speaks only of "the reviewer". Every reviewer run passes `--as <name>`, which is what satisfies
`review-changes`' guard against overwriting another reviewer's threads
([`../review-changes/SKILL.md`](../review-changes/SKILL.md), "`--as` and concurrent reviewers").

## 1. Pin the PR

Resolve `owner/repo` and the PR with the discovery commands in
[`../review-changes/gh-commands.md`](../review-changes/gh-commands.md); a positional url settles the PR
outright. Confirm `gh auth status` succeeds. Then confirm the tree is clean and `HEAD` equals the PR's
`headRefOid` — the reviewer reads the PR diff, so a local commit it cannot see is a review of the wrong
code. A `HEAD` ahead of the PR is pushed here; a dirty tree stops the run.

Read the reviewer file `reviewers/<name>.md` and keep it open for the rounds.

**Done when**: the PR is known, pushed, and the tree is clean.

## 2. Run a round

Rounds are numbered from 1. Each round:

1. **Review.** Run the reviewer as its file says: `review-changes pr --as <name>`, with `--round
   follow-up` on every round after the first. It runs in the background and is polled to completion.
   While it runs, **edit nothing** in this tree — the reviewer reads the working copy for the code the diff
   points at, and an edit under it is a finding against code that does not exist. The file says what counts
   as a transport failure (one retry) and what counts as a review that ran (no retry).
2. **Read the outcome from the PR**, never from the CLI's text — it can be truncated and the PR is the
   record. Among the PR-level reviews (`gh api repos/{owner}/{repo}/pulls/{N}/reviews`, in
   `gh-commands.md`), take the latest whose body ends in the footer `— Reviewed by <name> …` and read its
   status line, in the shape [`../review-changes/output-pr.md`](../review-changes/output-pr.md) gives:
   `✅ **Cleared**` or `🛑 **Blocked**`, and the `🙋 <n> needs human` count when present. A review newer
   than the round's start with that footer is the round's outcome; none means the reviewer did not run.
3. **`cleared`** → the loop ends. Go to step 4.
4. **`blocked`** → dispatch the resolver (step 3). When it returns with its fixes pushed, the round is over
   and the next round starts at 1.

A CI wait and CI fix step belongs after the resolver returns, before the next round; T03 of the review-loop
task adds it, and the terminal condition becomes "cleared and green".

**Bounds.** Three review rounds. A third round that still reads `blocked` ends the loop with a report. The
reviewer's own stops — a transport failure that survived its retry, a timeout — end the loop too.

**Done when**: the outcome is `cleared`, or a bound or a reviewer stop has been hit.

## 3. Dispatch the resolver

Spawn **one fresh** `general-purpose` subagent per round — fresh, so it adjudicates against the code rather
than defending what it wrote. Its brief: read [`../resolve-review/SKILL.md`](../resolve-review/SKILL.md)
and run it as `resolve-review pr --auto <PR url>`, in this tree, reporting back when the fixes are pushed
or with the `needs-human` block. Wait for it; edit nothing while it works.

The resolver returns one of two ways:

- **Fixes pushed.** Its report carries the verdict counts and the push. The round is over.
- **`needs-human`.** It stopped before any edit and returned the block that
  [`../resolve-review/SKILL.md`](../resolve-review/SKILL.md) → "Returning on `needs-human`" specifies — the
  full verdict table and one question per `needs-human` finding. Then:
  1. Print the block **verbatim** in the terminal.
  2. Fire a `PushNotification` with the PR url and the number of questions.
  3. End the turn and **wait** for the developer's answers. Nothing is edited, committed or pushed while
     waiting.
  4. **Resume the same resolver with the answers** — the same agent, its table and reasoning still in
     context, not a fresh dispatch. In Claude Code that is a `SendMessage` to the subagent. It folds the
     answers into its fix set and proceeds; the round continues at "Fixes pushed".

The loop never ends with an unanswered `needs-human` finding: a bound or a stop is reported only once the
pending answers are in and the resolver has pushed.

**Done when**: the resolver has reported its fixes pushed.

## 4. Report

Before anything is said, confirm the PR is in a **consistent pushed state**: a clean tree and `HEAD` equal
to the PR's `headRefOid`. A stop that leaves local commits behind pushes them first.

Then report in the terminal: the PR url, the outcome (`cleared`, or why the loop stopped — rounds
exhausted, reviewer failure after its retry, timeout), the number of rounds run, the counts from the last
resolver report, and anything left open — `deferred` nits and `answered` human threads stay as open
threads for the developer. Leave the PR's threads as the reviewer and the resolver left them.
