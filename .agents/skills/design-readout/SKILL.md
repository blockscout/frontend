---
name: design-readout
description: >-
  Read one Figma node into a design readout — per node the repo component, its props and the theme
  tokens, with every ambiguous, unrecognized and layout item listed for the developer to settle.
  Use for each Figma link a task carries, at grill time and again before a markup leaf when the file
  changed. Recognition only, never implementation.
argument-hint: <figma node URL>
---

# Design readout

Turn a Figma node into a **readout**: the content root confirmed by the developer in this session, the
values and recognition from `pnpm design:readout`, and the judgment the tool cannot make — applied in a
subagent so the values never reach the main context. The readout names components; it writes no markup.
What the tool does on its own and where its record lives: `tools/design-readout/CONTEXT.md`.

## Inputs

| Input | Source | Missing |
| --- | --- | --- |
| Figma node URL *(positional)* | the task's issue, spec or ticket | stop |
| Task context | the task's `spec.md` or ticket `spec.md` in session; else the conversation | ask the developer one line: which screen, which entity family |
| API response type | the resource's type file, when the task names a resource | the context override has one leg less; say so in the dispatch |

One link is one screen in one state. A second state or the mobile variant is a second run.

The tool needs a Figma personal access token in the environment. A run that fails on the token prints
one line on stderr: relay it and stop. Obtaining the token is the developer's two-minute job; the skill
names no variable and sets none.

## 1. Outline — in this session

Read the flags once per session from `pnpm design:readout --help`. Then run the node with stdout
captured, and show the developer the outline only:

```bash
OUT="$SCRATCHPAD/readout-<fileKey>-<nodeId>.txt"
pnpm design:readout "<url>" > "$OUT"
sed -n '1,/^Regions:/p' "$OUT"
```

The developer confirms the content root and each dropped chrome line, or names the regions
themselves; a different choice is a re-run with `--regions`. Everything past the `Regions:` line — the
values, the hints, the lists — stays in the file for the subagent.

A node that already has a sidecar prints a diff instead of values; the sidecar is complete either way,
and a correction or override flagged `STALE` in that diff goes to the developer with the Ambiguous
items in step 3.

**Done when**: the developer has said yes to the regions, and the `Sidecar written to` or
`Sidecar updated at` line in `$OUT` names the record.

## 2. Readout — in a subagent

Spawn **one** `general-purpose` subagent with: the sidecar path from step 1, `$OUT`, the Figma node URL,
the task context (file paths when they exist, the developer's line otherwise), the API response type
path when there is one, and [`readout-brief.md`](readout-brief.md) — the judgment rules and the exact
return shape live there. The subagent reads the sidecar and the shipped code; this session reads neither.

**Done when**: the return is the Ambiguous, Unrecognized, Layout and By convention lists plus one
Recognized count. A return carrying anything else — a component table, values, prose — is cut to those
five before it is relayed, never pasted whole.

## 3. Settle — with the developer

Walk the lists in order: Ambiguous, Unrecognized, Layout, By convention. Per item, the developer
settles it, sends it on, or — a Layout item only — names it a convention:

- **Settled** — record it through the tool, with the gap category the brief proposed and the developer
  confirmed. A settled Layout question that changes a node's component or props is recorded the same
  way with the category `layout`; one that changes no node stays listed.

  ```bash
  pnpm design:readout "<url>" --correct <nodeId> <Component> [<props…>] --gap <category>
  ```

- **Sent on** — a design-intent question the developer cannot answer goes to the designer through the
  calling skill's question flow; the item stays in its list with the question beside it.

- **Convention** — the developer says "that's just how we do it": the repo answered this layout
  question long ago and will answer it the same way next time. Draft the line, read it back, and on
  the developer's confirmation append it to `tools/design-readout/layout-conventions.md` by a plain
  edit in this session. That file is one table and nothing else, one row per convention, with the
  columns *What the mockup shows / the question*, *Convention*, *Unless* (empty when there is no
  exception) and *Code home* — a file or directory path, never a line number; no date, no node id. A
  convention that also changes a node's component or props is recorded through the tool with the
  category `convention`, so the sidecar carries the props while the gap log can set the line aside:

  ```bash
  pnpm design:readout "<url>" --correct <nodeId> <Component> [<props…>] --gap convention
  ```

A **shipped-code-vs-mockup conflict** is presented with both sides and settled by the developer, one
of two ways. The shipped code is wrong here: a correction with the category `context`, as above. The
mockup styles this one instance on purpose, and the line carries an `override:` tail: an override,
which names no component and logs no gap — the tool read the values right, the disagreement is
design intent. A color prop is checked against the tokens the node resolved for that fill.

  ```bash
  pnpm design:readout "<url>" --override <nodeId> <prop=value> [<prop=value…>]
  ```

A **By convention** item is already settled: the developer reviews each application and either lets it stand or edits the convention's line
in the file.

**Done when**: every Ambiguous and Unrecognized item is recorded or sent on, the Layout list holds
only open questions, and every By convention line is reviewed.

## 4. Hand back

Return to the caller the sidecar path, the four lists and the Recognized count. The
file that carries a readout into a task folder follows [`readout-template.md`](readout-template.md);
writing it is the task workflow's job, not this skill's.

## Rules — binding in every step

- **Never invent a component.** A node nothing matches is Unrecognized with its resolved values.
- **Hex over style name.** A Figma style, component or layer name is a hint; the value wins and the
  disagreement is reported.
- **Report a conflict, do not pick.** Shipped code and mockup disagree → both sides on the list.
- **The MCP serves a screenshot only.** `get_screenshot` on the linked node is allowed, to see a
  composite the boxes alone do not settle; `get_design_context` is never read — its values are the
  hints this skill distrusts.
