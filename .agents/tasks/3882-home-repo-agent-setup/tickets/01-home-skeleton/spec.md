# 01 — Home skeleton and children list

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | none |

## What to build

Turn the prototype repository into the home repo. A session started at the home root, with `frontend`
cloned inside it, loads home's always-loaded instructions, home skills and home path-scoped rules; reads
`frontend`'s own instructions and rules when a `frontend` file is read; and reaches files inside the
child with search. The set of children is one committed list, and a bootstrap script clones them, so the
local layout can be rebuilt from a bare home clone.

Child skills are not part of this ticket (ticket 02), nor are hooks (tickets 03, 04).

## Acceptance criteria

- [ ] The prototype's top-level `skills/` and `rules/` live under `.agents/`, reached by Claude Code and
  Cursor through symlinks, with a root always-loaded instructions file — the pattern `frontend` uses.
- [ ] `check-github-cli` and `slack-file` are gone from home.
- [ ] One committed children list holds each child's name and repository URL; `frontend` is its only entry.
- [ ] The bootstrap script clones every listed child that is missing (shown in a scratch directory) and
  is a no-op when all are present.
- [ ] The git ignore file and the search ignore file agree with the children list, and a check fails when
  they do not.
- [ ] Home's instructions define the **active child** as the parent spec does ("Working in a child from
  home").
- [ ] In a headless session at the home root: home instructions, a home skill and a home path-scoped rule
  load; reading a `frontend` file loads `frontend`'s instructions and matching rules; a search from the
  root finds a string that exists only inside `frontend`.
- [ ] The README no longer describes the submodule mount. (The setup section is ticket 11.)

## Details

- The repository is renamed from `frontend-devkit` by the developer before any other leaf; package name
  and README follow the new name.
- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- The local home clone is a fresh directory with a fresh `frontend` clone inside it. Because the session
  has to start inside that `frontend` clone, the developer makes both clones by hand before the agent
  leaves; the bootstrap script is then verified as a no-op on this layout and against a scratch directory
  for a missing child. The existing `frontend` clone and its worktrees are not touched.
- The probe notes (`.ai/handoffs/2026-11-13-home-repo-probes.md` in the main developer's notes) hold the
  search-ignore fix and the instruction-loading evidence to reproduce.

## Leaf worklist

- [ ] 1 `[human]` Rename `blockscout/frontend-devkit` to `blockscout/frontend-home`
- [ ] 2 `[human]` Clone home into a fresh directory, clone `frontend` inside it, check out `issue-3882` there
- [ ] 3 `[agent]` Restructure to `.agents/` with provider symlinks and root instructions; drop the two Honk-owned skills
- [ ] 4 `[agent]` Children list, bootstrap script, ignore files and their consistency check
- [ ] 5 `[agent]` Active-child section in home's instructions
- [ ] 6 `[agent]` Verify the bootstrap script, and loading and search from a headless home session
