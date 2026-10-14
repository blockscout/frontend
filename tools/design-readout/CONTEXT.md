# Design readout — context

Turns a Figma node into material a developer confirms once the task's spec is written and before its
tickets are cut (the `design-readout` skill is that step; `.agents/tasks/README.md` places it): the
*scoping outline* —
which node is the content root and which chrome was dropped on the way down, with the rule that
dropped it — under the confirmed regions, the *values* of every leaf (text, fills per role, font,
icon instance name, trailing glyphs, bounding box) — and per leaf what the tool *recognizes* from
those values (a hash, a number, a timestamp, a sprite icon, the theme tokens each fill serves in the
color mode the fills voted for, a from/to pair or an amount with its ticker over neighbours), with a
status and the signal that fired, all written to a sidecar. It reads the node through the Figma REST API, never through the MCP; the
task spec behind the tool and the phases after this one: `.agents/tasks/3756-design-readout/spec.md`.

## Where to look

| Question | Answer lives in |
| --- | --- |
| How do I run it? What do the flags do? | `pnpm design:readout --help` |
| Which layer names count as chrome? Which token variable? | `./config.ts` |
| Which URL forms are accepted? | `./url.ts`, with `./url.spec.ts` as the list |
| How is the content root chosen, what is chrome, why do the chrome rules not reach equally far? | `./scope.ts` |
| What does a run print? | `./scope.ts` (`renderOutline`), `./values.ts` (`renderExtraction`), `./recognize.ts` (`renderRecognition`), `./index.ts` (the header) |
| What is a leaf, which role does a fill get, what is a trailing glyph? When does a hint "disagree"? | `./values.ts` |
| Where does a run's record go, and what is in it? | `<main checkout>/.ai/design-readout/<fileKey>-<nodeId>.json`, one per node; `./sidecar.ts` is the shape |
| How does the fetch fail, and with what message? | `./figma.ts` |
| What does the raw payload look like? | `./fixtures/`, one `--dump` per node, named `<node id>-<light\|dark>.json` |
| Which tokens does a hex serve, in which mode? Which role narrows to which tokens? | `./colormap.ts` builds the map from the theme and answers over it; `./config.ts` holds the role patterns |
| How is the run's color mode decided, and what breaks a tie? | `detectColorMode` in `./colormap.ts`; `extractValues` in `./values.ts` feeds it every fill and the linked node's own background |
| Which text shapes are recognized, in what order, with what example? Which characters are lookalikes? | `TEXT_SHAPE_RULES` in `./recognize.ts`, one example per rule; `./config.ts` holds the lookalike table |
| How is an icon instance name matched to a sprite name? What counts as "beside"? | `normalizeIconName` / `matchIconName` in `./recognize.ts`; the adjacency gap in `./config.ts` |
| Which composites exist, what are their parts, when does one not fire? | `COMPOSITE_RULES` in `./recognize.ts` and the comment above it; the member gap in `./config.ts` |
| What can a node's status be, and what does each mean? | `RecognitionStatus` in `./recognize.ts`: `recognized` (a signal fired and settles the shape), `ambiguous` (a signal fired but the shape alone cannot settle it — a truncated hash with no entity icon beside it), `unrecognized` (nothing fired; the values are listed, never a guess) |
| What does a second run for the same node print, and what counts as a change? | `diffRecords` and `renderRerun` in `./rerun.ts`: values or decision per node, new and vanished nodes; a box move alone is not a change |
| What happens to a correction or an override when the node changes? | `carryCorrections` in `./rerun.ts`: kept as-is while the values hold, kept and flagged `stale` once they differ, dropped with a vanished node |
| How do I record what a node really is? | `pnpm design:readout <url> --correct <nodeId> <component> [<props…>] --gap <category>`; `recordCorrection` in `./index.ts`, the slot is `Correction` in `./sidecar.ts` |
| How do I record a deliberate style change on a node the tool read right? | `pnpm design:readout <url> --override <nodeId> <prop=value…>`; `recordOverride` in `./index.ts`, the slot is `Override` in `./sidecar.ts`, the color props it checks are `OVERRIDE_COLOR_PROPS` in `./config.ts` |
| Where is the gap log, what is one line of it, which categories and stages exist? | `<main checkout>/.ai/design-readout/gaps.md`; `./gaps.ts` writes it, `GAP_CATEGORIES` and `GAP_STAGES` in `./config.ts` are the lists; the stage column says where the miss surfaced: `readout` while confirming the tool's lists, `markup` while verifying an agent's styling in the running app |
| How do I record a markup miss that maps to no node? | `pnpm design:readout <url> --note "<text>" --gap <category>`; `recordNote` in `./index.ts`. The URL supplies the file key only; no sidecar is read or written |
| Which layout questions are already settled, and where does a new convention go? | `./layout-conventions.md`, one table, one row per convention with its code home; the `design-readout` skill fixes the columns, reads the file before judging and appends to it |
| Which nodes is recognition checked against, and what does each entry hold? | `./calibration/<entry>/`: `snapshot.json` is the tool's own extraction of the node, `expected.json` the Figma link, the shipped component's path and per cell the component, its props and the signals recognition must give; the schemas sit at the top of `./calibration.ts` |
| How do I add an entry? | A folder under `./calibration/` with an `expected.json` (link, node id, component path, `cells: {}`), then `pnpm design:readout --refresh <entry>` to capture the snapshot, then the cells, read off the shipped component's JSX and keyed by the leaf ids the snapshot shows; `--calibrate` must pass before the commit |
| `--calibrate` reports a miss. What does it mean? | Recognition over a committed snapshot no longer says what the entry expects: a rule change regressed that cell, or improved it (a cell pinned `unrecognized` now hits), in which case the entry is updated in the same change. The run is offline, so it never means Figma changed |
| When do I `--refresh`? | When the mockup changed and the entry should follow it, or the entry's `stale` flag is set and the node is back. A refresh overwrites the snapshot only; the cells stay and `--calibrate` says which no longer hold |

