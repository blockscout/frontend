# Leave the preview alone on Noves-provider instances

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 7 of #3593 |
| Status | `done` |
| Size | `small` |
| Sub-branch | — (single commit on `issue-3593`) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |
| Depends on | subtasks 3 and 4 |

## Context & goal

An instance runs **one** interpretation provider: with `provider === 'noves'` the transaction page renders
Noves' prose and Blockscout's own summary is not used at all. Parent [Q1](../../spec.md#q1--what-should-the-og-description-show-on-noves-provider-instances)
settled what the preview should do there: **nothing** — keep the generic metadata description, and don't call
the Noves API for it. The reasoning was that quietly pointing social-bot traffic at a third party's slow API
isn't ours to decide; if Noves wants the richer card, they can ask, conditional on their API's performance.

Today the code does something else. `config.features.txInterpretation.isEnabled` is `true` on a Noves
instance, so `getServerSideProps` still requests `core:tx_interpretation` — the *Blockscout* summary endpoint,
which has nothing to serve there — gets an empty `summaries` array, and falls through to the
`called … on …` branch. That is Q1's option 2, not the decision.

## Functional requirements

- On an instance whose interpretation provider is `noves`, `/tx/[hash]` emits **no** enhanced OG description:
  `apiData` stays `null` and the card keeps the generic `<meta name="description">` text.
- Neither `core:tx` nor `core:tx_interpretation` is requested on those instances — the whole point is to add
  no crawler-driven load, and with no action available the other two params are useless anyway.
- The OG **title** is unaffected: it carries the short hash on every instance, since it needs no API data.
- No behavior change where the provider is `blockscout`.
- Where the feature is off entirely the output is unchanged (it already had no action, so no enhanced
  description), but the gate stops requesting `core:tx` there too — it could never produce a description, and
  the provider defaults to `none`, so that request was pure waste on the majority of instances.

### Verification

`curl -A Twitterbot` against a dev server on a Noves-provider preset shows the generic `og:description` and
the short-hash `og:title`, and the server logs show **no** API request for the transaction.

## Data & API

None — this only removes requests.

## UI inventory

- `src/pages/tx/[hash].tsx` — the gSSP gate.
- `src/slices/tx/utils/get-og-description-params.ts` + its spec — the action chain's front door.

## Out of scope

- Fetching and rendering Noves prose (`core:noves_transaction`, `createNovesSummaryObject`) — that is the
  option Q1 rejected. Should Noves later ask for it, it slots in as one more branch here.
- The transaction page's own rendering, which keeps using Noves as it does today.

## Task breakdown

- [x] 1 `[agent]` Skip the enhanced description when the provider is `noves`
  — `getActionText` and `[hash].tsx`'s gate both now require `provider === 'blockscout'`, so a Noves instance
  (and an instance with the feature off) makes no request at all. Verified with `curl -A Twitterbot` on the eth preset with the provider overridden: generic
  `og:description`, short-hash title, no transaction request in the server log (103 ms of application code),
  against `Success · Transfer 0.013 ETH to … · Jul 29, 2026 14:04 UTC` on the same hash with `blockscout`.
  - inputs:
    - Read the provider the way the rest of the code does: `getFeaturePayload(config.features.txInterpretation)?.provider`
      (`src/config/utils/features`), which is `undefined` when the feature is off. `TxSubHeading.tsx:39` is
      the reference for the same check on the client.
    - Gate it in **both** places, because they answer different questions: the gSSP gate decides whether to
      spend requests, and `getOgDescriptionParams` decides whether an action exists. The util already returns
      `null` without an action, so the second guard is what makes the first one's absence harmless.
    - Extend the feature check already in `getActionText` rather than adding a second branch — the condition
      becomes "interpretation on **and** provider is Blockscout".
- [x] 2 `[agent]` Cover it in the existing specs
  — one case in `get-og-description-params.spec.ts` under "gives up when a part is missing".
  - inputs:
    - `get-og-description-params.spec.ts` — a case with the Noves provider returning `null`, via
      `withEnvs` with `NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER` set to `noves` (the existing
      `ENVS_MAP.txInterpretation` preset sets it to `blockscout`, so this one needs its own override).
    - Nothing to add for the gSSP gate; it has no unit test today and testing Next.js plumbing would only
      assert the mock.

## Open questions

None.
