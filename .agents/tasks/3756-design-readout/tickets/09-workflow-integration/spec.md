# 09 — Workflow integration

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 09 of #3756 |
| Blocked by | T06, T08 |

## What to build

The readout becomes part of the task lifecycle. `grill-the-task` runs the `design-readout` skill for
every Figma link the task carries in place of today's enumerate-only step: outline confirmed in the main
session, readout in a subagent, Ambiguous items put to the developer first and only genuine
design-intent questions routed to the designer. A small task that gets no spec still runs the readout
at grill time; its output stays in session and in the sidecar. `to-spec` writes `design-readout.md` into
the task folder from the sidecar using the ticket 08 template; `structure.md` gains its row and
`finalize-task` prunes it with the ticket files. `to-tickets` links the readout from each `[human]`
style leaf next to the Figma node. `implement-ticket` re-runs the tool before a markup leaf when the
file's `lastModified` is newer than the sidecar's and surfaces the changed leaves to the developer.

## Acceptance criteria

- [ ] `grill-the-task` Step 1 item 4 invokes the skill; the enumerate-only wording is replaced; the
      Ambiguous-first routing is stated; the no-spec small-task path is stated.
- [ ] `to-spec` writes `design-readout.md` from the sidecar when one exists for a task link; the
      template in the skill folder is the only definition of its shape.
- [ ] `structure.md` tree and ownership table gain `design-readout.md` (written by `to-spec`, pruned
      at land); `finalize-task` Step 1 lists it.
- [ ] `to-tickets` ticket template's style-leaf line links the readout next to the Figma node.
- [ ] `implement-ticket` compares `lastModified` before a `[human]` style leaf and re-runs on a newer
      file, reporting the diff; the step names the tool command, not the token.
- [ ] `.agents/tasks/README.md` lifecycle mentions the readout once; `pnpm lint:doc-links` passes.

## Details

- Edit skills under `.agents/` only after reading `.agents/README.md` (dual frontmatter, symlinks).
- No new skill file here; every change is an edit to an existing skill or doc.

## Leaf worklist

- [ ] 1 `[agent]` `grill-the-task` research step and small-task path
- [ ] 2 `[agent]` `to-spec` writes `design-readout.md`; `structure.md` row; `finalize-task` prune line
- [ ] 3 `[agent]` `to-tickets` style-leaf link; `implement-ticket` re-run gate
- [ ] 4 `[agent]` `tasks/README.md` lifecycle line; doc-links check
