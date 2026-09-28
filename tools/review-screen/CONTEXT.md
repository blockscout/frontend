# Review screen — context

A pilot, not a gate. Before the agent code review's axes read a change, this tool scores every rubric rule
against every touched file with Jev (TypeSafe's typed-judgment model) and prints the cells over threshold
as *suspects* — a rule id, a file, a line and a probability. When the change has a task spec it also
scores every Functional Requirement against every touched file, and a requirement no file seems to
address becomes a suspect too — a requirement id, the best-scoring file, `—` for the line, and the
probability. It sets no severity and writes no claim: a subagent in `review-changes` opens each suspect
and decides. The task spec behind the pilot:
`.agents/tasks/3720-jev-review-screen/spec.md`.

## Where to look

| Question | Answer lives in |
| --- | --- |
| How do I run it? What do the flags do? | `pnpm review:screen --help` |
| What does the model get asked? | `./rubric.ts` — the rules, their globs, questions and counterexamples |
| Where do the thresholds, the cap and the window budget live? | `./config.ts` |
| Where does a run's record go? | `<main checkout>/.ai/jev/`, one JSON per run; `./sidecar.ts` names it |
| How is a change turned into model state? | `./select/hunks.ts` |
| How are the base, the files and the spec resolved? | `./select/change.ts` |
| Where does a standards cell become a suspect? | `./grid/standards.ts` |
| Where does a requirement become a suspect? Where is the cap shared? | `./grid/spec.ts` |
| How are the Functional Requirements read out of a spec? | `./select/spec.ts` |
| After a review: how does a suspect get its fate, a finding its origin? | `./origins/match.ts` (`--origins`) |
| What does `--findings` accept? | `pnpm review:screen --help`; the two readers in `./origins/parse.ts` |
| How is it wired into the review? | `.agents/skills/review-changes/axes.md`, the `jev` axis brief |

## What an editor here must keep true

- **A tool failure never fails a review.** No key, an API error, a diff with nothing to score: all exit 0
  with the status and reason in the JSON, and every one of them still writes a sidecar. Only a bug in the
  tool exits non-zero. The `jev` axis brief relies on this.
- **Explicit inputs are never re-derived.** `--base` and `--spec` are used verbatim, because the review that
  passes them has already pinned its base and the two must agree.
- **The sidecar keeps every cell, not only the suspects.** Re-tuning a threshold in `./config.ts` is an
  offline read of the sidecars; if cells under threshold were dropped it would take a re-run per diff.
- **The sidecar lives in the main checkout**, resolved through the git common dir. A worktree's own files
  vanish with the worktree, and task folders are pruned at land.
- **The API key is the tool's concern only.** The SDK reads it from the environment; no agent instruction
  names the variable. Keep it that way — an agent told the variable's name will try to set it.
- **The spec grid's comparison is inverted, and that lives in `./grid/spec.ts` only.** Its question is
  phrased so a high value means "this file addresses the requirement", so a suspect is a requirement whose
  best score is *below* `SPEC_THRESHOLD`, ranked lowest first. Everything downstream — the JSON, the
  sidecar, the `jev` brief — sees suspects and scores and never needs to know which way the threshold
  points. Keep it that way when tuning: change the threshold, not the direction.
- **The `spec` block in the output has its own status.** `no-spec` when there is nothing to score;
  `skipped` when there is a spec but no client; `failed` when an explicit `--spec` points nowhere, the spec
  has no `## Functional requirements` list, or the API failed while scoring it. Only the API failure also
  fails the run: a bad spec path still gets the review its standards grid.
- **Line ids are new-side line numbers.** Under `--scope uncommitted` they match the working tree; under
  `--scope branch` too, because both diff against the working tree, never a commit.
- **`--origins` matches mechanically, never by reading code.** A finding meets a standards suspect when
  it sits in the same file inside the suspect's window — the line span the sidecar records under
  `windows`, since by then the diff may be gone — and a spec suspect when its location is the same
  `FR<n>`. The `jev` axis's drop list is the only other input; a suspect named by neither is `dropped`
  with reason `not reported`. Keep it that way: the subagent that runs it forwards the table and nothing
  else, so any judgement added here would be a judgement made without the code in front of it.
- **A calibration run is not a pilot review.** A past diff screened to tune `./config.ts` is run with
  `--calibration`, which sets `calibration: true` in its sidecar; `--report` filters on that
  field, so a calibration sidecar in `.ai/jev/` never inflates the pilot's counts. Screen such a diff from
  a detached worktree at the commit under review with `--base` its merge-base, and give it a `--ticket`
  that names the PR, or the same-day runs overwrite one another.
- **`jev` membership comes from `sources`, not from `axis`.** A finding's `axis` is its label
  (`standards`, `spec`, …); which sides raised it is the orchestrator's `sources` list. A `jev`-sourced
  finding with an axis alongside is `both`, and its suspect is `merged` rather than `confirmed`.

## Gotchas

- **Rerunning on the same day, branch and scope overwrites the sidecar.** The name carries no time of day.
  A calibration or dry run that should survive the next run needs a different `--ticket` or a copied file;
  a detached checkout has no branch name and gets `detached`, so two PRs screened the same day collide
  unless `--ticket` tells them apart.
  A rerun also drops the sidecar's `origins` block — run `--origins` again if the review's table still
  stands. Running `--origins` twice replaces the block; it never appends.
- **A spec finding must carry its `FR<n>` in `location` to match a spec suspect.** The review's table
  writes `—` for a finding with no line; a spec suspect has no line either, so the requirement id is the
  only handle. Without it the suspect is `not reported` even when the finding came from it.
- **The task folder is excluded from the spec grid** (`SPEC_GRID_EXCLUDE`). A branch that adds its own
  `spec.md` and ticket specs would otherwise score every requirement high — the spec *states* each one —
  and hide the requirements no code addresses yet. The standards grid still sees those files.
- **A requirement about things outside the diff scores low everywhere.** A requirement that names docs,
  a PR description or a later ticket will be a suspect on every run by construction, and so will one
  about code the change *removes*, since the state carries new-side lines only. That is expected; the
  `jev` axis drops such a suspect with that reason.
- **A `choice` question takes at most 255 options**, so a window never carries more changed lines than
  that even when it fits the character budget. A huge single hunk therefore becomes several windows, and
  the file's cell is the max across them.
- **The rubric's `EntryType` is the SDK's.** `./rubric.spec.ts` still requires arrays of short strings; an
  object-shaped example the SDK would accept fails that spec on purpose.

## File map

- `./index.ts` — flags, orchestration, the `skipped | failed | ok` status, the JSON on stdout; flag
  mechanics shared with the sibling tools in `../cli/flags.ts`
- `./config.ts` — model pin, thresholds for both grids, the shared suspect cap, window budget, sidecar folder
- `./rubric.ts` — the standards rules
- `./select/change.ts` — scope, base, touched and untracked files, spec path, ticket
- `./select/hunks.ts` — `git diff -U<n>` → hunks → line-id state → windows
- `./select/spec.ts` — the spec's `## Functional requirements` list → `FR<n>` ids and text
- `./grid/shared.ts` — the client surface, the bounded pool, the per-call record both grids write
- `./grid/standards.ts` — `noul` batch per window, `choice` locate per suspect, threshold and cap
- `./grid/spec.ts` — `noul` batch per window over the requirements, max over files, the inverted threshold,
  the cap shared with the standards grid
- `./origins/parse.ts` — the findings table and the drop list, from a JSON array or Markdown tables
- `./origins/match.ts` — fate per suspect, origin per finding, the window and requirement matching
- `./sidecar.ts` — main-checkout resolution, file naming, the record shape, reading one back
- `./run.sh`, `./tsconfig.json` — compile-on-run wrapper; the compiled output is git-ignored
