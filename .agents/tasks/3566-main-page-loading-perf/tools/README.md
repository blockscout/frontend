# Measurement protocol for issue #3566

Every subtask in `../spec.md` ends with a before/after measurement. The numbers go into the
"Impact tracking" table in the spec. **Always measure a production build** — dev-mode traces are
useless for magnitudes (React dev build, Turbopack on-demand compile, and StrictMode double-fetch
inflate everything 2–3×).

## Recording a trace

1. Build and serve a production bundle against a live instance's config:

   ```bash
   pnpm prod:preset <alias>                 # use the preset the baseline numbers were taken with
   pnpm prod:preset <alias> --skip-build    # restart from the existing build
   ```

   Keep the **same preset** for every measurement — metrics M3/M4 depend on the instance's
   backend latency, so numbers from different presets are not comparable.

2. Record the trace, either by hand or scripted.

   **By hand** — open `http://localhost:3000/` in a **clean browser profile** (incognito, no
   extensions — React DevTools alone adds ~150 ms of scripting), then DevTools → Performance →
   "Record and reload". Stop a couple of seconds after the transactions/blocks lists show real
   data. Export the trace as JSON.

   **Scripted** — `trace.mjs` drives headless Chromium over CDP and writes the same JSON:

   ```bash
   node trace.mjs http://localhost:3000/ /tmp/traces/before 3   # 3 runs -> before-1..3.json
   ```

   It records the same event categories the Performance panel does and uses a fresh browser
   context per run (no extensions, cold cache), so it is the scripted equivalent of the clean
   profile above. Prefer it whenever you need several runs per variant or a repeatable A/B; a
   single exploratory trace is easier by hand, where you can also read the flame chart.

3. Extract the metrics:

   ```bash
   python3 trace-metrics.py baseline.json            # one trace
   python3 trace-metrics.py baseline.json after.json # A/B comparison
   ```

## Interpreting the numbers

- **M1 (FCP), M2 (first API request start), M5 (blocking time), M6 (JS before FCP)** are stable
  run-to-run — a single run per variant is usually enough to see a lever's effect.
- **M3 (transactions data ready) and M4 (content rendered)** include the backend's response time,
  which varies significantly between runs. Take the **median of 3+ runs**, or reason via
  M2 + known backend latency instead.
- The app under `prod:preset` proxies API calls through `localhost:3000/node-api/proxy` (the
  fetched config keeps `APP_ENV=development`). Both variants of an A/B pair share this hop, so
  deltas are valid — but do not compare absolute values against traces of a deployed instance.
- **Headless (`trace.mjs`) and headed absolute values are not comparable either** — same rule,
  compare within one capture method. Do not mix them in a single row of the spec's table.
- **M6 is not a sufficient gate on its own.** A bundler change can leave the bytes-before-FCP
  almost untouched while doubling FCP and tripling blocking time, because the cost is in executing
  the code rather than transferring it. Always read M1 and M5 alongside M6 before concluding a
  change is cheap — see `.agents/adr/0001-webpack-for-production-builds.md` for the case that
  taught us this.
- `prod:preset` builds with the same bundler as the shipped image (webpack, per that ADR), so its
  traces represent what users get. If you ever measure a build made another way, say so next to
  the numbers.
