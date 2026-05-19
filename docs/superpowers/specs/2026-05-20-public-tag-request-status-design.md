# Public tag/label request status — design spec

**Date:** 2026-05-20
**Owner:** VinuChain Explorer
**Touches:** `vinuexplorer-frontend`, `vinuexplorer-backend`
**Status:** approved (brainstorming gate)

## Problem

Today, when a user visits `/public-tags/submit` and files a public-tag request, they see a one-shot success/error panel and then nothing else. There is no way for the user to come back later and see whether their request was accepted, rejected, or is still pending — even though the backend already tracks a `status` column on `account_public_tag_submissions` (`pending` | `approved` | `rejected`).

Goal: surface the moderation status of a signed-in user's prior submissions on the same `/public-tags/submit` page, so the user knows what happened to each request without contacting support.

## Decisions taken during brainstorming

| Question | Decision |
|---|---|
| Data source | Backend-backed list, served by the same `vinuexplorer-backend` that already accepts the POST. No external metadata microservice involved. |
| Audience | Signed-in user only. |
| Attribution mechanism | New `identity_id` FK on `account_public_tag_submissions`, server-stamped on every authenticated submission. |
| Submission flow | Becomes auth-only. POST moves out of `:api_v1_public` into the authenticated pipeline that already serves the rest of the account-area endpoints. |
| Historical anonymous rows | A one-shot data migration backfills `identity_id` for rows whose `LOWER(requester_email)` matches an existing `account_identities.email`. Unmatched orphans stay orphaned and never appear in any user's "My requests" list. |
| UI shape | Two-tab page at `/public-tags/submit`: **Submit new tag** (existing form) and **My requests** (new paginated list). Whole page is auth-gated. |
| Moderator UI | Out of scope — moderators continue mutating `status` via DB or admin script. |
| Status-change notifications | Out of scope. |
| Rejection-reason field | Out of scope; deferred to a follow-up migration that adds `reject_reason :text NULL`. |

## Architecture

```
Browser (Next.js)                vinuexplorer-backend (Elixir)
─────────────────                ──────────────────────────────
/public-tags/submit              GET  /api/v1/chains/:chainId/metadata-submissions/tag
  ├── Tab: "Submit new tag"      POST /api/v1/chains/:chainId/metadata-submissions/tag
  │     (existing form)               (both auth-only, Auth0 bearer)
  └── Tab: "My requests"
        (new list, paginated)    account_public_tag_submissions
                                   + identity_id  (NEW, FK → account_identities, nullable)
                                   + status       (exists, default "pending")
```

## Backend changes (`vinuexplorer-backend`)

### 1. Schema migrations

**File:** `apps/explorer/priv/account/migrations/<timestamp>_add_identity_id_to_public_tag_submissions.exs`

```elixir
defmodule Explorer.Repo.Account.Migrations.AddIdentityIdToPublicTagSubmissions do
  use Ecto.Migration

  def change do
    alter table(:account_public_tag_submissions) do
      add(:identity_id, references(:account_identities, on_delete: :nilify_all), null: true)
    end

    create(index(:account_public_tag_submissions, [:identity_id]))
  end
end
```

**File:** `apps/explorer/priv/account/migrations/<timestamp+1>_backfill_public_tag_submissions_identity.exs`

One-shot data migration. Runs after the FK migration. Operates in a single statement to keep the rollback story simple — the FK migration above is the inverse.

```elixir
defmodule Explorer.Repo.Account.Migrations.BackfillPublicTagSubmissionsIdentity do
  use Ecto.Migration

  def up do
    execute("""
    UPDATE account_public_tag_submissions r
       SET identity_id = i.id
      FROM account_identities i
     WHERE r.identity_id IS NULL
       AND LOWER(r.requester_email) = LOWER(i.email)
    """)
  end

  def down, do: :ok
end
```

Sizing note: if `account_public_tag_submissions` has grown above ~50k rows on the live Account DB at deploy time, switch the index migration to `CREATE INDEX CONCURRENTLY` (non-transactional, separate file). Current expected scale is well below that threshold.

