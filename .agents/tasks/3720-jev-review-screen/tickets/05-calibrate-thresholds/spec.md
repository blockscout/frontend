# 05 — Calibrate the thresholds against past diffs

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3720 |
| Blocked by | T03 |

## What to build

Run `pnpm review:screen --base <merge-base> --spec <spec>` against the past diffs the developer names
(merged PRs whose agent review findings are known), compare every cell score with the known findings, and
set `config.ts`: the standards default, per-rule overrides where a rule's score distribution demands it,
`SPEC_THRESHOLD`, and `MAX_SUSPECTS`. The evidence — per diff: cells, known findings, which threshold
catches what at what false-positive cost — goes to this ticket's `notes.md`.

## Acceptance criteria

- [ ] Each named diff was screened from a detached checkout of the PR's head (`git worktree add`), with
      `--base` its merge-base, never from the current branch.
- [ ] `notes.md` holds, per diff: the sidecar path, the score of every known finding's cell, the top five
      cells with no known finding, and the chosen threshold's hits/misses/false positives.
- [ ] `config.ts` values are changed only here, with a one-line why per override.
- [ ] `(human)` Developer accepts the thresholds after reading `notes.md`.

## Details

- The developer supplies the PR list (see "Skill inputs"). A PR's known findings are its agent review
  comments (`gh api repos/{owner}/{repo}/pulls/{n}/comments`, footer `— Reviewed by`); for `md`-mode
  reviews the developer pastes the findings table.
- Requires `TYPESAFE_API_KEY` in the shell. With no key the ticket cannot run; stop and say so.
- Calibration sidecars must not pollute `--report` (ticket 07): write them with `calibration: true`
  (a `--calibration` switch on the tool), and let ticket 07 filter on it.

## Skill inputs

### calibration set

- PRs to screen: the developer provides 2–3 merged PR numbers with review findings before this ticket runs.

## Leaf worklist

- [ ] 1 `[agent]` Add the `--calibration` switch; screen each PR from a detached worktree; collect sidecars
- [ ] 2 `[agent]` Compare with known findings; write `notes.md`; set `config.ts`
