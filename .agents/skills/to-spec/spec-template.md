# <Task title>

| | |
| --- | --- |
| Issue | <GitHub issue URL> |
| Feature branch | `<branch name>` |
| PM | <name> |
| Designer | <name> |
| Backend | <name> |
| Minimum API version | <API version(s) this task requires, e.g. "Core API v11.2.4+"; list several for a multi-service raise; "—" if none> |
| Slack channel | <#feature-channel if the task has one; otherwise "—" (default routing per `grill-the-task`)> |

<!-- Header is static identity — no status row: task status is derived from `progress.md` (see
`.agents/tasks/structure.md`). People default from `.agents/TEAM.md`; override here per task. The spec body
below is immutable once written; only `progress.md` and `questions.md` change as work proceeds. -->

## Context & goal

<!-- The problem that the user is facing and solution to it, from the user's perspective. -->

## Functional requirements

<!-- What the feature must do, as verifiable feature-level statements. THIS is the whole-task review
contract. Write each one so its truth can be judged from the shipped behaviour. -->

## Data & API

<!-- Endpoints, which `service:name` resources exist vs. must be
added, pagination/sorting/filtering params, env vars / feature flags, API readiness (deployed vs.
staging-only) and the backend release version that ships the changes (for release-notes reference). -->

## UI inventory

<!-- Affected pages/tabs/components: routes, navigation entry points, cross-links to existing entity
pages. One Figma node link per screen. State behavioral facts and placement; leave appearance to the
mockups and the [human] style leaves. When you must lean on existing code, point to it by component or
symbol name ("match `LogDecodedInputDataTable`") — never transcribe its values, class names, or line
numbers; those rot and the code owns them. Capture only a deliberate deviation and its reason. See "What
the spec holds" in `.agents/tasks/concepts.md`. -->

## Implementation decisions

<!-- A list of implementation decisions that were made. This can include:
- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits. -->

## Out of scope

<!-- Explicit non-goals, so agents don't wander. -->
