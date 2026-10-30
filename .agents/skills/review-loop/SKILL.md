---
name: review-loop
description: >-
  Run the review loop on an open PR — a headless reviewer round, an autonomous resolver, a CI wait and fix,
  repeated until the review is cleared and CI is green; pauses only on a `needs-human` finding.
argument-hint: "[<PR url>] [--reviewer <name>] [--model <id>]"
disable-model-invocation: true
---

# Review loop

Close the loop between `review-changes`, `resolve-review` and CI on one PR. Each **round**: the reviewer
reviews the PR from its own CLI, and the orchestrator reads the outcome from the PR. While the outcome is
`blocked` a fresh resolver fixes. The round then waits for the Checks run on the branch, fixes it when red,
and pushes everything **once**. The loop ends **cleared and green**: the review outcome is `cleared` and the
Checks run for the current `HEAD` is green. Otherwise it stops with a report. The one decision it never
makes alone is a `needs-human` finding, from the review or from a CI fix: that pauses the round for the
developer.

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
   record. Among the PR-level reviews (`gh api repos/{owner}/{repo}/pulls/{N}/reviews --paginate`, in
   `gh-commands.md` — a PR past its first 30 reviews returns none of the newest ones without the flag), take the latest whose body ends in the footer `— Reviewed by <name> …` and read its
   status line, in the shape [`../review-changes/output-pr.md`](../review-changes/output-pr.md) gives:
   `✅ **Cleared**` or `🛑 **Blocked**`, and the `🙋 <n> needs human` count when present. A review newer
   than the round's start with that footer is the round's outcome; none means the reviewer did not run.
3. **`blocked`** → dispatch the resolver (step 3). It returns with the review fixes **committed, not
   pushed**. Then wait for CI and fix a red run (step 4), **push once**, and start the next round at 1.
4. **`cleared`** → with a `🙋 <n> needs human` count above zero, dispatch the resolver first (step 3): a
   `needs-human` nit pauses the round exactly as a blocker would, and the resolver's fixes are committed
   before the CI wait. Otherwise no resolver. Then wait for CI (step 4). Green with nothing committed
   locally ends the loop at step 5. Green with the resolver's fixes still local is **not** the end: the
   round pushes them — its one push — and waits for the run on the new `headRefOid`; that run's conclusion
   is the one that ends the loop or opens a CI-fix cycle. Red enters the post-clear CI-fix cycles step 4
   describes. Neither path runs another review round.

**One push per round.** The review fixes and the CI fix are separate commits — the history shows which
change came from which source — and they leave in one `git push` after the CI wait. Nothing is pushed
between the resolver's return and that push.

**Bounds.** Three review rounds. A third round that still reads `blocked` is resolved like the others —
resolver, `needs-human` pause, CI wait, one push — and then the loop ends with a report instead of a fourth
review; the report says the round-3 fixes landed unverified by the reviewer. The reviewer's own stops — a
transport failure that survived its retry, a timeout, an agent that finished without posting — end the loop
too.

**Done when**: the outcome is `cleared` and the current `HEAD` is green, or a bound or a reviewer stop has
been hit.

## 3. Dispatch the resolver

Spawn **one fresh** `general-purpose` subagent per round — fresh, so it adjudicates against the code rather
than defending what it wrote. Its brief: read [`../resolve-review/SKILL.md`](../resolve-review/SKILL.md)
and run it as `resolve-review pr --auto <PR url>`, in this tree, **committing but not pushing** — the loop
pushes once per round after its CI wait — and reporting back with the commit or with the `needs-human`
block. Wait for it; edit nothing while it works.

The resolver returns one of two ways:

- **Fixes committed.** Its report carries the verdict counts and the commit sha. Continue at step 4.
- **`needs-human`.** It stopped before any edit and returned the block that
  [`../resolve-review/SKILL.md`](../resolve-review/SKILL.md) → "Returning on `needs-human`" specifies — the
  full verdict table and one question per `needs-human` finding. Then:
  1. Print the block **verbatim** in the terminal.
  2. Fire a `PushNotification` with the PR url and the number of questions.
  3. End the turn and **wait** for the developer's answers. Nothing is edited, committed or pushed while
     waiting.
  4. **Resume the same resolver with the answers** — the same agent, its table and reasoning still in
     context, not a fresh dispatch. In Claude Code that is a `SendMessage` to the subagent. It folds the
     answers into its fix set and proceeds; the round continues at "Fixes committed".

