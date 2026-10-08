# 10 — Settled layout conventions for the readout

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 10 of #3756 |
| Blocked by | none (T08 landed) |

## What to build

The readout stops asking layout questions the repo has already answered. A tracked file,
`tools/design-readout/layout-conventions.md`, lists the settled conventions one line each — what the
mockup shows or the question it raises, the convention that answers it, an exception when there is one,
and the code home a developer opens to see it in effect. The subagent brief reads it before judging:
a Layout question a listed convention answers is not raised; the convention is applied as a fact, and
the return gains a fifth block, `By convention:`, naming each convention applied and the nodes it
settled, so the developer reviews every application — including the one where the mockup draws the
opposite (a card list on mobile against the scrollable-table convention). The convention still wins
there; the line says so.

The file grows from use. In the skill's step 3 a Layout item gets a third outcome beside *settled* and
*sent on*: **convention** — the developer says "that's just how we do it", the session drafts the line,
the developer confirms it, and the session appends it to the file by a plain edit in that same session.
A convention that also changes a node's component or props is recorded through the tool with the new
gap category `convention`, so the sidecar carries the props while the phase 2 hand count over the gap
log can set those lines aside; `layout` lines then mean real misses.

Seeded with three conventions from the gas price history run: a list on mobile is a horizontally
scrollable table, never a card variant; pagination sits in the `ActionBar` unless the mockup puts it in
the tabs row; price-like cells are right-aligned under `isNumeric` column headers.

## Acceptance criteria

- [ ] `tools/design-readout/layout-conventions.md` exists, tracked, with a header stating the one-line
      format and the append rule (one line per convention, appended in the session that settled it,
      no dates, no node ids), and the three seed lines.
- [ ] `readout-brief.md` step 1 reads the conventions file; step 2's Layout rule applies a listed
      convention instead of raising the question; the return shape gains `By convention:` with one line
      per applied convention — `<convention> — nodes <ids>[ — mockup shows <the opposite>]` — and the
      "exactly this" clause counts five blocks.
- [ ] `SKILL.md` step 2 cuts a return to five blocks (not four); step 3 adds the **convention** outcome
      (draft, confirm, append; `--correct … --gap convention` when a node's component or props change);
      step 4 hands the `By convention` list back with the other three.
- [ ] `GAP_CATEGORIES` in `tools/design-readout/config.ts` gains `convention`; `sidecar.spec.ts` lists
      it; `--help` prints it without a text change; the parent spec's FR 11 category list names it
      (one-word amendment, the ticket's only edit to `spec.md`).
- [ ] `tools/design-readout/CONTEXT.md` "Where to look" gains one row for settled layout questions
      pointing at the file; the "What an editor here must keep true" list gains the rule that a
      convention is appended in the session that settled it and carries no node id. No other doc
      gains an ActionBar or mobile-list line (single home).
- [ ] `readout-template.md` is unchanged — `design-readout.md` does not carry conventions.
- [ ] `pnpm lint:doc-links` and the tool's specs pass.
- [ ] `(human)` Re-run the skill on node `22842:178272` (gas price history): the Layout list no longer
      carries the mobile-list and pagination questions, `By convention` lists the three seeds with
      their nodes, and nothing beyond the five blocks reaches the main context.

## Details

- Line format, fixed in the file's header and nowhere else:
  `- <what the mockup shows / the question> → <convention>[; unless <exception>] — <code home>`.
  Code home is a file or directory path (`src/shell/page/action-bar/ActionBar.tsx`,
  `src/toolkit/chakra/table.tsx`, `src/shared/pagination/`), never a line number.
- No node id or date on a line: ids rot as mockups change, and provenance is the git history.
- Conventions cover the Layout list only. A recurring Ambiguous or Unrecognized answer is a tool miss
  and goes through `--correct` and the gap log, never into this file.
- A convention the mockup contradicts is still applied; the `By convention` line carries
  `mockup shows <…>` so the developer can review the override. No `context` conflict is raised for it.
- Editing or removing a convention that no longer holds is a hand edit in a PR; the file is tracked.
- Edit skills under `.agents/` only after reading `.agents/README.md` (dual frontmatter, symlinks).
- `.agents/rules/docs.md` governs the CONTEXT.md row; the conventions file itself is data, not a code doc.

## Leaf worklist

- [ ] 1 `[agent]` `layout-conventions.md` with header and three seeds; `GAP_CATEGORIES` + spec; FR 11 word
- [ ] 2 `[agent]` `readout-brief.md` read step, Layout rule, five-block return shape
- [ ] 3 `[agent]` `SKILL.md` convention outcome in step 3, five-block cut in step 2, hand-back in step 4
- [ ] 4 `[agent]` `tools/design-readout/CONTEXT.md` row and constraint; `pnpm lint:doc-links`
- [ ] 5 `[human]` Re-run on `22842:178272`, confirm the `(human)` criterion
