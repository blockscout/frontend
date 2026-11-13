# 07 — Review trio from home against a named child

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T01, T03 |

## What to build

`review-loop`, `review-changes` and `resolve-review` are home skills that run from a home session against
a named child. One real `frontend` pull request goes through a full review loop started from home:
rounds, the resolver, the CI wait and the report.

## Acceptance criteria

How to verify: from a task worktree in the home clone, run `review-loop` against an open `frontend` pull
request and follow it to its report.

- [ ] The three skills, with their supporting files and the `code-reviewer` agent definition, are in home
  and current with `frontend`'s versions apart from the child parameter.
- [ ] Each of the three takes the child as a parameter; it defaults to the active child and is asked for
  when that is ambiguous.
- [ ] Everything that reads the current branch's pull request, the tree state or runs `gh` does so in the
  named child, not in the home worktree.
- [ ] The Cursor reviewer is launched from the home worktree root; if the skill invocation does not
  attach from there, the launch uses Cursor's workspace or additional-directory option, and the skill
  text says which one was needed.
- [ ] Paths the skills hand to a reviewer or resolver (the spec, review files, the delegation boundary)
  resolve in the child.
- [ ] `(human)` One real `frontend` pull request completes a full review loop started from home, with at
  least one finding resolved and pushed.

## Details

- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- These three are the exception to the active-child convention because they launch other processes; the
  other moved skills take no parameter.
- The frozen copies in `frontend` keep working without a parameter for sessions started there (ticket 08).
- Problems found during the real loop are fixed in this ticket; anything that is not a skill-text change
  is recorded in `notes.md`.

## Leaf worklist

- [ ] 1 `[agent]` Bring the trio and the agent definition to home; add the child parameter throughout
- [ ] 2 `[agent]` Cursor reviewer launch from the home worktree root, with the fallback if needed
- [ ] 3 `[human]` Pick an open `frontend` pull request and start the loop from home
- [ ] 4 `[agent]` Fix what the real loop surfaces
