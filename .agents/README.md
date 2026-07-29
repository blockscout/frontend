# Agent configuration

The shared instruction set for the coding agents used in this repo. Every document has one source of truth
here; each tool reads it through its own directory via symlinks.

| Path | What it is | Reached by |
|---|---|---|
| `AGENTS.md` | Always-loaded project context | `.claude/CLAUDE.md` → here; Cursor reads `AGENTS.md` natively |
| `rules/*.md` | Coding rules, scoped to file patterns | `.claude/rules/` and `.cursor/rules/` — see below |
| `skills/*/SKILL.md` | Workflows loaded on invocation | `.claude/skills/` → here |
| `delegation.md`, `GLOSSARY.md`, `TEAM.md` | Read on demand, by pointer from `AGENTS.md` or a skill | — |
| `tasks/` | Product-task specs — see `tasks/README.md` | — |

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
