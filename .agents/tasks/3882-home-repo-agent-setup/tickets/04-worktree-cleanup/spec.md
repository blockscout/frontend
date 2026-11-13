# 04 — Worktree cleanup

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T03 |

## What to build

Task worktrees do not accumulate. At session start, a task worktree whose child branch is proven landed
and that has been idle is removed together with its child worktree, the child branch and the home
worktree branch. Removing a worktree at an interactive session's exit removes the same four things.
Anything unproven is reported, never deleted.

## Acceptance criteria

- [ ] The prune hook uses the proof `frontend`'s `worktree-prune.sh` uses (ancestor of the base branch,
  or a merged pull request whose head is the branch tip; an open pull request keeps the branch) and its
  idle window, applied to the child branch.
- [ ] A proven, idle task worktree loses all four: child worktree, child branch, home worktree, home
  worktree branch.
- [ ] An unproven worktree is listed in the hook's report and left intact; any GitHub failure resolves to
  keep.
- [ ] A mirrored worktree with several children is removed only when every child branch is proven.
- [ ] The removal hook, on an interactive exit, removes the same four things for that worktree.
- [ ] Both hooks clear inherited git environment variables before calling git in another repository.
- [ ] The prune decisions are covered by a scripted test against scratch repositories.

## Details

- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- The removal hook never fired in the headless probe, and its input field name in the probed script is a
  guess. Probe it in an interactive session first and record the input shape in `notes.md`.
- The removal hook covers only an interactive exit, leaving a worktree mid-session and deleting a
  background session. The prune hook is the real cleanup mechanism.
- `frontend` keeps its own prune hook unchanged.

## Leaf worklist

- [ ] 1 `[human]` Exit an interactive home worktree session with a logging removal hook installed, so the hook input is captured
- [ ] 2 `[agent]` Removal hook from the captured input shape
- [ ] 3 `[agent]` Prune hook adapted to two-branch task worktrees, with its scripted test, wired into home's session start
