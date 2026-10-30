# Automate the post-finalize review loop, CI fixes and demo deploys for task PRs

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3822 |
| Feature branch | `issue-3822` |
| PM | tom (frontend tooling task) |
| Demo | none |

<!-- Header is static identity — no status row: task status is derived from `progress.md` (see
`.agents/tasks/structure.md`). Rows with nothing to say are dropped (a decision this task makes, see
Implementation decisions); `Demo` is always present because it drives an action. -->

## Context & goal

Landing a product task ends today at "PR ready for review". Everything after that is driven by hand: the
developer opens a Cursor session in a second terminal and runs `review-changes` so a different model
provider reviews the agent's work, then runs `resolve-review` with its two confirmation gates, pushes,
reruns the review, watches CI, fixes what CI flags, and finally runs `deploy-demo` once or twice. The pieces
exist; the loop between them is the developer.

This task closes the loop. After `finalize-task` flips the PR to ready, the session runs a review loop:
a headless Cursor agent reviews the PR, an autonomous resolver fixes or rejects the findings, CI failures
from the previous run are fixed in the same push, and the cycle repeats until the review is cleared and
CI is green. The one thing the loop never does is guess at a decision the code and the spec cannot settle:
a `needs-human` finding pauses the loop, the developer answers in the terminal, and the answers fold into
the same round. Once cleared and green, demos deploy from presets the spec recorded at grilling time.

The developer then opens the PR to a reviewed, green, deployed change, with the review history and the
unresolved human questions on the PR threads.

## Functional requirements

1. **Loop entry.** `finalize-task` runs, in order: prune → `create-pr` Mode B (flip to ready, which starts
   CI) → the review loop → the demo deploys → a final report. The review loop is its own skill,
   `review-loop`, runnable by hand on any PR; `create-pr` Mode C never offers it.
2. **Reviewer.** Each round runs the repo's `review-changes` skill in `pr` mode under the tag `cursor`
   through the Cursor CLI headlessly, with `first` on round 1 and `follow-up` afterwards. The review itself
   is unchanged: inline PR comments, the summary with the `Blocked`/`Cleared` status, the arbitration
   round that closes threads.
3. **Outcome.** The loop reads the round's outcome from the PR (the latest summary carrying the reviewer's
   footer), never from the CLI's text.
4. **Resolver.** Each round dispatches `resolve-review pr --auto` in a fresh subagent. Auto mode keeps the
   adjudication procedure and changes the gating: no confirmation before fixing, no diff approval before
   pushing; the only stop is a `needs-human` finding.
5. **Nits in auto mode** are fixed when the fix is at most 5 lines in one file with no new test and no new
   file, and always when the nit concerns comments, docs or tests; otherwise `deferred`. A deferred nit
   stays an open thread for the developer.
6. **Rejections in auto mode** follow the existing rule (no repeat rejection on the same grounds), tightened:
   a second dispute from the reviewer turns the finding `needs-human`; there is never a third rejection.
7. **Pause on `needs-human`.** Any `needs-human` finding, whether raised by the reviewer or by the
   resolver, stops the round before any edit: the resolver returns its full verdict table and the questions,
   the orchestrator presents them in the terminal, fires a push notification (PR link, number of questions)
   and waits. The developer's answers go back to the same resolver, which folds them into its fix set and
   proceeds. The loop never ends with an unanswered `needs-human` finding.
8. **CI per round.** After the resolver has fixed, the loop waits for the CI run that is in progress on the
   branch. A red run is fixed by the same resolver in a separate commit. Review fixes and CI fixes go out in
   one push per round. Playwright failures are fixable: the resolver reproduces in Docker, views the diff
   image, and updates the baseline only when the diff is explained by a spec requirement it cites in the
   commit; any other visual diff is `needs-human`. Other gate failures (mutation, complexity, React Doctor)
   are fixable with the same escape: a fix that changes behaviour or restructures beyond the finding is
   `needs-human`.
9. **Terminal condition.** The loop ends when the review outcome is `cleared` and the CI run for the
   current HEAD is green. `cleared` with CI pending waits; `cleared` with CI red fixes and pushes without
   another review round. Bounds: 3 review rounds, 2 post-clear CI-fix cycles. Hitting a bound, a reviewer
   failure after one retry, or a timeout stops the loop with the PR in a consistent pushed state and a
   report saying why.
10. **Reviewer invocation.** `agent -p --trust --approve-mcps --output-format json "<skill invocation>"`
    run in the background with a 30-minute limit, Cursor's default model unless the loop is given a model
    override. Transport failures (non-zero exit, no output) get one retry; a review that ran gets none.
11. **Provider seam.** Everything Cursor-specific (binary, flags, timeout, failure detection, the tag) lives
    in one reviewer file under the skill; the skill body speaks only of "the reviewer" and takes
    `--reviewer <name>` defaulting to `cursor`. The reviewer's tag is its name.
