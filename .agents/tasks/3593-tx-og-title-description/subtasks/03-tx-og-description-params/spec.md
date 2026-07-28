# Derive the three OG description params for a transaction

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 3 of #3593 |
| Status | `done` |
| Size | `medium` |
| Sub-branch | — (single commit on `issue-3593`) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |
| Depends on | subtask 2 (`summaryToPlainText`, `addressToPlainText`) |

## Context & goal

The unit that turns the two API responses into the three strings the OG description template compiles.

It lives in the tx slice rather than in `src/shell/metadata/` for two concrete reasons: `generate()` is
called from `update.ts` on every client-side route change, so anything it reaches for is bundled for all
users — and `apiData` is serialized into `__NEXT_DATA__`, so passing raw responses through would ship
`token_transfers`, `decoded_input`, `raw_input` hex and whole `Token`/`Address` objects into the HTML of
every bot request. Three short strings instead. This also matches precedent: `ApiData<'/address/[hash]'>` is
already `{ domain_name: string }` — a derived value, not an API response.

## Functional requirements

- One exported function in `src/slices/tx/utils/get-og-description-params.ts` taking the (possibly
  `undefined`) `core:tx` and `core:tx_interpretation` responses.
- It returns `{ tx_status: string; tx_action: string; tx_timestamp: string }` **or `null`** — never an
  object with `undefined` members. This enforces the parent spec's all-or-nothing rule at the source, and
  it is also required: Next.js refuses to serialize `undefined` in props.
- **Status** — `ok` → `Success`, `error` → `Failed`, `null` → `Pending`. `undefined` → no status, mirroring
  `TxStatus` returning `null` for `undefined` (`src/slices/tx/components/TxStatus.tsx:19`). This distinction
  is load-bearing: `fetchApi` returns non-200 bodies as data, so a 404's `{ message: … }` must not read as
  `Pending`.
- **Timestamp** — `dayjs(tx.timestamp).utc().format('lll') + ' UTC'`. The `lll` locale format is already
  `MMM D, YYYY H:mm` (`src/shared/date-and-time/dayjs.ts:47`) and the `utc` plugin is already loaded, so no
  new format string is introduced. Absent when `timestamp` is `null` (pending transactions).
- **Action** — the chain from the parent spec, in order:
  1. `config.features.txInterpretation.isEnabled` false → no action.
  2. `summaryToPlainText(interpretation.data.summaries[0])` if it returns a string → that.
  3. else, if `method` **and** `from` **and** `to` are all present →
     `` `${ addressToPlainText(from) } ${ status === 'error' ? 'failed to call' : 'called' } ${ method } on ${ addressToPlainText(to) }` ``
  4. else → no action.

  Branch 3's wording, and its use of `addressToPlainText` rather than a bare hash, come from
  `TxSubHeading.tsx:105` — the UI feeds `from`/`to` through `AddressEntity`, so names and ENS domains show
  when present.

## Data & API

Consumes the two responses described in the parent spec; issues no requests of its own (subtask 4 owns the
fetching). Types: `schemas['TransactionResponse']` from `@blockscout/api-types` and `TxInterpretationResponse`
from `src/features/tx-interpretation/common/types/api`.

Guard against the `fetchApi` non-200 trap by checking the fields, not the object: an error body has no
`timestamp` and no `status`, so it produces `null` without any special-casing.

## UI inventory

No visual surface. New file `src/slices/tx/utils/get-og-description-params.ts` (kebab-case, matching
`get-revert-reason-text.ts` and its siblings) plus its `.spec.ts`.

## Out of scope

- The Noves branch — parent Q1, explicitly **not blocking**. Build the four-branch chain above; if the
  answer is yes, Noves slots in ahead of branch 2 as an additive commit.
- Fetching, gating, and the `ApiData` type — subtask 4.

## Task breakdown

- [x] 1 `[agent]` Write `get-og-description-params.ts`
  — exports `TxOgDescriptionParams` alongside the function, for subtask 4's `ApiData` entry.
  - inputs:
    - Return `null` unless all three strings resolve; assemble them independently first, then check.
    - Read the feature flag as `config.features.txInterpretation.isEnabled` at call time (not module load),
      so tests can vary it.
    - Import `dayjs` from `src/shared/date-and-time/dayjs` (never the package directly — the locale
      overrides live in that module).
- [x] 2 `[agent]` Unit tests
  — the happy path uses the `TX_INTERPRETATION` stub, whose summary has no timestamp variable, so the only
  date in the assertions is the util's own UTC one.
  - inputs:
    - Cover: the happy path against the parent spec's production sample (expect
      `Success · Swap 2.92M SPERPS for 0.016 WETH · Jul 27, 2026 22:39 UTC`); <!-- cspell:ignore SPERPS --> each status word; `undefined`
      response → `null`; pending (`status: null`, `timestamp: null`) → `null`; feature off → `null`; no
      summary + `method`/`from`/`to` → the `called` line; the same with `status: 'error'` → `failed to call`;
      no summary and `method: null` → `null`; a 404-shaped body (`{ message: 'Not found' }`) → `null`.
    - Reuse `src/slices/tx/mocks/details.ts` (`base`) for the transaction and
      `src/features/tx-interpretation/blockscout/mocks.ts` for the summary.
    - Timestamp assertions must be timezone-independent — the whole point is that output is UTC regardless
      of where the test runs.

## Open questions

Parent [Q1](../../spec.md#q1--on-noves-provider-instances-must-the-og-description-match-the-noves-prose)
touches this subtask's action chain but does **not** block it.
