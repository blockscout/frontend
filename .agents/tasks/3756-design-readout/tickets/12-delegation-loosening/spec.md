# 12 — Agents do the markup leaf; the developer verifies and the diff is logged

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 12 of #3756 |
| Blocked by | T13 |

## What to build

The style leaf of a UI component is `[agent]` work. `to-tickets` cuts it that way unconditionally, as
the second of the two linked leaves, with a mandatory `(human)` "matches the mockup" criterion on the
ticket, and links the readout block beside the Figma node when the task folder has one. `implement-ticket`
runs the leaf in a subagent that reads `design-readout.md`, the node's sidecar and the shipped code; when
the task has no readout the subagent runs `pnpm design:readout <url>` itself for the values and the
sidecar, and on that path only may also read the Figma MCP design context. A Figma screenshot is allowed
on either path. Every style leaf covers all breakpoints: the mobile node when the ticket links one,
otherwise the desktop layout adapted the way neighbouring views do. At hand-off the agent stages its work,
prints the tree hash of the staged state and stops before committing; the developer verifies in the
running app and fixes by hand, unstaged. When the developer says "record my corrections", a subagent
diffs the working tree against that hash and proposes one gap line per correction: a miss it can map to a
sidecar node goes through `--correct` or `--override` as today, anything else through a new
`pnpm design:readout <url> --note "<text>" --gap markup`; the developer confirms the batch and the
agent records it. `gaps.md` lines carry a stage column (readout / markup) and `markup` joins the
categories. `TODO (design):` markers go: the scaffold emits none, the style leaf consumes the readout or
the tool's run, and an item still with the designer is a `Blocked by Q<NN>` edge and nothing else. The
`lastModified` re-run gate leaves `implement-ticket`; the tool keeps its diff. `delegation.md` moves
"final markup and styling to match the mockups" and "choosing nav/sprite icons" to "Agents may do today";
visual polish, Playwright baselines and design sign-off stay human.

## Acceptance criteria

- [ ] `tools/design-readout/config.ts`: `GAP_CATEGORIES` gains `markup`; `gaps.ts` `GapEntry` takes a
      `stage: 'readout' | 'markup'` and `GAP_LOG_HEADER` names the column after the category; existing
      `--correct` lines write `readout`; the duplicate-miss key ignores the stage. `--note "<text>" --gap
      <category>` appends a line with an empty node id, the text as "the developer said" and `markup` as
      stage, offline, without a token; `--note` without `--gap`, or with `--correct` / `--override`,
      exits non-zero with one line naming the rule. `gaps.spec.ts` and `index.spec.ts` cover the column,
      the note line and the rejections; `--help` documents `--note` and the stage.
- [ ] `.agents/delegation.md`: the markup/styling line and the icon line move under "Agents may do
      today" (markup phrased as "to the mockup, verified by the developer in the running app"; icons
      phrased as "sprite icons the readout recognized or the spec names"); "visual polish of any kind",
      Playwright baselines and design sign-off stay under humans-only; the `TODO (design):` sentence is
      gone.
- [ ] `.agents/tasks/concepts.md` Leaves: UI work is two linked `[agent]` leaves, scaffold then style;
      the style leaf takes the component to the mockup at every breakpoint and carries the Figma node
      and the readout block; no marker sentence. Acceptance criteria: a style leaf always earns a
      `(human)` criterion.
- [ ] `to-tickets/SKILL.md` Step 6 and `ticket-template.md`: the style leaf line reads `[agent]`, the
      ticket carries `(human) <component> matches the mockup at every breakpoint`, and the "stay human
      regardless of what the readout recognized" sentence is gone.
- [ ] `implement-ticket/SKILL.md`: Step 3 loses the `lastModified` re-run block and gains the style-leaf
      paragraph (subagent, inputs by path, no-readout path with the tool run and the MCP exception,
      screenshot allowed, breakpoints rule); Step 5's touchpoint hand-off says: stage, print
      `git write-tree`, stop, and name the three things the developer does next — verify in the app, fix
      unstaged, say "record my corrections"; a new Step 6 "Record corrections" describes the diff read
      (`git diff <tree-hash>`), the per-hunk mapping to sidecar nodes, the two commands, the confirm
      batch, and that the agent edits no source file in this step. No `TODO (design):` mention.
- [ ] `add-new-page/SKILL.md`, `wiring.md` and the templates emit no `TODO (design):` marker; the nav
      icon is read from the spec's UI inventory and set in the scaffold; `review-changes/SKILL.md` and
      `tools/review-screen/rubric.ts` no longer name the marker. `TODO (api-data):` is untouched.
- [ ] `design-readout/SKILL.md` and `readout-brief.md`: the rule "the MCP serves a screenshot only" is
      unchanged for the readout; a one-line note says the markup leaf's no-readout exception is
      `implement-ticket`'s. `tools/design-readout/CONTEXT.md` gains the stage column, the `--note`
      row and the "every style leaf covers all breakpoints" convention is in `layout-conventions.md`
      only if a code home exists — otherwise it stays in `implement-ticket`. `pnpm lint:doc-links`, the
      tool's specs and the repo's lint pass.
- [ ] `(human)` On a real ticket with a style leaf: the agent's hand-off prints a tree hash, your
      unstaged fixes are read back as proposed gap lines with sensible stages and categories, and
      `gaps.md` shows them after you confirm.

## Details

- Why the tree hash and not a commit or stash: nothing unverified is committed, the stash stack is
  shared across worktrees, and `git diff <tree-ish>` compares a tree to the working tree regardless of
  what is staged on either side. The hash goes in the hand-off text only; the sidecar does not store it.
- `--note` needs the URL only to find the sidecar's file key for the line; the node id column is empty.
  Mapping a hunk to a node is the subagent's judgment from the readout block and the sidecar's values; an
  uncertain mapping is a `--note`, never a guessed `--correct`.
- The MCP exception: `get_design_context` was kept out of the readout because its names are the hints
  the tool distrusts and its size exceeds a context. On a no-readout markup leaf the tool's run is the
  primary input and the design context is a secondary one the subagent may consult for structure.
- Edit skills under `.agents/` only after reading `.agents/README.md` (dual frontmatter, symlinks);
  `.agents/rules/docs.md` governs the CONTEXT.md lines.

## Leaf worklist

- [ ] 1 `[agent]` Tool: `markup` category, stage column, `--note`, usage, specs; `CONTEXT.md` rows
- [ ] 2 `[agent]` `delegation.md`, `concepts.md`, `to-tickets` Step 6 + `ticket-template.md`
- [ ] 3 `[agent]` `implement-ticket`: style-leaf paragraph, hand-off with tree hash, Step 6 record corrections, gate removed
- [ ] 4 `[agent]` Markers out of `add-new-page` (SKILL, wiring, templates), `review-changes`, `review-screen/rubric.ts`; `design-readout` note; `pnpm lint:doc-links`
- [ ] 5 `[human]` Run one real style leaf end to end and confirm the `(human)` criterion
