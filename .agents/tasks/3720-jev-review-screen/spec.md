# Pilot Jev typed judgments as a fourth subagent in the agent code-review workflow

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3720 |
| Feature branch | `issue-3720` |
| PM | — (frontend tooling task; owner: tom) |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

The agent code review (`review-changes`) runs three LLM axes — spec, standards, correctness — each reading
the whole change blind. A fast typed-judgment model (TypeSafe's Jev) can score every rubric rule against
every touched file in well under a second per call, but it returns probabilities, not claims. The pilot
measures whether such a screen, verified by a subagent, finds things the axes miss — precision, unique
contribution, recall gaps, added latency — over about ten reviews, so the developer can decide keep or kill
from evidence rather than a demo.

## Functional requirements

1. A CLI tool under `tools/` screens a change and emits suspects as JSON. It resolves the base ref, the
   touched files (untracked included) and the task spec from `--scope branch|uncommitted`, or takes them
   explicitly via `--base <ref>` and `--spec <path>`; explicit inputs are never re-derived. It runs standalone
   (`pnpm review:screen`) for rubric calibration, and the pilot dataset can be replayed from it.
2. **Standards grid.** For each rubric rule and each touched file matching the rule's glob, the tool scores
   the probability of a breach with a yes/no (`noul`) judgment. The scored state is the file's changed hunks
   plus surrounding context, each line prefixed with a line id. A cell over its threshold gets a second,
   `choice` call over the changed line ids to locate the offending line. Hunks exceeding the model's state
   limit are split into windows and the file takes the maximum score.
3. **Spec grid.** When a task spec exists, each Functional Requirement is scored per touched file for the
   probability that the diff addresses it; the requirement's score is its maximum across files. A
   requirement whose score falls below the spec threshold is a suspect. With no spec the grid is skipped and
   the output says so.
4. **The rubric** is a hand-written file of 8–10 conventions that linters cannot catch. Each rule has an id,
   the rule file it cites, a file glob, a question, and counterexamples expressed as the model's structured
   criteria (`not_for` / `examples`). The rules are drafted from `.agents/rules/*.md`, `smells.md` and the
   `CONTEXT.md` files and approved by the developer before implementation.
5. **Thresholds** live in the tool's config: one default for the standards grid with optional per-rule
   overrides, a separate threshold for the spec grid, and a cap on the number of suspects passed on. Values
   are calibrated during implementation against a few past diffs with known findings.
6. Each suspect carries a rule or requirement id, the file, the line (or `—` for a spec suspect) and the
   score. The tool sets no severity and writes no claim or fix text.
7. **The key is the tool's concern only.** It reads `TYPESAFE_API_KEY` from the shell environment. With no
   key, or on any API failure, it exits 0 with `status: skipped|failed` and a reason; no agent instruction
   names the variable.
8. **Sidecar.** Every run of the screen writes one JSON file to `.ai/jev/` in the repository's **main
   checkout** (resolved through the git common dir, so worktrees share one dataset), named by date, branch,
   scope and ticket. It records every cell score (not only over-threshold ones), the suspects, the model
   version, per-call timings and token usage. A later `--origins` invocation, given the review's final
   findings table, records each suspect's fate (confirmed / dropped with reason / merged with an axis finding)
   and each finding's origin (`axis`, `jev`, `both`) into the same file.
9. **Workflow integration.** In a `first` round, `review-changes` dispatches a fourth `general-purpose`
   subagent — the `jev` axis — alongside the three blind axes, with the same inputs they get. Its brief in
   `axes.md` is the only place the tool is mentioned. It runs the screen, then for each suspect opens the
   location, reads the cited rule or requirement, and either writes a finding in the standard shape or drops
   the suspect with a one-line reason. It returns every suspect exactly once — confirmed or dropped — plus the
   sidecar path. It never looks beyond its suspects.
10. A confirmed Jev finding is labelled by the grid that produced it — `standards` or `spec`. Findings carry
    no provenance marker; `resolve-review` and the `follow-up` round are unchanged.
11. Normalization (step 4) de-duplicates across all four sources as today; the orchestrator additionally
    notes which sources raised each surviving finding. After publishing, it spawns a fresh subagent with the
    `jev` brief, the sidecar path and the final table (id, axis, location, sources) to run `--origins`.
12. When the `jev` axis returns `skipped` or `failed`, or with zero suspects, the review proceeds on three
    axes and the terminal report states the reason. A tool failure never fails a review.
13. The terminal report gains one line for the `jev` axis: suspects sent, confirmed, dropped, and the
    origin split of the published findings.
14. `pnpm review:screen --report` reads every sidecar in `.ai/jev/` and prints one table: confirmed vs
    dropped per rule, the `jev`-only / `axis`-only / `both` counts, and added seconds per review. Nothing is
    computed during a review.
15. The integration works for `pr` and `md` outputs and for both `branch` and `uncommitted` scopes.
16. **Keep-or-kill** is the developer's judgment, informed by the `--report` table and their own reading of
    the `jev`-only findings at Gate 1 / on the PR. No numeric gate is fixed.

## Data & API

- TypeSafe Jev: `POST https://api.typesafe.ai/v1/systemone`, bearer auth with `TYPESAFE_API_KEY`, via the
  typed `@typesafe-ai/sdk` npm package (dev dependency, Node 20+, MIT). Primitives used: `noul` (breach
  probability), `choice` (line location). Model pinned to `jev-1.13.0`; the response's `model` is recorded in
  the sidecar. Limits that shape FR2: 64k tokens per request, 32k for state plus the longest question.
- No `NEXT_PUBLIC_*` env var, no runtime code, no API resource.

## UI inventory

None. This task ships no user-facing surface.

## Implementation decisions

- **Tool name `review-screen`**, script `pnpm review:screen`. The name describes the job, not the vendor;
  `jev` remains the provenance value, the axis name and the sidecar folder.
- Follows the `tools/<name>/` layout of the complexity and mutation gates (`index.ts`, `config.ts`, `run.sh`,
  `CONTEXT.md`), with flag parsing from `tools/cli`.
- **The SDK over raw `fetch`**: it ships its own typings and retries 429/529 with backoff.
- **Hunks, not whole files** (FR2): a review covers the diff, and whole-file scoring would flag breaches that
  predate the change.
- **Spec grid is per file, ranked by max**, never one call over the whole diff — the state limit.
- **The tool lives inside the fourth subagent**, not the orchestrator: the orchestrator learns only "spawn
  a `jev` axis" and "hand the final table to a `jev` subagent". Removing the pilot is deleting the tool, the
  `jev` brief, and those two lines.
- **A fresh subagent for `--origins`** rather than resuming the finished `jev` one. It needs only the
  sidecar path and the table, so nothing is lost, and it behaves identically on every agent host (Cursor's
  parent-initiated resume is unverified; Claude Code's would need a `SendMessage` grant on `code-reviewer`).
- **Sidecar in the main checkout's gitignored `.ai/`** (already ignored) because task folders are pruned at
  land, non-task branch reviews have no task folder, and a worktree's own files vanish with the worktree.
- **All cell scores are logged**, not just suspects, so thresholds can be re-tuned offline and recall gaps
  measured without re-running.
- **`--origins` in the tool, not in the agent**: the tool matches finding locations to its confirmed suspects
  mechanically; the subagent only forwards the table.
- **Cost is not a decision input**: at $0.042 per million input tokens a 10-rule × 20-file grid costs cents.
- **Prerequisite**: #3724 (per-finding word cap replacing the per-axis 400-word cap) lands before the first
  pilot review, since it changes the axis baseline the pilot compares against. The `jev` axis has no total
  word cap either — a suspect silently cut for length would skew the counts.

## Out of scope

- **Test-gap and general correctness screening.** The complexity and mutation gates cover test gaps; the
  model gives no explanation to act on for correctness.
- **Running the screen on `follow-up` rounds** (regressions from fixes). Revisit after the pilot.
- **Accepted-on-resolve tracking** — writing findings' final verdicts back to the sidecar. The developer
  judges `jev`-only findings directly.
- **Numeric keep-or-kill thresholds.** Ten reviews are too few for them to mean much.
- **A CI integration** posting comments on PRs. Deferred until precision is known: fork PRs have no
  repository secrets, and unverified output on public PRs is noise.
- **Any change to `resolve-review`**, or to the existing axes' briefs beyond #3724.
- **Any provenance marker on findings** — in the PR, in `review.md`, or in their ids.
