# 11 — Intended style overrides are not gaps

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 11 of #3756 |
| Blocked by | T10 |

## Goal

Let the readout record a node as "the shipped component, with this deliberate style change" without
logging a miss. The second human run ("Estimated cost of tx actions" table, node `22842:178041`)
raised two items that are neither recognition misses nor open questions: the header row background
(`#FFFFFF/6`, `whiteAlpha.100`, against the shipped `line` variant's `whiteAlpha.200`) and the column
header text (`text.primary` against the shipped `table.header.fg`). The developer knows the component
and knows the mockup differs on purpose — a custom style for this one table. Today the only way to
settle such an item is `--correct <node> TableColumnHeader --gap context`, which drops the style the
markup leaf needs and counts the node as a `context` miss in the gap log, so the phase 2 hand count
overstates recognition failures.

Wanted: a correction that names the component **and** the override (the token or value the mockup
draws, per role), recorded in the sidecar so the markup leaf and `design-readout.md` carry it, and
set aside in the gap log the way `convention` lines are — the tool read the values right; the
disagreement is design intent, not a miss.

## Known context

- The correction slot (`Correction` in `tools/design-readout/sidecar.ts`) holds component, props and
  gap only; props are free words, so an override can be smuggled in as `bg=whiteAlpha.100` today but
  nothing distinguishes it from a component prop, and the gap category is still a miss.
- The brief's "Shipped code vs mockup" rule puts every such disagreement on the Ambiguous list with
  category `context`, and the skill's step 3 settles it as a `context` correction.
- Ticket 10 added `convention` as a category the gap-log count sets aside; the same pattern fits an
  `override` (or `style`) category.
- The tool already resolves each fill to its tokens per role (`tokens` on the node record), so the
  override can be stated as `<role>=<token>` and checked against the node's resolved tokens.

## Blocking unknowns

- **Shape of the record** — owner: tom. A new gap category on the existing correction (`--gap
  override`, override in the props) vs a separate slot beside `correction` (`style: { bg:
  'whiteAlpha.100' }`), which the readout template and the markup leaf can read without parsing props.
- **Where the override lands in the readout** — owner: tom. A `Props` cell entry in the Recognized
  table vs its own column, so the human style leaf sees "shipped + this override" at a glance.
- **Whether an override is ever a convention** — owner: tom. A style the mockups repeat for one
  component family (every stat table header at `whiteAlpha.100`) belongs in the theme, not in
  per-node overrides; the tool could count repeats and say so.
