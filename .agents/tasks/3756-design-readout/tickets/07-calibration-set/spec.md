# 07 — Calibration set, `--calibrate` and `--refresh`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3756 |
| Blocked by | T05, Q01 |

## What to build

`tools/design-readout/calibration/` holds one entry per labeled node: the tool's own value snapshot (the
extraction output, not the raw Figma payload) and the expected component and props per cell. `pnpm
design:readout --calibrate` runs recognition over every snapshot offline — no token, no network — and
prints a table of hits and misses per signal (shape, icon, color, composite) and per entry, exiting
non-zero when any expected cell is missed so a recognition change that regresses a calibrated node is
caught in CI. `--refresh [<entry>]` re-fetches the snapshot from Figma with the token; a node that no
longer exists marks its entry `stale` in the entry file and the run continues. The set is seeded with
the five hand-calibrated nodes and the ~10 shipped row components from Q01.

## Acceptance criteria

- [ ] Entry format: one folder per entry with `snapshot.json` (extraction output) and `expected.json`
      (component + props per cell, keyed by node id, plus the Figma node URL and the repo component
      path); a spec validates the shape and rejects an entry with an unknown node id.
- [ ] `--calibrate` runs offline, prints hits/misses per signal and per entry, exits non-zero on a miss;
      a spec runs it over a small synthetic entry with one deliberate miss.
- [ ] `--refresh` re-extracts with the live tree and overwrites `snapshot.json`; a 404 / missing node
      sets `stale: true` on `expected.json` and the run continues; specs cover both with a mocked fetch.
- [ ] `--calibrate` is wired into the test pipeline; the committed set passes.
- [ ] The set contains the Q01 entries, each with the expected cells filled from the shipped component.
- [ ] `CONTEXT.md` gains the calibration rows: how to add an entry, what a miss means, when to refresh.

## Details

- The five hand-calibrated nodes and the ~10 `*TableItem.tsx` rows with their node URLs come from
  `questions.md` Q01; the expected cells are read off the shipped component's JSX, never off Figma.
- A `stale` entry is skipped by `--calibrate` with a printed line, so a vanished mockup never blocks CI.

## Leaf worklist

- [ ] 1 `[agent]` Entry format, loader and validation with specs
- [ ] 2 `[agent]` `--calibrate` report and exit code, pipeline wiring, specs
- [ ] 3 `[agent]` `--refresh` with stale marking, specs
- [ ] 4 `[agent]` Seed the set from Q01 (capture snapshots via `--refresh`, write expected cells from the shipped components)
- [ ] 5 `[agent]` `CONTEXT.md` calibration rows
