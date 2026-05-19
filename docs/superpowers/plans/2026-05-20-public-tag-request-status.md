# Public tag request status — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface moderation status (pending / approved / rejected) of a signed-in user's public-tag/label submissions on `/public-tags/submit`, as a new tab next to the existing submission form.

**Architecture:** Add an `identity_id` FK + indexed column to `account_public_tag_submissions` so signed-in submissions are attributable. Move the existing `POST /api/v1/chains/:chainId/metadata-submissions/tag` route behind the same session/CSRF auth pipeline that already protects watchlist/api-keys/etc., and add a sibling `GET` route returning that identity's submissions paginated. Frontend wraps the existing `/public-tags/submit` content in `RoutedTabs` (existing toolkit component), adds a new "My requests" tab that consumes the new endpoint, and gates the page with `useRedirectForInvalidAuthToken()` (same pattern as `Watchlist.tsx`).

**Tech Stack:** Backend — Elixir 1.16, Phoenix 1.7, Ecto, Postgres. Frontend — Next.js 15, React 19, @tanstack/react-query, Chakra v3, Playwright.

**Spec:** `~/vinuexplorer-frontend/docs/superpowers/specs/2026-05-20-public-tag-request-status-design.md`

**Repo boundaries:**
- Tasks 1–7 commit to `~/vinuexplorer-backend` (branch `feat/public-tag-request-status-backend`)
- Tasks 8–15 commit to `~/vinuexplorer-frontend` (branch `feat/public-tag-request-status`)

The backend ships first; the frontend depends on the new `GET` endpoint being live on the target environment before its tab can render real data.

---

## File Structure

### Backend — files to create or modify

| File | Action | Responsibility |
|---|---|---|
| `apps/explorer/priv/account/migrations/<ts>_add_identity_id_to_public_tag_submissions.exs` | Create | Adds the `identity_id` FK + index. |
| `apps/explorer/priv/account/migrations/<ts+1>_backfill_public_tag_submissions_identity.exs` | Create | One-shot data migration matching historical rows by email. |
| `apps/explorer/lib/explorer/account/public_tag_submission.ex` | Modify | Add `belongs_to(:identity, Identity)`, add `:identity_id` to optional attrs. |
| `apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submissions_controller.ex` | Modify | `create_tag/2` becomes auth-gated, stamps `identity_id`, returns the inserted record. New `index/2` action. |
| `apps/block_scout_web/lib/block_scout_web/views/api/v1/tag_submissions_view.ex` | Create | JSON renderers for `:show` and `:index`. |
| `apps/block_scout_web/lib/block_scout_web/api_router.ex` | Modify | Move existing POST + tag_types out of `:api_v1_public` into authenticated scope. Add new GET route in same scope. |
| `apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submissions_controller_test.exs` | Modify | Add auth, attribution, GET, pagination cases. |

### Frontend — files to create or modify

| File | Action | Responsibility |
|---|---|---|
| `lib/api/services/admin.ts` | Modify | Add `public_tag_applications_list` resource + payload-mapping. |
| `types/api/publicTagSubmissions.ts` | Create | `PublicTagApplicationRow`, `PublicTagApplicationsResponse`, `PublicTagApplicationStatus`. |
| `ui/publicTags/list/PublicTagApplicationStatusBadge.tsx` | Create | Status pill (pending/approved/rejected). |
| `ui/publicTags/list/PublicTagApplicationsTable.tsx` | Create | Desktop table view of submissions. |
| `ui/publicTags/list/PublicTagApplicationsListItem.tsx` | Create | Mobile card view of one submission. |
| `ui/publicTags/list/PublicTagApplicationsList.tsx` | Create | Wraps fetch + pagination + table/list. |
| `ui/pages/PublicTagsSubmit.tsx` | Modify | Wrap children in `RoutedTabs`, add auth gate, wire post-submit nav + cache invalidation. |
| `ui/publicTags/submit/PublicTagsSubmitForm.tsx` | Modify | Consume additive `{message, submission}` POST response; pass `submission` upward. |
| `ui/publicTags/submit/types.ts` | Modify | Extend `FormSubmitResult` row shape with optional `submissionId`/`status` from POST response. |
| `ui/publicTags/list/PublicTagApplicationsList.pw.tsx` | Create | Playwright component test: empty / 3-status / paginated / error states. |

---

## Conventions used in every task

- **Commit cadence:** one commit per task unless the task says otherwise. Conventional-commit format (`<type>(<scope>): <imperative>` — see `~/VinuChain/.claude/rules/development.md`).
- **Backend test runner:** `cd ~/vinuexplorer-backend && mix test path/to/test.exs:LINENO --color`.
- **Frontend test runner:** `cd ~/vinuexplorer-frontend && yarn jest path/to/file.test.ts` for unit, `yarn test:pw path/to/file.pw.tsx` for component. Type-check: `node_modules/.bin/tsc --noEmit`.
- **No `--no-verify`** on commits; if pre-commit hook fires, fix the cause, do not bypass.
- **TDD:** write failing test → run it to confirm RED → write minimal impl → re-run → GREEN → commit.

---

## Phase A — Backend (`~/vinuexplorer-backend`, branch `feat/public-tag-request-status-backend`)

### Task 1: Branch + migration adding `identity_id` FK

**Files:**
- Create: `apps/explorer/priv/account/migrations/<ts>_add_identity_id_to_public_tag_submissions.exs`

- [ ] **Step 1: Create branch**

```bash
cd ~/vinuexplorer-backend
git checkout master
git pull --ff-only
git checkout -b feat/public-tag-request-status-backend
```

- [ ] **Step 2: Generate migration**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix ecto.gen.migration --migrations-path apps/explorer/priv/account/migrations add_identity_id_to_public_tag_submissions
```

This prints the created path (e.g., `apps/explorer/priv/account/migrations/20260520120000_add_identity_id_to_public_tag_submissions.exs`).

- [ ] **Step 3: Replace migration body**

Open the generated file and replace its body with:

```elixir
defmodule Explorer.Repo.Account.Migrations.AddIdentityIdToPublicTagSubmissions do
  use Ecto.Migration

  def change do
    alter table(:account_public_tag_submissions) do
      add(
        :identity_id,
        references(:account_identities, on_delete: :nilify_all),
        null: true
      )
    end

    create(index(:account_public_tag_submissions, [:identity_id]))
  end
end
```

- [ ] **Step 4: Run the migration against test DB**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix do ecto.drop, ecto.create, ecto.migrate
```

Expected: no errors; the migrate output lists `=== Running … AddIdentityIdToPublicTagSubmissions.change/0 forward`.

