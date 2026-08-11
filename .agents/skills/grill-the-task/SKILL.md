---
name: grill-the-task
description: >-
  Grill a product task (GitHub issue) into implementable work — research first, then a
  one-question-at-a-time interview, then a breakdown quizzed with the developer; also scopes deferred
  subtasks.
disable-model-invocation: true
---

# Grill the task

Product task issues arrive thin — a title and a couple of links. This skill closes the gap: research
everything researchable, then grill the developer about everything that is a *decision*, tracking what they
can't answer as open questions for the responsible people.

**Two modes.**

- **Task mode** (default): input is a GitHub issue URL.
- **Subtask mode**: input is an existing spec plus a subtask that has only a `brief.md`. The session scopes
  research and questions to that subtask, reads its folder's `brief.md` (plus any `research.md` /
  prototype notes gathered since) as the starting point, and produces its `spec.md` — along with any
  further subtasks the spike revealed, which are appended as siblings. Run it just-in-time, right before
  the subtask starts, against the by-then-current code.

The output is work the developer can act on: a **single-subtask** task is implemented in this same session
and opened as a PR; anything larger is written up by the `to-spec` skill.

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

**Invoke the `grilling` skill** and run the interview under its discipline: one question at a time with a
recommended answer, decisions put to the developer while facts are looked up, and no enactment until shared
understanding is confirmed. Skip anything the research already answered.

**Start by picking the task's contacts**: for each relevant team in `.agents/TEAM.md`, ask which member
owns this task, recommending the member marked ✓ in that team's Default column — and record that ✓ member
whenever the developer has no task-specific pick. These go into the spec header, and Step 4 routes each open
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
6. **Delivery** — one question: deploy a demo after completion or not (executed via the `deploy-demo` skill
   as a final subtask if yes).

Testing is **not** an interview domain — the capability boundary in `.agents/delegation.md` settles it.
Neither is code review or human verification: review is `implement-task`'s call at run time (always under
`--auto`, the developer's choice in a manual run), and which acceptance criteria are `(human)` follows the
standing rule in "The subtask model" in `.agents/tasks/README.md`. Only ask when one sits genuinely on the
line.

The interview is complete when every domain the task reaches is covered or explicitly skipped as
research-answered, the contacts are settled, and every unanswered question has an owner.

## Step 3 — Quiz the breakdown

Propose the work as a numbered list of **subtasks** — vertical slices, per "The subtask model" in
`.agents/tasks/README.md`. For each, show the title, what end-to-end behaviour it delivers, and its
`Blocked by:` edges. Then put the breakdown itself to the developer and iterate until they approve it:

- **Granularity** — too coarse or too fine? The bound is hard: a subtask that does not fit in one fresh
  context window is two subtasks.
- **Edges** — does each subtask depend only on the subtasks that genuinely gate it?
- **Merge or split** — anything that should be one slice, or three?

Two things to look for while drafting it:

- **Prefactor first.** *Make the change easy, then make the easy change.* When the current code fights the
  feature, the first subtask reshapes it with no behaviour change — which also makes it the ideal opener for
  an unattended chain, since it earns no `(human)` acceptance criteria and never pauses.
- **Defer what can't be scoped.** A subtask blocked on a prototype, a spike, or an answer nobody has yet
  gets a `brief.md` and no `spec.md`; a just-in-time subtask-mode session scopes it later.

**Then front-load the executor skills' inputs — only when the breakdown has more than one subtask**, since
that is what makes a later session execute it blind. Go through every `[agent]` leaf that will run a project
skill (`add-new-page`, `add-api-resource`, `add-env-var`, …): **open that skill and run its user-facing
interview now** (e.g. `add-new-page` Step 0), from the skill's current text — don't work from memory of its
questions. The answers are recorded with the subtask in its own `spec.md`, so `implement-task` never stops
to ask. A single-subtask task skips this entirely: this session runs the skill itself, so it can just ask
as it goes.

## Step 4 — Send open questions

Route every question the session couldn't answer to the person who owns it.

1. Group them by owner.
2. Pick each group's destination. Ask whether the task has a **dedicated Slack channel** only when the
   breakdown came out as several subtasks — big features often get one, and it changes the routing;
   otherwise assume there is none.
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
5. Send (`slack_send_message`), then keep each thread's permalink for the question's spec entry.

If the Slack MCP tools are unavailable, record the questions with owners anyway and tell the user to route
them manually.

Outreach is complete when every question has a recorded permalink — or an explicit note that the developer
routes it manually.

## Step 5 — Hand off

**One subtask** — this session finishes the job. Create the feature branch (`issue-<number>` off `main`)
with the developer's approval, implement the work, and hand off to the `create-pr` skill, which writes the
reasoning from this conversation into the PR description. No spec is written: nothing is being handed to a
session that wasn't in the room. If a `pending` question blocks the work, wait for the reply and pick the
implementation back up in this same session — and write a spec instead only if the developer asks for one,
which is worth doing when the work will sit before it starts.

**Several subtasks** — invoke the **`to-spec`** skill. It writes the `spec.md` index plus every subtask
folder, records the Slack permalinks from Step 4, and walks the developer through branch, first commit, and
the draft PR.