12. **Demo presets at grilling.** `grill-the-task` asks which preset(s) the demo runs on, offering the
    workflow's `envs_preset` list with a recommendation inferred from the task (chain-type features →
    that chain's preset; multichain → `multichain`; generic UI → `staging`). Up to two entries; a third is
    refused with the reason (two deployment slots). `to-spec` writes the answer as the header row
    `| Demo | <preset> [(review-2)] · <preset> [(review-2)] |` or `| Demo | none |`. Small tasks hold the
    answer in session and `create-pr` Mode C offers the deploy.
13. **Demo deploys.** After the loop ends `cleared` with green CI, and only then, `finalize-task` deploys
    the header's entries sequentially: the first with an image build, the second reusing it
    (`build_image=false`). The first entry takes the `review` slot, the second `review-2`; an explicit
    `(review-2)` mark on a single entry selects that slot. `none` deploys nothing. A loop that stopped
    short deploys nothing.
14. **`deploy-demo` inputs.** The skill accepts explicit preset, variant and build-flag inputs for
    non-interactive use, alongside its current prose inference.
15. **Final report.** `finalize-task` ends with a push notification and a terminal report: PR link, review
    outcome and rounds, CI status, demo URLs, and anything left open. No demo comment on the PR; GitHub's
    deployment entry already links it.
16. **Spec header rule.** Header rows with nothing to say are dropped rather than filled with `—`; `Demo`
    is always present. `create-pr` keeps treating an absent `Minimum API version` row as "None".
17. **Delegation.** `delegation.md` gains, under what agents may do: resolve agent-review findings and push
    the fixes within the loop's rules; update a Playwright baseline when the diff is explained by a cited
    spec requirement. The rest of the baseline rule stays humans-only.
18. **Docs.** `tasks/README.md` step 6 describes the extended land step. Every edited skill keeps its
    frontmatter and doc links valid (`pnpm lint:doc-links`).

## Data & API

No application code, endpoints or env vars. External surfaces the skills drive:

- Cursor CLI (`agent`, headless print mode with JSON output). Skills under `.agents/skills/` are loaded
  natively; `-p "/<skill> <args>"` attaches a skill; trust and MCP approval are per absolute path, which is
  why `--trust --approve-mcps` are mandatory in a fresh worktree.
- GitHub: PR reviews and threads (`gh api`), the Checks workflow runs (`gh run list/watch`), the
  deploy-review workflow (`gh workflow run`). The Checks workflow has no cancel-in-progress, so each push
  starts a run while earlier ones continue.
- Playwright reports: the CI HTML report, and local Docker runs for reproduction and baseline regeneration.

## UI inventory

None. This task edits agent instructions only.

## Implementation decisions

- **A standalone `review-loop` skill**, handed off to by `finalize-task`, not an inline step: it is
  reusable on non-task PRs and keeps `finalize-task` a sequence of handoffs.
- **The session orchestrates; the resolver is a fresh subagent per round**, so it adjudicates against the
  code rather than defending what it wrote. Within a round it is resumed (answers to `needs-human`, then
  the CI fix) rather than replaced, so one agent holds both fix sets. The skill names resumption
  harness-neutrally and points at the Claude Code mechanism.
- **`--auto` is a flag on `resolve-review`**, not a sibling skill: one adjudication procedure with two
  gating policies, so the two cannot drift.
- **The reviewer runs in the background** from the orchestrator, polled to completion; it exceeds the
  foreground command cap. The orchestrator makes no edits while the reviewer runs in the same tree.
- **Outcome re-derived from the PR**, not parsed from the CLI result: the PR is the record and the CLI text
  can be truncated.
- **One push per round, separate commits** for review fixes and CI fixes, so the history shows which change
  came from which source. No rewriting of ticket commits.
- **Wait for CI before pushing** rather than pipelining pushes against running CI: fewer concurrent runs,
  one push carries everything, and small tasks' CI is often faster than the review anyway.
- **No re-review after `cleared`** for CI fixes: a follow-up round over a trivial CI fix would be arbitration
  with nothing to arbitrate.
- **Demos wait for cleared and green**, because a demo of unreviewed code is the thing the loop exists to
  avoid.
- **Sequential demo deploys with one image build**: the image is preset- and variant-agnostic.
- **Header rows dropped when empty, `Demo` always explicit**, because `none` is a decision and absence would
  be indistinguishable from "never asked".

## Out of scope

- A second reviewer in parallel (Claude's `code-reviewer` alongside Cursor); the seam allows it later.
- Changes to the review axes, the finding shape, or the arbitration rules of `review-changes`.
- Offering the review loop from `create-pr` Mode C; non-task PRs run it by hand in a new session.
- Pinning a reviewer model in the repo.
- Any change to the Checks or deploy-review workflows.
- Cursor hooks or Cursor-side automation; the loop is driven from Claude Code.
