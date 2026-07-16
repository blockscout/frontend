---
name: grill-the-task
description: >-
  Grill a product task (GitHub issue) into an implementable spec — research first, then a
  one-question-at-a-time interview; also elaborates sub-specs for big steps of large tasks.
disable-model-invocation: true
---

# Grill the task

Product task issues arrive thin — a title and a couple of links. This skill closes the gap: research
everything researchable, then grill the developer about everything that is a *decision*, tracking what they
can't answer as open questions for the responsible people. The output is a spec, written by the `to-spec`
skill.

**Two modes.**

- **Task mode** (default): input is a GitHub issue URL; output is the task's main spec.
- **Subtask mode**: input is an existing spec plus a step number (a big step of a `large` task); the session
  scopes research and questions to that step and outputs its sub-spec (`subtasks/<NN>-<slug>.md`). Run it
  just-in-time, right before the step starts, against the by-then-current code.

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
   stays with the mockups and the `[human]` style subtasks (see `.agents/rules/delegation.mdc`). If the Figma
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

## Step 2 — Classify the size

Propose a size to the developer and confirm it:

- **small** — one step; implementable by an agent or a user right after this session.
- **medium** — a flat list of small subtasks in one spec.
- **large** — many steps; the main spec lists them, small steps fully specified now, big steps as one-liners
  each getting its own subtask-mode grilling session later.

## Step 3 — The interview

**Invoke the `grilling` skill** and run the interview under its discipline: one question at a time with a
recommended answer, decisions put to the developer while facts are looked up, and no enactment (Step 4)
until shared understanding is confirmed. Skip anything the research already answered.

**Start by picking the task's contacts**: for each relevant team in `.agents/TEAM.md`, ask which member
owns this task (recommending the roster's default) — these go into the spec header. Don't ask what can be
inferred: when the issue's author maps to a roster member of the relevant team (match the GitHub handle in
`.agents/TEAM.md`), record them as that team's contact without asking — the PM slot in particular is
usually just the task's author. Ask about a **dedicated Slack channel** only for **large** tasks — big
features often get one, and it changes where open questions are sent (see the `to-spec` skill); small and
medium tasks always use the default routing (frontend channel or DMs), so record "—" without asking. When
the developer doesn't know an answer, don't press — record the question with the owning contact and move on.

Cover these domains:

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

Testing is **not** an interview domain — the standing policy in `.agents/rules/delegation.mdc` applies.

**Front-load the executor skills' inputs.** Once the task breakdown has taken shape, go through every
`[agent]` subtask that will run a project skill (`add-new-page`, `add-api-resource`, `add-env-var`, …):
**open that skill and run its user-facing interview now** (e.g. `add-new-page` Step 0), from the skill's
current text — don't work from memory of its questions. The answers are recorded with the subtask in the
spec, so `implement-task` can later execute without stopping to ask. Do this in whichever session fully
specifies the subtask: here for small/medium tasks and small steps, in the just-in-time subtask session for
big steps.

The interview is complete when every domain is covered or explicitly skipped as research-answered, the
contacts and channel are settled, every unanswered question has an owner, and every fully-specified
`[agent]` subtask has its executor skill's inputs collected.

## Step 4 — Hand off to `to-spec`

Invoke the **`to-spec`** skill. It writes the spec (or sub-spec, in subtask mode), tags subtasks
`[agent]`/`[human]` per the delegation boundary, and runs the open-question outreach (grouping by owner,
drafting Slack messages for the developer's approval, recording thread permalinks).
