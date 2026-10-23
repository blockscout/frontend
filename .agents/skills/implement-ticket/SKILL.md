---
name: implement-ticket
description: >-
  Execute one ticket of a product-task spec.
disable-model-invocation: true
---

# Implement ticket

Execute a single **ticket** of a task, on the already-checked-out feature branch. It runs **once per
session, for one ticket**: a fresh session picks up the ticket, does it, and either commits it or hands off
at a human touchpoint. The ticket is the unit of a run and of a commit — the ticket model, and the
branch/status conventions this skill relies on, are in [`../../tasks/concepts.md`](../../tasks/concepts.md)
and [`../../tasks/structure.md`](../../tasks/structure.md).

## Invocation

`/implement-ticket <NN>` — the ticket number is **always required**, and the feature branch is assumed
checked out.

## Step 1 — Load

Resolve the task folder from the branch (`issue-<number>`) and read the main `spec.md`, the target ticket's
`tickets/NN-<slug>/spec.md`, `progress.md`, `questions.md`, and `.agents/delegation.md`. If ticket `NN` has
only a `brief.md`, it isn't scoped — tell the developer to scope it with a `to-tickets` run, and stop.

## Step 2 — Check runnable

Read the ticket's `Blocked by` list — the whole runnable test lives there, so check nothing else. Resolve
each entry by kind: a `T<NN>` entry must be checked in `progress.md`; a `Q<NN>` entry must be `resolved` or
`waived` in `questions.md`. If every entry clears, proceed; otherwise report exactly which blockers are open
and stop.

## Step 3 — Execute

Start at the **first unchecked** leaf and work in order, checking each box as it completes — resuming
after a human touchpoint skips the leaves already checked. Stop at the first **unchecked** `[human]` leaf
and hand off (Step 5).

**A style leaf** (the one linking a Figma node) takes the component to the mockup. The mockup is the source; the readout is an optional help, never a prerequisite:

- **The leaf links a readout block** → read it (the task folder's `design-readout.md`) and the node's
  sidecar in the main checkout (`tools/design-readout/CONTEXT.md` says where
  and what is in it): the component, props and theme tokens per node are already settled there, and the
  shipped code it names is the reference. Take a Figma screenshot (`get_screenshot` on the linked node)
  to see what the rows do not show.
- **No readout** → work from the mockup through the Figma MCP: `get_design_context` on the linked node
  for structure, values and names, plus `get_screenshot`. Do **not** run `pnpm design:readout`. Map what you see to the repo's components and theme tokens yourself, with
  `tools/design-readout/layout-conventions.md` for the settled layout questions.

Every style leaf covers **all breakpoints**: the mobile node when the ticket links one, otherwise the
desktop layout adapted the way neighbouring views do. An item that is still with the designer is a
`Blocked by Q<NN>` edge on the ticket and nothing else — the leaf leaves no marker in the code for it.

## Step 4 — Verify

Run every code-quality check the repo defines (per `.agents/rules/code-quality.md`) plus the relevant unit 
tests. Intentional scaffold `TODO`s may keep ESLint red the way the `add-new-page` skill documents — 
say so explicitly rather than chasing green. Then walk the ticket's **acceptance criteria** and confirm each 
agent-checkable one holds. A `(human)` criterion is not yours to judge — it is a touchpoint Step 5 stops for.
When the ticket carries a **How to verify** line, open its route on the dev server (`pnpm dev:preset <alias>`)
through the Playwright MCP, at a desktop and a mobile width, and look at what you built. A defect you can see
is yours to fix before the hand-off; what to probe follows from the leaf. The `(human)` criteria stay the
developer's — this pass is your own check, not their sign-off.

## Step 5 — Close

Key the close to whether the ticket has any **human touchpoint** — a `[human]` leaf, or a `(human)`
acceptance criterion:

- **No open touchpoint** — no unchecked `[human]` leaf, and no `(human)` criterion the developer has not
  yet confirmed → commit (Step 7). Done. A ticket with no touchpoint at all lands here on its first run; a
  ticket whose touchpoints are all `[human]` leaves lands here once the last one is checked.
- **An open touchpoint** → stop and hand off. Stop at the first **unchecked** `[human]` leaf; or, when no
  unchecked `[human]` leaf remains but an unconfirmed `(human)` criterion does, after implementing the
  leaves and **before** committing. **Stage** the work (`git add -A`) and stop — nothing is committed or stashed. From
  here the index is the agent's work and the working tree on top of it is the developer's: their fixes stay
  **unstaged**, so `git diff` reads back exactly what they changed. When the developer reports a bug during
  the hand-off and the agent fixes it, the index must still hold only the agent's hunks afterwards. `git
  add` cannot do that — it stages the whole file, developer hunks included — and no patch can be relied on
  to lift them back out, because a fix next to a developer hunk breaks the patch's context. So the fix
  goes into the index **by hand, beside the working tree**, per tracked file the agent edits:

  ```bash
  mkdir -p "$(dirname <scratchpad>/index/<path>)"   # the redirect below creates no parent directories
  git show :<path> > <scratchpad>/index/<path>      # the index copy — the agent's work, no developer hunks
  # … make the same fix in <path> (working tree) and in <scratchpad>/index/<path> …
  git update-index --cacheinfo "$(git ls-files --format='%(objectmode)' <path>),$(git hash-object -w <scratchpad>/index/<path>),<path>"
  ```

  Nothing is applied, so nothing can fail to apply: the index gains exactly the fix, the developer's
  hunks stay in the working tree, and `git diff` still reads back only what they changed. A file the agent
  creates for the fix has no developer hunks and is plain `git add <path>`. A modified path the agent
  did not touch is a developer fix and is never staged.

  Say what the developer does next, keyed to where the run stopped:

  - **At a `[human]` leaf** → **verify** in the running app and **fix** by hand, leaving the fixes
    unstaged; then check the leaf's box and ask the session to continue — it resumes from the next
    unchecked leaf (Step 3), never by re-invoking the skill.
  - **At the `(human)` criteria, on a ticket with a style leaf** (one linking a Figma node) → **verify**
    against the linked node at every breakpoint, **fix** by hand leaving the fixes unstaged, then say
    **"record my corrections"** (Step 6).
  - **At the `(human)` criteria, no style leaf** → **verify** and **fix** the same way, then confirm the
    criteria and ask the session to commit (Step 7).

  The stopping turn ends at its bullet.

## Step 6 — Record corrections

Entered when the developer says **"record my corrections"** after a hand-off on a ticket with a style
leaf. Spawn a **subagent** with [`record-corrections.md`](record-corrections.md) as its brief and the
leaf's Figma node URL; when the leaf had a readout, point it at the node's block and
sidecar too. The subagent reads the developer's unstaged fixes back as gap-log lines, confirms the batch
with the developer and records it; it edits no source file. After the batch, commit (Step 7).

## Step 7 — Commit

Check the ticket's box in `progress.md`, then **commit** the entire body of work — the box tick folded
into the commit so the worktree is clean after. A plain descriptive subject, the repo's `Co-Authored-By`
trailer, and **no** `#issue` reference (the PR's `Resolves #N` already links it; a commit that names the
issue spams its timeline).
