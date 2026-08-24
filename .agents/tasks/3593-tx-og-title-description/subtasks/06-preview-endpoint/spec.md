# Fetch the preview data from the endpoint built for it

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 6 of #3593 |
| Status | `done` |
| Size | `small` |
| Sub-branch | — (commits land directly on `issue-3593`, as in subtasks 1–5) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | Nikita P. (built the endpoint) |
| Depends on | subtask 4 |

## Context & goal

Subtask 4 built the description from `core:tx` + `core:tx_interpretation`. That works where the API is fast
and fails where it isn't: `core:tx` supplies the two mandatory fields, so when it aborts at the 2 s timeout
there is no description at all. On the loaded instance the parent spec's Q2 is about, it aborted on 6 of 6
crawler requests. Raising the timeout was ruled out — crawlers wait single-digit seconds, and a card that
fails to render is worse than a plain one.

The backend built `/api/v2/transactions/:hash/preview` for this feature: the same fields, none of the rest.
Measured on that same instance it answers in 0.51 s at p50 and never crossed 1 s (table below), so the
mandatory half of the description now arrives inside the budget where it never did. This subtask switches the
page to it.

The summary stays a **separate** request with its own timeout. Folding it into the preview response was
offered and declined: `/summary` is by far the slowest of the three calls, and coupling them would turn every
slow summary into a lost description instead of a degraded one.

## Functional requirements

- `/tx/[hash]`'s `getServerSideProps` requests **`core:tx_preview`** in place of `core:tx`, with
  `preload_ens`, `preload_metadata` and `decode_input` all `true`. They measure as free, so all three are
  always sent; none is made conditional.
- `core:tx_interpretation` keeps its own parallel request and its own **2 s** timeout, unchanged. When it
  misses the budget the description still resolves from the preview payload alone, via the existing
  `called … on …` branch.
- Both timeouts stay at **2 s**. The preview has headroom to spare, but the summary beside it does not, and
  a shared shorter budget would only cut off successes the crawler was willing to wait for.
- **No fallback to `core:tx`.** Where the endpoint is absent — an instance whose backend predates it — the
  request fails and the card keeps the generic description, exactly as it does today when a request times
  out. Chaining a second attempt would spend a crawler's patience precisely on the instances that are already
  slow. The frontend release notes name the backend version that ships the endpoint.
- The address labelling chain is unchanged — name tag → `ens_domain_name` → `name` → shortened hash — and
  `getAddressName` already accepts a partial address, so the narrower payload needs no change to it.
- The action text is unchanged in every branch: summary when there is one, otherwise
  `<from> called|failed to call <method> on <to>` with the **decoded** method name, which is what
  `decode_input=true` buys.
- No behavior change where the interpretation provider is not `blockscout` — subtask 7's gate sits in front
  of this code and still decides whether any request is made at all.

### Verification

`curl -A Twitterbot` against the demo on the loaded instance shows the enhanced description on a first
request for a transaction, and the server log shows one preview request inside the timeout. A real card in
Telegram confirms it end to end.

## Data & API

