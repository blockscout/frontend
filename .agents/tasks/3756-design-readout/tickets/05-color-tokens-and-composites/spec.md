# 05 — Color tokens and composite rules

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3756 |
| Blocked by | T02, T04 |

## What to build

The run detects the color mode from the extracted values (frame background as tiebreaker), records it in
the sidecar, and resolves every fill hex plus role to its semantic tokens through the reverse map; a hex
serving several tokens lists them all and the role narrows. Composite rules then run over recognized
siblings: entity + arrow + entity becomes a from/to pair, amount + ticker becomes a value with its
currency. A composite fires only over nodes already recognized; it never promotes an ambiguous one. The
readout now carries tokens and composite decisions per node, and the color-mode line at the top.

## Acceptance criteria

- [ ] Mode detection from ticket 02 is applied per run and written to the sidecar's `colorMode`.
- [ ] Each fill resolves to zero, one or several tokens through the lookup with its role; the hex is
      trusted over the style hint and a disagreement is reported, not stored; specs cover the multi-hit
      and the unmapped hex (Unrecognized with hex and role).
- [ ] Composite rules are a table like the text shapes: entity + arrow + entity, amount + ticker; specs
      cover a hit and a near-miss (an ambiguous member blocks the composite).
- [ ] Stdout Recognized items show their tokens and composites; Ambiguous and Unrecognized lists are
      unchanged in shape.
- [ ] `(human)` Run against the dark-mode Details node of ticket 01: mode reads dark, the primary text
      fill resolves to `text.primary`, and the readout's three lists look right against the frame.

## Details

- Sibling order for composites is the bounding-box order inside the parent (left to right, then top
  to bottom), not layer order; Figma layer order is unreliable in these files.

## Leaf worklist

- [ ] 1 `[agent]` Mode detection per run + hex/role → tokens in the decision, specs
- [ ] 2 `[agent]` Composite rules over recognized siblings, specs
- [ ] 3 `[agent]` Stdout and sidecar carry tokens, composites and `colorMode`