### 2. Schema module

**File:** `apps/explorer/lib/explorer/account/public_tag_submission.ex`

- Add `alias Explorer.Account.Identity`.
- Replace the timestamps-only schema block with one that declares `belongs_to(:identity, Identity)`.
- Add `:identity_id` to `@optional_attrs`.
- Changeset stays as-is; nothing else changes (validation, casting, status whitelist all unchanged).

### 3. Controller

**File:** `apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submissions_controller.ex`

Two changes plus one addition.

**3a. `create_tag/2` becomes auth-aware.** Stamps `identity_id` from the auth assign (whichever name `api_v2_account` pipeline already uses for the current identity; verify against `apps/block_scout_web/lib/block_scout_web/controllers/account/api/v2/user_controller.ex` for the canonical assign name). The reCAPTCHA gate stays (it still defends against bot abuse from compromised accounts and keeps the surface consistent with the existing form). Response shape changes from a bare `%{message: "Submission received"}` to the inserted record so the FE can prepend without a refetch race:

```elixir
{:ok, submission} ->
  Task.start(fn -> notify_operators(submission) end)

  conn
  |> put_status(:created)
  |> render(:show, submission: submission)
```

**3b. New `index/2` action.** Returns a paginated list filtered to the current identity, newest first.

```elixir
def index(conn, params) do
  identity = conn.assigns.current_identity

  query =
    from(s in PublicTagSubmission,
      where: s.identity_id == ^identity.id,
      order_by: [desc: s.inserted_at, desc: s.id]
    )

  {submissions, next_page_params} = paginate(query, params, default_items_count: 20, max_items_count: 100)

  render(conn, :index, submissions: submissions, next_page_params: next_page_params)
end
```

Pagination mirrors the existing `Explorer.PagingOptions` pattern used elsewhere in the v2 API; if the v1 controller does not yet use that helper, copy the smallest viable version from `BlockScoutWeb.API.V2.UserController` rather than inventing a new one.

**3c. View module** at `apps/block_scout_web/lib/block_scout_web/views/api/v1/tag_submissions_view.ex` with two renders: `show/1` for a single record and `index/1` for the paginated envelope.

```elixir
def render("show.json", %{submission: s}), do: render_submission(s)

def render("index.json", %{submissions: subs, next_page_params: npp}) do
  %{items: Enum.map(subs, &render_submission/1), next_page_params: npp}
end

defp render_submission(s) do
  %{
    id: s.id,
    address_hash: s.address_hash,
    tag_name: s.tag_name,
    tag_type: s.tag_type,
    company_name: s.company_name,
    description: s.description,
    status: s.status,
    inserted_at: s.inserted_at
  }
end
```

### 4. Routes

**File:** `apps/block_scout_web/lib/block_scout_web/api_router.ex`

Move the two existing tag-submission routes out of the `:api_v1_public` scope and into the authenticated `:api_v1` (or whichever existing v1 scope is wired to the Auth0 bearer plug). Add the new `index` route in the same scope:

```elixir
get("/chains/:chainId/metadata-submissions/tag", TagSubmissionsController, :index)
post("/chains/:chainId/metadata-submissions/tag", TagSubmissionsController, :create_tag)
```

If `:api_v1` does not yet have an auth plug wired, lift the auth plug from the v2 account scope into a shared plug module rather than duplicating it.

### 5. Tests

**File:** `apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submissions_controller_test.exs`

Add cases covering:

1. POST without bearer → `401 Unauthorized`.
2. POST with bearer → response body contains `id`, `status: "pending"`, and the inserted row has `identity_id == current.id`.
3. GET without bearer → `401`.
4. GET with bearer, no submissions → `{"items": [], "next_page_params": null}`.
5. GET with bearer, mixed submissions: returns only rows where `identity_id == current.id`. A row belonging to another identity, and an orphan row matching `requester_email == current.email`, are both excluded.
6. GET pagination: with `items_count: 1`, two submissions yield page 1 of 1 + `next_page_params != null`; following the cursor returns the second row.

