# 06 — Re-run diff, corrections and the gap log

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3756 |
| Blocked by | T05 |

## What to build

Running the tool again for a node that already has a sidecar diffs the new extraction against it and
prints only the leaves whose values or decision changed; nodes with a settled correction keep it unless
their values changed, in which case the correction is reported as stale and kept for the developer to
re-confirm. A developer records a correction with `pnpm design:readout <url> --correct <nodeId>
<component>[ <props…>] --gap <category>`: the sidecar node gets its `correction`, and
`.ai/design-readout/gaps.md` gains one line with the date, file key, node id, the category (shape / icon
/ color / composite / context / layout), what the tool said and what the developer said. A correction
without `--gap` is rejected, because every correction is by definition a miss.

## Acceptance criteria

- [ ] Re-run diff is a pure function over two records with specs: unchanged (prints nothing per
      node), changed values, changed decision, new node, vanished node.
- [ ] Carry-over: a correction on an unchanged node is kept and counted as recognized by correction;
      on a changed node it is kept and flagged stale; specs cover both.
- [ ] `--correct` + `--gap` update the sidecar and append to `gaps.md`; the category is validated
      against the six; a correction with no `--gap` exits non-zero with the reason.
- [ ] `gaps.md` is created with a header line on first write and only appended afterwards; a spec
      writes twice into a temp dir.
- [ ] `CONTEXT.md` gains the gap log row and the "a correction is always a miss" constraint.

## Details

- `--correct` does not fetch: it operates on the existing sidecar, so it works offline and does not
  need the token. A missing sidecar is an error naming the expected path.

## Leaf worklist

- [ ] 1 `[agent]` Re-run diff and correction carry-over with specs
- [ ] 2 `[agent]` `--correct` / `--gap` flags, sidecar update, `gaps.md` append, specs
- [ ] 3 `[agent]` `CONTEXT.md` rows and `--help`
