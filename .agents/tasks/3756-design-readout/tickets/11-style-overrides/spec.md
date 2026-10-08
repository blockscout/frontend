# 11 — Intended style overrides are not gaps

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 11 of #3756 |
| Blocked by | none (T10 landed) |

## What to build

The readout records a node as "the shipped component, with this deliberate style change" without
calling it a miss. A new tool command, `--override`, takes a node id and one or more `<prop>=<value>`
words — the exact Chakra prop and the value the mockup draws (`bg=whiteAlpha.100`,
`color=text.primary`, `fontWeight=500`) — and writes them to a new `override` slot on the node's
sidecar record, beside `correction`, which stays untouched. An override is not a correction: it names
no component, takes no `--gap`, and appends nothing to the gap log — the tool read the values right,
the disagreement is design intent. A color prop is checked against the node's resolved tokens for its
role (`bg` against the background fill, `color` against the text fill, `borderColor` against the
border) and refused with the tokens the node does carry when it names one the mockup does not draw;
any other prop is taken as given. A re-run carries an override exactly as it carries a correction:
kept while the values hold, `stale` once they differ, dropped with a vanished node.

The skill's shipped-code-vs-mockup conflict gains a second outcome. Where the disagreement is a style
the shipped component takes as a prop, the subagent's Ambiguous line carries the override form beside
the `context` proposal; the developer either corrects the node (`--correct … --gap context`, the
shipped code is wrong here) or overrides it (`--override`, the mockup styles this one instance on
purpose). `design-readout.md` shows the override in the Recognized table's Props cell, after the
component's own props, so the `[human]` style leaf reads "shipped + this override" off one row.

No repeat counting: an override that recurs across mockups is still an override per node; whether it
belongs in the theme is the developer's call at the style leaf, not the tool's.

## Acceptance criteria

- [ ] `pnpm design:readout <url> --override <nodeId> <prop=value…>` writes `override: { props,
      recordedAt, stale: false }` on the named node of the existing sidecar, offline, with no token,
      and prints the sidecar path and the override; it appends no line to `gaps.md`. `--override`
      with `--correct` or `--gap`, or with no `prop=value` word, or a word without `=`, exits non-zero
      with one line naming the rule; a node not in the sidecar exits as `--correct` does.
- [ ] `OVERRIDE_COLOR_PROPS` in `tools/design-readout/config.ts` maps `bg` → background, `color` → text,
      `borderColor` → border; an override naming one of these with a token absent from the node's
      `tokens` for that role exits non-zero and lists the tokens the node resolved for the role. A prop
      outside the map is accepted unchecked; the tool validates no Chakra prop name.
- [ ] `NodeRecord` in `tools/design-readout/sidecar.ts` gains `override: Override | null`; `buildRecord`
      sets it `null`; `readSidecar` fills a missing `override` with `null` so the existing version-2
      records keep reading, and `SIDECAR_VERSION` stays 2; `sidecar.spec.ts` lists the key and covers
      apply, replace and the unknown-node error for an override as it does for a correction.
- [ ] `carryCorrections` in `tools/design-readout/rerun.ts` carries `override` under the correction's
      rule (values changed → `stale`, decision changed → kept, node vanished → dropped and said), and
      the re-run text names the override on a changed or vanished line as it names a correction;
      `rerun.spec.ts` covers it.
- [ ] `--help` documents `--override` in the usage, the flag list and one paragraph after the
      `--correct` one; the sentence that an override is never a miss and logs no gap is in it.
- [ ] `readout-brief.md` step 1 reads `override` as settled unless `stale` (a stale one goes on the
      Ambiguous list with the override as the proposal); the "Shipped code vs mockup" rule says a
      disagreement the shipped component takes as a prop ends the Ambiguous line with
      `— override: <prop>=<token>[ <prop>=<token>]`, the return shape's Ambiguous line shows the
      optional tail, and the subagent still never picks.
- [ ] `SKILL.md` step 1 sends a `STALE` override to the developer with the stale corrections; step 3's
      conflict paragraph names both outcomes with the `--override` command; step 4 is unchanged.
- [ ] `readout-template.md` Recognized Props cell reads `<props, as words>[ · override <prop>=<value>…]`
      and "What goes where" says an override never moves a node between lists and sits beside a
      correction when both exist; the Signal column is unchanged.
- [ ] Parent spec FR 8 reads "the human correction and the style override once given" — the ticket's
      only edit to `spec.md`. FR 7, FR 11 and `GAP_CATEGORIES` are unchanged.
- [ ] `tools/design-readout/CONTEXT.md` "Where to look" gains one row for recording a deliberate style
      change; "What an editor here must keep true" gains the rule that an override is never a miss —
      no gap line, no component, color props checked against the node's resolved tokens — and the
      correction rule stays as written. `pnpm lint:doc-links` and the tool's specs pass.
- [ ] `(human)` Re-run the skill on node `22842:178041` (estimated cost of tx actions): record the
      header-row background and column-header color as overrides, see them in the Recognized Props
      cell of the regenerated block, and `gaps.md` gains no line.

## Details

- Why a slot and not a gap category: a category rides on `Correction`, which requires a component and
  always logs; an `override` category would special-case both invariants and could not coexist with a
  real miss on the same node (one slot). The slot keeps "a correction is always a miss" true verbatim.
- Override form, fixed in `--help` and the brief's return shape: `<prop>=<value>`, the Chakra prop
  name as written in JSX, the value a theme token (`whiteAlpha.100`, `text.primary`) or a plain value
  (`500`); no spaces inside a word, one word per prop. Repeating `--override` on a node replaces the
  earlier override whole, as `--correct` does.
- The token check reads the node's recorded `tokens` (`ColorTokens` per role in `recognize.ts`) and
  nothing else: no theme lookup at override time, so the check is offline and the match is against
  what the Recognized list printed for that fill. The role mapping lives in `config.ts` only.
- Separate runs: `--override` and `--correct` on one node are two commands, like `--calibrate` and
  `--refresh`; the parser rejects them together rather than ordering them.
- Edit skills under `.agents/` only after reading `.agents/README.md` (dual frontmatter, symlinks);
  `.agents/rules/docs.md` governs the CONTEXT.md lines.

## Leaf worklist

- [ ] 1 `[agent]` `config.ts` prop → role map; `sidecar.ts` `Override` slot, reader default, apply; `index.ts` `--override` parse, record, token check, usage; specs; FR 8 phrase
- [ ] 2 `[agent]` `rerun.ts` carry-over and re-run text for overrides; `rerun.spec.ts`
- [ ] 3 `[agent]` `readout-brief.md` conflict tail and settled rule; `SKILL.md` step 1 and 3; `readout-template.md` Props cell; `CONTEXT.md` row and rule; `pnpm lint:doc-links`
- [ ] 4 `[human]` Re-run on `22842:178041`, record the two overrides, confirm the `(human)` criterion
