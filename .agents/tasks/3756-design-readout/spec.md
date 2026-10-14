# Design readout: map a Figma node to repo components, props and tokens (phase 1)

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3756 |
| Feature branch | `issue-3756` |
| PM | — (frontend tooling task; owner: tom) |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

"Final markup and styling to match the designer's Figma mockups" is on the humans-only list in
`.agents/delegation.md`. The blocker is not the agent's eye but the input: the Figma files are dirty by
policy — detached components, unnamed layers, style names that disagree with the actual colors — and the
designer's workflow will not change. So the *semantic* channel from Figma (component, variant and style
names) is unreliable, while the *value* channel (text content, fills, fonts, icon instance names, geometry)
is intact. A hand calibration over five nodes confirmed this: every value-based recognition hit, and three
of five style names were misleading.

The task does recognition on our side. A `design-readout` tool and skill turn a Figma node into a readout
that names the repo component, its props and the design tokens per node, and lists every ambiguous,
unrecognized and layout item explicitly for a developer to resolve *before* any markup work starts. Phase 1
built the readout as the developer's input for a hand-made markup leaf. Q02 then loosened the boundary:
the readout is a *supporting* input, the agent does the markup leaf from it — or from the mockup alone
when no readout was made — and the developer verifies in the running app and has every correction
recorded. Phase 2 — automated verification of the rendered page against the readout — is a later issue;
the gap log is read by hand.

## Functional requirements

1. **Tool** — a CLI under `tools/design-readout/` (`pnpm design:readout`) that, given a Figma node URL,
   reads the node tree through the Figma REST API nodes endpoint. It takes its personal access token from
   the environment; the variable is the tool's concern only and no agent instruction names it. A missing or
   rejected token fails the run with a clear message; the tool never falls back to another source.
2. **Scoping outline.** The tool's first output for a node is an outline for the developer to confirm:
   the content root and the chrome it dropped on the way down. One link is one screen in one state: a
   state or a mobile variant of the screen is a separate node the developer links separately, so the
   tool never looks for siblings or variants, and hidden layers (visibility off) are not part of the
   screen and are ignored. Chrome is recognized structurally (library instances with no exposed children
   spanning the *screen's* width or height — the linked node's, not the parent's, so an empty-state
   instance filling its column is content), by a name list the tool ships (menu, navigation, top bar,
   search header, footer; matched across case and separators), or by holding nothing but chrome (a
   sidebar frame wrapping the menu and its collapse bar). The content root is reached by descending
   through single-visible-child wrappers, dropping chrome at each level, until a node with two or more
   non-chrome children; inside the content root, chrome is still dropped wherever the name list matches
   (a search header beside the page title), while the structural rule stops at the root.
3. **Readout.** For each confirmed region the tool extracts, per leaf node, the *values*: text content,
   fill hex plus opacity per role (text, background, border, icon), font family / weight / size / line
   height, icon instance name, trailing glyphs, bounding box. The Figma style and component names are
   carried as *hints* only, flagged where they disagree with the values.
4. **Deterministic recognition** lives in the tool, unit-tested, in this priority order: text-shape rules
   (address, transaction and method hashes, block / batch / epoch numbers, timestamps, tickers, NFT ids)
   with lookalike-character normalization (Cyrillic `х` in `0х05…` was seen in a mockup); a truncated hash
   with no icon is always ambiguous. Then icon recognition by normalized instance name against the
   generated sprite name list. Then hex plus role to semantic token via a reverse map. Then composite rules
   over recognized siblings (entity + arrow + entity, amount + ticker).
5. **Reverse color map** is built in-process from the theme's default colors and semantic tokens, keyed
   by color mode; nothing is generated into the repo. Runtime theme overrides from app config are ignored. A hex that serves several tokens returns all of them and
   the role filters; the color mode is detected from the values themselves, with the frame background as
   tiebreaker, and recorded per run.
