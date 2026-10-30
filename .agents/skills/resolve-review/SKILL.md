---
name: resolve-review
description: >-
  Close out review findings — adjudicate each one, fix what deserves fixing, then reply on the PR threads or
  in the task's review file.
argument-hint: pr|md [<PR url | comment url | review file path>] [--auto] [--scope branch|uncommitted] [--ticket <NN>]
disable-model-invocation: true
---

# Resolve review

Work through a change's review findings and close them out. The hard part is not fixing — it is deciding
*which* findings deserve a fix. So the centre of this skill is **adjudication**: every finding gets a
**verdict**, reached skeptically, by checking the claim against the real code and the project's intent
rather than by trusting how confidently it was worded.

In the product-task workflow this runs at **land**, against the whole-task PR, and mid-ticket against the
review file `review-changes` wrote for uncommitted work. The `review-loop` skill dispatches it per round
with `--auto`, as a fresh subagent.

## Inputs

Mirrors `review-changes`: the same output, first and required, decides where the findings are read from and
replied to.

| Input | Values | Default | Meaning |
| --- | --- | --- | --- |
| `output` *(positional)* | `pr` · `md` | **required** | where the findings live |
| `target` *(positional)* | PR url, comment url, or review-file path | the current branch's PR / its review file | scopes the run |
| `--auto` | flag | off | autonomous gating: no Gate 1, no Gate 2, the run commits and pushes (or leaves the push to a caller that says it pushes); the only stop is `needs-human`. `pr` only |
| `--scope` | `branch` · `uncommitted` | `branch` | which review file: the task's, or the in-flight ticket's. `md` only |
| `--ticket <NN>` | ticket number | inferred | `--scope uncommitted` only |

```
/resolve-review pr                      every open finding on the current branch's PR
/resolve-review pr --auto               the same, unattended — one round of the review loop
/resolve-review pr <comment url>        that single comment, scoping the whole run to it
/resolve-review md                      the task-level review file
/resolve-review md --scope uncommitted  the in-flight ticket's review file
/resolve-review md <path>               that review file — one reviewer's, where several ran
```

Contradictory inputs stop the run: `--scope` or `--ticket` with `pr`, `--ticket` with `--scope branch`, or
`--auto` with `md`.

### Auto mode

