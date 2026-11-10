# Notes — 01

## Build

- Commit: `74e7fe520d5e3dce1c9e23304735eddc75704dc9` (`74e7fe520`, tip of `issue-3838` before any foundation change)
- Build: `pnpm prod:preset eth --profile` (Turbopack, `next build --profile`, profiling `react-dom` aliased in)
- Working tree at build time: the SHA above plus this ticket's tooling fix — `--profile` moved from webpack to
  Turbopack because the webpack build no longer compiles (`@libp2p/http-utils` → `node:stream`). No `src/`
  change; the measured code is the SHA's.
- Exports (git-ignored): `.ai/tmp/before-txs-list.json`, `.ai/tmp/before-token-transfers.json`

Ticket 10 compares against these with `pnpm profile:analyze <before> <after> --commit=<N> --commit-b=<M>`;
both sides must come from the same build flavor (Turbopack, `--profile`).

## How the recordings were made, and which commit the tables are

Each recording: start the Profiler, load the URL, scroll to the footer so every lazy-render step
(`useLazyRenderedList`: 20 rows first, then +10 per step) commits, stop. Each trace has three big commits
before the reveal steps: the page shell, the 20-row skeleton commit and the 20-row real-data commit, then
three reveal commits of ~10 rows. The analyzer defaults to the biggest commit, which is the **skeleton**
one in both traces (loading rows render more fibers than data rows); the tables below are the **real-data
commit**, selected with `--commit`. Ticket 10 must pick the same commit kind on the after trace; the commit
indices will differ, so match by position in the commit list, not by number.

The DevTools 7 export carries Suspense-tree operations the analyzer did not parse before this ticket; the
parser was extended (with specs) so these tables are fully attributed.

### txs list — `pnpm profile:analyze .ai/tmp/before-txs-list.json --commit=24`

Commits ≥ 15 ms (shell, skeleton, **data**, reveal ×3):

```
  commit 4: 55.4ms, 1192 fibers, at 0.2s
  commit 10: 99.2ms, 8510 fibers, at 0.5s
  commit 24: 72.8ms, 7802 fibers, at 1.6s
  commit 49: 33.1ms, 3824 fibers, at 3.0s
  commit 73: 50.3ms, 3727 fibers, at 3.9s
  commit 92: 33.0ms, 3748 fibers, at 4.6s
```