6. **Skill** — `.agents/skills/design-readout/` is the thin driver: it runs the tool, applies the
   judgment parts the tool cannot (context override from the ticket and API resource type toward
   interchain / L1 / external entity variants; badge and tag fingerprints; layout questions such as a
   value shown in its own column vs under another cell), and produces the readout. It runs in a
   subagent and returns only the Ambiguous, Unrecognized, Layout and By convention lists (the last
   one the layout questions `layout-conventions.md` already answers, applied) with a count of
   Recognized nodes.
7. **Readout rules.** Never invent a component — an unmatched node is Unrecognized with its resolved
   values, not a guess. Trust the hex over the Figma style name and record the disagreement. When the
   shipped code and the mockup conflict (a batch icon in Figma vs `noIcon` in the shipped row), report the
   conflict; do not pick.
8. **Sidecar.** Every run writes one JSON to `.ai/design-readout/` in the main checkout (resolved through
   the git common dir): file key, node id, file `lastModified` and `version`, the detected color mode, and
   per node its values, decision (component, props, tokens, the signal that fired), status (recognized /
   ambiguous / unrecognized), the human correction and the style override once given, and bounding box. Figma hints are not
   stored.
9. **Re-run.** Running the tool again for a node it has a sidecar for diffs against it and reports only
   changed leaves; settled corrections carry over. No workflow step re-runs on its own; the developer
   re-runs when the mockup moved.
10. **Calibration.** `tools/design-readout/calibration/` holds committed value snapshots (the tool's own
    extraction, not raw Figma payloads) for a labeled set, each paired with the expected component and
    props per cell. `pnpm design:readout --calibrate` runs recognition over the snapshots offline and
    prints hits and misses per signal; `--refresh` re-fetches a snapshot from Figma, and a vanished node
    marks its entry stale rather than failing the run. The set is seeded with ten shipped components,
    six of them table rows, each with its Figma node (Q01).
11. **Gap log.** `.ai/design-readout/gaps.md`, one line per miss with a stage (readout / markup) and a
    category from shape / icon / color / composite / context / layout / convention / markup. The skill
    appends a line whenever the developer corrects an Ambiguous or Unrecognized item in session (category
    proposed, developer confirms). Misses found at the markup leaf are the developer's own edits: on
    request the agent reads the developer's diff against the hand-off tree and records each one —
    node-mapped through `--correct` / `--override`, the rest through `--note <text> --gap markup`. The
    phase 2 decision is a hand count over this file.
12. **Workflow integration.**
    - `grill-the-task` enumerates the Figma links, one node per screen and state; it runs no readout.
      A new route's nav icon is `add-new-page`'s own Step 0 input, not an interview item.
    - The readout is an optional step the developer runs between `to-spec` and `to-tickets`, per link or
      with no URL for every spec link without a block yet: scoping outline confirmed in the main session,
      readout in a subagent, Ambiguous items resolved by the developer first; the skill writes
      `design-readout.md` into the task folder (Recognized table, Ambiguous, Unrecognized, Layout
      questions) and a `questions.md` entry per design-intent question the developer sends on.
      `structure.md` carries the file's row; it is pruned at land like the ticket files.
    - `to-tickets` cuts the style leaf `[agent]` with a mandatory `(human)` "matches the mockup"
      criterion and links the readout block beside the Figma node when one exists. A style leaf covers
      every breakpoint.
    - `implement-ticket` runs the markup leaf in session from the readout, or from the mockup through
      the Figma MCP when there is none — it never runs the tool, which is the developer's step; at hand-off it stages the work and prints its tree hash; on the developer's
      request it records their corrections from the diff. No `TODO (design):` markers: an item still
      with the designer is a `Blocked by Q<NN>` edge and nothing else.
    - `delegation.md`: design readouts, markup and styling to the mockup, and sprite icons the readout
      recognized are agent work; visual polish, Playwright baselines and design sign-off stay human.
    - A small task that gets no spec gets no readout; the agent styles from the mockup.

## Data & API

- Figma REST API `GET /v1/files/:key/nodes?ids=…`, header `X-Figma-Token`, scopes `file_content:read` +
  `current_user:read`. Personal access tokens expire after at most 90 days; the tool's `--help` says so.
  Verified in session on a dark-mode node: the payload carries per-node `fills` with color and opacity,
  text style, `visible: false` on hidden nodes (the MCP design context omits those), bounding boxes,
  resolved style names, and file `lastModified` / `version`.
