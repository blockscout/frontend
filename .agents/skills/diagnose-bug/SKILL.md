---
name: diagnose-bug
description: Diagnose a reported misbehaviour end-to-end.
disable-model-invocation: true
argument-hint: <Slack thread link | GitHub issue URL | description of the problem>
metadata:
  credits:
    skill: diagnosing-bugs
    author: Matt Pocock
    url: https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnosing-bugs/SKILL.md
---
# Diagnose a bug

A workflow for hard bugs. The run goes end-to-end without asking; the one stop is a bug that cannot be 
reproduced. Skip phases only when explicitly justified.

The discipline in one line: **no red loop, no hypothesis.** A *red* loop is a command that goes red on
*this* bug and green once it is fixed; a *tight* one is deterministic and runs in seconds. With one in
hand the bug is mostly found — bisection, hypotheses and probes only consume it. Reading code to build a
theory before the loop exists is the failure this skill prevents.

Show every command and its output; put `<REDACTED>` in place of any token or key.

## Steps

### 1. Resolve the input

- A **Slack thread link** — read it per `.agents/slack-thread.md`, attachments included. Keep the
  thread: the outcome is posted back there (step 9).
- A **GitHub issue URL** — `gh issue view <N> --comments`. Keep the number: the branch is `issue-<N>`
  and the outcome is posted as a comment.
- **Anything else** — free text, or a bug already discussed in this conversation — the conversation is
  the source.

From the source, write down: the exact symptom, the instance (URL or alias), the page URL, the steps
and state that led there (chain, wallet, account), what the screenshots show, and whether the fix is
wanted in the release in flight (the source names staging, an alpha, a release or a version).

**Done when:** the symptom is one sentence, with the instance and page named or stated unknown.

### 2. Build a red loop

Work down the ladder in [`loops.md`](loops.md) and stop at the first rung that goes red. Spend
disproportionate effort here; be relentless. Treat the loop as a product once it exists: faster
(cache setup, narrow the scope), sharper (assert the exact symptom, not "didn't crash"), more
deterministic (pin time, seed data, freeze network).

A loop that reveals the **API response itself is wrong** — at the data rung, or already in the
dev-server rung's network list — settles the diagnosis early: go to step 6 with **Not a frontend bug**.

A **non-deterministic** bug needs a *higher reproduction rate*, not a clean repro: loop the trigger,
narrow timing windows, inject delays, until it is debuggable.

When the whole ladder is exhausted with nothing red, go to step 6 with **Cannot reproduce**.

**Done when:** one command (a test path, a browser sequence, a curl) has been run at least once, its
invocation and output shown, and it is red-capable, fast and agent-runnable, and either deterministic or
— for a non-deterministic bug — red at a stated rate (*n* of *m* runs) high enough to debug.

### 3. Reproduce and minimise

Run the loop; watch it go red. Confirm it is the **reporter's** failure — same message, same wrong
output, same slowness — and not a neighbour. Wrong bug, wrong fix.

Minimise in proportion to the repro: a one-line spec is already minimal; a repro with several inputs,
mocks or steps is cut one element at a time, re-running the loop after each cut, until every element
left is load-bearing.

**Done when:** the loop is red on the reported symptom, and each remaining element of the repro turns
it green when removed.

### 4. Hypothesise

Write **three ranked hypotheses** before testing any; a single one anchors on the first plausible idea.
Each must be falsifiable: "if *X* is the cause, then *changing Y* makes the loop go green". One that
cannot state its prediction is a vibe: sharpen or drop it.

Show the list, then proceed with the ranking straight away — the user interjects if they know better.

**Done when:** three predictions are in the transcript, ranked.

### 5. Instrument

One probe per prediction, one variable at a time. Prefer a breakpoint or a REPL-style check in a spec to
logs; when logs it is, tag each with one prefix (`console.log('[DEBUG-a4f2]', …)`) so cleanup is a
single grep. `no-console` is an ESLint error here, so a stray one also fails the commit hook.

A **performance regression** gets a baseline measurement first (timing in the loop, the profiler per
`tools/profiling/CONTEXT.md`) and a bisect second; logs are usually the wrong probe.

A **regression** gets its culprit named: `git bisect run` with the loop as the script when the loop is a
rung-1 or rung-2 command (a browser sequence has no exit code), otherwise `git log -S` or blame on the
lines the fix touches. The culprit decides the backport (step 7).

**Done when:** one hypothesis survives and the others are shown falsified. None surviving means a new
ranked three; more than one means keep falsifying until one remains.

### 6. Classify

