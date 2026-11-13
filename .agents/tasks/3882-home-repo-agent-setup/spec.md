# Share the agent setup through a home repo, phase 1

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3882 |
| Feature branch | `issue-3882` |
| Demo | none |

## Context & goal

Part of this repository's agent setup (skills, rules) and the generic developer tools behind it are not
specific to this project and are wanted in the organisation's other frontend repositories. The first
design, a read-only git submodule mounted in each consumer, was prototyped and worked, but it needs
sync hooks on every git operation, three agent hooks for worktrees and a pointer bump for every skill
edit. It is superseded.

The replacement is the **home repo** pattern (https://www.aihero.dev/the-home-repo-pattern): one
repository holds the shared skills, rules, project settings and hooks; agent sessions start there; the
project repositories ("children") are cloned inside it and gitignored. A skill edit is then an ordinary
commit in the home repo, with no pointer. Probes showed the pattern works with git worktrees given one
worktree-creation hook.

Phase 1 puts the main developer's daily work on the home repo with `frontend` as the only child, and
moves a first small batch of shared content, so that the layout, the hooks and one adapted workflow
(`review-loop`) are proven in real use. People and automation that start sessions inside `frontend`
(the second developer, the Honk orchestrator, cloud sessions) must notice no change. Phase 2, planned
separately once the exit criteria below are met, onboards the second developer and the second consumer
and moves the rest.

Terms used below: **home** is the home repo, `blockscout/frontend-home` (the prototype's
`frontend-devkit`, renamed). A **child** is a project repository cloned inside it. A **task worktree**
is a home worktree with a child worktree inside it. A **frozen copy** is a skill or rule that has
moved to home but is left in `frontend`, marked as not to be edited there.

## Functional requirements

1. A session started at the home root has: home's always-loaded instructions, home skills, home
   path-scoped rules on a matching read, every `frontend` skill listed and invocable from the first
   turn, and `frontend`'s own instructions and rules when a `frontend` file is read. Search from the
   home root reaches files inside the child.
2. Starting a named worktree session from home with a name of the form `<child>-<rest>` gives a task
   worktree containing only that child, on a new branch `<rest>` cut from the child's remote main
   branch. Any other name mirrors every child present in the directory the session runs in. Starting
   a session with the name of an existing task worktree reopens it instead of failing.
3. The same creation logic serves all three entry points: a worktree session from the command line,
   entering a worktree mid-session, and a worktree-isolated subagent. A subagent started inside a task
   worktree gets the same children as its parent session.
4. A new task worktree's child receives the files the child lists for copying into worktrees, and its
   dependencies are installed on the first command that needs them, as they are today.
5. A worktree-isolated subagent is told, at its start, to read the active child's always-loaded
   instructions.
6. Task worktrees do not accumulate. A worktree whose child branch is proven landed (by the proof the
   existing prune hook uses) and that has been idle is removed together with its child worktree, the
   child branch and the home worktree branch. Removing a worktree at an interactive session's exit
   removes the same four things. Anything unproven is reported, never deleted.
7. `review-loop`, `review-changes` and `resolve-review` run from a home session against a named child:
   one real `frontend` pull request goes through a full review loop started from home.
8. Home's own documents follow the `adr` and `docs` rules, and the general half of the unit-test rule
   applies in home sessions; the half that describes `frontend`'s local test setup is found from
   `frontend`.
9. `frontend` consumes `doc-links` as a pinned dependency from home, with no copy of the tool in its
   tree; `pnpm lint:doc-links` passes locally and in the Checks workflow. Changing the pin is one
   command.
10. A session started inside `frontend` (not through home) has every skill and rule it has today, by
    name and behaviour. The Honk playbooks run unchanged.
11. Home has a check that fails when its links to a child's skills do not match the skills the child
    has.
12. The decision to replace the submodule design with the home repo is recorded as an ADR in home,
    and home has a setup section sufficient for the main developer to rebuild the local layout from
    nothing.

Exit criteria for phase 1 (they gate phase 2, not the pull requests): requirement 7's full loop; one
product task taken from grilling to a merged pull request entirely from home; two weeks of daily use
with a log of every missing skill, wrong-directory command and stale worktree; requirement 9 green in
CI.

## UI inventory

None. No application code changes.

## Implementation decisions

**Layout**

- Home keeps the provider-agnostic pattern `frontend` uses: one `.agents/` source, reached by Claude
  Code and Cursor through symlinks, with a root always-loaded instructions file.
- The local home clone is a fresh directory with a fresh `frontend` clone inside it, named as the
  repository. The existing `frontend` clone and its in-flight worktrees are left alone and retired
  once their work lands; Honk keeps using it.
- The set of children is one committed list in home (name and repository URL). The creation hook, the
  ignore files, the link check and a bootstrap script that clones children all read it. The probe
  hook's reading of the gitignore file was a shortcut and is not kept.
- A task worktree is two branches: a home branch named after the worktree, and the task branch in the
  child. The home branch never has a pull request; it is deleted with its worktree.

**What moves, what stays**

- Moves to home in phase 1: `grilling`, `update-glossary`, `review-loop`, `review-changes`,
  `resolve-review`; the `adr` and `docs` rules; the general half of the unit-test rule; `doc-links`.
- Each moved skill and rule leaves a frozen copy in `frontend`. In a home session a frozen rule loads
  alongside its home original; this double load is accepted for phase 1.
- The prototype's copies of `check-github-cli` and `slack-file` are dropped from home: Honk depends on
  them inside `frontend`, so they stay there. Honk's footprint, which nothing in phase 1 may move, is
  the four skills with a `Run by Honk` section and the skills those call.
- Repo-specific rules stay in the child. Where a rule mixes general guidance with a description of
  the local setup, the general part goes to a home rule and the local part to the `CONTEXT.md` of the
  tool it describes. The unit-test rule is the pilot that settles this pattern; other rules are split
  in phase 2.
- Repo-specific skills stay in the child and are exposed to home sessions by committed symlinks from
  home's skills directory, prefixed with the child's name. Before building the link check, re-probe
  whether the documented nested discovery (skills in a subdirectory load once a file there is read,
  or when the directory is added to the session) works for a gitignored child and lists skills from
  the first turn. If it does, links and the check may be dropped in favour of it; requirement 1 is
  the bar. The same probe checks that a frozen copy in the child does not collide with the home skill
  of the same name.
- `frontend` keeps its own project settings and hooks for sessions started inside it. Home gets its
  own settings: a fetch per child at session start, the worktree hooks, the dependency-install and
  prune hooks adapted to a child sitting inside a home worktree, the subagent-start pointer, and the
  Playwright MCP configuration. The duplication is accepted for phase 1.

**Working in a child from home**

- Home's instructions define the **active child**: the only child in a task worktree; otherwise
  inferred from the request or asked. It is where root-relative paths resolve and commands run, so
  skills written against the repository root keep working from both a home session and a `frontend`
  session without edits. It does not limit a session to one repository: a skill may still name
  another child or an external workspace folder explicitly, as `resolve-config-request` does with
  the `frontend-configs` checkout, which stays an external folder in phase 1.
- The review trio is the exception, because it launches other processes and reads the current
  branch's pull request and tree state: these take the child as a parameter. The Cursor reviewer is
  launched from the home worktree root, where the skills are; if the skill invocation does not attach
  from there, fall back to Cursor's workspace or additional-directory option.

**Worktree hooks**

- One custom worktree-creation hook, starting from the probed script
  (`.ai/handoffs/2026-11-13-home-repo-probes.md` in the main developer's notes; the logic is: prefix
  match picks one child from its remote main, otherwise mirror the children present in the session's
  directory, each from that copy's `HEAD`). When several child names prefix the worktree name, the
  longest wins, so a child whose name extends another's is not shadowed. It must clear inherited git environment variables before
  calling git in another repository, print a normalised absolute path, be idempotent on an existing
  worktree, and copy the child's worktree-include files, which a custom hook otherwise loses.
- The removal hook fires only on an interactive exit, on leaving a worktree mid-session and on
  deleting a background session. It never fires for headless runs or subagent worktrees, and Claude
  Code's own sweep skips hook-created worktrees. The prune hook at session start is therefore the
  real cleanup mechanism; the removal hook covers only the interactive path.

**Tools**

- `doc-links` reaches `frontend` as a pnpm git dependency pinned by commit, built by the package's
  `prepare` script at install. pnpm requires the package with its exact commit in the workspace's
  build allowlist, so a bump is two edits; a bump script makes them together. Node cannot run the
  TypeScript source directly from `node_modules`, and committed build output was rejected.
- If install time in CI becomes a problem, the fallback is a release tarball built by home's CI.

**Housekeeping**

- The issue body is rewritten from "submodule" to "home repo", keeping the prototype's result as a
  short superseded note. The prototype pull request (#3883) is closed unmerged.
- Renaming the repository, closing the prototype pull request and deleting the prototype branch in
  the second consumer are done by the developer by hand.
- Work lands in two repositories. This spec and its tickets live here; each ticket names its target
  repository, and home pull requests link back to the issue.

## Out of scope

- The second developer's onboarding and the written setup guide for others.
- `autoscout-frontend`, `frontend-configs` or any second child.
- Moving the task-pipeline skills, `debrief-meeting`, `slack-watch`, or anything in Honk's footprint.
- Splitting rules other than the unit-test pilot.
- Running Honk from home; cloud sessions; Cursor's own worktrees.
- Tools other than `doc-links`, in particular any tool with runtime dependencies of its own.
- Restoring path-scoped rules in worktree-isolated subagents (missing today as well).
- Removing the frozen copies and collapsing the duplicated settings: phase 2.
