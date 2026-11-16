# 02 — Child skills in home sessions

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T01 |

## What to build

A session started in home lists and runs every `frontend` skill under the name it has in a `frontend`
session, from the first turn. Home reaches a child's skills through committed symlinks in its skills
directory, one script writes those links from the children list, and the same script in check mode fails
when the links and the child's skills disagree (requirement 11).

This holds at the home root, in a task worktree (where a link resolves to the worktree's own child, so
the skills are the branch's), in a worktree-isolated subagent, and in a headless run. Cursor sessions are
not a bar.

## Acceptance criteria

How to verify: start `claude` at the home root and type `/implement-ticket`.

- [x] Home's skills directory holds one symlink per child skill, named as the skill with no prefix, with
  a relative target into the child's skills directory.
- [x] A child skill whose name home owns as a real directory has no link; home's copy is the one that
  loads.
- [x] One script writes the links from the children list and each child's skills. Run with nothing to
  change, it changes nothing.
- [ ] `pnpm lint:skill-links` fails, naming the entry, on each of: a child skill with no link, a link
  with no target, a link for a name home owns, a link whose target is not the expected relative path.
- [x] The Checks workflow runs the check after the children are cloned.
- [x] In a headless session at the home root, the first turn's listing has every linked skill; a
  model-invocable one (`add-env-var`) loads through the skill tool from the child; a user-only one
  (`implement-ticket`) is listed as a command; `update-glossary` loads from home.
- [x] The same holds in a task worktree, with the loaded skill's base directory inside the worktree's
  child, and a worktree-isolated subagent started there loads a child skill.
- [x] A session in a home clone with no child starts without a skill error and lists home's own skills.
- [x] Home's instructions and its instruction-set README say that a symlinked skill belongs to the child
  it points into, and is edited and committed there.
- [x] `(human)` In an interactive session at the home root, typing `/implement-ticket` runs the skill.

## Details

- **Deviation from the parent spec.** The parent spec says the links are prefixed with the child's name.
  They are not: Claude Code lists a linked skill under the link's name, so a prefix would put
  `/frontend-implement-ticket` in the menu while skills and playbooks name `implement-ticket`. Names that
  clash between two children are left to phase 2. Evidence is in [`notes.md`](notes.md).
- **Why links.** The re-probe the parent spec asked for failed: nested discovery does not reach a
  gitignored child, the additional-directories setting loads no skills, and the launch flag that does
  load them cannot be committed. A link made by a session-start hook is missed by that session, so the
  links are committed, not generated at session start.
- **Fallback, not built.** If committed links prove a burden in daily use, the same script can run at
  bootstrap and at worktree creation with the links gitignored. Friction goes into the phase 1 exit log
  and the choice is revisited when phase 2 is planned.
- **Accepted for phase 1.** When a `frontend` pull request adds, renames or removes a skill, home goes
  red only on its own next push or pull request. Until then the skill is missing in home sessions.
- The check compares against the child checkout that is present: `main` in CI, whatever branch is
  checked out locally. It is run by hand and in CI, never from a session hook, because a child branch
  that adds a skill would fail it.
- "Home owns the name" means home has a real directory of that name. The frozen marker of ticket 08 is
  not read, so this ticket does not wait for it.
- The script reads the children through the one parser of the children list, as the other scripts do.
- The check that no skill error appears in a child-less clone is also the tripwire for the fallback
  above: if Claude Code objects to dangling links, record it in `notes.md` and stop for the developer.
- Ticket 03's hook may not exist yet. Build the task worktree for the verification by hand (a home
  worktree with a `frontend` worktree inside it) and remove both afterwards, with their branches.
- The developer's personal `grilling` skill shadows home's on this machine. Use `update-glossary` for
  the home-wins check.
- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session. The work is committed in home, on a
  branch of its own with a pull request that links the issue. The leaf boxes and the `progress.md` tick
  are the only changes committed in `frontend`.

## Leaf worklist

- [x] 1 `[agent]` The link script with its check mode, the `lint:skill-links` command and the CI step
- [x] 2 `[agent]` Write and commit the links; the ownership sentence in home's instructions and README
- [x] 3 `[agent]` Verify headless: home root, a hand-made task worktree, an isolated subagent, a child-less clone
- [x] 4 `[human]` Type `/implement-ticket` in an interactive session at the home root
