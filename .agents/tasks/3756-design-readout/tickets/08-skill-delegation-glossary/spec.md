# 08 — The `design-readout` skill, delegation line and glossary

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 08 of #3756 |
| Blocked by | T05 |

## What to build

`.agents/skills/design-readout/SKILL.md` is the thin driver a session invokes with a Figma node URL and
the task context. It runs the tool for the outline, has the developer confirm regions in the main
session, then runs the readout in a subagent that applies the judgment the tool cannot: the context
override (ticket text and API resource type decide interchain / L1 / external entity variants), badge
and tag fingerprints, and layout questions (a value in its own column vs under another cell). It
returns only the Ambiguous, Unrecognized and Layout lists plus the Recognized count. It never invents a
component, trusts hex over style names, and reports a shipped-code-vs-mockup conflict without picking.
When a developer resolves an item in session it records the correction through the tool (`--correct`
once ticket 06 lands; until then it says so and stops). It also fixes the shape of `design-readout.md`
(Recognized table, Ambiguous, Unrecognized, Layout questions) that `to-spec` will write in ticket 09.
`delegation.md` gains the "design readouts from Figma nodes — recognition only, never implementation"
line; the glossary gains **Readout**.

## Acceptance criteria

- [ ] `SKILL.md` carries dual frontmatter per `.agents/README.md`, names the tool command and its
      flags by pointing at `--help`, never names the token variable, and says the tool needs a token
      and stops when it is missing.
- [ ] The subagent brief is a separate file the skill hands over (like `review-changes/axes.md`), with
      the judgment rules (context override, fingerprints, layout questions) and the exact return shape.
- [ ] `readout-template.md` in the skill folder defines `design-readout.md`'s four sections.
- [ ] `.agents/delegation.md` gains the one line under "Agents may do today"; the markup line stays
      under humans-only, unchanged.
- [ ] `.agents/GLOSSARY.md` gains the row from Skill inputs; `pnpm lint:doc-links` passes.
- [ ] `(human)` Run the skill on one of the ticket 01 nodes: outline confirmed in session, subagent
      returns the three lists and a count, nothing else leaks into the main context.

## Details

- Badge and tag fingerprints: a small rounded frame with a fill from the `badge`/`tag` token
  families and one short text child; the skill maps the fill token to the badge color scheme and
  asks when two schemes share a hex.
- The MCP `get_screenshot` is allowed for a screenshot of the frame only; the skill never reads
  `get_design_context` for values.

## Skill inputs

### `update-glossary`

- Term: **Readout (design readout)**; Kind: `concept`.
- Definition: "The tool-produced mapping of a Figma node to repo components, props and design tokens,
  with every ambiguous, unrecognized and layout item listed for a developer to resolve before markup.
  Recognition only, never implementation; the skill of the same name drives it."
- Inclusion criterion: 1 (non-obvious meaning — "readout" is not a Figma or Blockscout word).

## Leaf worklist

- [ ] 1 `[agent]` `SKILL.md` + subagent brief + `readout-template.md`
- [ ] 2 `[agent]` `delegation.md` line
- [ ] 3 `[agent]` Glossary row — skill: `update-glossary`