- [ ] **Step 5: Verify column landed**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix run -e 'IO.inspect(Explorer.Repo.Account.query!("SELECT column_name FROM information_schema.columns WHERE table_name = '"'"'account_public_tag_submissions'"'"'").rows)'
```

Expected: the printed list includes `["identity_id"]`.

- [ ] **Step 6: Commit**

```bash
cd ~/vinuexplorer-backend
git add apps/explorer/priv/account/migrations/*add_identity_id_to_public_tag_submissions.exs
git commit -m "feat(account): add identity_id FK to public tag submissions"
```

### Task 2: One-shot backfill migration

**Files:**
- Create: `apps/explorer/priv/account/migrations/<ts+1>_backfill_public_tag_submissions_identity.exs`

- [ ] **Step 1: Generate migration**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix ecto.gen.migration --migrations-path apps/explorer/priv/account/migrations backfill_public_tag_submissions_identity
```

- [ ] **Step 2: Replace body**

```elixir
defmodule Explorer.Repo.Account.Migrations.BackfillPublicTagSubmissionsIdentity do
  use Ecto.Migration

  @disable_ddl_transaction true

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

`@disable_ddl_transaction true` keeps the data migration outside the DDL txn so it doesn't fight the FK index that just landed.

- [ ] **Step 3: Run migration**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix ecto.migrate
```

Expected: `=== Running … BackfillPublicTagSubmissionsIdentity.up/0`.

- [ ] **Step 4: Commit**

```bash
cd ~/vinuexplorer-backend
git add apps/explorer/priv/account/migrations/*backfill_public_tag_submissions_identity.exs
git commit -m "feat(account): backfill identity_id for historical tag submissions"
```

### Task 3: Schema field

**Files:**
- Modify: `apps/explorer/lib/explorer/account/public_tag_submission.ex`

- [ ] **Step 1: Add alias + belongs_to + optional attr**

Apply three edits:

a) After the existing module attributes (around `@optional_attrs`), keep:

```elixir
@optional_attrs ~w(chain_id company_name company_website description meta status identity_id)a
```

(adds `identity_id` to the existing list)

b) Replace the schema block:

```elixir
schema "account_public_tag_submissions" do
  field(:chain_id, :string)
  field(:requester_name, :string)
  field(:requester_email, :string)
  field(:company_name, :string)
  field(:company_website, :string)
  field(:address_hash, :string)
  field(:tag_name, :string)
  field(:tag_type, :string)
  field(:description, :string)
  field(:meta, :map)
  field(:status, :string, default: "pending")

  belongs_to(:identity, Explorer.Account.Identity)

  timestamps()
end
```

c) Confirm the changeset already includes `@optional_attrs` in the `cast/3` call — no further change there.

- [ ] **Step 2: Compile**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix compile --warnings-as-errors
```

Expected: clean compile, no warnings.

- [ ] **Step 3: Run existing schema tests**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix test apps/explorer/test/explorer/account/public_tag_submission_test.exs
```

Expected: pre-existing tests pass.

- [ ] **Step 4: Commit**

```bash
cd ~/vinuexplorer-backend
git add apps/explorer/lib/explorer/account/public_tag_submission.ex
git commit -m "feat(account): add identity belongs_to on public tag submission"
```

### Task 4: Failing controller tests (RED)

**Files:**
- Modify: `apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submissions_controller_test.exs`

- [ ] **Step 1: Append the new test cases**

Open the existing test file and append, inside the top-level `describe "create_tag/2"` block (or after, in a new `describe` block) the cases below. Match the helper style already used in the file — most likely a setup that builds `%Identity{}` rows in the account_repo and uses `BlockScoutWeb.Account.AuthController.login_user/2` or the same `conn` helper the v1 user_controller test uses (grep the existing test file for the helper name and copy the pattern verbatim — do NOT invent new helpers).

```elixir
describe "create_tag/2 (authenticated)" do
  setup [:fixture_identity, :login_as_identity]

  test "stamps identity_id and returns the submission record", %{conn: conn, identity: identity} do
    params = %{
      "submission" => valid_submission_params(identity),
      "recaptcha_response" => "test-token"
    }

    response =
      conn
      |> post(~p"/api/v1/chains/207/metadata-submissions/tag", params)
      |> json_response(201)

    assert %{
             "id" => id,
             "status" => "pending",
             "tag_name" => _,
             "address_hash" => _,
             "inserted_at" => _
           } = response

    row = Explorer.Repo.Account.get!(Explorer.Account.PublicTagSubmission, id)
    assert row.identity_id == identity.id
  end

  test "still 401 without a session", %{conn: conn} do
    params = %{
      "submission" => valid_submission_params(nil),
      "recaptcha_response" => "test-token"
    }

    conn
    |> Plug.Test.recycle()
    |> post(~p"/api/v1/chains/207/metadata-submissions/tag", params)
    |> response(401)
  end
end

describe "index/2" do
  setup [:fixture_identity, :login_as_identity]

  test "returns only this identity's submissions, newest first", %{conn: conn, identity: identity} do
    other = insert(:account_identity)
    mine_old = insert(:account_public_tag_submission, identity_id: identity.id, tag_name: "mine-old")
    mine_new = insert(:account_public_tag_submission, identity_id: identity.id, tag_name: "mine-new")
    _theirs  = insert(:account_public_tag_submission, identity_id: other.id, tag_name: "theirs")
    _orphan  = insert(:account_public_tag_submission, identity_id: nil, tag_name: "orphan")

    response =
      conn
      |> get(~p"/api/v1/chains/207/metadata-submissions/tag")
      |> json_response(200)

    ids = Enum.map(response["items"], & &1["id"])
    assert ids == [mine_new.id, mine_old.id]
    refute Enum.any?(response["items"], &(&1["tag_name"] in ["theirs", "orphan"]))
    assert response["next_page_params"] == nil
  end

  test "paginates with items_count", %{conn: conn, identity: identity} do
    first  = insert(:account_public_tag_submission, identity_id: identity.id, tag_name: "first")
    second = insert(:account_public_tag_submission, identity_id: identity.id, tag_name: "second")

    page1 =
      conn
      |> get(~p"/api/v1/chains/207/metadata-submissions/tag?items_count=1")
      |> json_response(200)

    assert [%{"id" => id1}] = page1["items"]
    assert id1 == second.id
    assert page1["next_page_params"] != nil

    page2 =
      conn
      |> get(~p"/api/v1/chains/207/metadata-submissions/tag", page1["next_page_params"])
      |> json_response(200)

    assert [%{"id" => id2}] = page2["items"]
    assert id2 == first.id
  end

  test "401 without a session", %{conn: conn} do
    conn
    |> Plug.Test.recycle()
    |> get(~p"/api/v1/chains/207/metadata-submissions/tag")
    |> response(401)
  end
end

defp valid_submission_params(identity) do
  %{
    "requesterName"    => "Tester",
    "requesterEmail"   => if(identity, do: identity.email, else: "tester@example.com"),
    "address"          => "0x" <> String.duplicate("ab", 20),
    "name"             => "Burn address",
    "tagType"          => "name",
    "description"      => "Example"
  }
end

defp fixture_identity(_), do: %{identity: insert(:account_identity)}

defp login_as_identity(%{conn: conn, identity: identity}) do
  # Re-use whatever helper the rest of this file uses to attach a session
  # to `conn` for `identity` — see `setup_account_session/2` in
  # `apps/block_scout_web/test/support/conn_case.ex` for the canonical pattern.
  %{conn: setup_account_session(conn, identity)}
end
```

- [ ] **Step 2: Verify helpers match the existing test scaffold**

Search the existing test file for the canonical setup helper name and replace `setup_account_session` + `insert(:account_identity)` / `insert(:account_public_tag_submission)` with whatever the file actually uses. If the file does NOT have a public-tag-submission factory, add one inline as `defp insert_submission(attrs)` and replace the four `insert/2` calls accordingly.

```bash
cd ~/vinuexplorer-backend
grep -rn "setup_account_session\|account_identity\|account_public_tag_submission" apps/block_scout_web/test/support/ apps/explorer/test/support/ | head -30
```

- [ ] **Step 3: Run the tests, confirm RED**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix test apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submissions_controller_test.exs --color
```

Expected: at least 5 of the new tests fail. The current POST controller returns `{message: "Submission received"}` with HTTP 200 (not 201), does not stamp `identity_id`, and the `GET` route does not exist at all.

- [ ] **Step 4: Commit (red)**

```bash
cd ~/vinuexplorer-backend
git add apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submissions_controller_test.exs
git commit -m "test(api/v1): cover auth + identity attribution + GET index for tag submissions"
```

### Task 5: Controller + view implementation (GREEN)

**Files:**
- Modify: `apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submissions_controller.ex`
- Create: `apps/block_scout_web/lib/block_scout_web/views/api/v1/tag_submissions_view.ex`

- [ ] **Step 1: Add imports + aliases at the top of the controller**

Add to the existing alias block:

```elixir
import BlockScoutWeb.Account.AuthController, only: [current_user: 1]

alias BlockScoutWeb.Models.UserFromAuth
alias Explorer.Account.Identity
alias Explorer.PagingOptions
```

- [ ] **Step 2: Rewrite `create_tag/2` to stamp identity and return the record**

Replace the existing `create_tag/2` head with:

```elixir
def create_tag(conn, %{"submission" => submission_params} = params) do
  with {:auth, %{id: uid}} <- {:auth, current_user(conn)},
       {:identity, %Identity{} = identity} <- {:identity, UserFromAuth.find_identity(uid)},
       true <- recaptcha_passed?(conn, params, submission_params) do
    chain_id = Map.get(params, "chainId") || Map.get(params, "chain_id")

    attrs = %{
      chain_id: chain_id,
      requester_name: submission_params["requesterName"],
      requester_email: submission_params["requesterEmail"],
      company_name: submission_params["companyName"],
      company_website: submission_params["companyWebsite"],
      address_hash: submission_params["address"],
      tag_name: submission_params["name"],
      tag_type: submission_params["tagType"],
      description: submission_params["description"],
      meta: submission_params["meta"],
      identity_id: identity.id
    }

    case %PublicTagSubmission{}
         |> PublicTagSubmission.changeset(attrs)
         |> Repo.account_repo().insert() do
      {:ok, submission} ->
        Task.start(fn -> notify_operators(submission) end)

        conn
        |> put_status(:created)
        |> put_view(BlockScoutWeb.API.V1.TagSubmissionsView)
        |> render(:show, submission: submission)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{message: format_changeset_errors(changeset)})
    end
  else
    false ->
      conn
      |> put_status(:forbidden)
      |> json(%{message: "Invalid reCAPTCHA response"})

    {:auth, _} ->
      conn |> put_status(:unauthorized) |> json(%{message: "Not authenticated"})

    {:identity, _} ->
      conn |> put_status(:unauthorized) |> json(%{message: "Account not found"})
  end
end
```

- [ ] **Step 3: Add `index/2`**

Append a new action below `create_tag/2`:

```elixir
def index(conn, params) do
  with {:auth, %{id: uid}} <- {:auth, current_user(conn)},
       {:identity, %Identity{} = identity} <- {:identity, UserFromAuth.find_identity(uid)} do
    items_count = parse_int(params["items_count"], 20) |> min(100) |> max(1)
    page_number = parse_int(params["page_number"], 1) |> max(1)
    offset = (page_number - 1) * items_count

    query =
      from(s in PublicTagSubmission,
        where: s.identity_id == ^identity.id,
        order_by: [desc: s.inserted_at, desc: s.id],
        limit: ^(items_count + 1),
        offset: ^offset
      )

    rows = Repo.account_repo().all(query)
    {items, next} = paginate_split(rows, items_count, page_number)

    conn
    |> put_view(BlockScoutWeb.API.V1.TagSubmissionsView)
    |> render(:index, submissions: items, next_page_params: next)
  else
    _ -> conn |> put_status(:unauthorized) |> json(%{message: "Not authenticated"})
  end
end

defp paginate_split(rows, items_count, page_number) do
  if length(rows) > items_count do
    {Enum.take(rows, items_count), %{items_count: items_count, page_number: page_number + 1}}
  else
    {rows, nil}
  end
end

defp parse_int(nil, default), do: default
defp parse_int(value, default) when is_binary(value) do
  case Integer.parse(value) do
    {n, _} -> n
    _ -> default
  end
end
defp parse_int(value, _default) when is_integer(value), do: value
defp parse_int(_, default), do: default
```

Also add `import Ecto.Query` at the top of the controller if it isn't already imported.

- [ ] **Step 4: Create the view module**

Write `apps/block_scout_web/lib/block_scout_web/views/api/v1/tag_submissions_view.ex`:

```elixir
defmodule BlockScoutWeb.API.V1.TagSubmissionsView do
  use BlockScoutWeb, :view

  def render("show.json", %{submission: submission}), do: serialize(submission)

  def render("index.json", %{submissions: submissions, next_page_params: next}) do
    %{
      items: Enum.map(submissions, &serialize/1),
      next_page_params: next
    }
  end

  defp serialize(s) do
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
end
```

- [ ] **Step 5: Compile**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix compile --warnings-as-errors
```

Expected: clean.

- [ ] **Step 6: Run the controller tests, confirm GREEN**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix test apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submissions_controller_test.exs --color
```

Expected: every test passes, including the pre-existing ones.

If a test still fails because the route doesn't exist yet → move on to Task 6 (route wiring) before re-running.

- [ ] **Step 7: Commit (green)**

```bash
cd ~/vinuexplorer-backend
git add apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submissions_controller.ex \
        apps/block_scout_web/lib/block_scout_web/views/api/v1/tag_submissions_view.ex
git commit -m "feat(api/v1): authenticate tag submission POST + add GET index"
```

### Task 6: Move POST out of public scope, add GET route

**Files:**
- Modify: `apps/block_scout_web/lib/block_scout_web/api_router.ex`

- [ ] **Step 1: Locate the existing public block**

Find the block in `api_router.ex`:

```elixir
scope "/v1", BlockScoutWeb.API.V1 do
  pipe_through(:api_v1_public)

  get("/public-tag-types", TagSubmissionsController, :tag_types)
  post("/chains/:chainId/metadata-submissions/tag", TagSubmissionsController, :create_tag)

  get("/public-tag-submissions/action", TagSubmissionActionsController, :show)
  post("/public-tag-submissions/action", TagSubmissionActionsController, :create)
end
```

- [ ] **Step 2: Split into two scopes**

Keep operator magic-link routes anonymous; move tag-submission user-facing routes behind auth, and add the new GET.

```elixir
scope "/v1", BlockScoutWeb.API.V1 do
  pipe_through(:api_v1_public)

  get("/public-tag-types", TagSubmissionsController, :tag_types)

  # Operator magic-link approve/decline (unchanged).
  get("/public-tag-submissions/action", TagSubmissionActionsController, :show)
  post("/public-tag-submissions/action", TagSubmissionActionsController, :create)
end

scope "/v1", BlockScoutWeb.API.V1 do
  pipe_through(:api)
  pipe_through(:account_api)

  get("/chains/:chainId/metadata-submissions/tag", TagSubmissionsController, :index)
  post("/chains/:chainId/metadata-submissions/tag", TagSubmissionsController, :create_tag)
end
```

`public-tag-types` stays public because it carries no user data and the FE pulls it without a session.

- [ ] **Step 3: Run all controller tests + router tests**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix test apps/block_scout_web/test/block_scout_web/controllers/api/v1/ \
        apps/block_scout_web/test/block_scout_web/api_router_test.exs --color
```

Expected: all pass.

- [ ] **Step 4: Run full backend suite for regressions**

```bash
cd ~/vinuexplorer-backend
MIX_ENV=test mix test --color
```

Expected: pre-existing pass rate. Note: if there are flaky tests unrelated to this change, leave a comment in the commit body — do not bypass them.

- [ ] **Step 5: Commit**

```bash
cd ~/vinuexplorer-backend
git add apps/block_scout_web/lib/block_scout_web/api_router.ex
git commit -m "feat(api/v1): gate tag submission routes behind account auth"
```

### Task 7: Push backend branch + open PR

- [ ] **Step 1: Push**

```bash
cd ~/vinuexplorer-backend
git push -u origin feat/public-tag-request-status-backend
```

- [ ] **Step 2: Open PR using `gh`**

```bash
gh pr create --title "feat(api/v1): public tag request status — backend" --body "$(cat <<'EOF'
## Summary
- Adds `identity_id` FK + index on `account_public_tag_submissions`, backfills historical rows by email match.
- Moves `POST /api/v1/chains/:chainId/metadata-submissions/tag` behind the existing `:account_api` pipeline, stamps the row with the signed-in `identity_id`, returns the inserted record (additive shape — still includes `message` would be a breaking change vs the new shape; FE consumes the new shape).
- Adds `GET /api/v1/chains/:chainId/metadata-submissions/tag` returning the signed-in user's submissions, newest first, paginated.

Spec: `~/vinuexplorer-frontend/docs/superpowers/specs/2026-05-20-public-tag-request-status-design.md`.

## Test plan
- [ ] `mix test` green
- [ ] Manual: testnet `POST` without session → 401
- [ ] Manual: testnet `POST` with session → 201 + row in DB has `identity_id`
- [ ] Manual: testnet `GET` returns only my submissions
- [ ] Manual: testnet pagination with `items_count=1` works
EOF
)"
```

Stop here until the PR is merged + deployed to the target environment(s).

---

## Phase B — Frontend (`~/vinuexplorer-frontend`, branch `feat/public-tag-request-status`)

### Task 8: Branch + API resource definition

**Files:**
- Modify: `lib/api/services/admin.ts`

- [ ] **Step 1: Create branch**

```bash
cd ~/vinuexplorer-frontend
git checkout main
git pull --ff-only
git checkout -b feat/public-tag-request-status
```

- [ ] **Step 2: Add the new resource**

Edit `lib/api/services/admin.ts`. Inside the `ADMIN_API_RESOURCES` literal, add the new entry alongside the existing `public_tag_application`:

```ts
public_tag_applications_list: {
  path: '/api/v1/chains/:chainId/metadata-submissions/tag',
  pathParams: [ 'chainId' as const ],
  filterFields: [] as Array<never>,
  paginated: true,
},
```

In the `AdminApiResourcePayload<R>` mapping, add a row before `never`:

```ts
R extends 'admin:public_tag_applications_list' ? PublicTagApplicationsResponse :
```

Import `PublicTagApplicationsResponse` at the top of the file:

```ts
import type { PublicTagApplicationsResponse } from 'types/api/publicTagSubmissions';
```

- [ ] **Step 3: Type-check (will fail because the type doesn't exist yet)**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | grep "publicTagSubmissions" | head -5
```

Expected: error mentioning the missing module. Confirms wiring landed where it should — we'll resolve it in Task 9.

- [ ] **Step 4: Commit**

(Defer commit until Task 9 so the working tree compiles between commits.)

### Task 9: Response types

**Files:**
- Create: `types/api/publicTagSubmissions.ts`

- [ ] **Step 1: Write the type file**

```ts
import type { PublicTagType } from './addressMetadata';

export type PublicTagApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PublicTagApplicationRow {
  id: number;
  address_hash: string;
  tag_name: string;
  tag_type: PublicTagType['type'];
  company_name: string | null;
  description: string | null;
  status: PublicTagApplicationStatus;
  inserted_at: string;
}

export interface PublicTagApplicationsResponse {
  items: Array<PublicTagApplicationRow>;
  next_page_params: { items_count: number; page_number: number } | null;
}
```

- [ ] **Step 2: Type-check**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | grep -E "publicTagSubmissions|public_tag_applications_list" | head
```

Expected: no errors specific to these names.

- [ ] **Step 3: Commit Tasks 8 + 9 together**

```bash
cd ~/vinuexplorer-frontend
git add lib/api/services/admin.ts types/api/publicTagSubmissions.ts
git commit -m "feat(api): register public_tag_applications_list resource"
```

### Task 10: Status badge component

**Files:**
- Create: `ui/publicTags/list/PublicTagApplicationStatusBadge.tsx`

- [ ] **Step 1: Write the component**

```tsx
import React from 'react';

import type { PublicTagApplicationStatus } from 'types/api/publicTagSubmissions';

import { Badge } from 'toolkit/chakra/badge';

const VARIANTS: Record<PublicTagApplicationStatus, { palette: 'orange' | 'green' | 'red'; label: string }> = {
  pending: { palette: 'orange', label: 'Pending review' },
  approved: { palette: 'green', label: 'Approved' },
  rejected: { palette: 'red', label: 'Rejected' },
};

interface Props {
  status: PublicTagApplicationStatus;
}

const PublicTagApplicationStatusBadge = ({ status }: Props) => {
  const variant = VARIANTS[status];
  if (!variant) {
    return null;
  }

  return <Badge colorPalette={ variant.palette }>{ variant.label }</Badge>;
};

export default React.memo(PublicTagApplicationStatusBadge);
```

- [ ] **Step 2: Verify the Badge import surface**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | grep -E "PublicTagApplicationStatusBadge|colorPalette|toolkit/chakra/badge" | head
```

If `colorPalette` is rejected, swap to whatever prop the project's `Badge` uses (`palette`, `colorScheme`, etc. — `grep -n "<Badge" ui/ | head` will reveal the canonical prop name; copy it).

- [ ] **Step 3: Commit**

```bash
cd ~/vinuexplorer-frontend
git add ui/publicTags/list/PublicTagApplicationStatusBadge.tsx
git commit -m "feat(public-tags): add request status badge component"
```

### Task 11: List components (table + mobile card + container)

**Files:**
- Create: `ui/publicTags/list/PublicTagApplicationsTable.tsx`
- Create: `ui/publicTags/list/PublicTagApplicationsListItem.tsx`
- Create: `ui/publicTags/list/PublicTagApplicationsList.tsx`

- [ ] **Step 1: Table view**

`ui/publicTags/list/PublicTagApplicationsTable.tsx`:

```tsx
import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import { Table, TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import PublicTagApplicationStatusBadge from './PublicTagApplicationStatusBadge';

interface Props {
  data: Array<PublicTagApplicationRow>;
  isLoading?: boolean;
  top?: number;
}

const PublicTagApplicationsTable = ({ data, isLoading, top }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Address</TableColumnHeader>
          <TableColumnHeader>Tag name</TableColumnHeader>
          <TableColumnHeader>Type</TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>Submitted</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item) => (
          <TableRow key={ item.id }>
            <TableCell>
              <AddressEntity
                address={{ hash: item.address_hash, is_contract: false, implementations: null, name: null, ens_domain_name: null }}
                isLoading={ isLoading }
                truncation="constant"
              />
            </TableCell>
            <TableCell>{ item.tag_name }</TableCell>
            <TableCell>{ item.tag_type }</TableCell>
            <TableCell><PublicTagApplicationStatusBadge status={ item.status }/></TableCell>
            <TableCell><TimeAgoWithTooltip timestamp={ item.inserted_at }/></TableCell>
          </TableRow>
        )) }
        { isLoading && <Box as="tr"><td colSpan={ 5 }>Loading…</td></Box> }
      </TableBody>
    </Table>
  );
};

export default React.memo(PublicTagApplicationsTable);
```

If `AddressEntity`'s prop shape differs in this fork (some forks omit `implementations`), `grep -n "AddressEntity address=" ui/ | head` and copy a recent valid usage.

- [ ] **Step 2: Mobile card**

`ui/publicTags/list/PublicTagApplicationsListItem.tsx`:

```tsx
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import PublicTagApplicationStatusBadge from './PublicTagApplicationStatusBadge';

interface Props {
  item: PublicTagApplicationRow;
}

const PublicTagApplicationsListItem = ({ item }: Props) => {
  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%" alignItems="center">
        <Text fontWeight={ 600 }>{ item.tag_name }</Text>
        <PublicTagApplicationStatusBadge status={ item.status }/>
      </Flex>
      <AddressEntity
        address={{ hash: item.address_hash, is_contract: false, implementations: null, name: null, ens_domain_name: null }}
        truncation="constant"
      />
      <Flex justifyContent="space-between" w="100%" color="text_secondary" fontSize="sm">
        <Text>{ item.tag_type }</Text>
        <TimeAgoWithTooltip timestamp={ item.inserted_at }/>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(PublicTagApplicationsListItem);
```

- [ ] **Step 3: Container component**

`ui/publicTags/list/PublicTagApplicationsList.tsx`:

```tsx
import { Box } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import PublicTagApplicationsListItem from './PublicTagApplicationsListItem';
import PublicTagApplicationsTable from './PublicTagApplicationsTable';

const PublicTagApplicationsList = () => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'admin:public_tag_applications_list',
    pathParams: { chainId: appConfig.chain.id },
  });

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="No requests yet — submit one from the Submit new tag tab."
      actionBar={ actionBar }
    >
      <Box display={{ base: 'block', lg: 'none' }}>
        { data?.items.map((item) => (
          <PublicTagApplicationsListItem key={ item.id } item={ item }/>
        )) }
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <PublicTagApplicationsTable
          data={ data?.items ?? [] }
          isLoading={ isPlaceholderData }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        />
      </Box>
    </DataListDisplay>
  );
};

export default React.memo(PublicTagApplicationsList);
```

- [ ] **Step 4: Type-check**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | grep "ui/publicTags/list" | head
```

If `useQueryWithPages` complains about the resource name not being recognised in its generic constraint, add `'admin:public_tag_applications_list'` to its accepted list (search for the existing union — `grep -n "admin:" lib/api/useApiQuery.tsx | head`).

- [ ] **Step 5: Commit**

```bash
cd ~/vinuexplorer-frontend
git add ui/publicTags/list/
git commit -m "feat(public-tags): add my-requests list (table + mobile card)"
```

### Task 12: Restructure page with RoutedTabs + auth gate

**Files:**
- Modify: `ui/pages/PublicTagsSubmit.tsx`

- [ ] **Step 1: Rewrite the page**

Replace the file's body (preserving the `DEFAULT_TAG_TYPES` constant block) with:

```tsx
import React from 'react';

import type { PublicTagType } from 'types/api/addressMetadata';
import type { FormSubmitResult } from 'ui/publicTags/submit/types';

import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

import appConfig from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { RoutedTabs } from 'toolkit/components/RoutedTabs';
import PublicTagApplicationsList from 'ui/publicTags/list/PublicTagApplicationsList';
import PublicTagsSubmitForm from 'ui/publicTags/submit/PublicTagsSubmitForm';
import PublicTagsSubmitResult from 'ui/publicTags/submit/PublicTagsSubmitResult';
import PageTitle from 'ui/shared/Page/PageTitle';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

// (keep existing DEFAULT_TAG_TYPES const here)

const PublicTagsSubmit = () => {
  useRedirectForInvalidAuthToken();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [ submitResult, setSubmitResult ] = React.useState<FormSubmitResult>();

  const profileQuery = useProfileQuery();
  const configQuery = useApiQuery('metadata:public_tag_types', {
    queryOptions: {
      enabled: !profileQuery.isLoading && appConfig.features.addressMetadata.isEnabled,
    },
  });

  const handleFormSubmitResult = React.useCallback(async(result: FormSubmitResult) => {
    setSubmitResult(result);

    const allOk = result.every((row) => row.error === null);
    if (allOk) {
      await queryClient.invalidateQueries({
        queryKey: getResourceKey('admin:public_tag_applications_list', { pathParams: { chainId: appConfig.chain.id } }),
      });
      router.push(
        { pathname: '/public-tags/submit', query: { tab: 'my-requests' } },
        undefined,
        { shallow: true },
      );
    }
  }, [ queryClient, router ]);

  const tagTypes = configQuery.data?.tagTypes ?? DEFAULT_TAG_TYPES;

  if (profileQuery.isLoading || (appConfig.features.addressMetadata.isEnabled && configQuery.isPending)) {
    return (
      <>
        <PageTitle title="Request a public tag/label"/>
        <ContentLoader/>
      </>
    );
  }

  const tabs = [
    {
      id: 'submit-tag',
      title: 'Submit new tag',
      component: submitResult ? (
        <PublicTagsSubmitResult data={ submitResult }/>
      ) : (
        <PublicTagsSubmitForm
          config={{ tagTypes }}
          onSubmitResult={ handleFormSubmitResult }
          userInfo={ profileQuery.data }
        />
      ),
    },
    {
      id: 'my-requests',
      title: 'My requests',
      component: <PublicTagApplicationsList/>,
    },
  ];

  return (
    <>
      <PageTitle title="Request a public tag/label"/>
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default PublicTagsSubmit;
```

Notes:
- `useRedirectForInvalidAuthToken()` handles the anonymous-user redirect identically to `Watchlist.tsx`.
- `RoutedTabs` reads `?tab=` from the URL automatically (it's wired internally via `useActiveTabFromQuery`).
- The "view-result" panel still appears inside the `submit-tag` tab — same UX as before, but now sits inside a tab.

- [ ] **Step 2: Type-check + lint**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | grep "PublicTagsSubmit" | head
yarn lint --quiet ui/pages/PublicTagsSubmit.tsx
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
cd ~/vinuexplorer-frontend
git add ui/pages/PublicTagsSubmit.tsx
git commit -m "feat(public-tags): split submit page into two-tab layout with my-requests"
```

### Task 13: Form consumes new POST response (additive)

**Files:**
- Modify: `ui/publicTags/submit/PublicTagsSubmitForm.tsx`
- Modify: `ui/publicTags/submit/types.ts`

- [ ] **Step 1: Extend `FormSubmitResult` row shape**

In `ui/publicTags/submit/types.ts`, locate the per-row union for `FormSubmitResult` (most likely `{ error: null, payload: T } | { error: string, payload: T }`) and add an optional `submission?` on the success branch:

```ts
import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

// before
// { error: null, payload: SubmissionBody }
// after
// { error: null, payload: SubmissionBody, submission?: PublicTagApplicationRow }
```

(Find and update the type literally; do not invent new shapes.)

- [ ] **Step 2: Read the new response shape in `PublicTagsSubmitForm.tsx`**

In `onFormSubmit` (around line 69), change the typed `apiFetch` call to expect the new response:

```ts
const item = await apiFetch<'admin:public_tag_application', { id: number; status: 'pending' | 'approved' | 'rejected'; tag_name: string; address_hash: string; inserted_at: string; tag_type: string; company_name: string | null; description: string | null }, { message: string }>(
  'admin:public_tag_application', {
    pathParams: { chainId: appConfig.chain.id },
    fetchParams: {
      method: 'POST',
      body: { submission: body, recaptcha_response: token },
      headers: { 'recaptcha-v2-response': token },
    },
  })
  .then((submission) => ({ error: null as const, payload: body, submission }))
  .catch((error: unknown) => {
    // (existing error-extraction unchanged)
    const errorObj = getErrorObj(error);
    const messageFromPayload = getErrorObjPayload<{ message?: string }>(errorObj)?.message;
    const messageFromError = errorObj && 'message' in errorObj && typeof errorObj.message === 'string' ? errorObj.message : undefined;
    const message = messageFromPayload || messageFromError || 'Something went wrong.';
    return { error: message, payload: body };
  });
```

- [ ] **Step 3: Type-check**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | grep "publicTags/submit" | head
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
cd ~/vinuexplorer-frontend
git add ui/publicTags/submit/PublicTagsSubmitForm.tsx ui/publicTags/submit/types.ts
git commit -m "feat(public-tags): consume tag submission record from POST response"
```

### Task 14: Playwright tests for the list

**Files:**
- Create: `ui/publicTags/list/PublicTagApplicationsList.pw.tsx`

- [ ] **Step 1: Write the spec**

```tsx
import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import PublicTagApplicationsList from './PublicTagApplicationsList';

const URL = '/api/v1/chains/207/metadata-submissions/tag';
const baseRow = {
  id: 1,
  address_hash: '0x' + 'ab'.repeat(20),
  tag_name: 'Burn address',
  tag_type: 'name',
  company_name: null,
  description: null,
  inserted_at: '2026-05-20T10:00:00Z',
};

test.beforeEach(async({ mockEnvs }) => {
  await mockEnvs(ENVS_MAP.account);
});

test('empty state', async({ render, mockApiResponse }) => {
  await mockApiResponse('admin:public_tag_applications_list', { items: [], next_page_params: null }, { pathParams: { chainId: '207' } });
  const component = await render(<PublicTagApplicationsList/>);
  await expect(component.getByText(/No requests yet/i)).toBeVisible();
});

test('three statuses render with distinct badges', async({ render, mockApiResponse }) => {
  await mockApiResponse('admin:public_tag_applications_list', {
    items: [
      { ...baseRow, id: 1, tag_name: 'P', status: 'pending' },
      { ...baseRow, id: 2, tag_name: 'A', status: 'approved' },
      { ...baseRow, id: 3, tag_name: 'R', status: 'rejected' },
    ],
    next_page_params: null,
  }, { pathParams: { chainId: '207' } });

  const component = await render(<PublicTagApplicationsList/>);
  await expect(component.getByText('Pending review')).toBeVisible();
  await expect(component.getByText('Approved')).toBeVisible();
  await expect(component.getByText('Rejected')).toBeVisible();
});

test('pagination control renders when next_page_params present', async({ render, mockApiResponse }) => {
  await mockApiResponse('admin:public_tag_applications_list', {
    items: [{ ...baseRow, status: 'pending' as const }],
    next_page_params: { items_count: 20, page_number: 2 },
  }, { pathParams: { chainId: '207' } });

  const component = await render(<PublicTagApplicationsList/>);
  await expect(component.getByRole('button', { name: /next/i })).toBeVisible();
});

test('error state', async({ render, mockApiResponse }) => {
  await mockApiResponse('admin:public_tag_applications_list', { status: 500 }, { pathParams: { chainId: '207' } });
  const component = await render(<PublicTagApplicationsList/>);
  await expect(component.getByText(/something went wrong/i)).toBeVisible();
});
```

The exact `mockEnvs` key and `mockApiResponse` helper names must match what the project's `playwright/fixtures/` exposes — `grep -rn "mockApiResponse\|mockEnvs" playwright/fixtures/ | head -10` and copy the canonical signature into the test if it differs from the above.

- [ ] **Step 2: Run the spec**

```bash
cd ~/vinuexplorer-frontend
yarn test:pw ui/publicTags/list/PublicTagApplicationsList.pw.tsx
```

Expected: 4 specs pass. If any fail because the project's mock-API helper signature differs, adjust the call shape — do NOT mutate the component to make tests pass.

- [ ] **Step 3: Commit**

```bash
cd ~/vinuexplorer-frontend
git add ui/publicTags/list/PublicTagApplicationsList.pw.tsx
git commit -m "test(public-tags): cover my-requests empty/loaded/paginated/error states"
```

### Task 15: Final type-check, push, PR

- [ ] **Step 1: Full type-check**

```bash
cd ~/vinuexplorer-frontend
node_modules/.bin/tsc --noEmit 2>&1 | tee /tmp/tsc.out
```

Expected: zero new errors. Pre-existing errors (if any) are documented in `~/.claude/projects/-home-gypsey-VinuChain/memory/` and unrelated to this change — note them in the PR body.

- [ ] **Step 2: Lint**

```bash
cd ~/vinuexplorer-frontend
yarn lint
```

Expected: no new errors. Project memory notes that the `WatchListAddressItem` warning is a pre-existing lint baseline — ignore that one.

- [ ] **Step 3: Push + PR**

```bash
cd ~/vinuexplorer-frontend
git push -u origin feat/public-tag-request-status
gh pr create --title "feat(public-tags): show request status on submit page" --body "$(cat <<'EOF'
## Summary
- New "My requests" tab on `/public-tags/submit` showing the signed-in user's prior submissions with Pending / Approved / Rejected status badges.
- Existing form continues to live on the "Submit new tag" tab; on successful submit, the page navigates to "My requests" and invalidates the list cache so the new row appears immediately.
- Whole page now auth-gated via `useRedirectForInvalidAuthToken()` (same pattern as Watchlist).

Depends on `vinuexplorer-backend#<PR-number>` (auth-gated POST + new GET endpoint).

## Test plan
- [ ] `yarn lint` green
- [ ] `node_modules/.bin/tsc --noEmit` no new errors
- [ ] `yarn test:pw ui/publicTags/list/PublicTagApplicationsList.pw.tsx` green
- [ ] Manual on staging: anonymous user → redirected to login
- [ ] Manual on staging: signed-in user, empty list → empty state copy + "Submit new tag" tab active
- [ ] Manual on staging: signed-in user submits → lands on "My requests" with new row at top, status "Pending review"
- [ ] Manual on staging: moderator marks the row approved via magic-link → refresh → badge flips to "Approved"
EOF
)"
```

---

## Self-Review

**1. Spec coverage:** every section of the spec has an owning task —

| Spec section | Owning task(s) |
|---|---|
| `identity_id` FK migration | Task 1 |
| Email backfill migration | Task 2 |
| Schema `belongs_to(:identity)` | Task 3 |
| Auth-gated POST + record-returning response | Task 5 + 6 |
| New paginated GET | Task 5 + 6 |
| View JSON serializer | Task 5 |
| Route move into authenticated pipeline | Task 6 |
| Backend tests (5 cases listed in spec) | Task 4 |
| FE API resource | Task 8 |
| FE response types | Task 9 |
| Two-tab page + auth gate | Task 12 |
| Status badge | Task 10 |
| List/table/mobile card | Task 11 |
| Post-submit navigation + cache invalidation | Task 12 |
| Form consumes new response shape | Task 13 |
| Playwright tests | Task 14 |

**2. Placeholder scan:** no `TBD` / `TODO` placeholders inside code blocks. The `<ts>` and `<ts+1>` in migration filenames are intentional — `mix ecto.gen.migration` fills them at gen time, and the instruction in the step is explicit about it.

**3. Type consistency:** `PublicTagApplicationRow` keys (`id`, `address_hash`, `tag_name`, `tag_type`, `company_name`, `description`, `status`, `inserted_at`) match the backend view's `serialize/1` keys exactly. `next_page_params` shape (`{ items_count, page_number }`) matches the controller's `paginate_split/3` output.

**4. Repo-boundary clarity:** every task lists its repo (`~/vinuexplorer-backend` for Tasks 1–7, `~/vinuexplorer-frontend` for Tasks 8–15). Commits target the right branch in the right repo.

---

## Addendum (2026-05-20) — promoted from out-of-scope

User authorized expanding the rollout to also include:

A. **Rejection-reason field.** Schema column + view exposure + UI tooltip on a rejected badge.
B. **Status filter** in the My requests tab (`?status=pending|approved|rejected` on the new GET).
C. **Email notification to the requester** on status transitions (approved / rejected).
D. **Edit a still-pending submission from the FE** (new `PUT` route + ownership check + edit modal).

Explicitly skipped: in-app moderator UI, WebSocket live updates. The existing magic-link operator flow at `BlockScoutWeb.API.V1.TagSubmissionActionsController` stays as the moderator path.

### Edits to existing tasks

- **Task 1 migration** also adds `reject_reason :text NULL`:
  ```elixir
  alter table(:account_public_tag_submissions) do
    add(:identity_id, references(:account_identities, on_delete: :nilify_all), null: true)
    add(:reject_reason, :text)
  end
  create(index(:account_public_tag_submissions, [:identity_id]))
  ```
- **Task 3 schema** adds `field(:reject_reason, :string)` and `:reject_reason` is added to `@optional_attrs`.
- **Task 4 tests** also cover: (a) `GET ?status=approved` returns only approved rows; (b) `PUT` rewrites a pending submission; (c) `PUT` on someone else's submission → 403; (d) `PUT` on an already-decided submission → 409; (e) successful approve email + decline email are queued via the `Bamboo.TestAdapter`.
- **Task 5 view** `serialize/1` includes `reject_reason`.
- **Task 5 controller** `index/2` accepts an optional `status` query param and applies `where: s.status == ^status` when given a known value.
- **Task 6 routes** also wires `put("/chains/:chainId/metadata-submissions/tag/:id", TagSubmissionsController, :update)` into the authenticated scope.
- **Task 9 type** `PublicTagApplicationRow` adds `reject_reason: string | null`.
- **Task 10 badge** wraps the rejected pill in a `Tooltip` showing `reject_reason` when present.
- **Task 11 list** wires the filter dropdown above the table; both desktop + mobile views read the `reject_reason` tooltip via the badge.
- **Task 12 page** still has two tabs; nothing changes there.
- **Task 14 Playwright** adds two cases: (1) filter dropdown narrows the list; (2) edit modal saves and refetches.

### New tasks

#### Task 5A — PUT update endpoint

**Files:**
- Modify: `apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submissions_controller.ex`

- [ ] **Step 1: Add `update/2`**

```elixir
def update(conn, %{"id" => id} = params) do
  with {:auth, %{id: uid}} <- {:auth, current_user(conn)},
       {:identity, %Identity{} = identity} <- {:identity, UserFromAuth.find_identity(uid)},
       %PublicTagSubmission{} = submission <- Repo.account_repo().get(PublicTagSubmission, id) do
    cond do
      submission.identity_id != identity.id ->
        conn |> put_status(:forbidden) |> json(%{message: "Not your submission"})

      submission.status != "pending" ->
        conn |> put_status(:conflict) |> json(%{message: "Submission already decided"})

      true ->
        sub_params = params["submission"] || %{}

        attrs = %{
          tag_name: sub_params["name"] || submission.tag_name,
          tag_type: sub_params["tagType"] || submission.tag_type,
          company_name: sub_params["companyName"] || submission.company_name,
          company_website: sub_params["companyWebsite"] || submission.company_website,
          description: sub_params["description"] || submission.description
        }

        case submission |> PublicTagSubmission.changeset(attrs) |> Repo.account_repo().update() do
          {:ok, updated} ->
            conn
            |> put_view(BlockScoutWeb.API.V1.TagSubmissionsView)
            |> render(:show, submission: updated)

          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{message: format_changeset_errors(changeset)})
        end
    end
  else
    nil ->
      conn |> put_status(:not_found) |> json(%{message: "Submission not found"})

    _ ->
      conn |> put_status(:unauthorized) |> json(%{message: "Not authenticated"})
  end
end
```

- [ ] **Step 2: Commit**

```bash
git add apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submissions_controller.ex
git commit -m "feat(api/v1): allow editing a still-pending tag submission"
```

#### Task 5B — Status-change email + reject-reason capture on decline

**Files:**
- Modify: `apps/explorer/lib/explorer/account/public_tag_submission.ex` (add status-change emitter)
- Modify: `apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submission_actions_controller.ex` (capture `reject_reason` on decline; trigger requester email)
- Create: `apps/block_scout_web/lib/block_scout_web/notifications/public_tag_submission_notifier.ex`

- [ ] **Step 1: Notifier module**

```elixir
defmodule BlockScoutWeb.Notifications.PublicTagSubmissionNotifier do
  @moduledoc "Sends approved/rejected emails to the requester of a public tag submission."

  import Bamboo.Email

  alias Explorer.Account.PublicTagSubmission
  alias Explorer.Mailer

  require Logger

  def notify_status_change(%PublicTagSubmission{status: "approved"} = s), do: send(:approved, s)
  def notify_status_change(%PublicTagSubmission{status: "rejected"} = s), do: send(:rejected, s)
  def notify_status_change(_), do: :ok

  defp send(kind, %PublicTagSubmission{} = s) do
    sender =
      Application.get_env(:explorer, Explorer.Account)[:sendgrid][:sender] || "hello@vinuchain.org"

    email =
      new_email(
        to: s.requester_email,
        from: sender,
        subject: subject(kind, s),
        text_body: body(kind, s)
      )

    Mailer.deliver_now(email)
  rescue
    error -> Logger.warning("Public tag submission requester notification failed: #{inspect(error)}")
  end

  defp subject(:approved, s), do: "Your public tag '#{s.tag_name}' was approved"
  defp subject(:rejected, s), do: "Your public tag '#{s.tag_name}' was declined"

  defp body(:approved, s) do
    """
    Your public tag '#{s.tag_name}' for address #{s.address_hash} has been approved and is
    now visible on VinuChain Explorer.

    Thanks for contributing!
    """
  end

  defp body(:rejected, s) do
    reason = if s.reject_reason && s.reject_reason != "", do: s.reject_reason, else: "No reason was provided."

    """
    Your public tag '#{s.tag_name}' for address #{s.address_hash} was declined.

    Reason: #{reason}

    You can submit a revised request from the explorer if you'd like to try again.
    """
  end
end
```

- [ ] **Step 2: Wire the notifier into the magic-link decline flow**

In `apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submission_actions_controller.ex`:

a) `show/2` and `create/2` accept an optional `reject_reason` query param when `action == :decline`. The confirm-page form (rendered HTML inside `confirm_page/3`) gains a `<textarea name="reject_reason">` for declines.

b) `decline_submission/1` writes `reject_reason` onto the row alongside `status: "rejected"`.

c) Both `approve_submission/1` and `decline_submission/1`, on success, call:

```elixir
Task.start(fn ->
  BlockScoutWeb.Notifications.PublicTagSubmissionNotifier.notify_status_change(updated)
end)
```

- [ ] **Step 3: Tests**

Add to `apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submission_actions_controller_test.exs` (or its equivalent) cases for:

```elixir
test "decline sets reject_reason and queues an email", %{conn: conn} do
  # Bamboo.SentEmail.start_link() in conn_case if not already
  submission = insert(:account_public_tag_submission, status: "pending")
  token = PublicTagSubmissionToken.sign(%{submission_id: submission.id, action: :decline})

  conn
  |> post(~p"/api/v1/public-tag-submissions/action?token=#{token}", %{"reject_reason" => "Duplicate of existing tag"})
  |> response(200)

  reloaded = Repo.account_repo().get!(PublicTagSubmission, submission.id)
  assert reloaded.status == "rejected"
  assert reloaded.reject_reason == "Duplicate of existing tag"
  assert_email_delivered_with(subject: ~r/declined/i, to: [submission.requester_email])
end
```

- [ ] **Step 4: Commit**

```bash
git add apps/block_scout_web/lib/block_scout_web/notifications/ \
        apps/block_scout_web/lib/block_scout_web/controllers/api/v1/tag_submission_actions_controller.ex \
        apps/block_scout_web/test/block_scout_web/controllers/api/v1/tag_submission_actions_controller_test.exs
git commit -m "feat(public-tags): notify requester + capture reject_reason on decision"
```

#### Task 11A — FE: status filter dropdown

**Files:**
- Modify: `ui/publicTags/list/PublicTagApplicationsList.tsx`
- Create: `ui/publicTags/list/PublicTagApplicationsStatusFilter.tsx`

- [ ] **Step 1: Filter component**

```tsx
import React from 'react';

import type { PublicTagApplicationStatus } from 'types/api/publicTagSubmissions';

import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

type Value = PublicTagApplicationStatus | undefined;

interface Props {
  value: Value;
  onChange: (next: Value) => void;
}

const OPTIONS: Array<{ value: PublicTagApplicationStatus; label: string }> = [
  { value: 'pending', label: 'Pending review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const PublicTagApplicationsStatusFilter = ({ value, onChange }: Props) => {
  return (
    <PopoverFilter contentProps={{ w: '220px' }} appliedFiltersNum={ value ? 1 : 0 }>
      <TableColumnFilter
        title="Status"
        isTouched={ Boolean(value) }
        onFilter={ () => undefined }
        onReset={ () => onChange(undefined) }
      >
        { OPTIONS.map((opt) => (
          <label key={ opt.value } style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="radio"
              name="public-tag-status"
              checked={ value === opt.value }
              onChange={ () => onChange(opt.value) }
            />
            { opt.label }
          </label>
        )) }
      </TableColumnFilter>
    </PopoverFilter>
  );
};

export default React.memo(PublicTagApplicationsStatusFilter);
```

(If the project's existing filter primitive has a different surface, copy it from `ui/transactions/TxsFilters.tsx` or the closest equivalent — do NOT invent new ones.)

- [ ] **Step 2: Wire into the list**

Modify `PublicTagApplicationsList` to thread `filters: { status }` into `useQueryWithPages` so the URL gets a `?status=` param, and pass it into the `ActionBar`.

- [ ] **Step 3: Commit**

```bash
git add ui/publicTags/list/PublicTagApplicationsStatusFilter.tsx ui/publicTags/list/PublicTagApplicationsList.tsx
git commit -m "feat(public-tags): filter my-requests by status"
```

#### Task 11B — FE: Edit-pending-submission modal

**Files:**
- Create: `ui/publicTags/list/PublicTagApplicationEditModal.tsx`
- Modify: `lib/api/services/admin.ts` — add `public_tag_application_update` PUT resource
- Modify: `ui/publicTags/list/PublicTagApplicationsTable.tsx` + `…ListItem.tsx` — add an "Edit" button visible only when `status === 'pending'`

- [ ] **Step 1: Add the PUT resource**

In `admin.ts`, add:

```ts
public_tag_application_update: {
  path: '/api/v1/chains/:chainId/metadata-submissions/tag/:id',
  pathParams: [ 'chainId' as const, 'id' as const ],
},
```

- [ ] **Step 2: Edit modal**

```tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import appConfig from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

interface FormValues {
  name: string;
  description: string;
  companyName: string;
  companyWebsite: string;
}

interface Props {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  row: PublicTagApplicationRow;
  onSaved: () => void;
}

const PublicTagApplicationEditModal = ({ open, onOpenChange, row, onSaved }: Props) => {
  const apiFetch = useApiFetch();
  const form = useForm<FormValues>({
    defaultValues: {
      name: row.tag_name,
      description: row.description ?? '',
      companyName: row.company_name ?? '',
      companyWebsite: '',
    },
  });

  const onSubmit = form.handleSubmit(async(values) => {
    await apiFetch('admin:public_tag_application_update', {
      pathParams: { chainId: appConfig.chain.id, id: String(row.id) },
      fetchParams: {
        method: 'PUT',
        body: {
          submission: {
            name: values.name,
            tagType: row.tag_type,
            description: values.description,
            companyName: values.companyName,
            companyWebsite: values.companyWebsite,
          },
        },
      },
    });
    onSaved();
    onOpenChange({ open: false });
  });

  return (
    <DialogRoot open={ open } onOpenChange={ onOpenChange }>
      <DialogContent>
        <DialogHeader>Edit pending request</DialogHeader>
        <DialogBody>
          <FormProvider { ...form }>
            <form onSubmit={ onSubmit } noValidate>
              <FormFieldText<FormValues> name="name" required placeholder="Tag name"/>
              <FormFieldText<FormValues> name="description" placeholder="Description" rules={{ maxLength: 500 }} asComponent="Textarea"/>
              <FormFieldText<FormValues> name="companyName" placeholder="Company name"/>
              <FormFieldText<FormValues> name="companyWebsite" placeholder="Company website"/>
            </form>
          </FormProvider>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={ () => onOpenChange({ open: false }) }>Cancel</Button>
          <Button onClick={ onSubmit } loading={ form.formState.isSubmitting }>Save</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(PublicTagApplicationEditModal);
```

(Verify Dialog/DialogContent/etc imports against the existing modal in `ui/watchlist/AddressModal/AddressModal.tsx` — copy the exact shape if names differ.)

- [ ] **Step 3: Wire Edit button**

In both table and mobile card components, render a small "Edit" button only when `row.status === 'pending'`. Clicking opens the modal seeded with the row. On save, invalidate the list query.

- [ ] **Step 4: Commit**

```bash
git add ui/publicTags/list/PublicTagApplicationEditModal.tsx \
        ui/publicTags/list/PublicTagApplicationsTable.tsx \
        ui/publicTags/list/PublicTagApplicationsListItem.tsx \
        ui/publicTags/list/PublicTagApplicationsList.tsx \
        lib/api/services/admin.ts
git commit -m "feat(public-tags): edit pending request from my-requests list"
```

### Updated task ordering (final)

`1 → 2 → 3 → 4 → 5 → 5A → 5B → 6 → 7 → 8 → 9 → 10 → 11 → 11A → 11B → 12 → 13 → 14 → 15`

19 tasks total. Stop point unchanged — pause after Task 7 (backend PR) for user merge + deploy.

---

## Execution Handoff

Plan complete and saved to `~/vinuexplorer-frontend/docs/superpowers/plans/2026-05-20-public-tag-request-status.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
