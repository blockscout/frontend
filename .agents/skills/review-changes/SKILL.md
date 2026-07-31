---
name: review-changes
description: >-
  Review a change on three axes — spec compliance, repo standards, correctness — each in a fresh
  subagent context, then report as a markdown record or as inline PR comments.
disable-model-invocation: true
---

# Review changes

Review a change the way a lead reviewer would: three **axes** in parallel, each in its own fresh
subagent context, then one normalized report.

You produce **findings** and nothing else. Fixing them is `resolve-review`'s job, so this skill never
edits a file except the review record — which is also why it runs `lint:eslint` and never
`lint:eslint:fix`.

## Scope and mode

Mode is not a choice; it follows from where the code is. An inline PR comment needs its line to exist
in the PR diff, so work that has not been pushed can only produce a markdown record.

| Working tree | Mode | Base |
| --- | --- | --- |
| Dirty — an uncommitted leaf | markdown record | `HEAD` |
| Clean, PR open for the branch | inline PR comments | merge-base with the PR's base branch |
| Clean, no PR, inside a task dir | markdown record | last reviewed sha in the record, else merge-base with `main` |
| Clean, no PR, no task dir | chat only, no file | merge-base with `main` |

The skill takes no arguments — every case above is inferred.

**Round detection.** A prior review of this same unit — a `review.md` section with open findings, or
prior review comments on the PR — means this run is **arbitration** (step 3), not a fresh review.

## 1. Pin the ground

Resolve mode and base from the table, then **fail fast before spawning anything**: a base that does not
resolve (`git rev-parse`) or an empty diff stops the run here, not inside three subagents.

Collect, in the review's own context:

- `git diff --stat <base>` and `git diff --name-only <base>`, plus untracked files
  (`git ls-files --others --exclude-standard`) — a new file is the most review-worthy thing in a change
  and `git diff` alone misses it.
- The subtask's `spec.md` (or the task's, or the sub-spec for a leaf step) and `.agents/delegation.md`.
- The prior review record, if any.

**In markdown and chat modes**, run the repo's checks yourself — do not take "checks pass" on trust,
because verifying that claim is most of what an absent developer is buying:

```bash
pnpm lint:eslint
pnpm lint:tsc
pnpm lint:cspell
pnpm test:vitest --changed              # or `--changed <base>` for a committed range
```

`vitest --changed` selects only the test files the change affects, and exits 0 when it affects none.

**In PR mode, checks are not your business at all** — neither run them nor read them. The Checks workflow
reports to the PR where the developer already sees it, and it may still be running alongside this review.

**Done when**: mode, base, the touched-file list, and (outside PR mode) the check results are all in hand,
and the diff is known non-empty.

## 2. Round 1 — spawn the axes

Send **one** message with three `general-purpose` subagents. Each gets: the base ref, the touched-file
list plus untracked files, the check output as established fact, and the paths it must read.

Every axis returns findings in this shape, and nothing else — no preamble, no summary:

```
severity: blocker | major | nit
needs-human: yes | no
location: <path>:<line>
claim: <what is wrong — quote the code>
fix: <one or two lines>
```

Each report is capped at **400 words**, which forces ranking instead of dumping.

**Spec axis brief.** Read the spec (path given) and the diff. Report: requirements the spec asks for
that are missing or partial; behaviour in the diff the spec never asked for; requirements that look
implemented but are implemented wrongly. Quote the spec line behind each finding. Anything the spec's
**Out of scope** section names is not a finding.

**Standards axis brief.** Read `.agents/rules/*.md` matching the touched file types, every `CONTEXT.md`
for directories the diff touches, `.agents/delegation.md`, and
[`smells.md`](smells.md). Report: places the diff breaks a documented rule — **cite the rule file and
the rule** — and smells from the baseline, each named and quoted. A documented rule can be a hard
breach; a smell is always a judgement call. Skip anything the checks in step 1 already cover.

**Correctness axis brief.** Read the touched files **in full**, plus the files the change depends on —
a hunk-only read produces exactly the shallow findings that make developers stop trusting review.
Report: logic errors; mishandled loading / empty / error / pagination paths; places where the types
claim something the runtime does not; and tests that assert the framework or the mock rather than real
behaviour (per the "What to test (and what not)" section of `.agents/rules/tests-unit.md`).

**Done when**: all three axes have returned, or an axis has failed and you have noted which.

## 3. Round 2+ — arbitration

