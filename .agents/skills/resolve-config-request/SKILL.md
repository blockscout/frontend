---
name: resolve-config-request
description: Turn a Slack request into the exact env vars to set on a live instance, and hand them to DevOps.
disable-model-invocation: true
---

# Resolve a config request

Convert **intent → variables**. The request already carries the intent; this skill never originates it.

## Sure

Only send a DevOps message we are **sure** of. Every other rule serves that.

- **Stop** on ambiguity. If the variable cannot be pinned, or the value is not in the documented set of allowed values, stop and tell the user.
- **The user is the face.** Uncertainty and clarifying questions go to the user. Requester-facing posts are only the handover reply after an approved send, and the demo link on the skin branch.
- **Intent is given.** Any question that turns on what someone *wants* is a stop, not a judgement call.
- **Operator.** `docs/ENVS.md` is the manual. The docs pin legal values, not the consumers. A value the docs cannot pin is a documentation gap, fixed as documentation.
- **Off.** Prefer a documented off-value over unsetting. Unset only when the docs show the default *is* the desired state.
- **Mirror** the requester's targeting language. Unstated is not undeterminable — the DevOps bot resolves instances.
- **Drift.** `NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG` and `NEXT_PUBLIC_COLOR_THEME_OVERRIDES` ship with a `frontend-configs` file change in the same run; take the skin branch.

No commit without the user's explicit confirmation in this conversation — the one exception is the skin branch's phase 1, which runs unattended up to the demo link.

## Scope

**In:** variables in `docs/ENVS.md`, including start-time ones such as `FAVICON_MASTER_URL`.

**Out, with the exit:**

- **Not configurable** — needs a code change. Stop and offer the `create-issue` skill. The channel carries these; they look like ordinary requests.
- **Retired variable named** — read `docs/DEPRECATED_ENVS.md` and propose the replacement.
- **Outside the frontend, or mixed with a non-configurable ask** — do the configurable frontend part only, and tell the user what was left out.
- **CDN-only trees** in `frontend-configs` with no `docs/ENVS.md` variable (`multisearch/`, `token-icons/`, `nft-images/`, `explorer-logos/`, `meta-suites-logos/`) — stop and tell the user.

## Steps

### 1. Read the thread

Follow `.agents/slack-thread.md`. Threads are typically in Russian.

**Done when:** every message and attachment in the thread is in hand.

### 2. Map the ask to variables

Using `docs/ENVS.md` as the operator manual, pin each change to a variable and a documented value. **Stop** if it cannot be pinned.

**Skin.** Read [`SKIN-REQUESTS.md`](SKIN-REQUESTS.md) when a designer owns the change: this instance's logo, icon, favicon, OG image, colour theme, hero banner, homepage highlights, or navigation promo banner. That branch runs to its own stop; it returns here at step 3. A chains-menu or footer icon that merely *lives* in `network-icons/` / `footer-icons/` is not that.

**Fetched config.** A chains menu, footer, marketplace, widgets, or cross-chain JSON — and icons those files reference — is a `frontend-configs` PR without a demo. See **Fetched configs** below; do that PR before step 3. Skip when the skin branch is already running — those files ride in that PR.

**Done when:** every asked change is a `(variable, value)` pair pinned by the docs (and any non-skin configs PR is merged to `main`), or the run has stopped.

### 3. Read current state (nameable instance)

When the target is a nameable instance, fetch its live config, diff against the proposed change, drop no-ops, and identify anything that needs removing. Sending a variable already at that value is how these requests lose credibility.

When the target is a vague class ("everywhere", "all testnets"), there is no single current state — go set-only.

**Done when:** the message contains only real changes, or the target is a class and the message is set-only.

### 4. Validate

Run the startup validator against the live env plus our change, before drafting. See **Validation** below.

**Done when:** the validator accepts the overlay (or the only remaining vars are start-time ones it cannot see).

### 5. Draft the DevOps message

Compose it per **The DevOps message** below. Show it to the user and wait.

**Done when:** the user has approved the exact text.

### 6. Send, then hand over

Post the approved message to `blockscout-devops-requests` — resolve the channel ID from `.agents/TEAM.md`. Then reply in the original thread — same language as the thread — with a link to that message, saying the request has been handed over and is waiting on DevOps.

**Done when:** both posts exist and the original-thread reply carries the DevOps link.

## Reading an instance's env

Every deployed instance exposes `{ envs: { …all NEXT_PUBLIC_* } }` at `<url>/node-api/config`. The CLI:

