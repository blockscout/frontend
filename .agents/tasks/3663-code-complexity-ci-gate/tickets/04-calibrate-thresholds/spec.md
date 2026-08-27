# 04 — Calibrate thresholds and turn the gate on

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 04 of #3663 |
| Blocked by | T03 |

## What to build

The final step: replace the provisional thresholds with numbers calibrated from real data, then
enable enforcement. Run the tool repo-wide (all in-scope files, not diff-scoped) to produce the CRAP
and complexity distributions, examine the tail, and set the raw-complexity cap and CRAP threshold in
the tool config so the gate flags the genuine offenders rather than flooding on ordinary code
(the spec flags that at 0% coverage CRAP > 30 trips at complexity ≥ 6 — confirm that is the tail).

## Acceptance criteria

- [ ] `(human)` The complexity cap and CRAP threshold in the tool config are set from the observed
      repo-wide distribution, with the choice justified against the tail (not the provisional
      30 / 20 placeholders).
- [ ] A repo-wide run at the chosen thresholds flags a small, defensible set of offenders rather
      than a flood.
- [ ] The gate is enforced (fails CI on a real threshold breach) with the calibrated numbers.

## Details

- Calibration is repo-wide (a full-scope run), distinct from the diff-scoped gate CI runs. Full-repo
  is the tool's **default** selection (`pnpm test:code-complexity` with no paths and no `--changed`);
  for the CRAP distribution generate whole-suite coverage once and iterate the full-repo report
  against it with `--coverage-file <path>` (files no spec covers show 0% and populate the tail).
- Only the tool's threshold config changes here (FR12); no CI-YAML threshold edits.
- Optional chaining `?.` is counted toward complexity (ticket 01). A developer can write `?.`
  redundantly, so the repo-wide run may show `?.`-heavy files inflating the tail; check whether that
  distorts calibration and, if it does, decide here whether to keep counting `?.` or drop it (a
  one-line change in the tool) before setting the thresholds.

## Skill inputs

None — no project skill applies to this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Repo-wide run producing the CRAP + complexity distributions (histogram / sorted
      offender list)
- [ ] 2 `[human]` Choose the complexity cap and CRAP threshold from the distribution and set them in
      the tool config
- [ ] 3 `[agent]` Note the calibration evidence (distribution + chosen numbers) in the ticket's
      `notes.md`