An arbitration round is **not** a fresh three-axis review. Re-reviewing everything keeps surfacing
unrelated findings, so the round cap never bites and the loop never converges.

Spawn **one** fresh `general-purpose` agent — fresh, so it rules on the evidence in the record rather
than defending a claim it made itself. Give it the record (which carries the full exchange history) and
the current diff. It does exactly three things:

1. Verify each claimed fix actually addresses its finding, rather than cosmetically silencing it.
2. Rule on each `reject`: **agree** — the finding closes as `rejected-accepted` — or **disagree**, with
   a counter-argument.
3. Flag regressions introduced **by the fixes only**. New findings elsewhere are out of scope for this
   round.

**Done when**: every open finding is either closed or carries a ruling.

## 4. Normalize

Only this context sees all three axes, so only it can calibrate. Left alone, each axis inflates its own
findings to `blocker` because that axis is all it can see.

- **Severity.** `blocker` — a spec requirement missing or wrong, a correctness bug, or a rule breach
  with a real consequence. `major` — real cost, not shipping-critical. `nit` — taste. Set
  `needs-human` on any finding that turns on design intent the code cannot settle; it is orthogonal to
  severity and it is the loop's escape hatch.
- **One defect, one label.** The same defect seen through two axes is one finding: pick the sharper label
  and drop the other. Never report it twice.
- **Anchor check.** For every surviving finding, open its `file:line`. Confirm the quoted code is
  actually there and the claim still holds — and, in PR mode, that the line is in the PR diff. Drop
  what fails. Hallucinated line numbers and stale claims are the two things that end a reviewer's
  credibility, and this single pass catches both.
- **Backwards scope.** A finding outside the current unit's diff is actionable only if this change is
  what made it wrong. Otherwise it goes under `## Out of scope — for the final review` in the record and
  is left alone, so it resurfaces at the end-of-task review instead of unravelling the chain backwards.

**Done when**: every finding has a normalized severity, a verified anchor, and exactly one axis label.

## 5. Report

Zero findings still produces a report with `Outcome: clear` and zeroed counts — a missing record is
indistinguishable from a review that never ran.

**Markdown mode.** Write `review.md` beside the spec it was reviewed against: in the subtask folder, or
next to a small task's `spec.md`. One `##` section per reviewed unit, rounds nested beneath it. Format
in [`review-template.md`](review-template.md).

**PR mode.** One batched review event per round — never N separate comments — with the header table as
the review body and `event: COMMENT`. Never `REQUEST_CHANGES` (it blocks the author's own PR) and never
`APPROVE` (it claims accountability an agent does not have). Each comment carries its severity prefix
and a footer naming the reviewer: `— Reviewed by <your agent or model name>`, falling back to
`— Reviewed by agent` when you cannot name it. Any provider can run this skill, so never hardcode one.
Findings that cannot be anchored — approach-level questions, or
lines outside the diff — go into the review body under `## Not anchorable`, in the same event. Commands
and the all-or-nothing 422 hazard: [`gh-commands.md`](gh-commands.md). PR mode writes no `review.md`;
the PR is the record.

**Chat mode.** Same content, no file.

Close by reporting counts per severity, counts per axis (an axis that came back empty is worth a second
look), and the `Outcome`.

**Done when**: the record exists — or the review is posted — and the counts have been reported.

## Out of bounds

Not findings, no matter how they look. Each of these otherwise fills a report with noise that trains the
reader to skim past real problems.

**Always out of bounds**

- **Any visual or styling judgement.** Presentation belongs to the `[human]` style subtask.
- **Anything the spec's Out of scope section names.**
- **Missing Playwright screenshot baselines** — human-generated by standing policy.
- **Style preferences with no basis** in `.agents/rules/`, a `CONTEXT.md`, or the surrounding code. No
  citable rule or precedent, no finding.
- **"Add a comment explaining what this does"** — `code-quality.md` forbids *what* comments.
- **A primitive or shortcut with a why-comment on it.** The comment is an override signal: read it and
  back off rather than arguing with it.

**Tolerated in a per-leaf review only**, because an `[agent]` scaffold leaf is deliberately unfinished:

- **`TODO (design):` markers** — the scaffold working as designed. This tolerance **expires** at the
  whole-task review, where the PR is ready for review, belongs to no subtask, and the `[human]` style leaves
  have had their turn: an unconsumed marker there is a finding.
- **Check failures the dispatch declared intentional** — known, not discoveries. Nothing to carry over to the
  whole-task review, where you run no checks at all.