## What an editor here must keep true

- **A failed fetch is a failed run.** No token, a rejected token, a node not in the file: all exit
  non-zero with one line on stderr and nothing on stdout, and the tool never tries another source. This
  is the opposite of `tools/review-screen/`, whose failures still produce output; do not copy that rule
  over.
- **The token variable is named in `./config.ts` only.** Not here, not in a skill, not in `--help`. An
  agent told the variable's name will try to set it.
- **Scoping is a pure function of the node tree.** Everything in `./scope.ts` takes the REST payload's
  document and nothing else, so the specs run over `./fixtures/` and the tests never reach Figma.
  Keep new rules inside that boundary; a rule that needs a second request belongs in `./figma.ts` and
  must be fed into `scopeOutline` as data.
- **One link is one screen.** The developer links the exact node of one screen in one state; a state
  or a mobile variant of it is a separate link. So the tool never looks for siblings, variants or
  states, and a hidden layer (visibility off) is not part of the screen: it is dropped before any
  rule runs, never counted, never printed.
- **The color map reads the theme defaults, not the theme.** It is built at run time from the
  config-free modules `src/toolkit/theme/foundations/colorsDefault.ts` and `semanticTokensDefault.ts`,
  so an instance's runtime color overrides are never in it; nothing under this folder may import
  `src/config`, directly or through the composed theme modules.
- **Recognition names no component.** A decision is a signal plus what that signal says — the
  entities a shape can be, the sprite an instance name resolves to. Mapping that to a repo component
  is the skill's judgment with the ticket in hand, never the tool's; an unmatched node is listed
  with its values, not with a guess. The one source of icon names is the tracked, generated
  `public/icons/name.d.ts`, read at run time, so the tool and the `IconName` type cannot drift.
- **Hints are never stored.** A Figma style name, component name or layer name is printed beside the
  value it labels and goes nowhere else: the sidecar carries values, boxes and the decision slots only,
  and `./sidecar.spec.ts` asserts the keys. The calibration that started this task found three of five
  style names misleading; a hint in the record would be read back as a fact by the next phase.
- **The sidecar lives in the main checkout**, resolved through the git common dir (`../cli/checkout.ts`),
  so every worktree reads and writes the same record for a node and the file outlives the worktree.
- **A correction is always a miss, and so is a note.** `--correct` or `--note` without `--gap` exits
  non-zero: the phase 2 decision is a hand count over `gaps.md`, and a miss that skips the log makes
  the count lie small. The gap log is append-only, header once; nothing here rewrites or prunes it.
- **An override is never a miss.** `--override` appends no gap line, names no component and takes
  no `--gap`; the parser rejects it beside `--correct`. The slot sits beside `correction` so one node
  can carry a real miss and a deliberate style at once. A color prop (`bg`, `color`, `borderColor`)
  is checked against the tokens the node's sidecar resolved for that fill and nothing else, so the
  check is offline and the override can only name a token the Recognized list printed. The
  correction rule above stays as written.
- **The gap log counts kinds of miss, not nodes or stages.** The same cell repeated down eight rows
  of a mockup is one line: a correction whose file key, category, values and correction match an
  existing line adds none, and says so; the stage is left out of the key. The sidecar still takes a
  correction per node, so every cell carries its component.
