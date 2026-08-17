# <Task title>

| | |
| --- | --- |
| Issue | <GitHub issue URL, or "—" for ad-hoc specs> |
| Status | `draft` \| `ready` \| `in progress` \| `done` |
| Feature branch | `<branch name>` |
| PM | <name> |
| Designer | <name> |
| Backend | <name> |
| Minimum API version | <API version(s) this task requires, e.g. "Core API v11.2.4+"; list several for a multi-service raise; "—" if none> |
| Slack channel | <#feature-channel if the task has one; otherwise "—" (default routing per `grill-the-task`)> |

<!-- People default from `.agents/TEAM.md`; override here per task. Subtask specs use
`subtask-template.md` and inherit these rows. -->

## Context & goal

<!-- The "why" and the user-facing outcome. A couple of paragraphs, no more. -->

## Functional requirements

<!-- What the feature must do at task level, as testable statements. Per-subtask detail belongs to that
subtask's acceptance criteria, not here. -->

## Data & API

<!-- Endpoints with sample responses (curl-verified), which `service:name` resources exist vs. must be
added, pagination/sorting/filtering params, env vars / feature flags, API readiness (deployed vs.
staging-only) and the backend release version that ships the changes (for release-notes reference). -->

## UI inventory

<!-- Affected pages/tabs/components: routes, navigation entry points, cross-links to existing entity
pages. One Figma node link per screen. State behavioral facts and placement; leave appearance to the
mockups and the [human] style leaves. When you must lean on existing code, point to it by component or
symbol name ("match `LogDecodedInputDataTable`") — never transcribe its values, class names, or line
numbers; those rot and the code owns them. Capture only a deliberate deviation and its reason. See "What a
spec holds" in `.agents/tasks/README.md`. -->

## Out of scope

<!-- Explicit non-goals, so agents don't wander. -->

## Task breakdown

<!-- A slim INDEX of vertical slices — one line per subtask, nothing else. No inputs, no leaf steps, no
changelog: that detail lives in the subtask's own `subtasks/<NN>-<slug>/spec.md`.

Each line carries exactly three things: the done checkbox (the ONLY per-subtask state this file tracks —
readiness is derived, never stored), the title, and the blocking edges. Numbers are identity, not order;
a new subtask is appended and its edges placed, never renumbered. See "The subtask model" in
`.agents/tasks/README.md`.

A deferred subtask links its `brief.md` instead, and is scoped just-in-time by a `grill-the-task` subtask
session. -->

- [ ] 01 <title> → [`subtasks/01-<slug>/`](subtasks/01-<slug>/spec.md) — blocked by: none
- [ ] 02 <title> → [`subtasks/02-<slug>/`](subtasks/02-<slug>/brief.md) — blocked by: 01

## Open questions

<!-- One entry per question. Status is the gate `implement-task` checks. The Slack permalink is recorded
when the question is sent, so answers can be folded in later. When resolved, fold the decision into the
section above that it affects AND record it here. A question scoped to one subtask lives in that subtask's
spec instead. -->

### Q1 — <question>

- Owner: <role> (<name>)
- Status: `pending` \| `resolved` \| `waived`
- Slack: <permalink, once sent>
- Answer: <the decision as a phrase, + date — the decision, not the deliberation; the Slack link holds the reasoning and any internal detail this public spec shouldn't carry>
