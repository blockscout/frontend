# 13 — The readout is a step after the spec, not part of grilling

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 13 of #3756 |
| Blocked by | none |

## What to build

The developer runs the `design-readout` skill in its own session, after `to-spec` has written the task
folder and before `to-tickets` cuts the tickets — or not at all. With no URL the skill reads every Figma
link in the task's `spec.md` and runs the ones that have no block in `design-readout.md` yet; with a URL
it runs that one link. The outline, subagent and settle steps are as today. At hand-back the skill
itself writes the node's block into `design-readout.md` in the task folder (the template is unchanged)
and, for every item the developer sent on to the designer, appends a `questions.md` entry in the
questions template's shape with the designer as owner and status `pending`; the developer sends it
through the normal Slack flow. `grill-the-task` goes back to enumerating the Figma links, one node per
screen and state, and asks for the nav icon of every new route — a sprite name from the developer, or
a question to the designer when the icon is not drawn yet — recorded in the spec's UI inventory. `to-spec`
no longer writes `design-readout.md`. A small task that gets no spec gets no readout.

## Acceptance criteria

- [ ] `design-readout/SKILL.md`: the argument is optional; the Inputs table says what a missing URL means
      (every link in `spec.md` without a block in `design-readout.md`); the description names the
      moment — after the spec, before the tickets, re-run by the developer when the mockup moved — and
      no longer says "at grill time" or "before a markup leaf". Step 4 writes the block into the task
      folder's `design-readout.md` (create from `readout-template.md`, replace an existing block for the
      same node) and appends one `questions.md` entry per sent-on item; the no-task-folder case (a URL
      given in a session with no spec) keeps today's behaviour: lists in session, sidecar on disk,
      nothing written to the repo.
- [ ] `grill-the-task` Step 1 item 4 enumerates links (one node per screen and state, hidden layers
      ignored) and runs no readout; Step 1 UI inventory asks for the nav icon per new route and the
      answer or the question lands in the spec's UI inventory; Step 4's small-task line no longer
      mentions a readout.
- [ ] `to-spec` Step 1 writes `spec.md` and `questions.md` only; Step 2 commits those two. The
      `spec-template.md` UI inventory has a nav-icon field per route.
- [ ] `to-tickets` Step 6 and `ticket-template.md` link the readout block "when the task folder has a
      `design-readout.md`" — wording unchanged where it already says so, and no reference to grilling.
- [ ] `.agents/tasks/README.md` lifecycle gains one optional line between steps 2 and 3 naming the skill;
      `structure.md`'s `design-readout.md` row says the skill writes it; `finalize-task` prune line
      unchanged.
- [ ] `tools/design-readout/CONTEXT.md` names the moment the skill runs where it names grill time today.
      `pnpm lint:doc-links` passes.

## Details

- Edit skills under `.agents/` only after reading `.agents/README.md` (dual frontmatter, symlinks);
  `.agents/rules/docs.md` governs the CONTEXT.md and README lines.
- Why the skill writes the block itself: `to-spec` has already run, and there is no later skill on the
  path that owns the file; the template stays the only definition of its shape.
- The `questions.md` entry's `Resolved when:` is the design-intent question itself, phrased as the brief
  states it (both readings, node ids); the Slack column stays `—` until the developer sends it.
- The nav-icon question goes through grill's existing Step 3 question flow; nothing new there.

## Leaf worklist

- [x] 1 `[agent]` `design-readout/SKILL.md`: optional URL, hand-back writes `design-readout.md` and `questions.md` entries, description
- [x] 2 `[agent]` `grill-the-task` enumerate-only + nav icon; `to-spec` + `spec-template.md`; `to-tickets` wording
- [x] 3 `[agent]` `tasks/README.md` lifecycle line; `structure.md` row; `CONTEXT.md`; `pnpm lint:doc-links`
