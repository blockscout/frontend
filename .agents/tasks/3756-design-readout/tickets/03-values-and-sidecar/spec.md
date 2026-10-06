# 03 — Value extraction and the sidecar

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3756 |
| Blocked by | T01 |

## What to build

After the outline, the tool walks every confirmed region and extracts the *values* per leaf node: text
content, fill hex plus opacity per role (text, background, border, icon), font family / weight / size /
line height, icon instance name, trailing glyphs, bounding box. Figma style and component names ride
along as hints and are flagged where they disagree with the values (a style named for one hex while the
fill carries another). The run writes one JSON to `.ai/design-readout/` in the main checkout — file key,
node id, file `lastModified` and `version`, the color mode slot (filled by ticket 05), and per node its
values and bounding box; hints are printed, never stored. Confirmation of the outline is a flag
(`--regions <ids>`; default: the content root) so a non-interactive run is possible.

## Acceptance criteria

- [ ] Extraction is a pure function over the fixture trees with specs: a text node, a filled frame, an
      icon instance, a node with a trailing glyph, and a hidden node (excluded) each have a case.
- [ ] A hint that disagrees with the value is reported as a disagreement with both sides; a spec covers
      the dark-mode `text.primary` hint over a `whiteAlpha` fill.
- [ ] The sidecar lands in `<main checkout>/.ai/design-readout/<fileKey>-<nodeId>.json`, resolved through
      the git common dir the way `tools/review-screen/sidecar.ts` does; a `version` field on the record;
      a spec reads one back.
- [ ] The record carries no Figma hint, style name or component name; a spec asserts the keys.
- [ ] `CONTEXT.md` gains the sidecar row in its where-to-look table and the "hints are never stored"
      constraint.

## Details

- Reuse the main-checkout resolution from `tools/review-screen/sidecar.ts` by moving it to `tools/cli/`
  rather than copying it.
- Per-node record shape (the minimum the phase 2 decision needs, per the spec): `id`, `values`,
  `bbox`, and slots for `decision`, `status`, `correction` that later tickets fill.
- `.ai/` is already git-ignored.

## Leaf worklist

- [x] 1 `[agent]` Prefactor: lift main-checkout resolution from review-screen into `tools/cli/`
- [x] 2 `[agent]` Value extraction per leaf with hint disagreement flags, specs over fixtures
- [x] 3 `[agent]` Sidecar write/read, `--regions`, record shape, `CONTEXT.md` rows
