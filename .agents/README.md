# Agent configuration

The shared instruction set for the coding agents used in this repo. Every document has one source of truth
here; each tool reads it through its own directory via symlinks.

| Path | What it is | Reached by |
|---|---|---|
| `AGENTS.md` | Always-loaded project context | `.claude/CLAUDE.md` → here; Cursor reads `AGENTS.md` natively |
| `rules/*.md` | Coding rules, scoped to file patterns | `.claude/rules/` and `.cursor/rules/` — see below |
| `skills/*/SKILL.md` | Workflows loaded on invocation | `.claude/skills/` → here |
| `delegation.md`, `GLOSSARY.md`, `TEAM.md`, `slack-thread.md`, `slack-message.md`, `honk.md` | Read on demand, by pointer from `AGENTS.md` or a skill | — |
| `tasks/` | Product-task specs — see `tasks/README.md` | — |

Cross-references between all of these are machine-checked: `pnpm lint:doc-links`.

## Frozen copies

Some skills and rules have moved to the home repo, `blockscout/frontend-home`, which shares them with the
other frontend repositories. Each one is still here as a **frozen copy**, so a session started inside this
repo has it under the same name. A frozen copy opens with a `Frozen copy` note naming its home original.

| Kind | Frozen copies |
|---|---|
| Skills | `grilling`, `update-glossary`, `review-loop`, `review-changes`, `resolve-review` |
| Rules | `adr`, `docs`, `typescript`, `code-quality`, and the general half of `tests-unit` |

- **Edit the home original, never the copy.** A change made only here is lost when the copies are removed,
  and until then the two versions disagree depending on where the session started.
- **A home change reaches sessions started here only when it is copied over by hand**, with the note kept.
  A rule's `description`, `paths` and `globs` and a skill's `name` and `description` stay as they are here.
- **The review trio differs from home on purpose.** Home's versions take the repository under review as a
  `--child` parameter. The copies here have none and work on the current checkout, so that part is not
  copied over.
- **`tests-unit` is frozen in part.** Its general half is home's. The description of this repo's Vitest
  setup is `vitest/CONTEXT.md`, which is not a copy and is edited here.
- **`typescript` and `code-quality` each have a local rule.** What this repo adds to the home rule or does
  differently is `rules/typescript-local.md` and `rules/code-quality-local.md`. They are not copies and are
  edited here. Local content never goes into the frozen copy, because a home session skips that file.
- **`review-changes` and `review-loop` have local parts.** What this repo adds to a file of the home skill
  is the `<file>-local.md` beside its frozen copy: `SKILL-local.md`, `smells-local.md` and
  `prose-smells-local.md` in `skills/review-changes/`, and `ci-fixes-local.md` in `skills/review-loop/`.
  They are not copies and are edited here. Only a home session reads them. The frozen copies still carry
  the same content and are not kept in step.

## The rules contract

Claude Code and Cursor discover rules differently and neither reads the other's format, so a rule file
carries frontmatter for **both**; each tool ignores the keys it doesn't recognise.

```yaml
---
description: what this rule covers
paths:                        # Claude Code — YAML list of globs
  - "**/*.{ts,tsx}"
globs: "**/*.ts,**/*.tsx"     # Cursor — the same patterns, comma-separated in one string
alwaysApply: false
---
```

Keep the two in sync by hand. If they drift, the tools disagree about when the rule applies and nothing
warns you.

Two constraints that are easy to get wrong:

- **A new rule needs a new symlink.** Cursor reads only `.cursor/rules/*.mdc`, so a rule without one there
  is invisible to it. Claude Code needs no per-file step, because `.claude/rules` is a directory symlink.

  ```bash
  ln -s "../../.agents/rules/<name>.md" ".cursor/rules/<name>.mdc"
  ```

- **A rule with no `paths` loads at launch, in every session.** That is why `delegation.md` and this file sit
  outside `rules/`: a document placed in there would silently become permanent context. Anything meant to be
  read on demand belongs outside `rules/`, with a pointer to it from `AGENTS.md` or a skill.

To check what actually loaded in a session, run `/context` in Claude Code and look under **Memory files**.