```
=== .ai/tmp/before-txs-list.json — commit #24: duration=72.8ms, fibers=7802, sum(self)=68.3ms, effects=1.2ms, passive=25.1ms ===
rank | component | total ms | % of self | instances | avg ms
   1 | chakra(div) (ForwardRef)                     |     12.2 |   17.9% |    416 |   0.029
   2 | chakra(Component) (ForwardRef)               |      9.9 |   14.5% |    591 |   0.017
   3 | chakra(button) (ForwardRef)                  |      7.9 |   11.6% |     85 |   0.093
   4 | Memo(Anonymous) (Memo)                       |      6.2 |    9.1% |    579 |   0.011
   5 | ForwardRef(Anonymous) (ForwardRef)           |      5.9 |    8.6% |   1407 |   0.004
   6 | chakra(span) (ForwardRef)                    |      5.8 |    8.5% |    304 |   0.019
   7 | chakra(td) (ForwardRef)                      |      3.7 |    5.4% |    160 |   0.023
   8 | Anonymous (Function)                         |      2.7 |    4.0% |    954 |   0.003
   9 | chakra(a) (ForwardRef)                       |      2.5 |    3.7% |     96 |   0.026
  10 | chakra(svg) (ForwardRef)                     |      2.3 |    3.4% |    121 |   0.019
  11 | TagRoot (ForwardRef)                         |      1.5 |    2.2% |     13 |   0.115
  12 | ForwardRef(LoadableComponent) (ForwardRef)   |      1.2 |    1.8% |     23 |   0.052
  13 | Button (ForwardRef)                          |      1.2 |    1.8% |     85 |   0.014
  14 | Link (ForwardRef)                            |      0.6 |    0.9% |     96 |   0.006
  15 | Box (ForwardRef)                             |      0.6 |    0.9% |     51 |   0.012
  16 | A (Function)                                 |      0.5 |    0.7% |   1909 |   0.000
  17 | Flex (ForwardRef)                            |      0.5 |    0.7% |    165 |   0.003
  18 | Stack (ForwardRef)                           |      0.5 |    0.7% |     60 |   0.008
  19 | chakra(tr) (ForwardRef)                      |      0.4 |    0.6% |     21 |   0.019
  20 | chakra(TabTrigger) (ForwardRef)              |      0.3 |    0.4% |      6 |   0.050
  21 | E (Function)                                 |      0.3 |    0.4% |     40 |   0.008
  22 | Badge (ForwardRef)                           |      0.3 |    0.4% |     37 |   0.008
  23 | SpriteIcon (ForwardRef)                      |      0.2 |    0.3% |    120 |   0.002
  24 | chakra(th) (ForwardRef)                      |      0.2 |    0.3% |      8 |   0.025
  25 | PopoverTrigger (ForwardRef)                  |      0.1 |    0.1% |      2 |   0.050
  26 | PopoverPositioner (ForwardRef)               |      0.1 |    0.1% |      2 |   0.050
  27 | chakra(TabList) (ForwardRef)                 |      0.1 |    0.1% |      1 |   0.100
  28 | TableRow (ForwardRef)                        |      0.1 |    0.1% |     21 |   0.005
  29 | TableHeader (ForwardRef)                     |      0.1 |    0.1% |      1 |   0.100
  30 | TableCell (ForwardRef)                       |      0.1 |    0.1% |    160 |   0.001
  31 | TabContent (ForwardRef)                      |      0.1 |    0.1% |      3 |   0.033
  32 | chakra(TabContent) (ForwardRef)              |      0.1 |    0.1% |      3 |   0.033
  33 | RenderStrategyContext.Provider (Context)     |      0.1 |    0.1% |      1 |   0.100
  34 | TabTrigger (ForwardRef)                      |      0.0 |    0.0% |      6 |   0.000
  35 | TabsTrigger (ForwardRef)                     |      0.0 |    0.0% |      6 |   0.000
  36 | chakra(PopoverTrigger) (ForwardRef)          |      0.0 |    0.0% |      1 |   0.000
  37 | chakra(PopoverPositioner) (ForwardRef)       |      0.0 |    0.0% |      1 |   0.000
  38 | PresenceContext.Provider (Context)           |      0.0 |    0.0% |      4 |   0.000
  39 | PopoverContext.Provider (Context)            |      0.0 |    0.0% |      1 |   0.000
  40 | eo (Function)                                |      0.0 |    0.0% |      1 |   0.000
top-40 account for 68.3ms of 68.3ms self time; 70 component types
```

### token transfers list — `pnpm profile:analyze .ai/tmp/before-token-transfers.json --commit=21`

Commits ≥ 15 ms (shell, skeleton, tab-strip, **data**, reveal ×3):

```
  commit 4: 57.8ms, 1192 fibers, at 0.2s
  commit 12: 77.8ms, 7242 fibers, at 0.6s
  commit 13: 21.5ms, 2316 fibers, at 0.6s
  commit 21: 60.5ms, 6622 fibers, at 1.1s
  commit 29: 23.5ms, 3277 fibers, at 2.2s
  commit 43: 20.7ms, 3248 fibers, at 2.4s
  commit 60: 25.7ms, 3242 fibers, at 3.0s
```

