# 01 — Record the before profile

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3838 |
| Blocked by | none |

## What to build

A baseline render profile of the two list scenarios the task is measured against, recorded on the
code as it is before any foundation change, and its `pnpm profile:analyze` summary kept as task
evidence. Every later ticket's "no worse than before" verdict (ticket 10, FR7) compares against this
export, so it lands before ticket 03 may start.

## Acceptance criteria

How to verify: `pnpm prod:preset eth --profile`, open the two URLs under Details

- [x] Two React DevTools Profiler exports exist in `.ai/tmp/` (git-ignored), one per scenario, named so
      the scenario and "before" are obvious.
- [x] `notes.md` in this ticket folder holds the `pnpm profile:analyze` per-component table of each export
      and the commit SHA the build was made from.
- [x] `(human)` Each recording covers the second (real-data) commit of the page, not only the skeleton
      commit, and the row count on screen is 50.

## Details

Both scenarios are on the `eth` preset and produce a stable set of rows:

- txs list: `https://eth.blockscout.com/txs?page=2&next_page_params=%257B%2522index%2522%253A194%252C%2522filter%2522%253A%2522validated%2522%252C%2522block_number%2522%253A26336028%252C%2522items_count%2522%253A50%257D`
- token transfers list: `https://eth.blockscout.com/token-transfers?page=4&next_page_params=%257B%2522index%2522%253A297%252C%2522block_number%2522%253A26336040%257D`

Open them on the local prod server (same path and query, `localhost` host). Procedure and gotchas are in
`tools/profiling/CONTEXT.md`: profile in the prod `--profile` flavor, same flavor again in ticket 10.

## Leaf worklist

- [x] 1 `[agent]` Build and serve the profiling build: `pnpm prod:preset eth --profile`; record the SHA
- [x] 2 `[human]` Record both scenarios in React DevTools Profiler and export to `.ai/tmp/`
- [x] 3 `[agent]` Run `pnpm profile:analyze` on each export and write `notes.md`
