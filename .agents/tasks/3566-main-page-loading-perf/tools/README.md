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

2. Open `http://localhost:3000/` in a **clean browser profile** (incognito, no extensions —
   React DevTools alone adds ~150 ms of scripting).

3. DevTools → Performance → "Record and reload". Stop a couple of seconds after the
   transactions/blocks lists show real data. Export the trace as JSON.

4. Extract the metrics:

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
