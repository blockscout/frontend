---
name: review-changes
description: >-
  Review a change on three axes — spec compliance, repo standards, correctness — each in a fresh subagent
  context, then post the findings as inline PR comments (or report them in chat when there is no PR).
disable-model-invocation: true
---

# Review changes

Review a change the way a lead reviewer would: the **axes** that apply, in parallel, each in its own fresh
subagent context, then one normalized report.

You produce **findings** and nothing else. Fixing them is `resolve-review`'s job, so this skill never edits
a file — which is also why it runs `lint:eslint` and never `lint:eslint:fix`.

## Scope and mode

Mode follows from where the code is.

| Working tree | Mode | Base |
| --- | --- | --- |
| Clean, PR open, `HEAD` = the PR's head sha | inline PR comments | merge-base with the PR's base branch |
| Clean, PR open, `HEAD` ≠ the PR's head sha | **stop — the branch must be synced first** | — |
| Clean, no PR | chat only, no file | merge-base with `main` |

**An open PR plus an out-of-sync branch stops the run.** Say which way it diverged and what to run — `git
push` when `HEAD` is ahead, `git pull` when behind — then stop rather than review. Otherwise lines that were
never pushed are absent from the PR diff, every anchor fails, and the all-or-nothing POST discards the whole
review.

The skill takes no invocation arguments — every case above is inferred.

**Round detection.** Prior review comments on the PR make this run **arbitration** (step 3) rather than a
fresh review — keyed on the presence of prior comments, not on whether findings are still open, so a second
round never silently becomes another three-axis pass.

## 1. Pin the ground

Resolve the mode with exactly these three probes, then **fail fast before spawning anything**: a wrong mode,
a base that does not resolve (`git rev-parse`), or an empty diff stops the run here, not inside three
subagents.

```bash
git status --porcelain                                    # any output at all → dirty, not ready to review
gh pr list --head "$(git branch --show-current)" --state open \
  --json number,headRefOid,baseRefName
git rev-parse HEAD                                        # compare against headRefOid
```

**The `gh` exit code answers "could I ask?"; its output answers "is there one?"** Exit ≠ 0 is a tooling
failure that **aborts the run**; exit 0 with `[]` is genuinely no PR. Use `gh pr list --json` and never `gh pr
view`, which exits 1 *both* when no PR exists and when it cannot reach GitHub — so nothing downstream can tell
a missing PR from a sandbox with no network. Never wrap either command in `||`.

`--state open` matters: a merged or closed PR must not select PR mode. `headRefOid` and `baseRefName` come
back from that same call, so the base is read rather than guessed, and a plain string comparison against
`HEAD` decides PR mode — unequal in *either* direction means out of sync.

Collect, in the review's own context:

- `git diff --stat <base>` and `git diff --name-only <base>`, plus untracked files
  (`git ls-files --others --exclude-standard`) — a new file is the most review-worthy thing in a change
  and `git diff` alone misses it.
- The task's `spec.md` (if this is a task PR) and `.agents/delegation.md`.

**In chat mode**, run the repo's checks yourself — do not take "checks pass" on trust, because verifying that
claim is most of what a review is worth:

```bash
pnpm lint:eslint
pnpm lint:tsc
pnpm lint:cspell
pnpm test:vitest --changed <base>
```

`vitest --changed` selects only the test files the change affects, and exits 0 when it affects none.

**In PR mode, checks are not your business at all** — neither run them nor read them. The Checks workflow
reports to the PR where the developer already sees it, and it may still be running alongside this review.

**Done when**: mode, base, the touched-file list, and (in chat mode) the check results are all in hand, and
the diff is known non-empty.

## 2. Round 1 — spawn the axes

Send **one** message with the `general-purpose` subagents the change actually has axes for. Each gets: the
base ref, the touched-file list plus untracked files, the check output as established fact, and the paths it
must read.

**The spec axis is gated on a spec existing.** Plenty of changes have none — work done outside the task
workflow, and any task finished inside its own grilling session (see "Not every task needs a spec" in
[`../../tasks/README.md`](../../tasks/README.md)). Confirm `spec.md` is there before dispatching. With no
spec, run **two** axes and say so in the report — the spec axis with nothing to read invents a standard to
judge against, which is worse than the gap it papers over. Standards and correctness carry the review on
their own.

Every axis returns findings in this shape, and nothing else — no preamble, no summary:

```
severity: blocker | major | nit
needs-human: yes | no
location: <path>:<line>
claim: <what is wrong — quote the code>
fix: <one or two lines>
```

Each report is capped at **400 words**, which forces ranking instead of dumping.

**Spec axis brief.** Read the spec (path given) and the diff. Its **Functional Requirements** are the
contract: take each one in turn and report whether the diff actually satisfies it, quoting the requirement
behind each finding. Then report what the requirements don't cover: behaviour in the diff the spec never
asked for, and requirements that look implemented but are implemented wrongly. Anything the spec's **Out of
scope** section names is not a finding.

**Standards axis brief.** Read `.agents/rules/*.md` matching the touched file types, every `CONTEXT.md` for
directories the diff touches, `.agents/delegation.md`, and **one** smell baseline, picked by what the diff
touches:

| The diff touches | Baseline |
| --- | --- |
| code | [`smells.md`](smells.md) |
| the instruction surface — `.agents/**`, `AGENTS.md`, any `CONTEXT.md`, `.cursor/**`, `.github/*instructions*` | [`prose-smells.md`](prose-smells.md) |
| both | both, each applied only to the files it governs |

