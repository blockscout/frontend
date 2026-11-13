# 11 — ADR, setup section and housekeeping

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 11 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T02, T03, T04 |

## What to build

The decision to replace the submodule design with the home repo is recorded as an ADR in home, and home
has a setup section sufficient for the main developer to rebuild the local layout from nothing. The
issue and the prototype's leftovers say the same thing the repositories now do.

## Acceptance criteria

- [ ] An ADR in home, following home's `adr` rule, records the decision: the submodule design and why it
  was dropped, the home repo pattern, and the costs accepted for phase 1 (frozen copies, the double rule
  load, duplicated settings).
- [ ] Home's setup section takes a machine with nothing to a working layout: clone, bootstrap, what the
  hooks do, how to start a task worktree by name, how worktrees are cleaned up, and how child skills
  reach a home session (as ticket 02 settled it).
- [ ] The setup section is checked by following it into a fresh directory.
- [ ] The issue body describes the home repo design, with the prototype's result kept as a short
  superseded note.
- [ ] Pull request #3883 is closed unmerged, and the prototype branch in the second consumer is deleted.

## Details

- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- The setup section is for the main developer; the written guide for others is phase 2.
- The ADR lives in home, not in `frontend`'s records index.
- The two-week usage log (missing skills, wrong-directory commands, stale worktrees) is an exit criterion
  of the phase, not of this ticket; the setup section says where the log is kept.

## Leaf worklist

- [ ] 1 `[agent]` Write the ADR
- [ ] 2 `[agent]` Write the setup section and verify it in a fresh directory
- [ ] 3 `[agent]` Rewrite the issue body
- [ ] 4 `[human]` Close #3883 unmerged; delete the prototype branch in the second consumer
