# Values — context

The components in `entity/` render an amount. They are layered: `SimpleValue.tsx` formats one number,
`AssetValue.tsx` adds the asset and its fiat value, and `NativeCoinValue.tsx` and `TokenValue.tsx` wrap
`AssetValue.tsx`.

## Which component for which value

Take the first row that fits. The rows run from the most specific component to the least.

| The value is | Use |
|---|---|
| An amount of the chain's native coin, with or without its fiat value | `entity/NativeCoinValue.tsx` |
| A hidden amount of a confidential token | `entity/ConfidentialTokenValue.tsx` |
| A hidden amount with no token beside it | `entity/ConfidentialValue.tsx` |
| An amount of a token from the core API | `entity/TokenValue.tsx` |
| An amount of a token from the interchain indexer | `src/features/cross-chain-txs/components/TokenValueInterchain.tsx` |
| A gas price | `entity/GasPriceValue.tsx` |
| An amount of any other asset, with or without its fiat value | `entity/AssetValue.tsx` |
| A number or a fiat amount that stands alone | `entity/SimpleValue.tsx` |

## Constraints

- **Do not rebuild a higher component from a lower one.** An amount shown next to its fiat value is one
  `AssetValue.tsx` or one of its wrappers, never two `SimpleValue.tsx` side by side. The pair then drifts
  from every other view of the same value: rounding, the tooltip, the loading state.
- **A value kind that only one feature has lives in that feature**, as a wrapper around `AssetValue.tsx`.
