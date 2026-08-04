// Record page-load performance traces without the DevTools UI.
//
// Produces the same JSON the Performance panel's "Record and reload" export produces, so the output
// feeds straight into trace-metrics.py. Use it when you want several runs per variant (M3/M4 need a
// median) or a repeatable A/B — the manual protocol in README.md is still fine for a one-off.
//
// Usage, against an already-running production server (`pnpm prod:preset <alias>`):
//
//   node .agents/tasks/3566-main-page-loading-perf/tools/trace.mjs http://localhost:3000/ ./traces/after 3
//   python3 .agents/tasks/3566-main-page-loading-perf/tools/trace-metrics.py ./traces/before-2.json ./traces/after-2.json
//
// Writes <out-prefix>-<n>.json for n in 1..runs.

/* eslint-disable no-console -- a CLI tool: stdout is its interface, for the usage hint and for
   reporting each trace it wrote. */

import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// Long enough for the transactions/blocks lists to fill with real data, which M3/M4 measure.
const SETTLE_MS = 10_000;

// The capture set the Performance panel uses: devtools.timeline for resources/tasks/render commits,
// loading for navigationStart, blink.user_timing for paint marks, __metadata for thread names
// (trace-metrics.py needs those to tell CrRendererMain apart from other threads).
const CATEGORIES = [
  '-*',
  'devtools.timeline',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'blink.user_timing',
  'loading',
  'latencyInfo',
  'v8.execute',
  '__metadata',
];

const [ url, outPrefix, runsArg ] = process.argv.slice(2);
if (!url || !outPrefix) {
  console.error('Usage: node trace.mjs <url> <out-prefix> [runs=1]');
  process.exit(2);
}
const runs = Number(runsArg ?? 1);

mkdirSync(dirname(outPrefix), { recursive: true });

// A fresh context per run is the scripted equivalent of the protocol's "clean browser profile":
// no extensions, no warm HTTP cache, no carried-over service worker.
const browser = await chromium.launch();

for (let run = 1; run <= runs; run++) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  const events = [];
  client.on('Tracing.dataCollected', ({ value }) => events.push(...value));
  const complete = new Promise((resolve) => client.once('Tracing.tracingComplete', resolve));

  // Tracing has to start before the navigation — that is what "Record and reload" does, and
  // navigationStart is the zero point every metric is relative to.
  await client.send('Tracing.start', {
    transferMode: 'ReportEvents',
    traceConfig: { includedCategories: CATEGORIES, recordMode: 'recordAsMuchAsPossible' },
  });

  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(SETTLE_MS);

  await client.send('Tracing.end');
  await complete;
  await context.close();

  const out = `${ outPrefix }-${ run }.json`;
  writeFileSync(out, JSON.stringify({ traceEvents: events }));
  console.log(`${ out }: ${ events.length } events`);
}

await browser.close();