The loop never ends with an unanswered `needs-human` finding: a bound or a stop is reported only once the
pending answers are in and the fixes are pushed.

**Done when**: the resolver has reported its review fixes committed.

## 4. Wait for CI, fix a red run

The run to watch is the **Checks** workflow run for the PR's pushed head — `headRefOid`, which is the last
pushed commit, not the local `HEAD` once the resolver has committed. Find it by head SHA, never by "latest
on the branch": the workflow has no `cancel-in-progress`, so every push leaves its own run going and the
newest one may belong to an older commit.

```bash
gh run list --workflow=checks.yml --commit <headRefOid> --json databaseId,status,conclusion,url
gh run watch <databaseId> --exit-status          # blocks until the run completes
```

- **No run for that SHA** → a run takes a few seconds to register after a push, so an empty list is not yet
  an answer: poll the same command every 15 seconds for up to 2 minutes. A run that appears is the run to
  watch. Still none after the window → the workflow's `paths-ignore` skipped the push (agent docs, `docs/`,
  deploy values): the newest completed Checks run on the branch stands in for it, and **its** conclusion is
  the one read below. No completed run on the branch at all counts as green.
- **Pending** (`queued`, `in_progress`) → watch it to completion. Edit nothing while waiting.
- **Green** (`success`) → in a `blocked` round, push and start the next round. After `cleared`, the loop
  ends at step 5 **only when `HEAD` equals `headRefOid`** — the green run is for the code on the PR. With
  the round's resolver fixes still local (a `cleared` round with `needs-human` findings), push them and
  watch the run for the new `headRefOid` from the top of this step; a green run on the pre-fix SHA says
  nothing about the fixes.
- **Red** (`failure`, `timed_out`, `cancelled`) → a CI fix:
  1. **Resume the round's resolver** with [`ci-fixes.md`](ci-fixes.md) as its brief, the run url and the
     PR url — the same agent, so one agent holds both fix sets. After `cleared` no resolver exists for the
     round: spawn a fresh `general-purpose` subagent with the same brief.
  2. It returns one of four ways, all in the shapes `ci-fixes.md` gives:
     - the CI fix in its **own commit**, separate from the review fixes → continue to the push;
     - a `needs-human` block → pause exactly as in step 3: print verbatim, `PushNotification`, wait, resume
       the same agent with the answers;
     - an **infrastructure rerun** (`gh run rerun --failed`, no commit) → the SHA is unchanged, so watch that
       same run id again (`gh run watch`) and read its new conclusion; red again is the next CI-fix cycle,
       not a repeat of this one;
     - a job the developer **left red** (no commit) → the loop stops: push what is committed (step 5) and
       name the job in the report. No further CI-fix cycle opens on it.
  3. **Push once.** In a `blocked` round that push carries the review fixes and the CI fix, and the next
     round starts. After `cleared` it carries the CI fix and any review fixes the round's resolver left
     local, and the loop waits for the run on the new `headRefOid`: green ends the loop, red starts another
     CI-fix cycle.

**Post-clear bound.** Two CI-fix cycles after `cleared`. A second cycle that still ends red stops the loop
with a report, the fixes pushed. No review round follows a post-clear CI fix: a follow-up review over a
baseline update or an added assertion would be arbitration with nothing to arbitrate.

**Done when**: the round's push is out and the next round can start, or the loop has ended cleared and
green, or the post-clear bound has been hit.

## 5. Report

Before anything is said, confirm the PR is in a **consistent pushed state**: a clean tree and `HEAD` equal
to the PR's `headRefOid`. A stop that leaves local commits behind pushes them first.

Then report in the terminal: the PR url, the outcome (`cleared` and green, or why the loop stopped — rounds
exhausted, post-clear CI-fix cycles exhausted, reviewer failure after its retry, timeout), the number of
rounds run and of post-clear CI-fix cycles, the Checks run url for the final `HEAD` and its conclusion, the
counts from the last resolver report, and anything left open — `deferred` nits and `answered` human threads
stay as open threads for the developer. Leave the PR's threads as the reviewer and the resolver left them.