- No `NEXT_PUBLIC_*` env var, no runtime code, no API resource.

## UI inventory

None. This task ships no user-facing surface.

## Implementation decisions

- **REST, not the Figma MCP, for the tool.** The MCP is session-only and its metadata for one page frame
  exceeds 400k characters, so it cannot be read in context anyway; REST returns the value channel as JSON,
  works for calibration refresh in any session, and is testable against saved responses. The MCP stays
  available to the skill for a screenshot only.
- **Tool + skill split by determinism**: what is a pure function of the node tree (scoping, text shapes,
  color map, icon names, composites, calibration diff) is TypeScript with specs; what needs the ticket,
  the API type or taste is skill text.
- **Follows the `tools/<name>/` layout** of `tools/review-screen/` (`index.ts`, `config.ts`, `run.sh`,
  `CONTEXT.md`, flag parsing from `tools/cli`), and its sidecar convention: main checkout, git-ignored
  `.ai/`, one JSON per run.
- **Icon matching by name, not by SVG bytes.** Figma's exporter re-serializes paths and the sprite
  pipeline runs SVGO and rewrites fills to `currentColor`, so byte or path equality is hopeless. Instance
  names stayed linked in every calibrated node even when the parent was detached. Geometry matching, if
  ever, is phase 2.
- **Hex first, hints as labels.** The dark-mode probe returned `rgba(255,255,255,0.8)` with a style hint
  naming `text.primary` at `#FFFFFF`; the value resolves to `whiteAlpha.800` → `text.primary` (dark), the
  hint's hex would have mis-tokenized to `white`. The same file mixes light and dark hints.
- **Readout after the spec, before tickets** (Q02; at first it ran inside grilling). The spec carries the
  context the readout's judgment needs — entity family, API resource type — and ambiguities still become
  `questions.md` entries before tickets are cut, which is the whole point of the question gate in
  `implement-ticket`. Running it in its own session keeps the grill short.
- **Supporting, not required** (Q02). The agent styles with or without a readout and the developer always
  verifies; the readout's worth is the question gate and the logged corrections, not a precondition.
- **Corrections come from the developer's diff, not from dictation** (Q02): fixing by hand is faster than
  describing the fix; the agent's job is to read the diff and log it. The boundary is the tree hash the
  agent prints at hand-off, so staging on either side cannot blur it, and nothing unverified is committed.
- **The readout is a pruned task artifact, not spec content.** A per-node component table in the spec's UI
  inventory would be the value-copying that `concepts.md` forbids.
- **Sidecar shape is the minimum the phase 2 decision and calibration need**: status, correction and gap
  category answer "are the gaps small?"; values and the fired signal give per-signal precision and re-run
  diffs; bounding boxes are free from REST. Figma hints are dropped — the calibration already proved them
  misleading.
- **Source of the shape**: the five-step template of the pstack `create-verification-skill`
  (interview the repo → generate → seed a feature map → prove by running once → maintain) — adopted as a
  shape, not verbatim; the calibration set is the feature map, `--calibrate` is the proof.
- **Vocabulary**: "readout" and "design readout" go into `.agents/GLOSSARY.md`.

## Out of scope

- **Phase 2**: automated verification of a rendered component against the readout (pixel or structure
  diff) and a `verify-design` review axis. A side-by-side of a Playwright shot and the Figma screenshot
  in the hand-off is the first candidate.
- **Agent-run Playwright baselines**: the developer runs the one command after verifying.
- **Dropping `TODO (api-data):` markers**: they are `add-new-page`'s own phase marker, not a hand-over.
- **Icon geometry matching** against sprite sources.
- **Any change to the designer's Figma workflow or file hygiene.**
- **Automated routing of Ambiguous items to the designer** — they go through the normal grill-time
  question flow.
- **A token setup flow in the skill**: the skill says the tool needs a token and stops; obtaining one is
  the developer's two-minute job.
- **Numeric phase 2 gates.** The gap log is read by hand.
