# Publishing to a review file

`md` mode. One Markdown file holds the whole exchange — findings, replies, rulings — in place of the PR's
threads. Only agents read it (`resolve-review` replies in the same file), so a finding carries no
`— Reviewed by` footer: there is no human to tell an agent's comment from a colleague's.

## Where the file goes

The task folder comes off the branch name, `issue-<number>` → `.agents/tasks/<issue>-<slug>/`. If no task
folder resolves, stop and ask — this mode reviews tasks and tickets, and inventing a path elsewhere buries
the review where nothing will look for it.

| `--scope` | The file |
| --- | --- |
| `branch` | `<task>/review.md` |
| `uncommitted` | `<task>/tickets/<NN>-<slug>/review.md` |

`<NN>` comes from `--ticket`, or from the first unchecked box in `progress.md` — uncommitted work is by
definition the ticket in flight, since `implement-ticket` checks the box only once the commit exists. An
absent or ambiguous `progress.md` stops the run.

Under `--as <tag>` the file is `review-<tag>.md` beside it, so concurrent reviewers never write the same
file.

Both are working files: `finalize-task` prunes them with the rest of the task's scaffolding, and only
`spec.md` survives the land.

## The file

A `## Rounds` log, then one `###` section per finding — the thread. Replies append inside the section as
blockquote lines; the `**Status:**` line is the only record of what is still open, so it is edited in place
rather than restated in the index.

```md
# Review — tickets/03-holders-table · uncommitted

## Rounds

- **1** — 2026-09-07, <model name>. blocker 1 · major 2 · nit 1. Outcome: blocked.

## Findings

| id | severity | needs-human | axis | location |
| --- | --- | --- | --- | --- |
| F1 | blocker | no | correctness | `src/slices/token/pages/Holders.tsx:41` |

### F1 · blocker · correctness · `src/slices/token/pages/Holders.tsx:41`

**Claim.** <what is wrong, quoting the code>

**Fix.** <one or two lines>

**Status:** open

> **resolve-review, round 1:** fix — <what changed>
> **review, round 2:** verified
```

A finding with no line to sit on keeps its section and writes `location: —`. The PR's split into a separate
comment has nothing to do here, and neither do its severity emoji: only agents read this file.

Zero findings still writes the file: the `## Rounds` line reads `Outcome: cleared` and `## Findings` is
empty.

## A `follow-up` round

Append a line to `## Rounds`, then work each of your open findings:

| Ruling | Reply line | Status |
| --- | --- | --- |
| fix verified | `verified` | `resolved — verified` |
| reject agreed | `accepted, <reason>` | `resolved — rejected` |
| reject disputed | the counter-argument | `disputed` |
| regression from a fix | a new `###` section, next free id | `open` |

The round's `## Rounds` line reads `Outcome: blocked` while any `blocker` or `major` is left open, and
`Outcome: cleared` once only nits remain — the same two words `pr` mode puts on its status line.
