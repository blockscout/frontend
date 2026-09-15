# 06 — Transaction state changes

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 06 of #3671 |
| Blocked by | T02, Q01 |

## What to build

The State tab of a transaction shows an ERC-8056 holder's balance before, balance after and change in scaled
units, each with the tag and the disclosure tooltip, using the state change's own `ui_multiplier` (the factor
in force at that block). Today `getStateElements` divides by decimals inline and renders bare text; it moves
onto `AssetValue` so scaling and tooltip come from the shared primitive rather than a second implementation.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open the tx of a live transfer with `?tab=state`

- [ ] `getStateElements` renders before / after / change through `AssetValue` (no exchange rate — state
      changes never showed USD) with the state change's `ui_multiplier` passed via T01's predicate; the sign
      and colour of the change are preserved.
- [ ] A state change with `ui_multiplier: null` renders unscaled with no tag through the predicate's
      existing `undefined` path (Q01); no fallback to the token's current factor.
- [ ] Non-ERC-8056 token state changes render the same numbers as before (existing `TxState.pw.tsx`
      baselines unchanged apart from the tooltip now existing).
- [ ] Playwright scaffold: `TxState.pw.tsx` gains an ERC-8056 row from a new state-change mock.
- [ ] `(human)` Before/after/change values are `1.69 ×` the raw ones, tagged, with the tooltip.

## Details

No dedicated mockup; reuse T02's amount treatment. `src/slices/tx` imports the predicate from the token slice
and never reimplements the scaling.

## Leaf worklist

- [ ] 1 `[agent]` Move `getStateElements` amounts onto `AssetValue` with the multiplier; state-change mock;
      Playwright scaffold
- [ ] 2 `[human]` Check the tag fits the state table's numeric cells; generate baselines
