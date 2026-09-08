---
name: resolve-review
description: >-
  Close out review findings — adjudicate each one, fix what deserves fixing, then reply on the PR threads or
  in the task's review file.
argument-hint: pr|md [<PR url | comment url | review file path>]
disable-model-invocation: true
---

# Resolve review

Work through a change's review findings and close them out. The hard part is not fixing — it is deciding
*which* findings deserve a fix. So the centre of this skill is **adjudication**: every finding gets a
**verdict**, reached skeptically, by checking the claim against the real code and the project's intent
rather than by trusting how confidently it was worded.

In the product-task workflow this runs at **land**, against the whole-task PR, and mid-ticket against the
review file `review-changes` wrote for uncommitted work.

## Inputs

Mirrors `review-changes`: the same output, first and required, decides where the findings are read from and
replied to.

| Input | Values | Default | Meaning |
| --- | --- | --- | --- |
| `output` *(positional)* | `pr` · `md` | **required** | where the findings live |
| `target` *(positional)* | PR url, comment url, or review-file path | the current branch's PR / its review file | scopes the run |

```
/resolve-review pr                      every open finding on the current branch's PR
/resolve-review pr <comment url>        that single comment, scoping the whole run to it
/resolve-review md                      the current branch's review file
/resolve-review md <path>               that review file — one reviewer's, where several ran
```

The default `md` path is resolved exactly as `review-changes` resolves it
([`../review-changes/output-md.md`](../review-changes/output-md.md)). Several review files side by side
means several reviewers ran: resolve them in one pass, and where two raise the same defect, fix once and
reply on both.

## Verdicts, by source

Which verdicts are even available depends on who raised the finding, so establish the source first. In `md`
mode every finding came from `review-changes`, so the question does not arise — `fix` or `reject`.

| Source | How you know it | Verdicts |
| --- | --- | --- |
| This workflow's review | a PR comment ending in a `— Reviewed by …` footer | `fix` · `reject` |
| A bot | `user.type == "Bot"` | `fix` · `reject` |
| A human | neither of the above | `fix` · `answered` |

Test in that order. The footer comes first because an agent posts through a human's account — `user.login`
is the repo owner's in every case, so nothing but the footer distinguishes this workflow's own review.
Bots are then caught by GitHub's own `user.type`, **not** by a list of logins: this repo alone sees
`Copilot` (no `[bot]` suffix, capitalised), `coderabbitai[bot]`, `cursor[bot]` (Cursor Bugbot, which
`.cursor/BUGBOT.md` aims at our smell baseline) and `github-advanced-security[bot]`, and a name list gets
three of those four wrong — silently promoting them to human, whose comments may never be rejected.

- **fix** — the concern is real *and* the fix belongs in this change.
- **reject** — invalid premise, contradicts design intent, already addressed, or out of scope. Closes with
  an explanation.
- **answered** — *only* for a human's comment, and the only alternative to fixing one. Reply with the
  reasoning: why it was done this way, what alternatives were considered, why this path won. Then **leave
  the thread unresolved** and let the human decide whether they still insist. A human comment is never
  rejected — they may be wrong, but that call is theirs, not yours.

Two further rules on verdicts:

- **No repeat rejection.** A finding you rejected once, where the reviewer came back and disagreed, may not
  be rejected again on the same grounds. Fix it, reject it on genuinely **new** grounds (once), or mark it
  `needs-human`.
- **Nits are `deferred`**, not fixed. The developer may promote one at Gate 1.

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
actionable threads. Drop already-resolved threads, your own prior replies, and bot status noise (CodeRabbit
"review skipped", Copilot's PR overview). Tag each with its **source** per the table above.

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
- **Give bots no deference.** A plausible-sounding suggestion is not automatically correct; a bot can
  contradict the author's intent or argue from the wrong docs.
- **When a verdict turns on design intent you cannot settle from the code and the spec, mark it
  `needs-human`.** Do not guess.

For each finding record the verdict, the reasoning, and the proposed action — the fix sketch, or the reply
text for a `reject` or an `answered`.

**Done when**: every gathered finding has a verdict, reasoning, and a proposed action, or is `needs-human`.

## 4. Gate 1 — confirm

**A hard stop.** Present a table — finding (id, `file:line` + short quote), source, verdict, reasoning,
proposed action — and list the `needs-human` items as questions. Then **stop and wait**. Edit no code until
the developer confirms; they may re-categorise anything or answer the open questions. This is the cheapest
steering point in the whole process, which is why it comes before any edit.

**Done when**: the developer has confirmed.

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

## 7. Close out

Reply to every finding; **who closes it depends on the source.**

- `fix` → what changed, plus the commit sha once it exists.
- `reject` → the explanation.
- `answered` → the reasoning, the alternatives, why this path won.

**This workflow's own findings — reply, never close.** The reviewer raised them and owns their close: it
verifies the fix (or agrees the reject) and closes them in its next follow-up round, which is what lets it
confirm the work landed and post the final all-clear. Closing here would end the loop before the reviewer
ever checked it.

In `pr` mode that means replying on the thread and leaving it unresolved. **Bot findings** — resolve on
`fix` or `reject`; a bot has no follow-up round, so its verdict stands on posting. **Human findings** —
resolve on `fix`, and leave `answered` open for the human. Leave every `needs-human` thread open.

In `md` mode, append a reply line under the finding — `> **resolve-review, round <n>:** fix — <what
changed>` — and leave its `**Status:**` alone.

**Done when**: every adjudicated finding has been replied to and (where settled) resolved. Then report:
counts per verdict, every `reject`/`answered` with its one-line reason, and anything left for a human.
