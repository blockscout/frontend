---
name: review-changes
description: >-
  Review a change on three axes — spec compliance, repo standards, correctness — then publish the findings 
  as inline PR comments or into a review file in the task folder.
argument-hint: pr|md [--round first|follow-up] [--scope branch|uncommitted] [--as <tag>] [--ticket <NN>]
disable-model-invocation: true
---

# Review changes

Review a change the way a lead reviewer would: the **axes** that apply, in parallel, each in its own fresh
subagent context, then one normalized report.

You produce **findings** and nothing else. Fixing them is `resolve-review`'s job.

## Inputs

Nothing here is inferred. The output is the one positional and the one required input; a run without it
stops rather than guessing.

| Input | Values | Default | Meaning |
| --- | --- | --- | --- |
| `output` *(positional)* | `pr` · `md` | **required** | where the findings are published |
| `--round` | `first` · `follow-up` | `first` | `follow-up` is arbitration (step 3), never a fresh pass |
| `--scope` | `branch` · `uncommitted` | `branch` | what to diff. `md` only |
| `--as <tag>` | short slug (`cursor`, `codex`) | none | namespaces the findings, for concurrent reviewers |
| `--ticket <NN>` | ticket number | inferred | `--scope uncommitted` only |

```
/review-changes pr                              round 1 on the current branch's PR
/review-changes pr --round follow-up            arbitrate the rulings on that PR
/review-changes md --scope uncommitted          the ticket in flight, before it is committed
/review-changes pr --as cursor                  a second reviewer on a PR another agent already reviewed
```

Contradictory inputs stop the run: `--scope` or `--ticket` with `pr`, or `--ticket` with `--scope branch`.

A `--scope uncommitted` run also stops when you cannot determine **whose** working-tree changes these are — 
the resolved ticket, task-level work spanning several tickets, or fixes from an earlier round. Ask the 
operator which, and review only after they answer.

### `--as` and concurrent reviewers

Two agents may review the same change simultaneously; comparing their findings is the point. The tag keeps
them separate by prefixing every finding ID (`cursor-F1`) and, in `md` mode, the file name. Without a tag,
IDs are bare (`F1`), with no collision because only one reviewer is present. A `follow-up` round applies
only to findings carrying **its own** tag, where an untagged round owns the untagged findings — the rest
belong to another reviewer's round. Do not derive the tag: guessing it from the running model makes it
change when the model does, causing round 2 to disown round 1's findings.

**Guard.** In a `first` round, a review of this change already sitting under someone else's tag means
another agent is working. With no `--as` of your own, stop and ask for one rather than overwriting it —
with a tag, you are the second reviewer and carry on.

## 1. Pin the ground

Resolve the base and the preconditions, and **fail fast before spawning anything**. A breached
precondition, a base that does not resolve (`git rev-parse`), or an empty diff stops the run here, not
inside three subagents.

| output · `--scope` | Base | Precondition | Repo checks |
| --- | --- | --- | --- |
| `pr` | merge-base with the PR's `baseRefName` | clean tree, and `HEAD` == the PR's `headRefOid` | none — the Checks workflow owns them |
| `md` · `branch` | merge-base with `main` | clean tree | run them |
| `md` · `uncommitted` | `HEAD`, against the working tree | a non-empty working diff | run them |

```bash
git status --porcelain                                    # output = dirty
gh pr list --head "$(git branch --show-current)" --state open \
  --json number,headRefOid,baseRefName                    # pr mode; see gh-commands.md
git rev-parse HEAD
```

**A `md` `follow-up` round has no clean-tree precondition.** `resolve-review` leaves its `md`-mode fixes
uncommitted on purpose ([`../resolve-review/SKILL.md`](../resolve-review/SKILL.md) step 6), so the round
whose whole job is verifying those fixes expects a dirty tree — under either scope.

**An open PR plus an out-of-sync branch stops the run.** Say which way it diverged and what to run — `git
push` when `HEAD` is ahead, `git pull` when behind. Otherwise lines that were never pushed are absent from
the PR diff, every anchor fails, and the all-or-nothing POST discards the whole review.

Collect, in the review's own context:

- `git diff --stat <base>` and `git diff --name-only <base>`, plus untracked files
  (`git ls-files --others --exclude-standard`) — a new file is the most review-worthy thing in a change and
  `git diff` alone misses it. Under `--scope uncommitted` the new files are usually most of the change.
- The task's `spec.md` (if this is a task PR) and [`../../delegation.md`](../../delegation.md).

Where the table says to run the checks, run them yourself rather than taking "checks pass" on trust —
verifying that claim is most of what a review is worth:

```bash
pnpm lint:eslint
pnpm lint:tsc
pnpm lint:cspell
pnpm test:vitest --changed <base>
```