| Outcome | When |
| --- | --- |
| **Fix PR** | Our code is the cause, `origin/main` still has it, and the fix is inside what `.agents/delegation.md` lets an agent do. |
| **Already fixed** | A commit on `origin/main` after the reported release fixes it (read the suspected code as of the release rev with `git show <rev>:<path>`; the instance's `/node-api/config` reports its tag or commit). |
| **Not a frontend bug** | The page renders faithfully what the API, the instance config or the chain gives it; the evidence is the request and its payload. |
| **Needs human fix** | The cause is found, but the fix is on the human side of `.agents/delegation.md` (styling to a mockup, a visual asset, a design call); or the bug lives only on the release branch (a bad pick; `origin/main` is clean) — name the pick, open no PR. |
| **Cannot reproduce** | The ladder is exhausted with no red loop. |

**Done when:** the outcome and a one-paragraph justification are written down for step 9. **Fix PR**
and **Already fixed** continue to step 7; only **Fix PR** goes on to step 8; the others go to step 9.

### 7. Backport

A release is **in flight** when `gh release list --json tagName,isPrerelease,isDraft` shows a release
that is a pre-release or a draft; its PRs are listed in that release's body (`gh release view <tag>
--json body`) plus the merged PRs labelled `backport` not picked yet. The fix goes in the release when:

- the culprit commit (step 5) belongs to one of the release's PRs, or the report came from staging; or
- the source asks for the fix in the release (step 1).

No release in flight means no backport. The label is `backport` (`gh pr edit <N> --add-label backport`):
for **Already fixed** set it now on the fixing PR when that PR is not in the release yet, and name the
reason in the step 9 report; for **Fix PR** it goes on the new PR in step 8, whose description names the
reason.

**Done when:** the decision and its reason are written down, and for **Already fixed** the label is set
or does not need to be set.

### 8. Fix and regression test

Branch off `origin/main`: `issue-<N>` for an issue, otherwise `bug-<kebab-slug>`.

1. **Seam.** Pick the test seam that exercises the real bug pattern — the spec or component test the
   loop already is, usually. A seam that is too shallow to catch the chain that triggered the bug gives
   false confidence; then no seam exists, and that absence is a finding for the PR description.
2. **Red first.** Turn the minimised repro into a failing test at that seam and watch it fail. Skip it 
   when the test would be expensive, integration-heavy, or unclear. A visual bug gets a DOM assertion 
   in Vitest, or no test: screenshot baselines are a human's to generate.
3. **Fix**, watch it pass, then re-run the step 2 loop on the original, un-minimised scenario.
4. **Cleanup.** `grep -r "DEBUG-" src/` returns nothing; throwaway scripts are gone from the scratchpad
   and the tree; a registry alias added in step 2 stays.
5. **Verify** per `.agents/rules/code-quality.md`: ESLint on the changed files, `pnpm lint:tsc`,
   `pnpm test:vitest --changed`, and `pnpm test:pw <file>` only when the regression test is a `*.pw.tsx`.
6. **Commit**, then follow the `create-pr` skill, Mode C. The Description carries, in this order:
   what was broken, the root cause, the fix, how it was verified (the regression test named, or why
   there is none). Additional information carries the hypotheses ruled out and the backport decision
   from step 7 with its reason.
7. **Label** the PR `backport` when step 7 decided so.

**Done when:** the PR link is in hand, the label matches step 7, and `git status` is clean.

### 9. Report

The **final message** has four parts, in this order: what was broken, the root cause, the fix (or the
outcome and its justification from step 6), and how it was verified. Links: the PR, the fixing commit,
or the request and payload that clear the frontend. **Cannot reproduce** replaces the last three parts
with what was tried and the artifacts to ask the reporter for: exact URL and instance, browser, a
screenshot or recording with timestamps, a HAR, the console output, wallet or account state.

Then post back to the source, without asking — the named exception to `AGENTS.md`'s
approve-before-sending rule. Slack text follows `.agents/slack-message.md`.

| Source | Fix PR | Already fixed | Not a frontend bug | Needs human fix | Cannot reproduce |
| --- | --- | --- | --- | --- | --- |
| Slack thread | two lines: outcome and PR link | the report | the report | the report | the artifact request |
| GitHub issue | nothing — the PR's `Resolves #N` links it | comment, close | comment, close | comment | comment, label `need info` |
| Conversation | the final message only | | | | |

**Done when:** the message is shown to the user and posted where the table above names a post.

## Run by Honk

When the Honk orchestrator runs this skill headless, follow [`honk.md`](../../honk.md). This skill adds
no statuses of its own; the shared three with their triggers here:

| Status | When | Resumed? |
| --- | --- | --- |
| `done` | the outcome is Fix PR, Already fixed, Not a frontend bug or Needs human fix, and the step 9 message is shown and posted where the step 9 table names a post; the message is that text | no |
| `needs_user` | the outcome is Cannot reproduce; the message is the artifact request, also posted where the step 9 table names a post | yes, with the artifacts |
| `needs_approval` | the push, the PR creation, a label, an issue comment or the Slack reply needs a tool the worker profile denies; the message carries exactly what would be done | yes, once a human did it or allowed it |
