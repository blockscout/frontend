# 10 — Settled layout conventions for the readout

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 10 of #3756 |
| Blocked by | T08 |

## Goal

Stop the readout subagent from asking layout questions the repo has already answered. The first
human run (gas price history table, node `22842:178272`) raised nine Layout questions; at least two
were conventions, not design intent: "mobile view for the list?" (every list is a horizontally
scrollable table now) and "pagination in the ActionBar?" (it goes there unless the mockup puts it in
the tabs row — the mockups have no notion of the `ActionBar` component). The brief says "state the
question; do not answer it", so without a written list the same questions come back every run.

A document of settled conventions, which the developer extends after any session where a layout
question was answered with "that's just how we do it"; `readout-brief.md` points at it and applies a
listed convention as a Recognized fact instead of raising it.

## Known context

- The brief's Layout rule and its recurring examples: `.agents/skills/design-readout/readout-brief.md`.
- Neither convention above is written anywhere today: `src/shared/pagination/CONTEXT.md` says nothing
  about the ActionBar, and no rule under `.agents/rules/` covers mobile list layouts.
- Seed entries from the test session: scrollable tables on mobile; pagination in the ActionBar unless
  the tabs row holds it; price-like cells right-aligned with `isNumeric` headers; the table sits
  below the page's chart where one exists.
- Update path wanted: a one-line append per settled question, in the session that settled it, so the
  list grows from use. The gap log's `layout` lines then record real misses only.

## Blocking unknowns

- **Where the document lives** — owner: tom. A file beside the skill (`.agents/skills/design-readout/`,
  read only when the readout runs) vs a global rule under `.agents/rules/` (loaded for every session
  touching matching files, so the conventions also steer scaffolding and review). The brief points at it
  either way; the choice decides who else reads it and what `paths` it carries.
- **Who appends** — owner: tom. The skill's step 3 appending automatically when the developer tags an
  answer as a convention, vs the developer editing by hand after the session.