**Done when**: the base, the touched-file list, and (where run) the check results are in hand, and the diff
is known non-empty.

## 2. Round `first` — spawn the axes

Send **one** message with the `general-purpose` subagents the change actually has axes for. Each gets: the
base ref, the touched-file list plus untracked files, the check output as established fact, and
[`axes.md`](axes.md) — its own brief, the finding shape and the word cap all live there.

**The spec axis is gated on a spec existing.** Plenty of changes have none — work done outside the task
workflow, and any task finished inside its own grilling session (see "Not every task needs a spec" in
[`../../tasks/README.md`](../../tasks/README.md)). Confirm `spec.md` is there before dispatching. With no
spec, run **two** axes and say so in the report.

**Done when**: every dispatched axis has returned, or one has failed and you have noted which.

## 3. Round `follow-up` — arbitration

Re-reviewing everything keeps surfacing unrelated findings, so the round never converges. This round rules
on what is already open and nothing else.

Spawn **one** fresh `general-purpose` agent — fresh, so it rules on the evidence rather than defending a
claim it made itself. Give it your own tag's open findings with their full reply history, and the current
code. It does exactly three things:

1. Verify each claimed fix actually addresses its finding, rather than cosmetically silencing it.
2. Rule on each `reject`: **agree** — the finding closes, in the words its output file's ruling table
   gives — or **disagree**, with a counter-argument.
3. Flag regressions introduced **by the fixes only**. New findings elsewhere are out of scope for this round.

Under `--scope uncommitted` the fixes are not separable from the original work in the diff, so verify each
one against the code as it now stands rather than looking for what changed since round 1.

**Done when**: every open finding of yours is either closed or carries a ruling — and a deferred nit's
ruling is that it stays open.

## 4. Normalize

Only this context sees every axis, so only it can calibrate. Left alone, each axis inflates its own findings
to `blocker` because that axis is all it can see.

- **Severity.** `blocker` — a requirement missing or wrong, a correctness bug, or a rule breach with a real
  consequence. `major` — real cost, not shipping-critical. `nit` — taste. Set `needs-human` on any finding
  that turns on design intent the code cannot settle; it is orthogonal to severity and it is the loop's
  escape hatch. Only `pr` mode records it — `md` mode is read by agents alone, so the escape hatch there is
  `resolve-review`'s Gate 1, which puts the question to the developer in the terminal.
- **One defect, one label.** The same defect seen through two axes is one finding: pick the sharper label
  and drop the other. Never report it twice.
- **Another reviewer's finding stays theirs.** A defect already raised under a different tag gets a
  concurrence on their thread, not a second id under yours.
- **Anchor check.** For every surviving finding, open its `file:line`. Confirm the quoted code is actually
  there and the claim still holds. Drop what fails. Hallucinated line numbers and stale claims are the two
  things that end a reviewer's credibility.

**Done when**: every finding has a normalized severity, a verified anchor, and exactly one axis label.

## 5. Publish

Both outputs carry the same findings, worded the same way, with the same ids and severities. They differ
only in where a finding lives and how its thread is closed.

| Output | Mechanics |
| --- | --- |
| `pr` | [`output-pr.md`](output-pr.md) |
| `md` | [`output-md.md`](output-md.md) |

Zero findings still publishes, with the outcome `cleared` and zeroed counts — a missing report is
indistinguishable from a review that never ran.

**The outcome is defined here; both output files render this definition rather than restating it.** It is
`blocked` while any `blocker` or `major` is open, and `cleared` once only nits remain.

Then close **in the terminal** with where the review was published — the review's `html_url` from the POST
response, or the review file's path — counts per severity, counts per axis (an axis that came back empty is
worth a second look), and the outcome.

**Done when**: the review is published and the counts reported.

## Out of bounds

Not findings, no matter how they look. Each of these otherwise fills a report with noise that trains the
reader to skim past real problems.

- **Any visual or styling judgement.** Presentation belongs to the `[human]` style leaf.
- **Anything the spec's Out of scope section names.**
- **Missing Playwright screenshot baselines** — human-generated, per [`../../delegation.md`](../../delegation.md).
- **Style preferences with no basis** in `.agents/rules/`, a `CONTEXT.md`, or the surrounding code. No
  citable rule or precedent, no finding.
- **Any "add a comment here" suggestion.** `code-quality.md` bans comments outright; its one exception — a
  *why* comment on code whose obvious reading is wrong — is the author's call, never a reviewer's request.
  A comment the diff *adds* that is not such a why comment is the opposite: a citable rule breach.
- **A primitive or shortcut with a why-comment on it.** The comment is an override signal: read it and back
  off rather than arguing with it.
- **A `TODO (design):` marker that has been consumed.** An *unconsumed* marker, though, is a finding here:
  by land the `[human]` style leaves have had their turn, so a leftover marker is real dead scaffolding.