```
=== .ai/tmp/before-token-transfers.json — commit #21: duration=60.5ms, fibers=6622, sum(self)=56.7ms, effects=0.8ms, passive=8.7ms ===
rank | component | total ms | % of self | instances | avg ms
   1 | chakra(Component) (ForwardRef)               |      9.2 |   16.2% |    578 |   0.016
   2 | chakra(a) (ForwardRef)                       |      7.7 |   13.6% |     81 |   0.095
   3 | chakra(button) (ForwardRef)                  |      6.2 |   10.9% |     66 |   0.094
   4 | chakra(div) (ForwardRef)                     |      5.4 |    9.5% |    276 |   0.020
   5 | ForwardRef(Anonymous) (ForwardRef)           |      4.6 |    8.1% |   1107 |   0.004
   6 | Anonymous (Function)                         |      4.3 |    7.6% |    925 |   0.005
   7 | chakra(td) (ForwardRef)                      |      3.3 |    5.8% |    140 |   0.024
   8 | Memo(Anonymous) (Memo)                       |      3.2 |    5.6% |    498 |   0.006
   9 | chakra(span) (ForwardRef)                    |      2.3 |    4.1% |    148 |   0.016
  10 | chakra(svg) (ForwardRef)                     |      1.7 |    3.0% |     94 |   0.018
  11 | ForwardRef(LoadableComponent) (ForwardRef)   |      1.4 |    2.5% |     31 |   0.045
  12 | Box (ForwardRef)                             |      1.4 |    2.5% |     78 |   0.018
  13 | A (Function)                                 |      0.8 |    1.4% |   1554 |   0.001
  14 | Button (ForwardRef)                          |      0.7 |    1.2% |     66 |   0.011
  15 | SpriteIcon (ForwardRef)                      |      0.6 |    1.1% |     94 |   0.006
  16 | chakra(img) (ForwardRef)                     |      0.5 |    0.9% |     18 |   0.028
  17 | z (Function)                                 |      0.5 |    0.9% |     20 |   0.025
  18 | Flex (ForwardRef)                            |      0.4 |    0.7% |    115 |   0.003
  19 | chakra(tr) (ForwardRef)                      |      0.4 |    0.7% |     21 |   0.019
  20 | chakra(th) (ForwardRef)                      |      0.2 |    0.4% |      7 |   0.029
  21 | TableCell (ForwardRef)                       |      0.2 |    0.4% |    140 |   0.001
  22 | Skeleton (ForwardRef)                        |      0.2 |    0.4% |     19 |   0.011
  23 | Image (ForwardRef)                           |      0.2 |    0.4% |     18 |   0.011
  24 | g (Function)                                 |      0.2 |    0.4% |      1 |   0.200
  25 | chakra(PopoverTrigger) (ForwardRef)          |      0.1 |    0.2% |      2 |   0.050
  26 | PopoverPositioner (ForwardRef)               |      0.1 |    0.2% |      4 |   0.025
  27 | eo (Function)                                |      0.1 |    0.2% |      2 |   0.050
  28 | HStack (ForwardRef)                          |      0.1 |    0.2% |      1 |   0.100
  29 | Link (ForwardRef)                            |      0.1 |    0.2% |     81 |   0.001
  30 | f (Function)                                 |      0.1 |    0.2% |     20 |   0.005
  31 | q (Function)                                 |      0.1 |    0.2% |     20 |   0.005
  32 | Badge (ForwardRef)                           |      0.1 |    0.2% |     20 |   0.005
  33 | E (Function)                                 |      0.1 |    0.2% |     40 |   0.003
  34 | U (Function)                                 |      0.1 |    0.2% |     20 |   0.005
  35 | E3 (Function)                                |      0.1 |    0.2% |      1 |   0.100
  36 | PopoverTrigger (ForwardRef)                  |      0.0 |    0.0% |      4 |   0.000
  37 | chakra(PopoverPositioner) (ForwardRef)       |      0.0 |    0.0% |      2 |   0.000
  38 | PresenceContext.Provider (Context)           |      0.0 |    0.0% |      2 |   0.000
  39 | PopoverContext.Provider (Context)            |      0.0 |    0.0% |      2 |   0.000
  40 | PopoverClassNameContext.Provider (Context)   |      0.0 |    0.0% |      2 |   0.000
top-40 account for 56.7ms of 56.7ms self time; 68 component types
```

## Superseded for the FR7 comparison

`eth` was down when the after profile was due, so ticket 10 re-recorded the baseline on the `robinhood`
preset from this same SHA and compared against that; see `../10-after-profile/notes.md`. The tables above
stay as the `eth` reference.
