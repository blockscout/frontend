# Deploy a demo, then verify the preview manually

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 5 of #3593 |
| Status | `done` |
| Size | `medium` |
| Sub-branch | — (no code; runs the `deploy-demo` skill) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |
| Depends on | subtask 4 |

## Context & goal

This feature's acceptance criterion is what the card looks like *inside a social app*, and Telegram and X
fetch the URL themselves — they can't reach localhost. A hand-forged `Twitterbot` UA against a dev server
proves the tags render; only a public URL proves the real bot-detection path, the real core-API latency, and
the real card.

**This subtask is deliberately split between agent and human.** The agent deploys and can assert the tags
exist over `curl`, but the thing being accepted is that the preview *actually works* — a judgement made in a
third-party client, on a real card, by a person. The timeout ruling is likewise human: Grafana isn't
agent-reachable. So the agent finishes at "deployed, tags look right", and the human closes the subtask.

## Functional requirements

- A demo is deployed from the feature branch on the **`robinhood`** preset
  (`tools/dev-server/registry.json` → `https://robinhoodchain.blockscout.com`). It's the instance from the
  issue's own example, it has the interpretation feature on with real traffic, so summaries are non-empty.
- Pasting a transaction URL into Telegram shows `{status} · {action} · {timestamp}`, and the title carries
  the short hash.
- The 2 s timeouts are confirmed sufficient against that instance's core API — this is the open
  question the demo exists to answer, not a formality. If `api_request_duration_seconds` shows the
  `core:tx` or `core:tx_interpretation` calls landing in the top bucket or returning `504`, the timeout
  needs revisiting and subtask 4 needs a follow-up commit.

## Data & API

Nothing new. The metrics to read are already wired and need no code:

- `social_preview_bot_requests_total{route="/tx/[hash]", bot}` — incremented from `_document.tsx` via
  `logRequestFromBot`, so it confirms the bot was actually detected as a social-preview crawler.
- `api_request_duration_seconds{route="core:tx"|"core:tx_interpretation", code}` — recorded inside
  `fetchApi`, with `code=504` on abort. This is the timeout evidence.

Both require `PROMETHEUS_METRICS_ENABLED=true` on the deployment (`src/server/monitoring/metrics.ts`
returns `undefined` otherwise) — check that before concluding the metrics are empty for any other reason.

## UI inventory

None.

## Out of scope

Any code change. Findings that need one become a follow-up commit against the subtask that owns the code.

## Task breakdown

- [x] 1 `[agent]` Deploy the demo — skill: `deploy-demo`
  — two demos, since one instance can't show both sides: `review-issue-3593` on the busy instance (where the
  preview degrades, and whose metrics gave the `504` evidence) and `review-2-issue-3593` on eth mainnet
  (where it works). Each image build needed a retry — the runner's outbound network keeps failing on the npm
  and Alpine mirrors, unrelated to the branch.
  - inputs:
    - Preset: `robinhood`.
    - Deploy from the feature branch `issue-3593`.
- [x] 2 `[agent]` Verify the tags on the public URL
  — all three description outcomes observed live; see the findings below.
  - inputs:
    - `curl -A Twitterbot` and `curl -A TelegramBot` against a settled transaction on that chain; confirm
      the title and the three-part description.
    - Also hit it with no special UA and confirm the SEO tags are unchanged.
- [x] 3 `[human]` Paste the link in Telegram and confirm the card really works
  — confirmed in Telegram **and** X on a second demo pointed at eth mainnet
  (`review-2-issue-3593.k8s-dev.blockscout.com`), where the endpoints answer fast enough for the enhanced
  description to resolve on the first request.
  - inputs:
    - The acceptance check: a real card in a real client, not a `curl` assertion. Also the check Ulyana and
      QA will run themselves.
    - Worth trying a transaction with a long action string to see where Telegram truncates, and a pending
      one to see the fallback in the wild.
- [x] 4 `[human]` Read the metrics and rule on the timeouts
  — ruled: keep 2 s. The metrics did get read in the end, once they worked (see below), and they said the
  quiet part out loud — on the busy instance `core:tx` aborted on 6 of 6 bot requests. Raising the timeout
  is not the answer, so the backend team is adding an endpoint built for this feature instead; adopting it
  is subtask 6.
  - inputs:
    - Human because Grafana isn't agent-reachable.
    - Look at the `api_request_duration_seconds` distribution for `core:tx` / `core:tx_interpretation` and
      any `code="504"`, and decide whether 2 s holds. The agent's findings below say it does not on this
      instance; the ruling is whether that's acceptable degradation or backend work.