## Frontend changes (`vinuexplorer-frontend`)

### 1. API resource definition

**File:** `lib/api/services/admin.ts`

Add a new resource and extend the payload mapping:

```ts
public_tag_applications_list: {
  path: '/api/v1/chains/:chainId/metadata-submissions/tag',
  pathParams: [ 'chainId' as const ],
  filterFields: [] as Array<never>,
  paginated: true,
},

// in AdminApiResourcePayload<R>:
R extends 'admin:public_tag_applications_list' ? PublicTagApplicationsResponse :
```

### 2. Response types

**File:** `types/api/addressMetadata.ts`

```ts
export type PublicTagApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PublicTagApplicationRow {
  id: number;
  address_hash: string;
  tag_name: string;
  tag_type: PublicTagType['type'];
  company_name: string | null;
  description: string | null;
  status: PublicTagApplicationStatus;
  inserted_at: string;       // ISO 8601
}

export interface PublicTagApplicationsResponse {
  items: Array<PublicTagApplicationRow>;
  next_page_params: { items_count: number; page_number: number } | null;
}
```

### 3. Page restructure

**File:** `ui/pages/PublicTagsSubmit.tsx`

- Page becomes auth-gated: replicate the redirect pattern from `ui/pages/Watchlist.tsx` (whatever Blockscout's current convention is — likely `useRedirectForInvalidAuthToken()` + a sign-in CTA fallback during loading).
- Replace the single `submitResult ? Result : Form` body with `RoutedTabs` containing two tabs:
  - `submit-tag` — current `PublicTagsSubmitForm` / `PublicTagsSubmitResult` (kept verbatim, same behaviour inside the tab).
  - `my-requests` — new `PublicTagsApplicationsList` component.
- On successful POST inside the **Submit new tag** tab, do two things:
  - `router.replace({ pathname: '/public-tags/submit', query: { tab: 'my-requests' } }, undefined, { shallow: true })`
  - `queryClient.invalidateQueries({ queryKey: getResourceKey('admin:public_tag_applications_list', { ... }) })`

  …so the freshly-submitted row appears at the top of the list the moment the user clicks the new tab.

### 4. New list component

**File:** `ui/publicTags/list/PublicTagsApplicationsList.tsx`

- `useApiQuery('admin:public_tag_applications_list', { pathParams: { chainId: appConfig.chain.id } })`
- Renders a `Table` (or `DataListDisplay`, whichever the existing account-area pages use) with columns:

  | Column | Source |
  |---|---|
  | Address | `address_hash` via `<AddressEntity address={{ hash, is_contract: false, … }}/>` |
  | Tag name | `tag_name` (plain text, truncated to ~30 chars) |
  | Type | `tag_type` (Title-cased) |
  | Status | `<StatusBadge status={ row.status }/>` (see §5) |
  | Submitted | `<TimeAgoWithTooltip timestamp={ inserted_at }/>` |

- Loading state: `ContentLoader`. Error state: `DataFetchAlert`. Empty state: a centered card reading **"No requests yet — submit one from the *Submit new tag* tab."**
- Pagination: standard Blockscout server-side paginator using `next_page_params`.

### 5. Status badge

**File:** `ui/publicTags/list/PublicTagApplicationStatusBadge.tsx` (small, local component — not promoted to `toolkit/`).

```ts
const STATUS_VARIANTS: Record<PublicTagApplicationStatus, { palette: string; label: string }> = {
  pending:  { palette: 'orange', label: 'Pending review' },
  approved: { palette: 'green',  label: 'Approved' },
  rejected: { palette: 'red',    label: 'Rejected' },
};
```

Rendered with the existing `toolkit/chakra/badge` (`palette` prop), so the styling stays consistent with other Blockscout status pills.

### 6. Tests

**File:** `ui/publicTags/list/PublicTagsApplicationsList.pw.tsx`

Playwright component tests cover: empty state, three-row mixed-status list (one of each badge), pagination control rendering when `next_page_params` is non-null, error state.

## Edge cases

- **User signs out while on the page:** the `useApiQuery` 401-handler from existing account pages handles this — redirects to login, no special-casing needed.
- **User has 0 submissions:** empty state copy above. The **Submit new tag** tab remains the default selection, so first-time visitors don't land on an empty list.
- **Stale tab parameter:** if the URL has `?tab=my-requests` and the user is not signed in, the auth gate fires before the tab logic, so the redirect happens first. After login, they land back on the tab they asked for.
- **A submission inserted between page-load and tab-click:** invalidate-on-mount of `my-requests` (cheap) is fine. Alternative: trust the post-submit invalidation only. Choose the latter to avoid double-fetches on a fresh page load.
- **Status changes between page loads:** no live updates. User must refresh. Acceptable for v1.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Auth-gating the POST silently breaks an undocumented external integration. | Grep `vinuchain-rpc.com`, `vinuexplorer.org`, and known third-party scripts for the path; announce the change in release notes; if a known anonymous client breaks, accept the regression (the audit trail benefit outweighs it, per brainstorming). |
| Backfill SQL matches a row that the email's true owner didn't actually submit (someone earlier spoofed their address). | Bounded to historical anonymous rows where the spoofer guessed the future Auth0 email exactly. For tag submissions this is essentially zero. Document in release notes; offer manual unlink via DB on request. |
| The `:api_v1` pipeline doesn't yet have an auth plug. | Lift the existing one from `:account_api_v2` into a shared plug; do not duplicate. Adds one small refactor commit. |
| `account_public_tag_submissions` ends up larger than expected at migration time. | Inspect row count before deploy; switch to `CREATE INDEX CONCURRENTLY` in a separate non-transactional migration if > 50k rows. |
| FE response-shape change (POST now returns the record instead of `{message: "Submission received"}`) breaks the existing `PublicTagsSubmitForm.tsx` callback. | Either keep the controller's response as `{message, submission}` (additive, backwards-compatible) or update the FE's `apiFetch<…, unknown, { message: string }>` generic to expect the full record. Prefer the additive shape: it preserves the existing success-toast text and lets the FE pick `id`/`status` off the same response. Spec assumes additive. |

## Acceptance criteria

1. Signed-in user visits `/public-tags/submit` → sees two tabs.
2. Submitting a tag from the form lands the user on the **My requests** tab with the new row at the top, status badge `Pending review`.
3. Moderator runs `UPDATE account_public_tag_submissions SET status='approved' WHERE id=N` against the Account DB; user refreshes → badge changes to `Approved`.
4. A second signed-in user does not see the first user's submissions (cross-identity isolation).
5. Anonymous visitor is redirected to login when hitting `/public-tags/submit`.
6. Backend tests cover: auth gate on POST, auth gate on GET, cross-identity filter on GET, pagination on GET.
7. Frontend Playwright tests cover: empty state, three-status mixed list, paginated list, error state.
8. `mix test` passes; `yarn lint && yarn test` passes; manual smoke on testnet (`testnet.vinuexplorer.org`) green before mainnet ship.

## Out of scope (deferred)

- Moderator UI for transitioning rows from `pending → approved | rejected`.
- Email or in-app notifications when a moderator changes a row's status.
- Editing a still-pending submission from the FE.
- Rejection reason / moderator notes field (would require a follow-up migration adding `reject_reason :text NULL` + view + UI).
- Status filter / search in the **My requests** tab.
- Live updates via WebSocket — current Blockscout account pages don't use them either, so consistent with house style to ship without.

## Follow-ups worth tracking

- Moderator admin UI under `/admin/public-tag-submissions`.
- Notification of the requester on status transition (re-use `Bamboo.Email` plumbing already in the controller for the operator notification).
- Migration to add `reject_reason :text NULL` and surface it in the badge tooltip when `status == "rejected"`.
