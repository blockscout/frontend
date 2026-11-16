# 03 — Probe findings

Probe of 2026-11-16, Claude Code 2.1.325, headless sessions in a scratch home with one child (`kid`) cloned
from a bare remote. Every hook was wrapped in a logger that recorded its input, `CLAUDE_PROJECT_DIR` and
working directory. The scratch home lived in a session scratchpad and is gone.

## Reopening an existing task worktree

`claude -p --worktree kid-a` run twice from the home root.

| Check | Result |
| --- | --- |
| Second run with the name of an existing hook-created worktree | Claude Code runs `WorktreeCreate` again with the same `name` and enters the path the hook prints. It does not look for the worktree itself |
| Idempotent hook (prints the existing path, creates nothing) | Pass: the session starts in the existing worktree, both branches untouched |
| Hook input on the second run | Same shape as the first: `cwd` is the launch directory, `name` is the worktree name |
| `CLAUDE_PROJECT_DIR` in a `--worktree` session | The launch directory for `WorktreeCreate`, the worktree for `SessionStart` and every later hook. The hook scripts that run in the session are the worktree's copies |

So reopening is the hook's job. A hook that fails on an existing worktree makes the second start fail.

## The subagent-start hook

A session inside the task worktree `kid-a` spawned two `general-purpose` subagents, one with
`isolation: worktree` and one without. `SubagentStart` returned a marker line as `additionalContext`.

| Check | Result |
| --- | --- |
| Order for an isolated subagent | `WorktreeCreate` first (`name` is `agent-<agent_id>`, `cwd` is the session's directory), then `SubagentStart` |
| `SubagentStart` input | The common fields plus `agent_id`, `agent_type` and `prompt_id`. Nothing says whether the subagent is isolated |
| `cwd` in `SubagentStart` | The subagent's worktree for an isolated subagent, the session's directory for a plain one |
| `additionalContext` | Reaches both subagents, in the first user turn after the task text |
| Home instructions in the isolated subagent | Present, loaded from the parent session's worktree, not from the subagent's own |
| Child instructions in either subagent, with no file read | Absent |
| Children of the isolated subagent's worktree | `kid` only, as in its parent session |

The hook tells an isolated subagent apart by its `cwd`: the last path segment is `agent-<agent_id>`.

Not tested: a subagent that is resumed, a custom agent with `isolation: worktree` in its frontmatter, and
an agent-team teammate.

## Verification in the real home clone

Headless sessions of the same day, with the hooks committed on home's branch. The worktrees and branches
they made were removed afterwards.

| Check | Result |
| --- | --- |
| `--worktree frontend-t03-verify` from the home root | Home worktree with `frontend` only, on a new `t03-verify` at `origin/main` |
| The same command again, after a commit in the child | Reopened: the session starts in the worktree, the commit is the child's `HEAD` |
| `EnterWorktree` with `frontend-t03-enter`, mid-session at the home root | The same layout, `t03-enter` at `origin/main` |
| Isolated subagent from the home root | `frontend` on `agent-<id>` at the main clone's `HEAD` |
| Isolated subagent inside `frontend-t03-verify` | `frontend` only, at that worktree's child `HEAD` |
| Worktree-include | A file under the child's gitignored `.zed/` reached every worktree above, the subagent's through its parent's |
| Subagent-start pointer | The isolated subagent quoted the hook's context, read `frontend/.claude/CLAUDE.md` from its own worktree and answered from it |
| Dependency install | `cd frontend && pnpm exec tsc --version` as the first such command installed in the child and in the home worktree, then printed the version |
| Fetch at session start | The child's `FETCH_HEAD` was rewritten at the session's start |
| Playwright MCP | Listed as `connected`, source `project`, in the session's `init` event |
