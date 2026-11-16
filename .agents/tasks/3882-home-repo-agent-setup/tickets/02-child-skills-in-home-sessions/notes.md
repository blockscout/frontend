# 02 — Probe findings

Probe of 2026-11-16 in the real home clone, Claude Code 2.1.325, headless sessions at the home root. The
evidence was the first `init` event of each stream, which lists the session's skills and commands. The
raw streams lived in a session scratchpad and are gone.

| Check | Result |
| --- | --- |
| Child skills after reading a child file (nested discovery) | Fail: `Unknown skill`. In a scratch repo the same works for a tracked nested directory and fails for a gitignored one |
| `--add-dir frontend`, relative or absolute | Pass from the first turn, all 30 skills. A name home also has is listed as `frontend:<name>`; the bare name loads home's copy |
| `permissions.additionalDirectories` passed through `--settings` | Fail. The skills documentation says the setting "grants file access only" |
| The same key in home's committed project settings | Not tested, it needs an edit in home. The documentation says it loads no skills |
| Symlink named `frontend-add-env-var` | Listed under the link's name only. The frontmatter name is not listed, though the skill tool accepts it |
| Two links to one skill | The second is dropped: skills are deduplicated by target |
| Link created by a `SessionStart` hook | Not listed and not invocable in that session's first turn. The next session has it |
| Symlinked skill with `disable-model-invocation` | Listed as a command; the skill tool refuses it, as designed |

Not tested: a typed slash command in an interactive session, `/add-dir` mid-session, `--add-dir` together
with `--worktree` or in a subagent.

## For phase 2

- A linked skill is named by its link, not by its frontmatter. Two children with a skill of the same
  name therefore need different link names, and every reference to the bare name then misses one of them.
- `--add-dir` already solves that clash with a directory-scoped name (`frontend:add-env-var`), at the
  cost of a launch flag at every entry point.
- In a task worktree that holds one child, links into any other child have no target.
