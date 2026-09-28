# Review screen — context

A pilot, not a gate. Before the agent code review's axes read a change, this tool scores every rubric rule
against every touched file with Jev (TypeSafe's typed-judgment model) and prints the cells over threshold
as *suspects* — a rule id, a file, a line and a probability. It sets no severity and writes no claim: a
subagent in `review-changes` opens each suspect and decides. The task spec behind the pilot:
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
| Where does a cell become a suspect? | `./grid/standards.ts` |
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
- **Line ids are new-side line numbers.** Under `--scope uncommitted` they match the working tree; under
  `--scope branch` too, because both diff against the working tree, never a commit.

## Gotchas

- **Rerunning on the same day, branch and scope overwrites the sidecar.** The name carries no time of day.
  A calibration or dry run that should survive the next run needs a different `--ticket` or a copied file.
- **A `choice` question takes at most 255 options**, so a window never carries more changed lines than
  that even when it fits the character budget. A huge single hunk therefore becomes several windows, and
  the file's cell is the max across them.
- **The rubric's `EntryType` is the SDK's.** `./rubric.spec.ts` still requires arrays of short strings; an
  object-shaped example the SDK would accept fails that spec on purpose.

## File map

- `./index.ts` — flags, orchestration, the `skipped | failed | ok` status, the JSON on stdout; flag
  mechanics shared with the sibling tools in `../cli/flags.ts`
- `./config.ts` — model pin, thresholds, suspect cap, window budget, sidecar folder
- `./rubric.ts` — the standards rules
- `./select/change.ts` — scope, base, touched and untracked files, spec path, ticket
- `./select/hunks.ts` — `git diff -U<n>` → hunks → line-id state → windows
- `./grid/standards.ts` — `noul` batch per window, `choice` locate per suspect, threshold and cap
- `./sidecar.ts` — main-checkout resolution, file naming, the record shape
- `./run.sh`, `./tsconfig.json` — compile-on-run wrapper; the compiled output is git-ignored
