# Design readout — context

Turns a Figma node into material a developer confirms before any markup work: the *scoping outline* —
which node is the content root and which chrome was dropped on the way down, with the rule that
dropped it — under the confirmed regions, the *values* of every leaf (text, fills per role, font,
icon instance name, trailing glyphs, bounding box) — and per leaf what the tool *recognizes* from
those values (a hash, a number, a timestamp, a sprite icon), with a status and the signal that fired,
all written to a sidecar. It reads the node through the Figma REST API, never through the MCP; the
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
| Which tokens does a hex serve, in which mode? Which role narrows to which token prefixes? | `./colormap.ts` builds the map from the theme and answers over it; `./config.ts` holds the role prefixes |
| Which text shapes are recognized, in what order, with what example? Which characters are lookalikes? | `TEXT_SHAPE_RULES` in `./recognize.ts`, one example per rule; `./config.ts` holds the lookalike table |
| How is an icon instance name matched to a sprite name? What counts as "beside"? | `normalizeIconName` / `matchIconName` in `./recognize.ts`; the adjacency gap in `./config.ts` |
| What can a node's status be, and what does each mean? | `RecognitionStatus` in `./recognize.ts`: `recognized` (a signal fired and settles the shape), `ambiguous` (a signal fired but the shape alone cannot settle it — a truncated hash with no icon beside it), `unrecognized` (nothing fired; the values are listed, never a guess) |

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

## File map

- `./index.ts` — flags, the fetch, `--dump`, `--regions`, the header, outline and values on stdout, the
  sidecar write; flag mechanics shared with the sibling tools in `../cli/flags.ts`
- `./config.ts` — token variable, API base, chrome name list, span tolerance, sidecar folder, what a
  text style name is taken to claim
- `./url.ts` — Figma node link → file key and canonical node id
- `./figma.ts` — the nodes request, the node types the tool reads, the failure messages
- `./scope.ts` — the descent, the chrome rules, the outline and its text rendering
- `./colormap.ts` — the reverse color map built from the theme defaults: token reference resolution,
  the hex → tokens lookup, color mode detection
- `./values.ts` — the leaf walk under the confirmed regions: values per leaf, the hints and their
  verdicts, the text rendering of both
- `./recognize.ts` — the lookalike normalizer, the text-shape rule table, icon matching against the
  sprite list, the per-leaf status and decision, the closing stdout lists
- `./sidecar.ts` — the record shape, its path under the main checkout, writing and reading one
- `./fixtures/` — raw payloads captured with `--dump`, the only Figma data the specs touch
- `./run.sh`, `./tsconfig.json` — compile-on-run wrapper; the compiled output is git-ignored
