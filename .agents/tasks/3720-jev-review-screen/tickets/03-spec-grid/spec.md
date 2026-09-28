# 03 — Spec grid: score each Functional Requirement against the diff

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3720 |
| Blocked by | T02 |

## What to build

When a task spec resolves, `pnpm review:screen` parses its Functional Requirements list and, per touched
file, asks one `noul` question per requirement: the probability that this file's changes address it. A
requirement's score is its maximum across files. A requirement under `SPEC_THRESHOLD` becomes a suspect
with `line: '—'` and the requirement id (`FR<n>`). With no spec, the output's `spec` block says
`{ status: 'no-spec' }`. The spec grid's cells join the sidecar alongside the standards cells.

## Acceptance criteria

How to verify: `pnpm review:screen --scope branch` on this branch (its spec has 16 FRs).

- [x] The FR list is parsed from the spec's `## Functional requirements` numbered list; bold lead-ins
      (`**Standards grid.**`) are part of the requirement text, not its id.
- [x] Every touched file is scored against every FR in one request per file/window, reusing ticket 02's
      state and windowing; the per-requirement score is the max over files and windows.
- [x] `SPEC_THRESHOLD` in `config.ts`; suspects are `{ requirement: 'FR3', file: <best file>, line: '—',
      score }`, ranked lowest score first (the least-covered requirement is the most suspect).
- [x] The spec suspects count against the same `MAX_SUSPECTS` cap, split evenly with the standards grid
      when both overflow.
- [x] Sidecar cells carry `{ requirement, file, window, score }` in a `spec` section next to `standards`.
- [x] No spec → `spec: { status: 'no-spec' }`; explicit `--spec` pointing at a missing file → `failed`
      with a reason, not a crash.
- [x] vitest specs: FR parsing against a fixture spec (including a bold lead-in and a multi-line
      requirement), max-over-files ranking, threshold selection, the no-spec path.

## Details

- The question is phrased for a high value = addressed: "Do the changes in this file implement or
  contribute to the requirement: <FR text>?" — so the suspect condition is score *below* threshold, the
  inverse of the standards grid; keep that asymmetry in one place (`grid/spec.ts`), not in the renderer.
- A requirement that names things outside the diff (docs, a PR description) will score low on every file
  by construction; that is expected and is what calibration in ticket 05 tunes the threshold against.

## Leaf worklist

- [x] 1 `[agent]` `select/spec.ts`: FR parser (+ spec with a fixture)
- [x] 2 `[agent]` `grid/spec.ts`: per-file scoring, max ranking, threshold → suspects; cap split (+ specs)
- [x] 3 `[agent]` Wire into `index.ts` output and the sidecar; extend `CONTEXT.md`
