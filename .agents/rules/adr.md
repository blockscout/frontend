---
description: ADR rules
paths:
  - "**/adr/*.md"
globs: "**/adr/*.md"
alwaysApply: false
---
# Architecture decision records

An ADR answers "why is it like this?" without a git archaeology session. It carries the evidence and the
trade-off, so read the relevant one before changing what it decided.

## Where a record goes

| Scope | Folder | Listed in |
| --- | --- | --- |
| Affects the project as a whole | `.agents/adr/` | a line in `.agents/AGENTS.md` |
| Relevant only to one area or module | `<module-root>/adr/` | that module's `CONTEXT.md` |

Numbering is sequential and **scoped to its folder**; the filename is `<0000>-<slug>.md`.

## When to offer one

All three must be true:

1. Hard to reverse: the cost of changing your mind later is meaningful.
2. Surprising without context: a future reader will look at the code and wonder "why on earth did
   they do it this way?"
3. The result of a real trade-off: there were genuine alternatives and you picked one for specific
   reasons.

If a decision is easy to reverse, skip it: you'll just reverse it. If it's not surprising, nobody will
wonder why. If there was no real alternative, there's nothing to record beyond "we did the obvious thing."

Offer the ADR; do not write one unasked.

## Superseding

Supersede rather than rewrite. Change the old record's `Status` to `superseded by <n>` and leave its
reasoning intact.
