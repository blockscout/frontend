# 07 — Type column and From/To per the design answers (deferred)

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #2881 |
| Blocked by | Q01, Q02, T02 |

## Goal

Bring the Type column and the From/To column(s) of the unified table in line with the designer's answers
to Q01 and Q02, if they differ from the interim behaviour T02 ships.

## Known context

- Interim (spec, "Implementation decisions"): Type = token-standard tag + mint/burn badge beside it;
  From and To = one combined `AddressFromTo` column with one selector entry.
- If Q02 answers "two columns": `AddressFromToIcon` already exists (advanced filter `or_and` column) for
  the direction arrow; the column config vocabulary, FR 2 defaults, and the override-map keys all gain a
  second entry, and persisted cookies keyed on the single column need a migration or a tolerant read.
- If Q01 answers "standard only": decide whether the mint/burn badge is dropped from the table entirely
  (the second fact `Resolved when` asks for).

## Blocking unknowns

- Q01 — owner Tatyana (designer): what the Type cell shows.
- Q02 — owner Tatyana (designer): one combined From/To column or two; which one carries the arrow.

When both are resolved, a `to-tickets` run scopes this ticket (or marks it a no-op if the answers match
the interim behaviour).