`GET /api/v2/transactions/:hash/preview` — merged in
[blockscout#14638](https://github.com/blockscout/blockscout/pull/14638) (2026-08-11), deployed to the loaded
instance and to staging. Sampled response:

```json
{ "status": "ok", "timestamp": "2026-08-14T08:46:24.000000Z", "method": "exactInputSingle",
  "from": { "hash": "0x…", "name": null, "ens_domain_name": null },
  "to":   { "hash": "0x…", "name": "SwapRouter02", "ens_domain_name": null } }
```

Three boolean query parameters, all defaulting to `false`; an unknown field is rejected with a 400
(`Unexpected field: <name>`), so this is the whole set:

| parameter | effect |
| --- | --- |
| `decode_input` | `method` becomes the decoded name (`0x04e45aaf` → `exactInputSingle`) instead of the selector |
| `preload_ens` | fills `ens_domain_name` |
| `preload_metadata` | fills the address `metadata` tags (fixed and deployed 2026-08-14 — see Q1) |

Latency on the loaded instance, paced sampling, disjoint transaction sets per variant, measured after the
metadata fix went live (`/stats` as the network control at 0.17 s):

| request | p50 | p90 | max | over 2 s |
| --- | --- | --- | --- | --- |
| `/preview` + all three parameters | 0.51 s | 0.59 s | 0.95 s | 0 / 10 |
| `/preview` without `preload_metadata` | 0.49 s | 0.97 s | 1.04 s | 0 / 10 |
| `/preview` bare | 0.21 s | 0.46 s | 0.70 s | 0 / 10 |
| `/transactions/:hash` | 1.90 s | 2.64 s | 3.34 s | 4 / 8 |
| `/transactions/:hash/summary` | 4.31 s | 5.56 s | 11.16 s | 7 / 8 |

The preloads are worth their cost: turning all three on is indistinguishable from turning only `decode_input`
on, and the whole request still fits inside a third of the budget. The two bottom rows were measured earlier
in the day, when the control read 0.37 s — the instance's own load moves these numbers more than any
parameter does, which is the point of keeping a control in every run.

**The budget is per instance, not per endpoint.** A `k8s-dev` instance serves the same request in ~1.7 s as
measured from inside the cluster, which loses to the 2 s timeout often enough that the description never
resolves there — warming the response first makes no difference, so it is the instance's floor rather than a
cold-start cost. Nothing to fix in the page: the same build enhances every request against a production
instance. It does mean a demo pointed at a dev instance is not evidence about this feature either way.

- **Resource:** `core:tx_preview` — new, added to `src/api/resources/services/core/tx.ts`. Not paginated, no
  filters. The three parameters are passed per-call through `fetchApi`'s `queryParams`, which already
  supports them, so nothing in the registry needs to carry them.
- **Response type:** no published `@blockscout/api-types` version has this path (checked `0.1.0` and every
  beta), so a beta must be published first — see the breakdown and Q1.
- **Error shape:** an unknown hash is a 404 with `{"message":"Not found"}`. `fetchApi` returns non-200 bodies
  as data, so the parent spec's trap still applies and `getOgDescriptionParams` still guards it by requiring
  a timestamp and by distinguishing `undefined` from `null` status.

## UI inventory

No visual output — `<meta>` tags only.

- `src/pages/tx/[hash].tsx` — the gSSP fetch.
- `src/slices/tx/utils/get-og-description-params.ts` + its spec — adapted to the narrower payload; its logic
  (status map, UTC timestamp, action chain) is unchanged.
- `src/api/resources/services/core/tx.ts` — the new resource and its type branch.

## Out of scope

- Using the endpoint anywhere but the social-preview path — the transaction page keeps `core:tx`.
- Multichain `/chain/[chain_slug_or_id]/tx/[hash]`, and the other OG-enhanced routes (address, token, NFT,
  stats), which have their own resources.
- Folding the summary into the preview response — declined above.
- Any change to the timeouts, the bot gate, or the Noves gate.

## Task breakdown

- [x] 1 `[agent]` Publish the beta types and pin the exact version — skill: `publish-beta-types`
  — `0.0.1-beta.e709d22`, published from `dev` ([run](https://github.com/blockscout/blockscout/actions/runs/32009994992))
  and pinned in `package.json`; the schema types the three query parameters and a `PreviewAddress` with
  `metadata`.
  - inputs:
    - Service `core` → package `@blockscout/api-types`, repo `blockscout/blockscout`, workflow
      `publish-api-types-npm-dev.yml` (no dispatch inputs).
    - Branch: **`dev`** — it carries both the endpoint and the metadata fix (Q1). `master` has only partial OpenAPI
      schema support, so a package built from it would not be correct.
    - Pin the exact published version in `package.json` — never the `@beta` tag.
- [x] 2 `[agent]` Declare the `core:tx_preview` resource — skill: `add-api-resource`
  — entry and payload branch in `src/api/resources/services/core/tx.ts`, typed from the package's
  `paths[…/preview]['get']`; verified with a throwaway `ResourcePayload` probe (positive and negative).
  - inputs:
    - Service `core`, key `core:tx_preview`, path `/api/v2/transactions/:hash/preview`, path param `hash`.
    - Live instance for the sample response: the loaded instance from the parent spec's Q2 (the developer
      names the registry alias at run time); the sample above was taken from it.
    - Types-package state: published by step 1; type comes from
      `paths['/api/v2/transactions/{transaction_hash_param}/preview']['get']`.
    - No filters, no sorting, not paginated.
- [x] 3 `[agent]` Switch the page to the preview resource
  — `[hash].tsx` calls `core:tx_preview` with the three parameters; `getOgDescriptionParams` and the mocks
  take `schemas['Preview']`, and `addressToPlainText` now takes the same name-source type `getAddressName`
  defines, since the preview's address carries only those fields.
  - inputs:
    - In `src/pages/tx/[hash].tsx`, replace the `core:tx` call with `core:tx_preview` plus
      `queryParams: { preload_ens: true, preload_metadata: true, decode_input: true }`; leave the
      `core:tx_interpretation` call, both timeouts, and the surrounding gates alone.
    - Adapt `getOgDescriptionParams`'s first parameter to the preview payload type. Its branches are
      unchanged, and its spec file covers them — update the fixtures, not the assertions.
- [x] 4 `[agent]` Redeploy the demo and check a real card — skill: `deploy-demo`
  — both variants on this branch's image: the loaded instance enhances **6 of 6** crawler requests where the
  old path managed 0 of 6, and a `k8s-dev` instance enhances none of 6 for the reason recorded above.
  - inputs:
    - Variant `review-2`, branch `issue-3593`, no image rebuild unless the branch moved.
    - Preset: the loaded instance from the parent spec's Q2 — the developer names the alias at deploy time.
    - Then `curl -A Twitterbot` for the tags, and post the link for the PM to confirm the card.

## Open questions

### Q1 — Can the metadata fix reach `dev`, so the types can be published?

The types package can only be built from `dev`; `master` has partial OpenAPI schema support. But `dev`
currently has neither the endpoint ([#14638](https://github.com/blockscout/blockscout/pull/14638), merged to
`master`) nor the metadata fix ([#14703](https://github.com/blockscout/blockscout/pull/14703), open against
`master`). So the ask is: merge the fix, then merge `master` into `dev`.

The fix matters beyond the types. `preload_metadata=true` was accepted but serialized nothing — where
`/transactions/:hash` returned a curated name tag, the preview response carried only the plain contract name
(Q3's `OKX Labs: DexRouter` → `DexRouter` case). Without it the parent spec's Q3 would have landed on "ENS
kept, name tags lost" by omission rather than by the PM's choice.

- Owner: Backend (Nikita P.)
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/C03MMUTQDNU/p1786701659121719 (sent 2026-08-14)
- Answer (2026-08-14): both merges done — the fix landed in `master` at 10:09 and `master` was merged into
  `dev` at 11:24, so `dev` carries the endpoint and the fix and is 0 behind. Verified on the deployed
  instance: the address objects now include `metadata`, and a tagged address returns its curated tag, so the
  preview text matches the page. Q3's dial stays where the PM left it — nothing is lost.
