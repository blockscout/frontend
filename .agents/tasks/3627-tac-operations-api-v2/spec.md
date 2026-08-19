# Migrate the TAC operations UI to Read API v2

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3627 |
| Status | `done` |
| Feature branch | `issue-3627` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | Evgenii |
| Minimum API version | `tac-operation-lifecycle` **v1.2.0** — the service release that serves Read API v2; core **v11.2.8** — the release whose `/api/v2/search` returns the v2 operation shape |
| Slack channel | — (default routing per `grill-the-task`) |

## Context & goal

The `tac-operation-lifecycle` service described an operation's whole lifecycle through one overloaded
`type` field that mixed three unrelated things: the transfer **route** (`TON_TAC_TON`, `TAC_TON`,
`TON_TAC`), the **state** (`PENDING`, `ROLLBACK`) and a locally derived **failure reason**
(`INSUFFICIENT_FEE`), plus two catch-alls (`UNKNOWN`, `ERROR`). Two defects follow from that shape and
cannot be worked around in the UI: the route is unknowable until an operation completes, so the direction
cannot be shown while it matters most; and a finalized failure without a rollback is indistinguishable
from a success, so `type: "TON_TAC_TON"` has never actually meant "succeeded" despite being read that way.

The upstream Stage Profiler moved to a v2 contract that separates route, business outcome, finality and
rollback. The backend consumes it, stores the facts separately, and exposes them through a new Read API v2
([blockscout-rs#1720](https://github.com/blockscout/blockscout-rs/pull/1720)).

Goal: the operations list, the operation details page and the by-transaction block read `/api/v2/tac/...`
and render the newly available facts — status independent of route, route while pending, the rollback flag,
and the failure reason.

## Functional requirements

1. The operations list, the operation details page and the by-transaction block read from
   `/api/v2/tac/...`. Paths, query params, pagination and search are identical to v1; only the operation
   object changes.
2. The status indicator is driven by `status` alone. No code path derives an outcome from `type`.
3. The route is driven by `type` and is rendered for **pending** operations too, not only completed ones.
4. Status and route stay in **one combined tag** — a status icon and colour wrapping the route text. This
   is a standing product decision: an earlier design split them into two fields and was rejected. Do not
   reintroduce the split.
5. `rollback: true` renders as a separate tag beside the status tag, never as a fourth status value. A
   `failed` operation may have `rollback` either `true` or `false` and both must render.
6. On the details page the title carries **one** badge: `Rollback` when `rollback: true`, otherwise the
   route. Never both — this preserves the current behaviour, where the single badge was driven by the
   v1 `type` and read `Rollback` for a rollback.
7. `error_reason` is rendered inside the status tag's tooltip when present, appended to the failure text.
   When absent the tooltip carries the plain failure text — the field is optional and legitimately missing
   in many failed states.
8. `type: "UNKNOWN"` renders the status word with a spinner in the neutral pending presentation, and no
   route. It means the operation id is indexed but its data has not loaded yet, which lasts a second or
   two; the API reports `status: pending` for it, so this is the pending presentation minus the route
   text, not a new state.
9. The per-stage failure text (`status_history[].note`) is reachable on the details page.
10. A `failed` operation may later become `success`, and the UI shows `failed` with no hedging in the
    meantime — no spinner, no "may still resolve" wording. Deliberate: the user cannot act on it and does
    not know what they would be waiting for.
11. Legacy values `PENDING`, `ROLLBACK`, `INSUFFICIENT_FEE` and `ERROR` are gone from every code path in
    `src/`. The search surfaces are the last to migrate, because their payload comes from core rather than
    from the tac service — see subtask 06.
12. No regression in search (`q`), pagination, sender rendering or the stage timeline.

## Data & API

**Endpoints** — same host as v1, no env or config change. All three exist on `tac-operation-lifecycle`
v1.2.0:

- `GET /api/v2/tac/operations?q=&page_token=&page_items=`
- `GET /api/v2/tac/operations/{operation_id}`
- `GET /api/v2/tac/operations:byTx/{tx_hash}`

The v1 resources are declared in
[`src/api/resources/services/tac-operation-lifecycle.ts`](../../../src/api/resources/services/tac-operation-lifecycle.ts)
and must be repointed. `stat_operations` in that file has never been consumed and is removed rather than
migrated.

**Operation object.** Four fields replace the single `type`:

| Field | Type | Required | Semantics |
| --- | --- | --- | --- |
| `operation_id` | `string` | yes | |
| `type` | `UNKNOWN \| TON_TAC_TON \| TAC_TON \| TON_TAC` | yes | **Route only.** Carries no outcome |
| `status` | `pending \| success \| failed` | yes | **Business outcome.** Lower-case values |
| `rollback` | `boolean` | yes | Whether a rollback occurred. Independent of `status` in the contract, though every rollback is expected to be `failed`. Do not hardcode that relationship |
| `timestamp` | `string` (RFC 3339, ms, UTC) | yes | |
| `sender` | `{ address, blockchain: TAC \| TON \| UNKNOWN_BLOCKCHAIN }` | no | |
| `error_reason` | `string` | no | Short failure label, e.g. `Insufficient Fee` |
| `status_history` | `V2OperationStage[]` | details endpoints only | Stage timeline, unchanged from v1 |

Sample responses for every status/rollback combination are in the
[issue](https://github.com/blockscout/frontend/issues/3627).

**Migration mapping** from the v1 `type` values:

| v1 `type` | v2 equivalent |
| --- | --- |
| `PENDING` | `status: pending`; `type` may already carry a concrete route |
| `INSUFFICIENT_FEE` | `status: failed`, `error_reason: "Insufficient Fee"` |
| `ROLLBACK` | `status: failed`, `rollback: true`; the route is preserved in `type` |
| `TON_TAC_TON` / `TAC_TON` / `TON_TAC` | `type` = route; the outcome is in `status` and **may be `failed`** |
| `UNKNOWN` | `type: UNKNOWN` |
| `ERROR` | Not produced in v2; such an operation reads as `pending` / `UNKNOWN` |

**Contract gotchas** — deliberate backend decisions, not bugs:

1. `failed` does not wait for finality; `success` does. An operation reads `failed` as soon as the outcome
   is known, while the indexer still polls it upstream, so `failed → success` is possible (requirement 10).
   A successful but not-yet-final operation reads `pending`. `success` is terminal.
2. `error_reason` is published only when the stored value is at most 16 characters — longer values are raw
   upstream payloads (serialized revert data, whole message bodies) rather than labels, and truncating them
   was rejected. Treat it as optional in every failed state; the full text stays per stage in `note`.
3. `type: UNKNOWN` has two causes — not profiled yet, or a route this API version does not know. They are
   indistinguishable and need not be distinguished.
4. Legacy rows may report `success` for an operation that actually failed: rows indexed under the v1
   upstream contract are mapped rather than hidden, and that contract could not express "finalized failure
   without rollback". This reproduces exactly what the UI shows today, so it is not a regression, and a
   background re-profiling worker converts them over time. No frontend handling.
5. A stage `timestamp` is `null` when the stage has no transactions. Pre-existing in v1.

**Types package.** `@blockscout/tac-operation-lifecycle-types@1.2.0` shipped **no v2 types at all**: the
package's `compile:proto` script listed only the v1 protos, so the v2 protos that landed in
`proto/v2/` were never generated. Note the version collision that made this confusing — the npm package and
the service Docker image both sit at `1.2.0` and are unrelated numbers.
[blockscout-rs#1725](https://github.com/blockscout/blockscout-rs/pull/1725) fixed the build; subtask 01
pins the beta published from `main` afterwards. All v2 messages and enums are `V2`-prefixed, so they
coexist with the v1 exports — which is what lets subtask 06 stay deferred without blocking anything.

**Deployment.** No feature flag and no coordinated cutover: Read API v1 is byte-for-byte unchanged
(additive-only Swagger diff), so v1 and v2 can be served in parallel indefinitely. There are three
service instances — mainnet, testnet and a staging of testnet — and at spec time v2 is deployed only to
the staging one, which no frontend points at. The service must be rolled out to the instances the
frontends do use **before this task merges**; the backends can be updated early since they stay
v1-compatible. That rollout is tracked on the PR, owned by Backend, and is not a code dependency.

**The search surfaces are the one exception**, and they do need a coordinated release. Their payload comes
from core, and core replaces `/api/v1/tac/operations` with the v2 call rather than serving both, so an
instance whose core predates **v11.2.8** would hand this frontend a v1 operation object it no longer parses.
Core cuts v11.2.8 when this task is ready, and the two ship together — see Q4.

Development and the demo deploy both run against the staging service host published in the issue, by
overriding `NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST`.

## UI inventory

One Figma frame covers every screen:
[TAC TON-TAC operations](https://www.figma.com/design/1UWWsK0bg6ifzS9O1NLlo4/TAC-TON-TAC-operations?node-id=4001-37444).
The issue carries screenshots of the same frames.

Everything lives under `src/features/chain-variants/tac/`, and the feature is gated on
`config.features.tac.isEnabled` (API host plus TON explorer URL) — unchanged by this task. Two routes
exist, `/operations` and `/operation/[id]`, plus a block on the transaction page and the search surfaces.

**The combined status tag** — [`TacOperationStatus`](../../../src/features/chain-variants/tac/components/TacOperationStatus.tsx)
today takes a single `tac.OperationType` and switches it into an error / pending / ok presentation. It
becomes the component that reads `status` for presentation and `type` for the label, and it is shared by
the list, the details page, the by-tx block and (eventually) search. Route labels come from
[`getTacOperationStatus`](../../../src/features/chain-variants/tac/utils/tac-operation.ts) — a name that
stops being accurate once it returns a route rather than a status, and should be renamed accordingly.
`STATUS_SEQUENCE` and `STATUS_LABELS` in the same file are keyed by the v1 stage enum and move to the v2 one.

**The rollback tag** is its own component, rendered as a sibling — the details page title uses it without
the status tag, so it cannot be baked in.

**List** — [`TacOperationsTable`](../../../src/features/chain-variants/tac/pages/operations/TacOperationsTable.tsx)
/ `TacOperationsTableItem` and the mobile `TacOperationsList` / `TacOperationsListItem`. No new column:
status, route and the optional rollback tag are one cell. `TacOperationEntity` renders a spinner for
pending operations and keys that off `type` today.

**Details** — [`TacOperation`](../../../src/features/chain-variants/tac/pages/operation-details/TacOperation.tsx)
(title badge via `TacOperationTag`), `TacOperationDetails` (the Status row), and the lifecycle accordion,
whose item content already renders a `note` row and whose trailing synthetic "Pending" item keys off `type`
today.

**By transaction** — [`TxDetailsTacOperation`](../../../src/features/chain-variants/tac/pages/tx/TxDetailsTacOperation.tsx),
composed into the transaction details page. It already renders the current-stage tags beside each
operation via `getTacOperationStage`, and that stays as-is.

**Search** — the search bar suggestion and the search results row/list item render `TacOperationStatus`
from a payload that arrives on the **core** `/api/v2/search` response, not from this service, typed in
[`src/features/chain-variants/tac/types/api.ts`](../../../src/features/chain-variants/tac/types/api.ts).
Core still returns the v1 shape, which is why subtask 06 is deferred.

**Tests** — `TacOperationStatus.pw.tsx` covers five v1 states and never covered `ROLLBACK` or
`INSUFFICIENT_FEE`; `TacOperation.pw.tsx` covers the details page. Screenshot cases stay minimal — one per
visual variant — and the text/branching matrix is covered by Vitest instead, since the tag is built from
standard toolkit components and screenshots are expensive. No Vitest spec exists for this feature yet.
Mocks live in `mocks/operations.ts` and `mocks/search.ts`, and placeholder data in `stubs.ts`.

## Out of scope

- **The "application" column** TAC asked for on the operations table. Their API is not ready and they do
  not yet know where the data comes from; it was explicitly deferred to its own task.
- **The by-transaction block rendering nothing** where the status block should be — a separate known issue,
  reported by Backend, cause not yet established. Not folded in here.
- **Live updates.** There is no socket on these pages and none is added; a pending operation repaints on
  refresh. No mockup exists for the transition, by design.
- **The core `/api/v2/search` migration itself** — backend work in `blockscout/blockscout`. Subtask 06
  consumes it once it lands.
- **Retiring Read API v1 on the backend.** No sunset date; to be agreed separately.
- New env vars or feature flags.

## Task breakdown

- [x] 01 Pin the v2 types package → [`subtasks/01-pin-v2-types/`](subtasks/01-pin-v2-types/spec.md) — blocked by: none
- [x] 02 Repoint the resources and rebuild the status tag on the operations list → [`subtasks/02-list-and-status-tag/`](subtasks/02-list-and-status-tag/spec.md) — blocked by: 01
- [x] 03 Operation details page → [`subtasks/03-operation-details/`](subtasks/03-operation-details/spec.md) — blocked by: 02
- [x] 04 By-transaction operations block → [`subtasks/04-by-tx-block/`](subtasks/04-by-tx-block/spec.md) — blocked by: 02
- [x] 05 Remove the v1 client and refresh the generated API docs → [`subtasks/05-remove-v1/`](subtasks/05-remove-v1/spec.md) — blocked by: 02, 03, 04
- [x] 06 Point the search surfaces at the v2 shape → [`subtasks/06-search-surfaces/`](subtasks/06-search-surfaces/spec.md) — blocked by: 02

## Open questions

### Q1 — Is `failed` a terminal status?

An insufficient-fee operation was described as staying nominally pending, since the fee can be topped up
and the operation can still succeed, while the issue reports it as `status: failed` with
`error_reason: "Insufficient Fee"` — and the v2 proto notes that `failed` is published while the indexer
still re-requests the operation upstream. If `failed` can flip to `success`, a red cross with a reason is
misleading, and no mockup covers that case.

- Owner: Backend (Evgenii)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D085WMQ2BC5/p1786700647766519
- Answer: 2026-08-14 — `failed` is terminal for the frontend but not for the indexer; the status can still
  change later. Showing a spinner on such operations was considered and rejected as more confusing, since
  the user can neither act on it nor know what they are waiting for. The UI shows `failed`, and shows
  `success` if it later becomes so. Agreed with Design and raised with TAC without objection. Captured as
  requirement 10.

### Q2 — Which instances serve Read API v2?

The frontend ships as one build to every instance and carries no feature flag, so an instance still on the
old service would 404 on the v2 paths.

- Owner: Backend (Evgenii)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D085WMQ2BC5/p1786700647766519
- Answer: 2026-08-14 — three instances exist (mainnet, testnet, staging of testnet); v2 is deployed only to
  the staging one, which no frontend points at. Rolling out to the rest is safe to do early because the
  service stays v1-compatible, and it is a release gate on the PR rather than a code dependency. Captured
  under *Deployment*.

### Q3 — Does the details page title keep its route badge?

The mockup shows only a `Rollback` tag beside the title, while the page renders a route badge there today —
raising whether the route badge is deliberately dropped.

- Owner: PM (Ulyana), Designer (Tatyana)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1786700651871919
- Answer: 2026-08-14 — nothing changes. The badge is mutually exclusive today because the v1 `type` was a
  single field: a rollback rendered `Rollback`, everything else rendered the route. The mockup draws the
  rollback case, so the route badge is absent there rather than removed. Captured as requirement 6.

### Q4 — Has the v2 operation shape reached the core `/api/v2/search` response?

The search surfaces render TAC operations from a payload embedded in the **core** search response rather than
from `tac-operation-lifecycle`, and core returned the v1 shape when this task was written. A v1 `type` can be
`PENDING`, `ROLLBACK` or `INSUFFICIENT_FEE`, so it cannot be reinterpreted as a pure route — which is why
subtask 06 was deferred instead of riding along with subtask 02.

- Owner: Backend (Evgenii → core backend team, Victor)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/C04NCPZGRAR/p1786715688895299
- Answer: 2026-08-19 — yes. Core's `dev` branch carries
  [#14719](https://github.com/blockscout/blockscout/pull/14719), which switches the search result to Read
  API v2 and describes the operation object in core's own OpenAPI spec, so the shape no longer has to be
  owned by the feature. Two consequences: core **replaces** `/api/v1/tac/operations` rather than serving both
  (a dual-endpoint period was considered and rejected as not worth the complexity for three instances), so a
  minimum core version applies; and the change ships in core **v11.2.8**, cut when the frontend is ready.