```bash
tools/dev-server/fetch.sh <alias> --omit-local-envs --out=/tmp/instance.env
```

Step 3 diffs this file. Aliases live in `tools/dev-server/registry.json`. How fetch and env layering work: `tools/dev-server/CONTEXT.md`.

Limits: registry alias only (otherwise GET `/node-api/config` yourself); `/node-api/config` is `NEXT_PUBLIC_*` only, so start-time variables like `FAVICON_MASTER_URL` cannot be checked this way; `fetch.sh` drops `ignoredEnvs` and `deprecatedEnvs` — for those, GET `/node-api/config`.

## Validation

**Default alias: `eth`.** One representative instance is enough, including when the target is a vague class.

`--omit-local-envs` drops `localEnvs` (`tools/dev-server/envs-rules.json`); the schema requires `NEXT_PUBLIC_APP_HOST`. Copy the fetched file and add those keys, then overlay our change on the copy. dotenv-cli: the **first** `-e` file wins (`tools/dev-server/CONTEXT.md`). For a key to drop, strip it from the copy before validating.

```bash
cp /tmp/instance.env /tmp/instance.validate.env
jq -r '.localEnvs | to_entries[] | "\(.key)=\(.value)"' tools/dev-server/envs-rules.json >> /tmp/instance.validate.env
```

From `deploy/tools/envs-validator/`, the preamble in `test.sh` (collect placeholders, copy `test/assets`, build), then:

```bash
pnpm exec dotenv -e /tmp/change.env -e /tmp/instance.validate.env -- pnpm run validate
```

Schema organisation: `deploy/tools/envs-validator/CONTEXT.md`. This is what catches missing companion variables (`.when(...)`), forbidden combinations, and malformed nested JSON — a documentation check cannot.

## Fetched configs

JSON the instance **fetches** at startup — not instance chrome, no demo.

Checkout: a workspace folder named `frontend-configs` or `blockscout_frontend_configs`. If none, stop and ask the user to add it.

Follow the `check-github-cli` skill. Confirm with the user before the commit and the PR — this PR is merged to `main`, where live instances fetch from. (Skin phase 1 is the exception: its PR stays unmerged for review, so it needs no confirmation.) The `create-pr` skill's frontend template, ENVs label, and issue-from-branch steps do not apply.

| Directory | Variable |
| --- | --- |
| `configs/featured-networks/` | `NEXT_PUBLIC_FEATURED_NETWORKS` |
| `configs/footer-links/` (+ `configs/footer-icons/`) | `NEXT_PUBLIC_FOOTER_LINKS` |
| `configs/marketplace/` and siblings (`marketplace-categories/`, `marketplace-subgraph-links/`, `marketplace-logos/`, `marketplace-security-reports/`) | `NEXT_PUBLIC_MARKETPLACE_CONFIG_URL`, `NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL`, `NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL` |
| `configs/widgets/` | `NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL` |
| `configs/cross-chain/` | `NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL` |

Hosted icons for **inlined** lists (the env holds the JSON; the file is the URL inside it): `configs/ide-icons/` → `NEXT_PUBLIC_CONTRACT_CODE_IDES`; `configs/nft-marketplace-logos/` → `NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES`; `configs/multichain-balance/` → `NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG`.

After merge to `main`, confirm each raw URL returns 200. If the instance already has that URL, the DevOps ask is a restart to re-fetch — no new `KEY=value`. If the URL is new, or the value is inlined, it goes in the block as usual.

## The DevOps message

Russian, informal. Target in the requester's own words — not registry aliases. Sets in one fenced `KEY=value` block; keys to drop as names only. Mention the requester with `<@U…>` from the thread author's `user_id` (`.agents/TEAM.md` → How to address).

````
Привет! 🐈
Для eth.blockscout.com нужно поставить:
```
NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES=['/accounts']
```
cc <@U024DUPJG3A>
````

Unset-only: `нужно убрать:` + names in the fence, no `=value`. Mixed: both sentences, set first. Restart-only (fetched file, URL already on the instance): `нужно перезапустить фронт, чтобы подтянуть обновлённый конфиг.` — no fence.

Omit: that we validated; a backlink to the source thread. A set or drop fence already implies the restart. Caveats as bullets after the fence, only when there is a real one (don't-remove-X, companion variables).

## Value formatting

- **`rgba()`, never hex** — a `#` in an env var breaks bash.
- **JSON values use single quotes** (`'{"a":1}'`) so they paste into a shell or `.env` file. The validator's `replaceQuotes` converts them.