- **A convention is appended in the session that settled it, and carries no node id.** The file
  grows only from a developer saying "that's just how we do it" over a real Layout item; a row
  written later, from memory, records a convention nobody applied. Node ids rot as mockups change
  and dates duplicate the history the commit already keeps, so a row names the question, the
  convention, the exception and the code home, nothing else. A correction that carries a
  convention's props is logged with the category `convention`, so the phase 2 count over `gaps.md`
  can set those lines aside and `layout` lines mean real misses.
- **A re-run never drops a correction on its own.** Values changed under it → kept and `stale`;
  decision changed under it (a new rule) → kept as-is, since the developer judged the values, not
  the rule. Only a vanished node takes its correction with it, and the re-run says so. An override
  is carried under the same rule.
- **A snapshot is the tool's extraction, captured with `--refresh`, never hand-edited and never a raw
  payload.** It holds values, boxes and the frame background only, so recognition can be re-run over
  it offline and a payload field the tool starts reading has to be captured again, by a refresh.
  `--calibrate` needs no token; the spec that runs the committed set is what keeps it green in CI.
- **The committed calibration set passes.** `--calibrate` exits non-zero on any miss and the spec
  asserts the same, so a recognition change that moves a calibrated cell lands together with the
  entry update that says so. A vanished node is `stale`, skipped and reported, never a miss.
- **Fixtures are captured with `--dump`, never hand-edited.** They are the raw response for one node,
  so a payload field the tool starts reading is already in them; the file name records the color mode
  the payload showed.

## Gotchas

- **The structural rule measures against the linked node, so what you link changes what is chrome.**
  Link a page frame and a sealed instance as tall as the page is a side rail; link a single table row
  and a loader icon as tall as the row passes the same test. The outline is printed to be confirmed
  for exactly this reason.

- **A color that serves a token in both modes casts no mode vote.** Light-mode `text.primary`
  (`blackAlpha.800`) is also the dark-mode hero button's selected text, so a naive "resolves in exactly
  one mode" test gave a light screen no light votes at all. Detection counts only the tokens one mode
  does not share with the other.

- **A composite part is matched against the part the rule expects next, not the first part whose
  predicate fits.** `from` and `to` share one predicate, so "find the first matching part" read every
  `to` hash as a second `from` and no from/to pair ever fired. A new rule with two parts of one kind
  hits the same trap.

- **A cell's expectation pins what recognition says today, which is not always the truth.** An
  identicon beside an address or a `Fire` instance for the `flame` sprite is `unrecognized` and the
  entry says so; a cell that stated the sprite would fail the committed set. The gap log, not the
  calibration set, is where the truth is recorded.

- **An arrow beside a truncated hash is not the icon that settles it.** The adjacency rule counts
  entity icons only; counting any icon made the `to` hash of a from/to pair "recognized" through the
  arrow alone, which is exactly the ambiguity the rule exists to keep.

## File map

- `./index.ts` — flags, the fetch, `--dump`, `--regions`, the header, outline and values on stdout, the
  sidecar write or the re-run diff, the `--correct`, `--override`, `--note`, `--calibrate` and `--refresh`
  paths; flag mechanics shared with the sibling tools in `../cli/flags.ts`
- `./config.ts` — token variable, API base, chrome name list, span tolerance, sidecar folder,
  calibration folder, gap log name, categories and stages, what a text style name is taken to claim
- `./url.ts` — Figma node link → file key and canonical node id
- `./figma.ts` — the nodes request, the node types the tool reads, the failure messages
- `./scope.ts` — the descent, the chrome rules, the outline and its text rendering
- `./colormap.ts` — the reverse color map built from the theme defaults: token reference resolution,
  the hex → tokens lookup, color mode detection
- `./values.ts` — the leaf walk under the confirmed regions: values per leaf, the color-mode vote,
  the hints and their verdicts in that mode, the text rendering of all three
- `./recognize.ts` — the lookalike normalizer, the text-shape rule table, icon matching against the
  sprite list, fills → tokens, the composite rule table, the per-leaf status and decision, the closing
  stdout lists
- `./sidecar.ts` — the record shape with the correction and override slots, its path under the main
  checkout, writing, reading, correcting and overriding one
- `./rerun.ts` — the diff of two records, the correction carry-over, the re-run text
- `./gaps.ts` — the gap log: its path, a correction's line and a note's line, the append
- `./calibration.ts` — the entry schemas and loader, the per-signal checks and the `--calibrate`
  report, the `--refresh` capture and the stale marking
- `./calibration/` — the committed set, one folder per labeled node
- `./layout-conventions.md` — the settled layout questions, one line each, read and appended by the skill
- `./fixtures/` — raw payloads captured with `--dump`, the only Figma data the specs touch
- `./run.sh`, `./tsconfig.json` — compile-on-run wrapper; the compiled output is git-ignored
