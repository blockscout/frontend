# React render profiling — context

Tooling for measuring and attributing React render cost of heavy pages (large tables,
long lists). Born out of the July 2026 `TokenTransferTable` optimization (dev 1275→646ms,
prod 554→259ms); kept generic so any page can be profiled the same way.

## Files

| File | Role |
|---|---|
| `profile.preset.sh` | `pnpm profile:preset <alias>` — production build + serve with the profiling `react-dom`, env-wired to a live instance exactly like `pnpm dev:preset` (see `tools/dev-server/CONTEXT.md`). `--skip-build` re-serves the existing build. |
| `aggregate-react-profile.mjs` | `pnpm profile:analyze <profile.json> [profileB.json]` — turns a React DevTools Profiler export into a per-component cost table (total self ms / instances / avg). With two files, also prints a delta table. |

## Workflow

1. **Attribute in dev** — `pnpm dev:preset <alias>`, record the scenario in the React DevTools
   Profiler, export ("Save profile...", the down-arrow button), run `pnpm profile:analyze` on it.
   Dev numbers are inflated (~2.5× vs prod) but component names are real.
2. **Size in prod** — `pnpm profile:preset <alias>`, record the same scenario. Numbers are close
   to what users pay; most names are minified.
3. **Compare** — `pnpm profile:analyze a.json b.json` (e.g. baseline vs patched: `git stash` around
   the rebuild). Only compare traces from the **same build flavor** — minified names differ across builds.

Keep exports in `.ai/tmp/` — they're ~30MB each and `.ai` is git-ignored.

## Gotchas (these bit us; don't re-learn them)

- **A normal prod build cannot be profiled** — the Profiler tab refuses to record. `--profile`
  aliases `react-dom` → `react-dom/profiling`. We pass `--webpack` because the flag is guaranteed
  on the webpack pipeline; Turbopack (the Next 16 default) doesn't document support.
  `next.config.js` deliberately maintains both pipelines.
- **Prod traces still attribute better than expected**: components with an explicit `displayName`
  (all of Chakra/Ark, `SpriteIcon`, …) survive minification; app function components don't.
- **Durations are render-phase self times.** Layout/passive effect totals are separate fields on
  each commit (the analyzer prints them in the header) — check them before assuming render is the problem.
- **A data-driven page commits twice** per navigation/filter change: once with skeleton placeholder
  rows, once with real data. Look at both big commits, not just the first.
- **The DevTools `operations` wire format drifts.** Current parser handles the trailing
  `compiledWithForget` field on ADD records (DevTools ≥ 6.x). On format drift it warns and
  degrades to partial attribution instead of failing — if you see many unattributed fibers,
  check the ADD record layout in `react-devtools-shared` first.
- **Fibers unmounted mid-session** (e.g. rows replaced when real data arrives) are only nameable
  through the `operations` replay, not the final-tree `snapshots` — that's why the analyzer
  replays operations first and uses snapshots as a fallback.
