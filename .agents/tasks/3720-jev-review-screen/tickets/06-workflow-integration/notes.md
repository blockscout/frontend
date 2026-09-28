# Notes — 06

## Dry run

`/review-changes md --scope branch` on this branch (HEAD at the ticket's uncommitted state, run from a
temporary WIP commit so the tree was clean; the commit was soft-reset afterwards).

- Sidecar: `/Users/tom/Dev/bs/.ai/jev/2026-09-28-issue-3720-branch.json` — carries an `origins` block
  (24 findings, 3 suspects).
- Review file: `../../review.md` (24 findings: major 4 · nit 20; outcome blocked). Left in place for
  `resolve-review`.
- Terminal close's `jev` line: `jev: 3 suspects · 0 confirmed · 3 dropped · origins jev 0 / axis 24 / both 0`.
  Standards grid: 40 cells, 0 suspects. Spec grid: 16 requirements, 3 suspects (FR14, FR15, FR16), all
  dropped — a later ticket, cross-cutting, and outside the diff respectively.

Two gaps in the first draft of the brief showed up live and were fixed before the hand-off: the axis
returned `drop:` prose lines that `--origins` cannot parse (now a `| suspect | fate | reason |` table), and
the Origins section named no location for the findings file (now beside the sidecar, `.findings.md`).
The review's F1 and F3 report the same two gaps against the draft.
