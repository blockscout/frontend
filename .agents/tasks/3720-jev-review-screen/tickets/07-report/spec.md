# 07 — `--report`: the pilot table

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3720 |
| Blocked by | T04 |

## What to build

`pnpm review:screen --report` reads every sidecar in the main checkout's `.ai/jev/` and prints one
table to the terminal: per rule, suspects sent / confirmed / dropped; the `jev`-only, `axis`-only and
`both` finding counts across reviews; and the added seconds per review (sum of the screen's call timings).
Nothing is computed during a review; the table is the keep-or-kill input the developer reads.

## Acceptance criteria

How to verify: `pnpm review:screen --report` after ticket 06's dry run.

- [x] Sidecars with `calibration: true` are excluded; sidecars without an `origins` block are listed as
      "pending origins" rather than counted.
- [x] Per-rule rows: sent, confirmed, dropped (with the top drop reason); spec-grid suspects as one `spec`
      row.
- [x] Totals: reviews counted, `jev`-only / `axis`-only / `both`, mean and max added seconds, mean input
      tokens per review.
- [x] `--report --json` prints the same data as JSON.
- [x] vitest specs against fixture sidecars: exclusion rules, per-rule aggregation, origin counts, timing
      sums.

## Leaf worklist

- [x] 1 `[agent]` `report/aggregate.ts` (+ specs with fixture sidecars)
- [x] 2 `[agent]` `report/render.ts` table + JSON; `--report` flag in `index.ts`; extend `CONTEXT.md`