## Findings from the demo (agent steps)

<!-- cspell:ignore SWOGE -->

Every branch was observed on the public URL, so the wiring is proven end to end:

- summary branch — `Success · Swap 0.4 ETH for 2.65M SWOGE · Jul 29, 2026 8:49 UTC`
- fallback branch — `Success · 0x07...e311 called dagSwapTo on OKX Labs: DexRouter · Jul 29, 2026 8:49 UTC`
  (note the `to` address resolving through its metadata name tag, as on the page)
- generic fallback when a request doesn't land in time

`og:title` carries the short hash, `<title>` keeps the full one, and `<meta name="description">` is
untouched — for bots and for a plain UA alike.

**Reliability is the open issue, and it is the backend's latency.** Over 10 identical `Twitterbot`
requests to one transaction, only 3 produced an enhanced description and only 1 of those used the summary;
a human pasting the link into Telegram saw the generic description every time.

Paced sampling of that instance from outside the cluster (25 transactions, one request every 3 s over a
10-minute window, 105 requests, all `200`, no rate limiting) — `/api/v2/stats` included as a control for
network and edge overhead:

| endpoint | phase | p50 | p90 | p95 | max | over 2 s |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/v2/stats` (control) | — | 0.27 s | 0.50 s | 0.50 s | 0.50 s | 0/5 |
| `core:tx` | cold | 2.84 s | 4.20 s | 4.34 s | 4.36 s | 21/25 |
| `core:tx` | warm | 3.08 s | 4.26 s | 4.45 s | 4.65 s | 24/25 |
| `core:tx_interpretation` | cold | 0.84 s | 8.33 s | 9.67 s | 10.21 s | 11/25 |
| `core:tx_interpretation` | warm | 0.75 s | 2.01 s | 2.62 s | 2.73 s | 3/25 |

The control says ~0.3 s of that is network, so the rest is backend time. Two distinct problems: `core:tx`
is *uniformly* slow — every single call took over a second, and warm is no faster than cold, so nothing is
cached — while `core:tx_interpretation` is bimodal, fast when cached and up to 10 s when not. Since the
status and timestamp both come from `core:tx`, its p50 of 2.8 s alone defeats the 2 s timeout on most
requests, which is why the preview almost never enhances on this instance. For comparison, eth mainnet
answers the same two endpoints in 0.56 s and 0.95 s cold.

(An earlier run without pacing showed ~12 s summary times; the paced numbers above supersede it — part of that was
contention from our own burst.)

**Conclusion: don't raise the timeout further.** 2 s already exceeds what the other routes allow, and no
crawler waits for 4 s. The finding goes to the backend team as an endpoint-latency issue on this instance;
until then the preview degrades to the generic description there, which is the designed behavior.

**The metrics this subtask planned to read did not work, and now do.** The cause was found and fixed on
`main` in #3600 (registry cached on `globalThis`, since Next.js instantiates the module once per server
bundle and the second `register.clear()` unregistered the first's metrics). After merging it, the busy
instance's demo answered the timeout question directly: 6 bot requests produced
`api_request_duration_seconds_count{route="core:tx",code="504"} 6` — every mandatory call aborted at 2 s —
against 3 of 6 succeeding for `core:tx_interpretation` at ~1.3 s each. The original diagnosis follows.

**The bug as found.** `PROMETHEUS_METRICS_ENABLED` *is* set for review
instances (`deploy/values/review/values.yaml.gotmpl`) and `/api/metrics` answers `200` — it returns `404`
when disabled — but the registry it exposes only ever contains what **API routes** record. Posting to
`/api/monitoring/invalid-api-schema` makes `invalid_api_schema` appear immediately, while
`api_request_duration_seconds` and `social_preview_bot_requests_total` stay sample-less through any amount
of bot traffic, because `fetchApi` and `_document.tsx` run in the SSR bundle, which gets its own
`prom-client` module instance and therefore its own registry. The `frontend_*` default metrics are missing
too, cleared by `promClient.register.clear()` in `metrics.ts`. So the parent spec's claim that these calls
are "instrumented for free" is wrong, on every deployment and not just review — tracked as its own task.

## Open questions

None.
