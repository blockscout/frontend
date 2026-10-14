# Design readout — context

Reads one Figma node and writes what it found to a sidecar: the content root and the chrome dropped
on the way down, the values of every leaf under the confirmed regions, and per leaf what the tool
recognizes from those values. The developer runs it through the `design-readout` skill once the
task's spec is written and before its tickets are cut (`.agents/tasks/README.md`). It reads through
the Figma REST API, never the MCP. The task spec behind the tool: `.agents/tasks/3756-design-readout/spec.md`.

Usage and flags: `pnpm design:readout --help`. Every tunable and list (chrome names, gap categories
and stages, lookalike characters, adjacency gaps) is in `./config.ts`.

## Where to look

| Question | Answer lives in |
| --- | --- |
| Where is a run's record? | `<main checkout>/.ai/design-readout/<fileKey>-<nodeId>.json`, one per node, shared by every worktree (`../cli/checkout.ts` resolves it through the git common dir). `./record/sidecar.ts` is the shape |
| Where is the gap log? | `<main checkout>/.ai/design-readout/gaps.md`, written by `./record/gaps.ts`, append-only |
| Which layout questions are settled? | `./layout-conventions.md`, one table; its header row is the format, the `design-readout` skill appends to it |
| What does the raw payload look like? | `./fixtures/`, one `--dump` per node, named `<node id>-<light\|dark>.json` |

## Calibration

`./calibration/entries/<entry>/` holds `expected.json` (Figma link, node id, shipped component path,
and per cell the component, props and the signals recognition must give, keyed by leaf id) and
`snapshot.json`, the tool's own extraction of the node. `./calibration/index.ts` has the schemas.

To add an entry: write `expected.json` with `cells: {}`, run `pnpm design:readout --refresh <entry>`
to capture the snapshot, then fill the cells from the shipped component's JSX. `--calibrate` must
pass before the commit.

A cell pins what recognition says today, which is not always the truth. An identicon beside an
address or a `Fire` instance for the `flame` sprite is `unrecognized`, and the entry says so; the gap
log is where the truth is recorded. A `--calibrate` miss is offline and never means Figma changed. It
means a rule change moved a cell, and the entry is updated in the same change.

## What an editor here must keep true

- **A failed fetch is a failed run.** No token, a rejected token, a node not in the file: exit
  non-zero, one line on stderr, nothing on stdout. The opposite of `tools/review-screen/`, whose
  failures still produce output; do not copy that rule over.
- **The token variable is named in `./config.ts` only.** An agent told the variable's name will try
  to set it.
- **Scoping is a pure function of the REST payload.** `./extract/scope.ts` takes the document and nothing
  else, so its specs run over `./fixtures/` and never reach Figma. A rule that needs a second request
  belongs in `./fetch/figma.ts` and reaches `./extract/scope.ts` as data.
- **Nothing under this folder imports `src/config`**, directly or through the composed theme
  modules. The color map is built from the config-free theme defaults, so an instance's runtime
  color overrides are never in it.
- **Recognition names no component.** The tool decides a signal and what it says; mapping that to a
  repo component is the skill's judgment with the ticket in hand. Icon names come from the generated
  `public/icons/name.d.ts`, read at run time, so the tool and the sprite cannot drift.
- **Hints are never stored.** A Figma style, component or layer name is printed beside the value and
  goes nowhere else; a hint in the record would be read back as a fact by the next phase.
- **A correction is always a miss, an override never is.** `--correct` and `--note` without `--gap`
  exit non-zero. The phase 2 decision is a hand count over `gaps.md`, and a miss that skips the log
  makes the count lie small. A correction with the category `convention` lets that count set the
  line aside, so `layout` lines mean real misses.
- **Snapshots and fixtures are captured by the tool, never hand-edited.** A payload field the tool
  starts reading is already in a fixture; a snapshot has to be captured again with `--refresh`.
- **The committed calibration set passes.** A recognition change that moves a calibrated cell lands
  together with the entry update that says so.

## File map

- `./index.ts` — dispatch and the entry-point guard
- `./config.ts` — every constant and list the tool reads
- `./cli/` — the usage text and argument parsing; the per-flag runs and what they print
- `./fetch/` — Figma node link to file key and node id; the nodes request and its failures
- `./extract/` — the descent and the chrome rules; the leaf walk under the confirmed regions, hints,
  the color-mode vote
- `./recognize/` — hex to theme tokens from the theme defaults; text-shape rules, icon matching,
  composites, the per-leaf status
- `./record/` — the sidecar with its correction and override slots; the diff and carry-over on a
  second run; the gap log
- `./calibration/` — the calibration checks and refresh; `entries/` is the committed set
- `./layout-conventions.md` — the settled layout questions
- `./fixtures/` — raw payloads captured with `--dump`, the only Figma data the specs touch
- `./run.sh`, `./tsconfig.json` — compile-on-run wrapper; the compiled output is git-ignored
