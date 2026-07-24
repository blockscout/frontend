# <Task title>

| | |
| --- | --- |
| Issue | <GitHub issue URL, or "—" for ad-hoc specs> |
| Status | `draft` \| `ready` \| `in progress` \| `done` |
| Size | `small` \| `medium` \| `large` |
| Feature branch | `<branch name>` (set on first `implement-task` run) |
| PM | <name> |
| Designer | <name> |
| Backend | <name> |
| Slack channel | <#feature-channel if the task has one; otherwise "—" (default routing per `to-spec`)> |

<!-- People default from `.agents/TEAM.md`; override here per task. -->

<!-- SUBTASK SPECS reuse this same template, at `subtasks/<NN>-<slug>/spec.md`, with two header changes:
swap the Issue row for `Parent spec | [../../spec.md](../../spec.md) — step <N> of #<issue>`, and add a
`Sub-branch | issue-<N>-step-<N>` row. The Status vocabulary is the same as a main spec's
(`draft | ready | in progress | done`). A subtask that hasn't been scoped yet has NO `spec.md` at all —
only a `brief.md` in its folder (the handoff from the initial grilling session); the just-in-time subtask
session reads that brief and writes this `spec.md`. People rows inherit from the parent unless a subtask
overrides one. -->

## Context & goal

<!-- The "why" and the user-facing outcome. A couple of paragraphs, no more. -->

## Functional requirements

<!-- User stories / testable statements. What the feature must do, not how it looks. -->

## Data & API

<!-- Endpoints with sample responses (curl-verified), which `service:name` resources exist vs. must be
added, pagination/sorting/filtering params, env vars / feature flags, API readiness (deployed vs.
staging-only) and the backend release version that ships the changes (for release-notes reference). -->

## UI inventory

<!-- Affected pages/tabs/components: routes, navigation entry points, cross-links to existing entity
pages. One Figma node link per screen. Behavioral facts only — never visual/styling prose; appearance
belongs to the mockups and the [human] style subtasks. -->

## Out of scope

<!-- Explicit non-goals, so agents don't wander. -->

## Task breakdown

<!-- Ordered checklist. The checkbox is the ONLY per-subtask state the spec tracks — done or not.
Readiness is NOT recorded here; it lives in each subtask spec's Status and is inferred from there.

MAIN spec of a medium/large task = a slim INDEX. One line per subtask, no inputs, no changelog — the
detail lives in the subtask's own `subtasks/<NN>-<slug>/spec.md`:

  - [ ] 1 `[agent]` <plain-language subtask title> → `subtasks/01-<slug>/`
  - [ ] 2 `[human]` <plain-language subtask title> → `subtasks/02-<slug>/`

LEAF worklist (a small task's single spec.md, or the breakdown inside a subtask spec) = the actual
steps. Tag each `[agent]`/`[human]` per `.agents/rules/delegation.mdc`; reference the executing skill;
list blocking question ids (the step may not start while any is `pending`); and record the executor
skill's interview answers as an indented `inputs:` list, so `implement-task` never stops to ask. A UI
component is two linked leaves (scaffold → style). Keep each completion note to ONE line — no changelog
blocks; fold durable decisions into the sections above and let git and the PR be the record of what
changed. -->

- [ ] 1 `[agent]` <title> — skill: `add-api-resource` — questions: Q2
  - inputs:
    - <executor-skill answer>
- [ ] 2 `[human]` Style <component> to mockup — [Figma](<node URL>)

## Open questions

<!-- One entry per question. Status is the gate `implement-task` checks. The Slack permalink is recorded
when the question is sent, so answers can be harvested later. When resolved, fold the decision into the
section above that it affects AND record it here. -->

### Q1 — <question>

- Owner: <role> (<name>)
- Status: `pending` \| `resolved` \| `waived`
- Slack: <permalink, once sent>
- Answer: <decision + date, once resolved>
