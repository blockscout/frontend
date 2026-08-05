# Migrate block countdown from API v1 `getblockcountdown` to API v2

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3583 |
| Status | `done` |
| Size | `medium` |
| Feature branch | `issue-3583` |
| PM | — |
| Designer | — |
| Backend | Nikita P. |
| Minimum backend version | **v11.2.4** — v11.2.3 has the endpoint, but only v11.2.4 has the response contract this task targets |
| Slack channel | — (default routing per `to-spec`) |

## Context & goal

The block countdown page is the last consumer of the API v1 RPC endpoint in this app. It calls
`/api?module=block&action=getblockcountdown&blockno=N` through a resource whose `path` is just `/api`,
with the module/action/blockno passed as query params — the shape of a legacy RPC call rather than a REST
resource. An API v2 route has existed since
[blockscout#12704](https://github.com/blockscout/blockscout/pull/12704) (2025-07-03) but returned 422 for
valid input, so the migration was never done.

[blockscout#14612](https://github.com/blockscout/blockscout/pull/14612) fixed that on 2026-07-23 and shipped
in **backend v11.2.3** (2026-07-24), renaming every response field and setting `additionalProperties: false`.
[blockscout#14646](https://github.com/blockscout/blockscout/pull/14646) then settled the rest of the contract
— real status codes for the non-success cases and string-typed block numbers (the answers to **Q1** and
**Q2**) — and shipped in **v11.2.4** (2026-08-04), which production instances run. So the target shape is
final and verifiable against a live instance.

Goal: the countdown page reads `/api/v2/blocks/:height/countdown`, the v1 resource is gone, and the payload
is typed from the generated `@blockscout/api-types` package rather than by hand.

## Functional requirements

1. Block countdown data comes from `core:block_countdown` → `/api/v2/blocks/:height/countdown`. No API v1
   RPC call remains anywhere in the app.
2. The payload type is the generated one from `@blockscout/api-types`, not a hand-written interface.
3. User-visible behavior is unchanged for the case users actually hit — an already-mined block still lands on
   the block page:

   | Case | API response | Page behavior |
   | --- | --- | --- |
   | Countdown available | 200 with all four fields | Renders the countdown (as today) |
   | Block already mined | **404** `{"message":"Block number already mined"}` | Redirects to `/block/[height_or_hash]` (as today) |
   | Chain still indexing | **422** `{"message":"Chain is indexing now, try again later"}` | Throws → error page (**changed**: v1 redirected) |
   | Non-numeric or negative height | **422** `{"errors":[…]}` | Throws → error page (**changed**: v1 redirected) |
   | Average block time disabled | **501** `{"message":…}` | Throws → error page (**changed**: v1 redirected) |

   The rule is: **404 means "the block exists, there is nothing to count down to" → redirect; every other
   non-200 throws.** The changed rows are deliberate — under v1 an invalid height bounced the user to a block
   page that cannot exist, which is a worse outcome than an error page.
4. The countdown page requires backend **v11.2.4 or newer**. On v11.2.3 the non-success cases answer 200
   instead of 404/422 and the block numbers are JSON integers, so the page would neither render nor redirect
   correctly; no compatibility shim reads both contracts (see *Out of scope*). The PR carries the
   `breaking changes` label and states the minimum version, per
   [docs/CONTRIBUTING.md](../../../docs/CONTRIBUTING.md).

## Data & API

**Endpoint** — `GET /api/v2/blocks/:height/countdown`, Core API, production-deployed (not staging-only).
Unpaginated, no filters or sorting. `:height` must be a non-negative integer; a hash returns 422.

Success body, curl-verified against the `staging` preset (v11.2.4):

```json
{
  "countdown_block_number": "99999999",
  "current_block_number": "11424472",
  "estimated_time_in_seconds": "1105865454.6",
  "remaining_blocks_count": "88575527"
}
```

All four fields are required, string-typed and `additionalProperties: false`
([countdown.ex](https://github.com/blockscout/blockscout/blob/master/apps/block_scout_web/lib/block_scout_web/schemas/api/v2/block/countdown.ex)).
Field mapping from v1 — every value the UI displays is present and every type is unchanged, so there is no
data gap and no conversion to write:

| v1 (`result.*`, all strings) | v2 (all strings) |
| --- | --- |
| `CountdownBlock` | `countdown_block_number` |
| `CurrentBlock` | `current_block_number` |
| `RemainingBlock` | `remaining_blocks_count` |
| `EstimateTimeInSec` | `estimated_time_in_seconds` |

**Non-success responses**, every one of them declared in
[`operation :block_countdown`](https://github.com/blockscout/blockscout/blob/master/apps/block_scout_web/lib/block_scout_web/controllers/api/v2/block_controller.ex)
and produced by the
[fallback controller](https://github.com/blockscout/blockscout/blob/master/apps/block_scout_web/lib/block_scout_web/controllers/api/v2/fallback_controller.ex):

| Case | Status | Body |
| --- | --- | --- |
| Target block already mined | 404 | `{"message":"Block number already mined"}` |
| Chain still indexing | 422 | `{"message":"Chain is indexing now, try again later"}` |
| Non-integer or negative height | 422 | `{"errors":[{"title":"Invalid value",…}]}` |
| Average block time disabled | 501 | `{"message":"Average block time calculation is disabled, so block countdown is not available"}` |

The 200, 404 and both 422 shapes were sampled live on v11.2.4; the 422-while-indexing and the 501 are
source-verified (neither is reproducible on a healthy instance). Note that 422 covers *both* an invalid height
and an indexing chain, so the status code alone does not separate them — nothing in this task needs to.

**Numeric precision** is no longer a concern: all four fields are strings, so a 30-digit height round-trips
intact (`"remaining_blocks_count":"123456789012345678901223143418"`). One quirk survives —
`estimated_time_in_seconds` is a stringified Elixir float, so an absurd height yields
`"1.5413580108191357e30"`. The UI only feeds it to `Number()`, which parses that correctly.

**Types package.** The repo pins `@blockscout/api-types@0.0.1-beta.8e1692a`, published from `dev` after
[#14646](https://github.com/blockscout/blockscout/pull/14646), so all four fields are string-typed in the
generated schema. Subtask 1 published `0.0.1-beta.50eadc8`, but `main` landed `8e1692a` first and it carries
the same countdown contract, so the merge kept `main`'s pin rather than adding an unrelated bump here. `dev` remains the only publishable ref: the
`paths` / `operations` helpers this repo imports in 469 files came from
[blockscout#14515](https://github.com/blockscout/blockscout/pull/14515) and are on neither `master` nor the
`v11.2.4` tag (verified — a build from either exports only `schemas`).

The payload type is `paths['/api/v2/blocks/{block_number_param}/countdown']['get']`, backed by the
`BlockCountdown` schema — all four fields required and string-typed.

**No env vars, no feature flags.** The endpoint is unconditional, exactly as the v1 call is today.

## UI inventory

No route, navigation, metadata, sitemap or visual change. Routes `/block/countdown`,
`/block/countdown/[height]` and their `/chain/[chain_slug_or_id]/…` multichain twins are untouched.

- [`src/slices/block/pages/countdown-details/BlockCountdown.tsx`](../../../src/slices/block/pages/countdown-details/BlockCountdown.tsx)
  — the only consumer. Reads the four fields, renders `RemainingBlock` / `CurrentBlock` through
  `StatsWidget`, and redirects via `window.location.assign` when there is no countdown.
- [`src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx`](../../../src/slices/block/pages/countdown-details/BlockCountdown.pw.tsx)
  — two screenshot cases, "short period" and "long period until the block". The long-period case is built on
  a 30-digit height; the mocks need the v2 field names but stay strings, so the rendered digits are unchanged
  (subtask 3 confirms that).
- Multichain needs no change: `useApiQuery` already resolves the chain from `useMultichainContext`
  ([useApiQuery.ts:42](../../../src/api/hooks/useApiQuery.ts)), so the countdown request follows the
  cluster's chain automatically.
- [`SearchBarSuggestBlockCountdown.tsx`](../../../src/slices/search/components/search-bar/SearchBarSuggest/SearchBarSuggestBlockCountdown.tsx)
  and [`BlockCountdownIndex.tsx`](../../../src/slices/block/pages/countdown-index/BlockCountdownIndex.tsx)
  only link to and navigate into the countdown route — neither fetches, so neither changes.

## Out of scope

- **A compatibility shim** reading both the pre- and post-v11.2.4 contracts. It would be permanent cruft for
  a transitional problem, and it would need a comment explaining a historical rename, which the
  [comment rules](../../../.claude/CLAUDE.md) push against. The minimum backend version is declared instead.
- **Backend changes to the endpoint** — **Q1** and **Q2** were `blockscout/blockscout` work, delivered in
  [#14646](https://github.com/blockscout/blockscout/pull/14646).
- **Renaming or retiring `src/api/resources/services/core/v1.ts`.** After this task it holds only `graphql`
  (whose path `/api/v1/graphql` is unrelated to the RPC API), so the file stays.
- New env vars, custom Mixpanel events (no new interactive element; page views are auto-wired), demo deploy.

## Task breakdown

- [x] 1 `[agent]` Unblock `@blockscout/api-types` publishing, publish a beta from `dev`, and pin it →
  [`subtasks/01-publish-api-types/`](subtasks/01-publish-api-types/spec.md)
- [x] 2 `[agent]` Migrate the resource and the countdown page to API v2 →
  [`subtasks/02-migrate-countdown-resource/`](subtasks/02-migrate-countdown-resource/spec.md)
- [x] 3 `[human]` Confirm the countdown screenshot baselines are unchanged →
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
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D03UYHZTLTB/p1785434045879309
- Answer: 2026-07-31 — agreed; shipped in **v11.2.4** via
  [#14646](https://github.com/blockscout/blockscout/pull/14646) (issue
  [#14644](https://github.com/blockscout/blockscout/issues/14644)). Already-mined is now **404**, indexing and
  invalid heights **422**, disabled average block time **501** and declared as `not_implemented`. Live-verified
  2026-08-05. Requirement 3's table reflects the delivered behavior.

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
- Status: `resolved`
- Slack: https://blockscout.slack.com/archives/D03UYHZTLTB/p1785434045879309 (same thread as Q1)
- Answer: 2026-07-31 — agreed; shipped in **v11.2.4** alongside Q1
  ([#14646](https://github.com/blockscout/blockscout/pull/14646)). All four fields are strings now, so the
  precision regression never reaches users and the long-period baseline keeps rendering the full digit string.
  Live-verified 2026-08-05.
