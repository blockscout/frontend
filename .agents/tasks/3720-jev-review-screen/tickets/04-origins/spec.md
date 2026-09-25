# 04 — `--origins`: record suspect fates and finding origins in the sidecar

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3720 |
| Blocked by | T02 |

## What to build

`pnpm review:screen --origins <sidecar> --findings <path|->` reads the review's final findings table and
the sidecar, matches each finding's location to the sidecar's suspects, and writes back: per suspect a
fate (`confirmed` / `dropped` with reason / `merged` with the axis finding id), and per finding an origin
(`axis`, `jev`, `both`). The match is mechanical — same file and a line within the suspect's window, or the
same requirement id for a spec suspect — so the subagent that later runs this only forwards the table.

## Acceptance criteria

How to verify: run the screen on this branch, hand-write a small findings table, run `--origins`, open the
sidecar.

- [ ] `--findings` accepts a JSON array or a Markdown table (`| id | axis | location | sources |`, the
      review's final table) from a path or stdin; `sources` is the orchestrator's per-finding list of
      raising axes, which is where `jev` membership comes from.
- [ ] The `jev` axis's drop list is part of the same input: `{ suspect: <rule+file+line or requirement>,
      fate: 'dropped', reason }` entries; a suspect named nowhere is recorded as `dropped` with reason
      `not reported`.
- [ ] Each finding gets `origin`: `jev` when its sources are only `jev`, `axis` when `jev` is absent,
      `both` otherwise. Each confirmed suspect that shares file+window with an axis-sourced finding is
      `merged` with that finding's id.
- [ ] The sidecar is rewritten in place with `origins: { findings: […], suspects: […], recordedAt }`;
      running `--origins` twice replaces the block rather than appending.
- [ ] Running `--origins` on a sidecar with `status: skipped|failed` still records the findings' origins
      (all `axis`) so `--report` counts that review.
- [ ] vitest specs: table parsing (both formats), origin classification, merge matching by window,
      idempotent rewrite.

## Leaf worklist

- [ ] 1 `[agent]` `origins/parse.ts`: findings table + drop list parsing (+ specs)
- [ ] 2 `[agent]` `origins/match.ts`: fate and origin assignment (+ specs)
- [ ] 3 `[agent]` `--origins` flags in `index.ts`, sidecar rewrite; extend `CONTEXT.md`
