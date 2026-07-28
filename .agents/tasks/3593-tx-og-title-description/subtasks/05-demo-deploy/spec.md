# Deploy a demo, then verify the preview manually

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 5 of #3593 |
| Status | `ready` |
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
- The 1 s timeouts are confirmed sufficient against that instance's core API — this is the open
  question the demo exists to answer, not a formality. If `api_request_duration_seconds` shows the
  `core:tx` or `core:tx_interpretation` calls landing in the 1 s bucket or returning `504`, the timeout
  needs raising and subtask 4 needs a follow-up commit.

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

- [ ] 1 `[agent]` Deploy the demo — skill: `deploy-demo`
  - inputs:
    - Preset: `robinhood`.
    - Deploy from the feature branch `issue-3593`.
- [ ] 2 `[agent]` Verify the tags on the public URL
  - inputs:
    - `curl -A Twitterbot` and `curl -A TelegramBot` against a settled transaction on that chain; confirm
      the title and the three-part description.
    - Also hit it with no special UA and confirm the SEO tags are unchanged.
- [ ] 3 `[human]` Paste the link in Telegram and confirm the card really works
  - inputs:
    - The acceptance check: a real card in a real client, not a `curl` assertion. Also the check Ulyana and
      QA will run themselves.
    - Worth trying a transaction with a long action string to see where Telegram truncates, and a pending
      one to see the fallback in the wild.
- [ ] 4 `[human]` Read the metrics and rule on the timeouts
  - inputs:
    - Human because Grafana isn't agent-reachable.
    - Look at the `api_request_duration_seconds` distribution for `core:tx` / `core:tx_interpretation` and
      any `code="504"`, and decide whether 1 s holds. If it doesn't, subtask 4 gets a follow-up commit
      raising it.

## Open questions

None.
