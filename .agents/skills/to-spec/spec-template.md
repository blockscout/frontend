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

<!-- Ordered. Tag each subtask `[agent]` or `[human]` per `.agents/rules/delegation.mdc`. Reference the
executing skill where one applies. A subtask blocked by open questions lists their ids — it may not start
while any of them is `pending`. In a large task, a big step gets a one-line entry here plus its own
sub-spec (written just-in-time via a `grill-the-task` subtask session); a UI component is two linked
subtasks (scaffold → style). Record the executing skill's interview answers (collected during grilling)
as an indented `inputs:` list under the subtask, so `implement-task` never has to stop and ask. -->

- [ ] 1 `[agent]` <title> — skill: `add-api-resource` — questions: Q2
- [ ] 2 `[agent]` <big step title> — sub-spec: `subtasks/02-<slug>.md`
- [ ] 3 `[human]` Style <component> to mockup — [Figma](<node URL>)

## Open questions

<!-- One entry per question. Status is the gate `implement-task` checks. The Slack permalink is recorded
when the question is sent, so answers can be harvested later. When resolved, fold the decision into the
section above that it affects AND record it here. -->

### Q1 — <question>

- Owner: <role> (<name>)
- Status: `pending` \| `resolved` \| `waived`
- Slack: <permalink, once sent>
- Answer: <decision + date, once resolved>
