---
name: resolve-review
description: >-
  Close out review findings — adjudicate each one, fix what deserves fixing, then record the verdicts
  or reply and resolve the PR threads.
disable-model-invocation: true
---

# Resolve review

Work through review findings and close them out. The hard part is not fixing — it is deciding *which*
findings deserve a fix. So the centre of this skill is **adjudication**: every finding gets a **verdict**,
reached skeptically, by checking the claim against the real code and the project's intent rather than by
trusting how confidently it was worded.

## Verdicts, by source

Which verdicts are even available depends on who raised the finding, so establish the source first.

| Source | How you know it | Verdicts |
| --- | --- | --- |
| This workflow's review | a `review.md` finding, or a PR comment ending in a `— Reviewed by …` footer | `fix` · `reject` |
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

- **No repeat rejection.** A finding you rejected once, where the reviewer came back and disagreed, may
  not be rejected again on the same grounds. Fix it, reject it on genuinely **new** grounds (once), or
  mark it `needs-human`.
- **Nits are `deferred`**, not fixed. The developer may promote one at Gate 1.

## Invocation

- `/resolve-review` — the usual case: resolve the open findings for the current unit of work. A `review.md`
  with anything left to resolve (per step 2) selects markdown mode; otherwise the current branch's PR
  selects PR mode.
- `/resolve-review <PR url | comment url>` — that PR, or that single comment, scoping the whole run to it.

Called from `implement-task --auto`, the skill runs in **no-gates posture** — see Gate 1.

## 1. Scope

Establish what you are resolving and in which mode. In PR mode derive `owner/repo` and the PR number, and
confirm `gh auth status` succeeds (commands: `../review-changes/gh-commands.md`).

**Done when**: you know the mode, the unit of work, and whether the scope is every open finding or one
specific comment.

## 2. Gather

Collect every **actionable** finding.

- **Markdown mode** — the `review.md` section for this unit: every finding whose Status is `open`, plus any
  `disputed` finding the latest round ruled on.
- **PR mode** — inline review comments, PR-level reviews, and issue comments (`gh-commands.md`). Keep only
  unresolved, actionable threads. Drop already-resolved threads, your own prior replies, and bot status
  noise (CodeRabbit "review skipped", Copilot's PR overview).

Tag each with its **source** per the table above, then open the code it points at — `path` + `line`, or
the `diff_hunk` — so the next step judges against reality rather than against the comment text.

**Done when**: every actionable finding is listed with its source, its location, and the current code it
refers to. Exhaustive, not a sample.

## 3. Adjudicate

The heart of the skill. Reason hard here; do not rush toward the gate.

- **Investigate before judging.** Verify the claim against the actual code. Check whether it still applies
  — it may be stale or already fixed. Weigh it against the spec and the conventions in `.agents/rules/`.
- **Decompose multi-point findings.** One comment can be part-`fix`, part-`reject`. Adjudicate each point.
- **Give bots no deference.** A plausible-sounding suggestion is not automatically correct; a bot can
  contradict the author's intent or argue from the wrong docs.
- **When a verdict turns on design intent you cannot settle from the code and the spec, mark it
  `needs-human`.** Do not guess — this is the escape hatch that keeps an unattended run from quietly
  inventing product decisions.

For each finding record the verdict, the reasoning, and the proposed action — the fix sketch, or the reply
text for a `reject` or an `answered`.

**Done when**: every gathered finding has a verdict, reasoning, and a proposed action, or is marked
`needs-human`.

## 4. Gate 1 — confirm

**Manual invocation: a hard stop.** Present a table — finding (`file:line` + short quote), source, verdict,
reasoning, proposed action — and list the `needs-human` items as questions. Then **stop and wait**. Edit no
code until the developer confirms; they may re-categorise anything or answer the open questions. This is
the cheapest steering point in the whole process, which is why it comes before any edit.

**Auto posture (`implement-task --auto`): no stop** — but write every verdict and its reasoning into
`review.md` *before* touching code. The written record is what replaces the gate, so it has to exist even
if the run dies halfway through the fixes.

**Done when**: the developer has confirmed, or the verdicts are recorded.

## 5. Fix

Implement the confirmed `fix` items only, following the conventions in `.agents/rules/`. Run the checks
those files define for the code you touched. Leave `reject`, `answered`, `deferred` and `needs-human`
findings untouched.

Do **not** commit. In auto mode `implement-task` owns the commit, folding these fixes into the subtask's
single commit; in manual mode the developer commits.

**Done when**: every confirmed fix is applied and locally verified.

## 6. Gate 2 — review the diff

**Manual invocation: a hard stop.** Show `git diff` plus a per-finding summary of what changed, and wait
for approval before anything is pushed or replied to.

**Auto posture: no stop.** Nothing is pushed here in any case.

## 7. Close out

**Markdown mode** — update each finding's **Status** in `review.md` and append one exchange line per finding
recording this round's verdict and its reasoning. A verdict is not a Status; these are the Statuses it maps to:

| Verdict | Status |
| --- | --- |
| `fix`, applied | `fixed` |
| `reject` of a **bot's** finding | `rejected-accepted` — no arbitration exists for a bot, so the reject stands on posting |
| `reject` of **this workflow's** finding | `rejected-pending` until an arbitration round agrees, then `rejected-accepted`; `disputed` if it comes back disagreeing |
| `answered` | `needs-human` — the human still owns the call |
| nit | `deferred` |

**PR mode** — reply to every thread; **who resolves depends on the source.**

- `fix` → what changed, plus the commit sha once it exists.
- `reject` → the explanation.
- `answered` → the reasoning, the alternatives, why this path won.

**This workflow's own findings — reply, never resolve.** The reviewer raised them and owns their close: it
verifies the fix (or agrees the reject) and resolves in its next arbitration round, which is what lets it
confirm the work landed and post the final all-clear. Resolving here would close the loop before the
reviewer ever checked it.

**Bot findings** — resolve on `fix` or `reject`; a bot has no arbitration round, so its verdict stands on
posting. **Human findings** — resolve on `fix`, and leave `answered` open for the human. Leave every
`deferred` nit and `needs-human` open — those must stay visible; a `deferred` nit is not declined, just
not this change's work.

**Done when**: every adjudicated finding carries its final Status in the record, or has been replied to and
(where settled) resolved on the PR. Then report: counts per verdict, every `reject`/`answered` with its
one-line reason, and anything left for a human.
