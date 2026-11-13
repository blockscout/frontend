# 03 — Worktree creation and session hooks

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T01 |

## What to build

Starting a named worktree session from home gives a usable task worktree: a home worktree with the right
child worktree inside it, the child's worktree-include files copied in, dependencies installed on the
first command that needs them, and each child fetched at session start. The same creation logic serves a
worktree session from the command line, entering a worktree mid-session and a worktree-isolated subagent,
and such a subagent is told at its start to read the active child's always-loaded instructions. Home's
project settings carry all of it, plus the Playwright MCP configuration.

Cleanup of worktrees is ticket 04.

## Acceptance criteria

- [ ] A name of the form `<child>-<rest>` creates a task worktree containing only that child, on a new
  branch `<rest>` cut from the child's remote main branch.
- [ ] When several child names prefix the worktree name, the longest wins.
- [ ] Any other name mirrors every child present in the directory the session runs in, each from that
  copy's `HEAD`.
- [ ] Starting a session with the name of an existing task worktree reopens it instead of failing.
- [ ] The hook reads children from the committed children list, clears inherited git environment
  variables before calling git in another repository, and prints a normalised absolute path.
- [ ] A new task worktree's child contains the files the child lists for copying into worktrees.
- [ ] All three entry points produce the same result; a subagent started inside a task worktree gets the
  same children as its parent session.
- [ ] In a task worktree, the first command that needs dependencies installs them in the child.
- [ ] A session start at home fetches every child.
- [ ] A worktree-isolated subagent's start context names the active child's always-loaded instructions
  file to read.
- [ ] Home has the Playwright MCP configuration `frontend` has.
- [ ] The creation logic's branches (prefix, longest prefix, mirror, reopen) are covered by a scripted
  test against scratch repositories.

## Details

- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- Start from the probed creation script in `.ai/handoffs/2026-11-13-home-repo-probes.md` (main
  developer's notes); its reading of the gitignore file is replaced by the children list.
- The dependency-install hook is `frontend`'s `worktree-deps.sh`, adapted to a child sitting inside a
  home worktree. `frontend` keeps its own copy and settings unchanged; the duplication is accepted.
- Reopening an existing task worktree and the subagent-start pointer have not been probed: probe each first and
  record the result in this folder's `notes.md`.
- A task worktree is two branches: the home branch named after the worktree and the task branch in the
  child. The home branch never gets a pull request.

## Leaf worklist

- [ ] 1 `[agent]` Probe reopening an existing task worktree and the subagent-start hook; record in `notes.md`
- [ ] 2 `[agent]` Worktree-creation hook with worktree-include copy, and its scripted test
- [ ] 3 `[agent]` Home settings: creation hook, fetch per child, adapted dependency-install hook, subagent-start pointer, Playwright MCP
- [ ] 4 `[agent]` Verify the three entry points and the dependency install in the real home clone
