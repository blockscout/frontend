# 01 — Tool skeleton, Figma fetch and scoping outline

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3756 |
| Blocked by | none |

## What to build

A developer runs `pnpm design:readout <figma node URL>` and gets the scoping outline for that node: the
content root the tool descended to and the chrome it dropped at each level, with the rule that dropped
it (structural or name list). One link is one screen in one state: hidden layers are ignored, and
siblings or variants are never looked for. The outline is for the developer to
confirm before any readout; it is text on stdout. Without a token, or with a rejected one, the run fails
with one clear line and never tries another source. `--help` documents the flags and that personal access
tokens expire after at most 90 days. Nothing is written to disk yet — that is ticket 03.

## Acceptance criteria

How to verify: `pnpm design:readout <URL from Details>` in a shell that has the token.

- [ ] `tools/design-readout/` follows the `tools/review-screen/` layout: `index.ts`, `config.ts`,
      `run.sh`, `tsconfig.json`, `CONTEXT.md`; flags parsed with `tools/cli/flags.ts`; compiled output
      git-ignored; `pnpm design:readout` in `package.json`.
- [ ] The URL parser accepts both the `design/<key>/...?node-id=A-B` and `A:B` forms and rejects
      anything else with a usage line; covered by a spec.
- [ ] The fetch uses `GET /v1/files/:key/nodes?ids=…` with the `X-Figma-Token` header; a missing or
      rejected token exits non-zero with a one-line reason naming no fallback.
- [ ] `--dump <path>` writes the raw REST payload so a fixture can be captured from any node later.
- [ ] Scoping is a pure function over the node tree with specs against the saved fixtures: descends
      single-visible-child wrappers, drops chrome (structural rule *or* the shipped name list), stops at
      the first node with two or more non-chrome children, then keeps dropping name-list chrome anywhere
      inside it; hidden layers are ignored throughout.
- [ ] `tools/design-readout/fixtures/` holds the two captured payloads named by node id, and a spec reads
      them; the fixtures are the only Figma data the tests touch.
- [ ] `CONTEXT.md` follows `.agents/rules/docs.md` (where-to-look table, constraints, gotchas); the
      token variable is named in `config.ts` only, never in `CONTEXT.md` or any skill text.
- [ ] `(human)` The outline printed for each of the two Details nodes matches what you see in Figma:
      right content root, chrome dropped and nothing else.

## Details

- Fixture nodes: `22842-174340` and `22842-178383` in the "Blockscout desktop pages" Figma file (the
  file key is in the issue's Figma links; URL form `https://www.figma.com/design/<fileKey>/?node-id=<nodeId>`).
  One is expected to be a
  light-mode frame and the other dark; record which is which in the fixture file name once the payload
  shows it.
- The developer's shell already exports the token (see Skill inputs); the agent inherits it, so it can
  run the tool and capture the fixtures itself. Capture them with `--dump`, not by hand-editing.
- Chrome name list shipped in `config.ts`: menu, navigation, top bar, search header, footer (substring
  match on the layer name ignoring case and separators, so `topbar_desktop` meets `top bar`).
- Structural chrome rule: a library instance with no exposed children whose box spans the *screen's*
  (the linked node's) full width or full height — measured against the parent it would eat an
  empty-state instance filling its column.
- Wrapper rule: a plain frame whose visible children are all chrome is chrome (a sidebar frame holding
  the menu and its collapse bar); otherwise the descent stops at it as a second content child.
- `tools/review-screen/CONTEXT.md` is the model for the constraints section; the review-screen
  "A tool failure never fails a review" rule does *not* carry over — here a failed fetch is a failed run.

## Skill inputs

### `design-readout` tool (no project skill; executor reads these)

- Token env var the tool reads: `FIGMA_API_KEY` — name it in `config.ts` only. This ticket file is
  pruned at land, which is why the name may appear here and nowhere durable.
- `package.json` script: `"design:readout": "./tools/design-readout/run.sh"`.

## Leaf worklist

- [x] 1 `[agent]` Scaffold `tools/design-readout/` (run.sh, tsconfig, config, flags, `--help`, URL parse, package script)
- [x] 2 `[agent]` Figma nodes fetch with token handling and `--dump`
- [x] 3 `[agent]` Capture the two fixtures with `--dump` and commit them
- [x] 4 `[agent]` Scoping outline (content root, chrome) with specs over the fixtures
- [x] 5 `[agent]` `CONTEXT.md` for the tool; add the tool to the per-directory list in `.agents/CLAUDE.md`
