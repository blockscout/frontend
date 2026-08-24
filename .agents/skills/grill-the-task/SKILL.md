---
name: grill-the-task
description: >-
  Grill a product task (GitHub issue) into implementable work.
disable-model-invocation: true
---

# Grill the task

Product task issues arrive thin — a title and a couple of links. This skill closes the gap: research
everything researchable, then grill the developer about everything that is a *decision*, tracking what they
can't answer as open questions for the responsible people. Input is a GitHub issue URL.


## Step 1 — Research

Always investigate the question against **primary sources** — official docs, source code, specs, first-party APIs — 
not a secondary write-up of them. **Never ask the developer something that can be looked up** — but do ask,
immediately, when something **blocks the research itself**: the issue has no mockup link, it's unclear which
instance an endpoint is deployed on (staging or production?), a linked doc is inaccessible, a named resource
can't be found in the codebase. Ask to unblock the lookup rather than guessing or silently skipping a source.
Gather, in roughly this order:

1. **The issue** — `gh issue view <n> --repo blockscout/frontend --comments` (needs `gh`; follow the
   `check-github-cli` skill if unsure). Read every linked resource that is accessible: other issues, docs
   pages, Notion pages (via the Notion MCP tools, if connected).
2. **The codebase** — what already exists: similar pages/features to mirror, relevant `service:name`
   resources, feature configs, terms from `.agents/GLOSSARY.md`.
3. **The API** — for every endpoint the issue names, fetch a real sample response (the `resolve-api-url`
   skill resolves instance URLs; then `curl`). Note pagination/sorting/filtering params and whether the API
   is production-deployed or staging-only.
4. **Figma mockups** — via the Figma MCP tools, **enumerate-only**: list screens/frames, their elements,
   columns, states, and record a node link per screen. Do **not** extract visual/styling details — appearance
   stays with the mockups and the `[human]` style leaves (see `.agents/delegation.md`). If the Figma
   MCP is not connected, have the developer describe the mockups instead.

Then run two mechanical cross-checks; every mismatch becomes an open question for the backend owner or PM:

- **Mockup ↔ API sufficiency** — for each element/column a mockup displays, confirm the sample API response
  actually contains that data (e.g. the mockup shows a `receiver` column but the list item model has no
  receiver hash → open question).
- **Field propagation** — when the task adds a new field to an existing model, enumerate **every** UI surface
  that displays that piece of information and verify each backing resource carries the new field — including
  proxy paths (e.g. BENS microservice data proxied through the core API, search results carrying the same info).

Research is complete when every linked source is read or flagged inaccessible, every named endpoint has a
real sample response, and both cross-checks have run with each mismatch recorded as an open question.

## Step 2 — The interview

**Invoke the `grilling` skill** and run the interview under its discipline. Skip anything the research already answered.

**Start by picking the task's contacts**: for each relevant team in `.agents/TEAM.md`, ask which member
owns this task, recommending the member marked ✓ in that team's Default column — and record that ✓ member
whenever the developer has no task-specific pick. These go into the spec header, and Step 3 routes each open
question to the contact that owns it. Don't ask what can be inferred: when the issue's author maps to a
roster member of the relevant team (match the GitHub handle in `.agents/TEAM.md`), record them as that
team's contact without asking — the PM slot in particular is usually just the task's author. When the
developer doesn't know an answer, don't press — record the question with the owning contact and move on.

Cover these domains, each only where the task actually reaches it — a one-line bug fix touches almost none
of them, and marching through all six regardless is how a five-minute task turns into a twenty-minute one:

1. **Goal & users** — what problem, for whom.
2. **Env gating** — does the feature sit behind a new `NEXT_PUBLIC_*` env var or not. (Just the decision —
   the mechanics belong to the `add-env-var` skill at implementation time.)
3. **Data & API** — anything Step 1 left open: readiness of staging-only endpoints, missing params, and
   **which upcoming backend release ships the required API changes** (so the frontend release notes can
   reference it) — usually a question for the backend owner.
4. **UI inventory** — routes, navigation entry points (where do users find this?), cross-links to existing
   entity pages. Behavioral states and mobile behavior are standard — don't ask.
5. **Analytics & links** — custom Mixpanel events **only** if there's a new interactive element worth
   tracking (page views are auto-wired); UTM query params on any hardcoded links to Blockscout or partner
   products.

Testing is **not** an interview domain — the capability boundary in `.agents/delegation.md` settles it.
Neither is human verification: which acceptance criteria are `(human)` follows the standing rule in "The
ticket model" in `.agents/tasks/concepts.md`. Only ask when one sits genuinely on the line.

The interview is complete when every domain the task reaches is covered or explicitly skipped as
research-answered, the contacts are settled, and every unanswered question has an owner.

## Step 3 — Send open questions

Route every question the session couldn't answer to the person who owns it.

1. Group them by owner.
2. Pick each group's destination. Ask whether the task has a **dedicated Slack channel** only when the task
   is large enough to warrant a spec — big features often get one, and it changes the routing; otherwise
   assume there is none.
   - Task has a **dedicated feature channel** → **all** questions go there, API ones included.
   - Otherwise, **product questions go to the frontend channel** (see `.agents/TEAM.md`) — never a DM — so
     colleagues from other teams (QA in particular) build the same understanding of the feature.
   - Other questions (API, design) default to a DM with the owner.
   - When posting to a channel, **always mention the addressee** — `<@member ID>` from `.agents/TEAM.md`
     (people missing from the roster: resolve by name via `slack_search_users` and suggest adding them).
3. Draft one message per owner: brief task context (issue link), the questions, and why they block progress.
   Write all Slack messages in **Russian** — the team's internal language (the spec itself stays in English).
4. **Show every draft (with its destination) to the user and wait for explicit approval** — never send
   unreviewed outreach.
5. Send (`slack_send_message`), then keep each thread's permalink for the question's `questions.md` entry.

If the Slack MCP tools are unavailable, record the questions with owners anyway and tell the user to route
them manually.

Outreach is complete when every question has a recorded permalink — or an explicit note that the developer
routes it manually.

## Step 4 — Size and hand off

Decide, by a rough sizing judgment, whether the task needs a spec — one session of work or not. No formal
breakdown is needed for this call ("Not every task needs a spec" in `.agents/tasks/README.md`).

- **Small task** — implement it in this same session, then hand off to the `create-pr` skill. If a `pending` question blocks the work, wait for the
  reply and pick the implementation back up here.
- **Larger task** — suggest proceeding with the `to-spec` skill **in this same session**.