`--auto` is a gating policy, not a second procedure. Steps 1–3, 5 and 7 run unchanged; the two gates switch
off, and the **In auto mode** sentences below say what replaces the developer's judgement at each: the two
verdict rules, and the commit at step 6. Where the interactive run
would have stopped for the developer, the auto run stops only on `needs-human` — and then **before any
edit**, returning as [Returning on `needs-human`](#returning-on-needs-human) specifies, so the caller can put
the questions to the developer and resume the same run.

`--scope` and `--ticket` are `review-changes`' own, and the file resolves off them exactly as it does there
([`../review-changes/output-md.md`](../review-changes/output-md.md)) — `branch` is the task-level
`review.md`, `uncommitted` the ticket's. An explicit `target` path settles the file outright and makes both
redundant. Several review files side by side means several reviewers ran: resolve them in one pass, and
where two raise the same defect, fix once and reply on both.

## Verdicts, by source

Which verdicts are even available depends on who raised the finding, so establish the source first. In `md`
mode every finding came from `review-changes`, so the question does not arise — `fix` or `reject`.

| Source | How you know it | Verdicts |
| --- | --- | --- |
| This workflow's review | a PR comment ending in a `— Reviewed by …` footer | `fix` · `reject` |
| A bot | `user.type == "Bot"` | `fix` · `reject` |
| A human | anything else | `fix` · `answered` |

Test the rows in that order. The footer is what separates this workflow's own review from a colleague's —
why, in [`../review-changes/gh-commands.md`](../review-changes/gh-commands.md). Bots are then caught by
GitHub's own `user.type`, **not** by a list of logins: this repo still runs CodeQL and Copilot, so
`github-advanced-security[bot]` and `Copilot` (no `[bot]` suffix, capitalised) both reach a PR, and a name
list goes stale the moment the tooling around the repo changes. Miss either test and an agent's or a bot's
finding is silently promoted to human, whose comments may never be rejected.

- **fix** — the concern is real *and* the fix belongs in this change.
- **reject** — invalid premise, contradicts design intent, already addressed, or out of scope. Closes with
  an explanation.
- **answered** — *only* for a human's comment, and the only alternative to fixing one. Reply with the
  reasoning: why it was done this way, what alternatives were considered, why this path won. Then **leave
  the thread unresolved** and let the human decide whether they still insist. A human comment is never
  rejected — they may be wrong, but that call is theirs, not yours.

Two further rules on verdicts, each with its auto-mode form:

- **No repeat rejection.** A finding you rejected once, where the reviewer came back and disagreed, may not
  be rejected again on the same grounds. Fix it, reject it on genuinely **new** grounds (once), or mark it
  `needs-human`. **In auto mode** the reviewer's second dispute on the same finding turns it `needs-human`
  outright: a rejection, a disputed rejection, a rejection on new grounds, a second dispute — and the
  question goes to the developer. There is never a third rejection.
- **Nits are `deferred`**, not fixed. The developer may promote one at Gate 1. **In auto mode** a nit is
  fixed when its fix stays within 5 lines in one file, adds no test and creates no file, and always when the
  nit concerns comments, docs or tests; any other nit is `deferred` and stays an open thread for the
  developer.

## 1. Scope

Establish what you are resolving:
- in `pr` mode derive `owner/repo` and the PR number, and confirm `gh auth
status` succeeds (commands: [`../review-changes/gh-commands.md`](../review-changes/gh-commands.md))
- in `md` mode resolve the review file and read it; a path that does not exist stops the run rather than
becoming a fresh review.

**Done when**: you know the unit of work and whether the scope is every open finding or one specific
finding.

## 2. Gather

In `pr` mode, collect every **actionable** finding — inline review comments, PR-level reviews, and issue
comments ([`../review-changes/gh-commands.md`](../review-changes/gh-commands.md)). Keep only unresolved,
actionable threads. Drop already-resolved threads and your own prior replies. Tag each with its **source**
per the table above.

A footer-bearing issue comment titled `### 📎 Findings without a diff anchor` holds several findings at
once, one per `**<emoji> <tag->F<n> · <severity>**` title, the tag prefix present exactly when that
reviewer ran under `--as`. Split them and adjudicate each on its own. They have no resolved flag, so read
one as open unless a later footer-bearing comment already rules on that id.

In `md` mode, collect every finding whose `**Status:**` is `open` or `disputed`. The file's reply
blockquotes carry the exchange history — read them, so a finding you already rejected once is not rejected
again on the same grounds.

Either way, open the code each finding points at — `path` + `line`, or the `diff_hunk` — so the next step
judges against reality rather than against the comment text.

**Done when**: every actionable finding is listed with its source, its location, and the current code it
refers to. Exhaustive, not a sample.

## 3. Adjudicate

The heart of the skill. Reason hard here; do not rush toward the gate.

- **Investigate before judging.** Verify the claim against the actual code. Check whether it still applies —
  it may be stale or already fixed. Weigh it against the spec and the conventions in `.agents/rules/`.
- **Decompose multi-point findings.** One comment can be part-`fix`, part-`reject`. Adjudicate each point.
- **Give the reviewer no deference.** A plausible-sounding finding is not automatically correct; a review
  agent or a bot can contradict the author's intent or argue from the wrong docs.
- **When a verdict turns on design intent you cannot settle from the code and the spec, mark it
  `needs-human`.** Do not guess. A finding the reviewer already marked `🙋 needs human` is `needs-human`
  from the start.

For each finding record the verdict, the reasoning, and the proposed action — the fix sketch, or the reply
text for a `reject` or an `answered`.

**Done when**: every gathered finding has a verdict, reasoning, and a proposed action, or is `needs-human`.

## 4. Gate 1 — confirm

**A hard stop.** Present the verdict table (shape below) and list the `needs-human` items as questions.
Then **stop and wait**. Edit no code until the developer confirms; they may re-categorise anything or answer
the open questions. This is the cheapest steering point in the whole process, which is why it comes before
any edit.

The verdict table, one row per finding: finding (id, `file:line` + short quote), source, verdict, reasoning,
proposed action.

**In auto mode** there is no confirmation. With no `needs-human` finding, go straight to step 5. With one or
more, this is where the run stops: [Returning on `needs-human`](#returning-on-needs-human).

**Done when**: the developer has confirmed — or, in auto mode, the table holds no `needs-human` row.

## 5. Fix

Implement the confirmed `fix` items only, following the conventions in `.agents/rules/`. Run the checks
those files define for the code you touched. Leave `reject`, `answered`, `deferred` and `needs-human`
findings untouched.

**Done when**: every confirmed fix is applied and locally verified.

## 6. Gate 2 — review the diff

**A hard stop.** Show `git diff` plus a per-finding summary of what changed, and wait for approval before
anything is pushed or replied to. In `pr` mode the developer commits and pushes the fixes — the reviewer's
next follow-up round reads them from the PR. In `md` mode the fixes stay uncommitted, which is what the
reviewer's follow-up round reads.

**In auto mode** there is no approval: commit the fixes yourself — one commit, a plain descriptive subject,
the repo's `Co-Authored-By` trailer, no `#issue` reference — and `git push`. When the caller's brief says it
pushes itself, commit and leave the push to it: the `review-loop` skill pushes once per round after its CI
wait, and the reviewer's follow-up round reads the PR from that push.

## Returning on `needs-human`

The auto run's one stop, and the contract the `review-loop` skill reads. It happens at step 4, **before any
edit**: the working tree is as the run found it, nothing is committed, replied to or resolved.

Return one block the caller can present verbatim:

1. The full verdict table from step 4 — **every** finding, not only the `needs-human` rows — so the
   developer sees what the run will do once resumed.
2. The questions, one per `needs-human` finding, each naming its finding id and stating what the code and
   the spec could not settle.

Then stop. Nothing else is in the block: the caller presents it, collects the developer's answers, and
**resumes the same run with the answers** — the same agent, with its table and reasoning still in context,
not a fresh dispatch. In Claude Code that is a `SendMessage` to this subagent. On resumption, re-adjudicate
each `needs-human` finding against its answer (`fix`, `reject` or `answered`, per the source's row in the
verdicts table), add the ones ruled `fix` to the fix set, and continue at step 5. The reply at step 7 cites
the developer's answer as the reasoning.

## 7. Close out

Reply to every finding; **who closes it depends on the source.**

- `fix` → what changed, plus the commit sha once it exists.
- `reject` → the explanation.
- `answered` → the reasoning, the alternatives, why this path won.
- `deferred` → that it is a nit left as it stands, so the reviewer's follow-up round can rule `deferred`
  rather than wait on a fix that is not coming.

**This workflow's own findings — reply, never close.** The reviewer raised them and owns their close: it
verifies the fix (or agrees the reject) and closes them in its next follow-up round, which is what lets it
confirm the work landed and post the final all-clear. Closing here would end the loop before the reviewer
ever checked it.

In `pr` mode that means replying on the thread and leaving it unresolved. **Bot findings** — resolve on
`fix` or `reject`; a bot has no arbitration round, so your verdict is the last word on its thread.
**Human findings** — resolve on `fix`, and leave `answered` open for the human. Leave every `needs-human`
thread open.

Non-anchorable findings have no thread. Reply to all of them in **one** new issue comment, each line naming
its id, so the reviewer's follow-up round can match the ids it raised.

In `md` mode, append a reply line under the finding — `> **resolve-review, round <n>:** fix — <what
changed>` — and leave its `**Status:**` alone.

**Done when**: every adjudicated finding has been replied to and (where settled) resolved. Then report:
counts per verdict, every `reject`/`answered` with its one-line reason, and anything left for a human.
