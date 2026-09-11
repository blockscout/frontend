# 02 — Scaled amounts in the shared primitive; token holders and token details

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3671 |
| Blocked by | T01 |

## What to build

The shared amount primitive learns to scale. `calculateUsdValue` / `AssetValue` / `SimpleValue` accept a
multiplier; when one is given the displayed amount is `raw × multiplier`, fiat is computed from the scaled
amount, and the tooltip states the scaled value (full precision, as today), the raw value, and the factor
applied. A new `TokenMultiplierTag` in the token slice renders the factor next to an amount. When the
predicate from T01 yields nothing, none of this appears and the output is byte-for-byte today's.

Two surfaces demonstrate it, both reading the token's current `ui_multiplier`: the Holders tab's Quantity
column (scaled, tagged, tooltip), and the token details page — total supply scaled with the tooltip but no
tag (the Multiplier row just above already states the factor), circulating supply and market cap untouched,
plus the new **Multiplier** row: the effective factor with the hint tooltip. The "View history" toggle and
the inline table are T08.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open
`/token/0x6D50E6CBca0e390BbCF82bEA80B31F4c2694395e` (Details, then Holders)

- [ ] `AssetValue` takes an optional `multiplier` (`BigNumber | null | undefined`); `calculateUsdValue`
      multiplies `valueBn` by it before formatting and before `usdBn`; existing callers that pass nothing
      render exactly as before (existing `AssetValue.pw.tsx` screenshots unchanged).
- [ ] With a multiplier, `SimpleValue`'s tooltip shows three lines: scaled amount (full precision, with the
      existing copy button), raw amount, and the factor formatted by T01's formatter.
- [ ] `TokenMultiplierTag` lives in `src/slices/token/components/`, takes the multiplier, renders the
      formatted factor, and is shown when the factor is exactly 1.
- [ ] Holders Quantity uses the scaled amount and carries the tag on table and list rows; the Percentage
      column is unchanged (a ratio, multiplier-invariant).
- [ ] Token details: Total supply is scaled with the tooltip and no tag; Circulating supply and Circulating
      market cap are not scaled; the socket-patched `total_supply` in `Token.tsx` still scales (it flows
      through the same `AssetValue`).
- [ ] Token details shows a Multiplier row directly under Price (or first, when there is no price) with
      hint "Token amounts shown are scaled by this factor compared to the raw ERC-20 token"; the row is absent
      when the predicate yields nothing.
- [ ] Playwright scaffolds: `TokenHoldersTable.pw.tsx` / `TokenHoldersList.pw.tsx` gain an ERC-8056 case
      using `tokenInfoERC8056`, with `NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES` set the way
      `AddressTokens.pw.tsx` does for `ZRC-2`; `Token.pw.tsx` gains an ERC-8056 details case. Screenshot
      baselines are generated only in the style leaf.
- [ ] Unit spec for `calculateUsdValue` with a multiplier: value, USD, and the "no multiplier" identity.
- [ ] `(human)` Holders quantities read `1.69 ×` the raw balance, the tag reads `1.69x`, the tooltip lists
      scaled, raw and factor; Total supply reads `1,690,000 IOU`; the Multiplier row reads `1.69x`.
- [ ] `(human)` With `ERC-8056` dropped from the additional-types list (override it in the git-ignored
      `.env.local`, which wins over `.env.extra`), the same page renders as a plain ERC-20: no tag, no
      Multiplier row, raw amounts.

## Details

**Where the factor enters.** `TokenValue` already receives the whole token, so it can call the predicate
itself. `AssetValue` receives only `decimals` and `exchangeRate`, so call sites that use it directly (holders,
supplies, the transfer rows in T03) pass `multiplier` explicitly from the predicate. Do not make `AssetValue`
depend on the token slice — shared primitives stay slice-agnostic; the predicate runs at the call site.

**Tooltip.** Extend the tooltip `SimpleValue` builds today (`value.toFormat()` + copy) rather than replacing
it through `tooltipContent`; the raw and factor lines are appended under it so every caller gets the same
disclosure. Mockup for the tag and the tooltip text: token transfers frame, node 5995:28720.

**Multiplier row.** Follow the Price row's `DetailedInfo.ItemLabel hint=… / ItemValue` pair in
`TokenDetails.tsx`; the value is the formatted factor. Mockup: node 5995:20900, first `Multiplier` row (ignore
the expanded-history variants; T08).

**Supplies.** Spec, Data & API: `total_supply` is raw and scales; `circulating_supply` is already in UI
units; `circulating_market_cap` is fiat.

## Leaf worklist

- [x] 1 `[agent]` `multiplier` through `calculateUsdValue` → `AssetValue` → `SimpleValue` tooltip; unit spec
- [x] 2 `[agent]` `TokenMultiplierTag` scaffold in the token slice (placeholder presentation,
      `TODO (design):` markers)
- [x] 3 `[agent]` Wire holders Quantity (table + list) and token details (supplies, Multiplier row);
      Playwright scaffolds
- [x] 4 `[human]` Style the tag, the amount tooltip and the Multiplier row to mockup; generate baselines —
      [Figma tag/tooltip](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-28720),
      [Figma details](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=5995-20900)
