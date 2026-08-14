# Fetch the preview data from the endpoint the backend is building for it

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 6 of #3593 |
| Status | `not scoped` (this is a brief; the sub-spec is written just-in-time via `grill-the-task` in subtask mode) |
| Depends on | subtask 4 and the backend endpoint |

## Why this subtask exists

Subtask 4 fetches `core:tx` and `core:tx_interpretation` in parallel to build the OG description. That works
where the API is fast and fails where it isn't: on a heavily loaded instance the mandatory `core:tx` call
aborted at the 2 s timeout on 6 of 6 crawler requests (in-cluster
`api_request_duration_seconds{route="core:tx",code="504"} 6`), so the card kept the generic description.
Raising the timeout is not available — crawlers wait single-digit seconds, and a card that fails to render
is worse than a plain one.

Rather than trade the timeout against the failure rate, the backend team agreed to add an endpoint shaped for
this feature: only the fields the preview needs, so it can answer fast. This subtask switches the page to it.

## What the frontend asked for

Sent in the thread below, so the endpoint can be checked against it when it lands:

- `status` (`ok` / `error` / `null`), `timestamp` — the two mandatory fields.
- `method`, `from`, `to` — only for the fallback action branch, and from the addresses only what the page
  labels them with (metadata name tag, `ens_domain_name`, `name`, else the shortened hash).
- The interpretation summary **in its current shape** (`summary_template` + `summary_template_variables`) —
  the text is rendered on the frontend so it matches the page's subheading exactly.
- Ideally the summary in the *same* response, so the page makes one request with one timeout instead of two.
- Target: comfortably under the 2 s timeout on a first request, including on a loaded instance.

## What this subtask will have to do

Rough shape, to be confirmed when the endpoint's contract is known:

- Add the resource via the `add-api-resource` skill, with its response type.
- Replace the two `fetchApi` calls in `src/pages/tx/[hash].tsx` with the one call; keep the bot gate, the
  multichain guard, and the timeout constant.
- Adapt `getOgDescriptionParams` (`src/slices/tx/utils/`) to the new payload. Its logic is unchanged — status
  map, UTC timestamp, action chain — only the input shape moves, and its spec file covers the branches.
- Decide what happens on instances whose backend is older than the endpoint: keep the two-request path as a
  fallback, or gate the feature on the endpoint's presence. This is the main open design question and needs
  the backend's release plan.

## What the endpoint actually returns (sampled 2026-08-14)

`GET /api/v2/transactions/:hash/preview`, 404 + `{"message":"Not found"}` for an unknown hash — so the
`fetchApi` trap the parent spec describes still applies. Payload:

```json
{ "status": "ok", "timestamp": "2026-08-14T08:46:24.000000Z", "method": "exactInputSingle",
  "from": { "hash": "0x…", "name": null, "ens_domain_name": null },
  "to":   { "hash": "0x…", "name": "SwapRouter02", "ens_domain_name": null } }
```

Three boolean query parameters, all defaulting to **false**: `preload_ens`, `preload_metadata`,
`decode_input`. The endpoint rejects an unknown field with a 400 (`Unexpected field: <name>`), so the accepted
set is exactly those three.

- `decode_input=true` is what turns `method` from the raw selector into the name — `0x04e45aaf` becomes
  `exactInputSingle`, matching `/transactions/:hash`. **Without it the fallback action line would show the
  selector**, so this task must send it.
- `preload_ens=true` works: an ENS name on `from` appears only with the parameter.
- `preload_metadata=true` is accepted but **serializes nothing** — no `metadata` key reaches the address
  objects with or without it, so where `/transactions/:hash` returns a curated name tag the preview response
  carries only the plain contract name (Q3's `OKX Labs: DexRouter` → `DexRouter` case). Reported and
  **confirmed as a bug by the backend on 2026-08-14, fix coming**, so the spec should assume the tags arrive
  and Q3's dial stays where the PM left it.

### Latency

Paced sampling on the loaded instance the parent spec's Q2 is about — the hard case — with disjoint
transaction sets per variant so nothing is warmed by a sibling call, and `/stats` as the network control at
0.37 s:

| request | p50 | p90 | max | over 2 s |
| --- | --- | --- | --- | --- |
| `/preview` bare | 0.76 s | 1.11 s | 1.31 s | 0 / 8 |
| `/preview?decode_input=true` | 0.91 s | 1.17 s | 1.96 s | 0 / 8 |
| `/preview` + all three parameters | 0.66 s | 0.92 s | 1.66 s | 0 / 8 |
| `/transactions/:hash` | 1.90 s | 2.64 s | 3.34 s | 4 / 8 |
| `/transactions/:hash/summary` | 4.31 s | 5.56 s | 11.16 s | 7 / 8 |

The preloads cost nothing measurable — the spread between the three preview rows is smaller than the run-to-run
noise — so **request all of them**. The endpoint solves the mandatory half of the description outright: status
and timestamp now arrive inside the budget on the instance where they never did.

The summary does not, and that is the shape of the change: the two requests stay **separate**, each with its
own timeout, so a `/summary` that misses the budget degrades to the preview's own fields (status, timestamp,
and the `called … on …` line) instead of taking the whole description down with it. Folding the summary into
the preview response would have coupled them, which is why it was rejected.

## Where it stands (2026-07-29)

Nikita P. is building the endpoint with the **ens / metadata / summary preloads individually switchable**, and
will put it on staging to measure. His read: the ENS and metadata preloads are what cost the second, they can
be parallelised, and without third-party calls the response should fit in ~1 s.

That turns the name-vs-latency trade-off (parent Q3, resolved) into a dial: Ulyana allowed dropping ENS and
tags from the OG text but called it a degradation, so this subtask should **measure with the preloads on
first** and only switch them off if the numbers demand it. The same paced sampling method as before applies —
the script from the earlier measurements takes a host as input.

Blocked on the endpoint reaching staging. Thread:
https://blockscout.slack.com/archives/C03MMUTQDNU/p1785325326478759

**Update (2026-08-14):** deployed and measured (tables above). The endpoint delivers what it was asked for —
status and timestamp inside the budget on the loaded instance, with the preloads on. Ready to scope; the one
loose thread is `preload_metadata` serializing no tags, which changes the action text but not the shape of
the change.
