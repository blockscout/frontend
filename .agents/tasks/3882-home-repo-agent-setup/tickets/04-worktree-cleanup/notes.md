# 04 — Probe findings

## The removal hook's input

Probe of 2026-11-16, Claude Code 2.1.325. An interactive session started from the home root with
`claude --worktree frontend-probe-remove`, exited with removal chosen, and a logging `WorktreeRemove` hook
in the user settings.

```json
{
  "session_id": "a527566a-…",
  "transcript_path": "/Users/…/.claude/projects/-…-frontend-home--claude-worktrees-frontend-probe-remove/a527566a-….jsonl",
  "cwd": "<home>/.claude/worktrees/frontend-probe-remove",
  "scratchpad_dir": "/private/tmp/claude-501/-…-frontend-home/a527566a-…/scratchpad",
  "prompt_id": "d6aee07c-…",
  "hook_event_name": "WorktreeRemove",
  "worktree_path": "<home>/.claude/worktrees/frontend-probe-remove"
}
```

| Check | Result |
| --- | --- |
| Field that names the worktree | `worktree_path`, the absolute path the creation hook printed. The probed script's guess was wrong |
| `cwd` | The worktree itself, so the hook starts inside the directory it removes |
| `CLAUDE_PROJECT_DIR` | The worktree: the hook that runs is the worktree's copy of the script |
| Inherited git variables | None in this run. The hook clears them regardless |
| A hook that exits 0 without deleting | The worktree counts as removed and stays on disk with both branches. Claude Code does nothing itself once a removal hook exists |

Not probed: leaving a worktree mid-session with `ExitWorktree`, and deleting a background session. The
hooks reference gives both the same input.

## What the hooks reference adds

Read the same day (https://code.claude.com/docs/en/hooks#worktreeremove). These shaped the hook:

- Claude Code looks for changed or untracked files with git in the path the creation hook returned, which
  is the home worktree. A child's uncommitted work and commits not yet pushed are invisible to it.
- At the exit of an unnamed session with a clean home worktree it runs the removal hook **without
  prompting**. `ExitWorktree` with `discard_changes: true` does not prompt either. The reference says to
  check for work in the hook before deleting anything.
- A non-zero exit with the directory still present means the removal failed and the worktree stays, with
  no git fallback. The hook's JSON output is discarded, so stderr is its only voice.
- Claude Code never deletes a branch of a hook-created worktree, and never runs the removal hook for a
  subagent's worktree.

## Decisions taken in the leaves

- **The removal hook applies the prune proof**, without the idle window. Because the hook can run
  unprompted, removing unconditionally would delete a child's unlanded work at an ordinary exit. An
  unproven worktree stays, the hook exits 1 and the next session-start report lists it. The cost: choosing
  "remove" at the prompt does not discard unlanded work; that is done by hand.
- **One proof beyond `frontend`'s.** A mirrored worktree is cut from its parent's `HEAD`, rarely on main,
  and a subagent's mirror never gets a pull request, so under `frontend`'s proof alone every isolated
  subagent would leave a worktree for good. A child branch is also proven when GitHub knows no open pull
  request for it and its tip is on another branch of the child, its own remote copy excluded. When GitHub
  does not answer, it is kept.
- **The home branch** is proven when the home worktree's commit is on another home branch. It never gets a
  pull request, so there is nothing else to ask.
- **Pruning runs from the main home clone only**, as `frontend`'s does. A session started in a task
  worktree runs that worktree's older copy of the hook and prunes nothing.
- A child's main branch is never deleted, whatever worktree had it checked out.

## Verification in the real home clone

| Check | Result |
| --- | --- |
| The removal hook fed the captured input, run from inside the leftover probe worktree | Exit 0. Child worktree, child branch `probe-remove`, home worktree and home branch `frontend-probe-remove` all gone, the main clones untouched |
| `prune` at the home root before that | The probe worktree reported as `landed but active within 3d` and left intact, in 0.3 s with no GitHub call |

Not verified in a live session: the two hooks as wired in home's settings. The scripted test covers the
decisions; the first real exit and session start after this lands cover the wiring.
