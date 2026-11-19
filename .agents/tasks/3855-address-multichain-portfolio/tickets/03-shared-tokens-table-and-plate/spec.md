# 03 — Shared fungible-tokens table and net-worth plate

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 03 of #3855 |
| Blocked by | T01 |

## What to build

A prefactor with no visible change. The Multichain explorer's portfolio table
(`MultichainAddressTokensTable` + item) and net-worth plate (`MultichainAddressPortfolioNetWorth`) become
shared components that a single-chain address page can use: they read `clusterConfig()` directly, never
`multichainConfig()`, and take their per-use differences as opt-in props. The Multichain explorer's address
page renders them exactly as today.

## Acceptance criteria

- [x] The table and the plate live outside the Multichain explorer feature, under names that no longer say
      "Multichain"; the Multichain explorer imports them from there.
- [x] Neither they nor the helpers they use (`getTokenChain`, the portfolio `calculateUsdValue`) call
      `multichainConfig()`; chain lookup goes through `clusterConfig()`.
- [x] Table: add-to-wallet is an opt-in prop, off by default; a row needs no chain (a row without one is a
      current-chain token), so core-API token balances can feed it in T04.
- [x] Plate: the ad banner and the multichain-button providers are opt-in props; the slot for extra stats
      (native balance, token count) that T05 needs is available as a prop or children, unused here.
- [x] The Multichain explorer passes the options that reproduce today's look: banner and providers on,
      add-to-wallet off (FR15).
- [x] Existing `*.pw.tsx` suites of the moved components and of `MultichainAddressPortfolio*` pass against
      their current baselines — no baseline is regenerated.

## Details

- Spec → "Implementation decisions" → "One table, one plate" and "Portfolio components read the shared
  accessor directly".
- Suggested home: the token slice's address pages, next to the current `AddressFungibleTokens*`
  (`src/slices/token/pages/address/`); the repo's placement rules win if they say otherwise.
- Types stay in the Multichain explorer feature (#3909); importing them from the new home is expected.
- Move each component's `*.pw.tsx` and `__screenshots__` with it.
- Do not touch the single-chain `AddressFungibleTokensTable*` or `AddressTokenBalances` here; T04 and T05
  replace them.

## Leaf worklist

- [x] 1 `[agent]` Move and rename the table, its item and their helpers; switch to `clusterConfig()`; add the add-to-wallet option
- [x] 2 `[agent]` Move and rename the plate; make banner, providers and the extra-stats slot opt-in
- [x] 3 `[agent]` Repoint the Multichain explorer's portfolio view and run its visual suites unchanged
