# 02 — Child skills in home sessions (deferred)

Target repo: home (`blockscout/frontend-home`). Needs ticket 01 landed before the probe can run.

## Goal

Every `frontend` skill is listed and invocable from the first turn of a session started at the home root
(requirement 1), and home has a check that fails when its links to a child's skills do not match the
skills the child has (requirement 11) — unless the probe below makes links unnecessary.

## Known context

- The earlier probe: skills in a gitignored child were not discovered (`Unknown skill`), while a skill
  symlinked into home's skills directory was listed, invocable, and resolved to the worktree's child
  inside a task worktree. Evidence: `.ai/handoffs/2026-11-13-home-repo-probes.md` in the main developer's
  notes.
- Planned shape if the probe fails again: committed symlinks from home's skills directory, prefixed with
  the child's name, read from the children list, plus the link check.
- Frontmatter skill names must stay unique across home and children.

## Blocking unknowns

| Unknown | Owner | How it is settled |
| --- | --- | --- |
| Does documented nested discovery (skills in a subdirectory load once a file there is read, or when the directory is added to the session) work for a gitignored child and list its skills from the first turn? | main developer | Probe in the real home clone, after ticket 01 |
| Does a frozen copy in the child collide with the home skill of the same name? | main developer | Same probe, with one skill present in both |

If nested discovery meets requirement 1, the links and the check are dropped and this ticket shrinks to
whatever configuration turns discovery on. Otherwise it is the symlinks plus the link check.