Task specs under `.agents/tasks/**` are not the instruction surface — the Spec axis reads those as the
source of truth rather than reviewing them as instructions.

Report: places the diff breaks a documented rule — **cite the rule file and the rule** — and smells from the
baseline, each named and quoted. A documented rule can be a hard breach; a smell is always a judgement call.
Skip anything the checks in step 1 already cover.

**Correctness axis brief.** Read the touched files **in full**, plus the files the change depends on — a
hunk-only read produces exactly the shallow findings that make developers stop trusting review. Report:
logic errors; mishandled loading / empty / error / pagination paths; places where the types claim something
the runtime does not; and tests that assert the framework or the mock rather than real behaviour (per the
"What to test (and what not)" section of `.agents/rules/tests-unit.md`).

**Done when**: every dispatched axis has returned, or one has failed and you have noted which.

## 3. Round 2+ — arbitration

An arbitration round is **not** a fresh three-axis review. Re-reviewing everything keeps surfacing unrelated
findings, so the round never converges.

Spawn **one** fresh `general-purpose` agent — fresh, so it rules on the evidence rather than defending a
claim it made itself. Give it the prior review comments (which carry the full exchange history) and the
current diff. It does exactly three things:

1. Verify each claimed fix actually addresses its finding, rather than cosmetically silencing it.
2. Rule on each `reject`: **agree** — the finding closes as `rejected-accepted` — or **disagree**, with a
   counter-argument.
3. Flag regressions introduced **by the fixes only**. New findings elsewhere are out of scope for this round.

The reviewer posts these rulings and resolves the settled threads itself (step 5).

**Done when**: every open finding is either closed or carries a ruling.

## 4. Normalize

Only this context sees every axis, so only it can calibrate. Left alone, each axis inflates its own findings
to `blocker` because that axis is all it can see.

- **Severity.** `blocker` — a requirement missing or wrong, a correctness bug, or a rule breach with a real
  consequence. `major` — real cost, not shipping-critical. `nit` — taste. Set `needs-human` on any finding
  that turns on design intent the code cannot settle; it is orthogonal to severity and it is the loop's
  escape hatch.
- **One defect, one label.** The same defect seen through two axes is one finding: pick the sharper label
  and drop the other. Never report it twice.
- **Anchor check.** For every surviving finding, open its `file:line`. Confirm the quoted code is actually
  there, the claim still holds, and the line is in the PR diff. Drop what fails. Hallucinated line numbers
  and stale claims are the two things that end a reviewer's credibility.

**Done when**: every finding has a normalized severity, a verified anchor, and exactly one axis label.

## 5. Report

Zero findings still produces a report with `Outcome: clear` and zeroed counts — a missing report is
indistinguishable from a review that never ran.

**PR mode.** The PR is the record. `event` is always `COMMENT`: never `REQUEST_CHANGES`, which blocks the
author's own PR, and never `APPROVE`, which claims accountability an agent does not have. Name the reviewer
from the running model — any provider can run this skill — in a footer `— Reviewed by <agent or model
name>`, falling back to `— Reviewed by agent`. Commands and the all-or-nothing 422 hazard:
[`gh-commands.md`](gh-commands.md).

*A fresh review (round 1)* posts one batched review event — never N separate comments. Each inline comment
opens with its finding id and severity — `**F1 · blocker** — <claim>` — then the suggested fix and the
footer. The review body is the header table, listing each finding by id, plus a `## Not anchorable` section
for findings with no diff line to sit on: approach-level questions, or lines outside the diff. With zero
findings the body is `Review clear` and the zeroed counts. The id is the handle a human greps for and the
coder cites back, so it is stable: an arbitration round recovers the highest `F<n>` from the existing
comments and numbers any regression from there.

*An arbitration round (round 2+)* acts on each ruling on its own thread, because the reviewer owns the
threads it raised and is the one that closes them:

| Ruling | Reply | Thread |
| --- | --- | --- |
| fix verified | `F<n> — verified` | resolve |
| reject agreed | `F<n> — accepted, <reason>` | resolve |
| reject disputed | the counter-argument | leave open |
| regression from a fix | a new inline comment, next free id | leave open |

When no `blocker` or `major` thread is left open — only `deferred` nits remain — post a final review whose
body is `Review clear` and the counts. That terminal comment is the PR's `Outcome: clear`.

**Chat mode.** Same content, no file, no PR — report the findings in the conversation.

Close by reporting counts per severity, counts per axis (an axis that came back empty is worth a second
look), and the `Outcome`.

**Done when**: the review is posted (or reported in chat) and the counts have been reported.

## Out of bounds

Not findings, no matter how they look. Each of these otherwise fills a report with noise that trains the
reader to skim past real problems.

- **Any visual or styling judgement.** Presentation belongs to the `[human]` style leaf.
- **Anything the spec's Out of scope section names.**
- **Missing Playwright screenshot baselines** — human-generated, per `.agents/delegation.md`.
- **Style preferences with no basis** in `.agents/rules/`, a `CONTEXT.md`, or the surrounding code. No
  citable rule or precedent, no finding.
- **"Add a comment explaining what this does"** — `code-quality.md` forbids *what* comments.
- **A primitive or shortcut with a why-comment on it.** The comment is an override signal: read it and back
  off rather than arguing with it.
- **A `TODO (design):` marker that has been consumed.** An *unconsumed* marker, though, is a finding here:
  by land the `[human]` style leaves have had their turn, so a leftover marker is real dead scaffolding.
