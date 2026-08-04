# Bugbot PR Review Rules

In addition to the regular bug-finding process, check the following aspects in the code changes introduced by the Pull Request.

## 1. Design System & Theming

See `.agents/rules/design-system.md`.

## 2. TypeScript

See `.agents/rules/typescript.md`.

## 3. Code Quality

See `.agents/rules/code-quality.md`.

## 4. Environment Variables

See `.agents/rules/env-vars.md`.

## 5. Testing

- Unit tests: See `.agents/rules/tests-unit.md`.
- Visual component tests: See `.agents/rules/tests-visual.md`.

## 6. Code smells

See `.agents/skills/review-changes/smells.md` — thirteen smells, each a judgement call, each overridden by
anything the rules files above document.

When the change touches the agent instruction surface instead of code — `.agents/`, `AGENTS.md`, any
`CONTEXT.md`, `.cursor/` — use `.agents/skills/review-changes/prose-smells.md` in its place. Those files are
code that runs on an agent, and none of the thirteen above apply to them.

## 7. Not findings

See the **Out of bounds** section of `.agents/skills/review-changes/SKILL.md`. Most importantly: styling and
visual judgements belong to a human, a `TODO (design):` marker is a scaffold working as designed, and a style
preference with no rule or precedent behind it is not a finding.
