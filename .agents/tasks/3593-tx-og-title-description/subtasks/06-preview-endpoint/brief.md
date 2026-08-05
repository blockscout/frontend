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
