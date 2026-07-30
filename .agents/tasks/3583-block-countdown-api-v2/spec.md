# Migrate block countdown from API v1 `getblockcountdown` to API v2

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3583 |
| Status | `ready` |
| Size | `medium` |
| Feature branch | `issue-3583` (set on first `implement-task` run) |
| PM | — |
| Designer | — |
| Backend | Nikita P. |
| Minimum backend version | **v11.2.3** — the countdown response shape this task targets ships in that release |
| Slack channel | — (default routing per `to-spec`) |

## Context & goal

The block countdown page is the last consumer of the API v1 RPC endpoint in this app. It calls
`/api?module=block&action=getblockcountdown&blockno=N` through a resource whose `path` is just `/api`,
with the module/action/blockno passed as query params — the shape of a legacy RPC call rather than a REST
resource. An API v2 route has existed since
[blockscout#12704](https://github.com/blockscout/blockscout/pull/12704) (2025-07-03) but returned 422 for
valid input, so the migration was never done.

[blockscout#14612](https://github.com/blockscout/blockscout/pull/14612) fixed that on 2026-07-23 and shipped
in **backend v11.2.3** (2026-07-24). The same PR renamed every response field, made
`estimated_time_in_seconds` a string, and set `additionalProperties: false`. So the target shape is settled
and verifiable against a live instance — `eth.blockscout.com` runs v11.2.3 today.

Goal: the countdown page reads `/api/v2/blocks/:height/countdown`, the v1 resource is gone, and the payload
is typed from the generated `@blockscout/api-types` package rather than by hand.

## Functional requirements

1. Block countdown data comes from `core:block_countdown` → `/api/v2/blocks/:height/countdown`. No API v1
   RPC call remains anywhere in the app.
2. The payload type is the generated one from `@blockscout/api-types`, not a hand-written interface.
3. User-visible behavior is unchanged for the two cases users actually hit:

   | Case | API response | Page behavior |
   | --- | --- | --- |
   | Countdown available | 200 with all four fields | Renders the countdown (as today) |
   | Block already mined | **200** `{"message":"Error! Block number already pass"}` | Redirects to `/block/[height_or_hash]` (as today) |
   | Chain still indexing | **200** `{"message":"Chain is indexing now, try again later"}` | Redirects to `/block/[height_or_hash]` (as today) |
   | Non-numeric or negative height | **422** `{"errors":[…]}` | Throws → error page (**changed**: v1 redirected) |
   | Average block time disabled | **501** `{"message":…}` | Throws → error page (**changed**: v1 redirected) |

   The rule is: **a 200 without `estimated_time_in_seconds` means "no countdown available" → redirect; any
   4xx/5xx throws.** The two changed rows are deliberate — under v1 an invalid height bounced the user to a
   block page that cannot exist, which is a worse outcome than an error page.
4. The countdown page requires backend **v11.2.3 or newer**. On older instances the response carries the
   pre-rename fields, so requirement 3's rule classifies it as "no countdown available" and the page
   redirects — the feature is absent but nothing crashes. No compatibility shim reads both field sets (see
   *Out of scope*). The PR carries the `breaking changes` label and states the minimum version, per
   [docs/CONTRIBUTING.md](../../../docs/CONTRIBUTING.md).

## Data & API

**Endpoint** — `GET /api/v2/blocks/:height/countdown`, Core API, production-deployed (not staging-only).
Unpaginated, no filters or sorting. `:height` must be a non-negative integer; a hash returns 422.

Success body, curl-verified against `https://eth.blockscout.com/api/v2/blocks/99999999/countdown`:

```json
{
  "countdown_block_number": 99999999,
  "current_block_number": 25647036,
  "estimated_time_in_seconds": "892235556.0",
  "remaining_blocks_count": 74352963
}
```

All four fields are required and `additionalProperties: false`
([countdown.ex](https://github.com/blockscout/blockscout/blob/master/apps/block_scout_web/lib/block_scout_web/schemas/api/v2/block/countdown.ex)).
Field mapping from v1 — every value the UI displays is present, so there is no data gap:

| v1 (`result.*`, all strings) | v2 | Type change |
| --- | --- | --- |
| `CountdownBlock` | `countdown_block_number` | string → **number** |
| `CurrentBlock` | `current_block_number` | string → **number** |
| `RemainingBlock` | `remaining_blocks_count` | string → **number** |
| `EstimateTimeInSec` | `estimated_time_in_seconds` | string → string |

**Non-success responses.** The OpenAPI spec declares only 200 / 404 / 422, but the controller's `with`
chain falls through to a
[fallback controller](https://github.com/blockscout/blockscout/blob/master/apps/block_scout_web/lib/block_scout_web/controllers/api/v2/fallback_controller.ex)
that returns **HTTP 200 with `{"message": …}`** for both "already pass" and "chain is indexing", and **501**
when average block time is disabled. It never returns the 404 the spec advertises. All four cases were
sampled live. This mismatch is **Q1**.

**Numeric precision.** The three renamed integers are unbounded and typed `integer`, so `JSON.parse` mangles
them past 2^53 — a 30-digit height really does come back as
`"remaining_blocks_count": 123456789012345678901208920841`, which becomes `1.2345678901234568e+29`. v1
returned them as strings, so this is a regression for absurd heights, and it is already under test (see
*UI inventory*). This is **Q2**.

**Types package.** No published `@blockscout/api-types` version carries the post-14612 schema — the newest
publish is 2026-07-02, three weeks before the rename. Neither the pinned `0.0.1-beta.82839e44ce` nor
`latest` (`0.1.0`) has the new field names. Worse, only the **`dev`** branch of `blockscout/blockscout`
exports the `paths` / `operations` / `schemas` helpers this repo imports in 469 files — they came from
[blockscout#14515](https://github.com/blockscout/blockscout/pull/14515), merged to `dev` on 2026-07-02 and
not yet on `master`. So `dev` is the only publishable ref, and its `types-package/package-lock.json` is
broken (`@redocly/openapi-core` requires `js-yaml@4.2.0`, the lock resolves `4.1.1`), which makes
`npm ci` — and therefore the publish workflow — fail. Subtask 1 fixes this.

Once published, the payload type is
`paths['/api/v2/blocks/{block_number_param}/countdown']['get']` (key verified present in the merged spec).

**No env vars, no feature flags.** The endpoint is unconditional, exactly as the v1 call is today.

## UI inventory

No route, navigation, metadata, sitemap or visual change. Routes `/block/countdown`,
`/block/countdown/[height]` and their `/chain/[chain_slug_or_id]/…` multichain twins are untouched.

- [`src/slices/block/pages/countdown-details/BlockCountdown.tsx`](../../../src/slices/block/pages/countdown-details/BlockCountdown.tsx)
  — the only consumer. Reads the four fields, renders `RemainingBlock` / `CurrentBlock` through
  `StatsWidget`, and redirects via `window.location.assign` when there is no countdown.
- [`src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx`](../../../src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx)
  — two screenshot cases, "short period" and "long period until the block". The long-period case is built on
  a 30-digit height, so it is exactly where the precision change in **Q2** shows up. Its baseline changes
  when the mocks move from strings to numbers (subtask 3).
- Multichain needs no change: `useApiQuery` already resolves the chain from `useMultichainContext`
  ([useApiQuery.ts:42](../../../src/api/hooks/useApiQuery.ts)), so the countdown request follows the
  cluster's chain automatically.
- [`SearchBarSuggestBlockCountdown.tsx`](../../../src/slices/search/components/search-bar/SearchBarSuggest/SearchBarSuggestBlockCountdown.tsx)
  and [`BlockCountdownIndex.tsx`](../../../src/slices/block/pages/countdown-index/BlockCountdownIndex.tsx)
  only link to and navigate into the countdown route — neither fetches, so neither changes.

## Out of scope

- **A compatibility shim** reading both the pre- and post-rename field sets. It would be permanent cruft for
  a transitional problem, and it would need a comment explaining a historical rename, which the
  [comment rules](../../../.claude/CLAUDE.md) push against. The minimum backend version is declared instead.
- **Backend changes to the endpoint** — the status codes in **Q1** and the string-typed integers in **Q2**
  are `blockscout/blockscout` work, not this repo's.
- **Renaming or retiring `src/api/resources/services/core/v1.ts`.** After this task it holds only `graphql`
  (whose path `/api/v1/graphql` is unrelated to the RPC API), so the file stays.
- New env vars, custom Mixpanel events (no new interactive element; page views are auto-wired), demo deploy.

## Task breakdown

- [ ] 1 `[agent]` Unblock `@blockscout/api-types` publishing, publish a beta from `dev`, and pin it →
  [`subtasks/01-publish-api-types/`](subtasks/01-publish-api-types/spec.md)
- [ ] 2 `[agent]` Migrate the resource and the countdown page to API v2 →
  [`subtasks/02-migrate-countdown-resource/`](subtasks/02-migrate-countdown-resource/spec.md)
- [ ] 3 `[human]` Regenerate the "long period" screenshot baseline →
  [`subtasks/03-countdown-baselines/`](subtasks/03-countdown-baselines/spec.md)

## Open questions

### Q1 — Should the non-success countdown responses use real status codes?

`/api/v2/blocks/:n/countdown` returns **HTTP 200** with `{"message":"Error! Block number already pass"}` when
the block is already mined, and **200** with `{"message":"Chain is indexing now, try again later"}` while the
chain indexes — bodies that violate the endpoint's own schema (`additionalProperties: false`, all four fields
required). Meanwhile the spec declares a **404** the controller never returns, and the **501** for disabled
average block time is not in the spec at all.

Asking whether already-passed should become a real 404 (and the other two documented), so clients can branch
on the status code instead of sniffing for a missing field. The frontend can ship either way — requirement 3
above works against today's behavior — but if this changes, subtask 2's narrowing logic changes with it.

- Owner: Backend (Nikita P.)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/D03UYHZTLTB/p1785434045879309
- Answer: <decision + date, once resolved>

### Q2 — Make the countdown's block numbers strings?

`countdown_block_number`, `current_block_number` and `remaining_blocks_count` are declared `integer` and
unbounded, so JavaScript loses precision above 2^53. Live example — `/api/v2/blocks/123456789012345678901234567890/countdown`
returns `"remaining_blocks_count": 123456789012345678901208920841`, which `JSON.parse` turns into
`1.2345678901234568e+29`, and the page renders that. API v1 returned all of these as strings, and
[#14612](https://github.com/blockscout/blockscout/pull/14612) already made `estimated_time_in_seconds` a
string for the same reason.

Asking for the three integers to become strings too. This decides subtask 2's payload type and the
mock values in subtask 3's baseline.

- Owner: Backend (Nikita P.)
- Status: `pending`
- Slack: https://blockscout.slack.com/archives/D03UYHZTLTB/p1785434045879309 (same thread as Q1)
- Answer: <decision + date, once resolved>
