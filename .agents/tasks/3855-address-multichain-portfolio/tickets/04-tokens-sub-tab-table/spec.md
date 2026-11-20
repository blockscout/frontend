# 04 — Tokens sub-tab: new table

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 04 of #3855 |
| Blocked by | T03 |

## What to build

On every single-chain instance, the address page's Tokens sub-tab lists fungible tokens in the shared table
from T03: columns Asset, Price, Quantity, Value. The Asset cell holds the token, its contract address below
it and its type tag; there is no Contract address column. The add-to-wallet control sits next to the
contract address, placed as in the tokens index table (FR3, FR4).

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/address/<hash>?tab=tokens_erc20` for an address holding tokens

- [x] The Tokens sub-tab renders the shared table fed from the core API query it uses today
      (`useAddressFungibleTokensQuery`); list, filter and pagination behaviour is unchanged.
- [x] Add-to-wallet is on for this use and placed as in `TokensTableItem`; the Multichain explorer's table
      still has none.
- [x] Rows link inside the explorer; the native-token row (when the instance configures a native token
      address) keeps its tag.
- [x] `AddressFungibleTokensTable` and `AddressFungibleTokensTableItem` are deleted, with no remaining
      import.
- [x] `AddressTokens.pw.tsx` is extended for the new table, not joined by a new suite.
- [x] `(human)` Add-to-wallet works from a row and sits where the tokens index table puts it.
- [x] `(human)` The Tokens table matches the mockup at every breakpoint, with the deliberate deviation below.

## Details

- **Deliberate deviation** (spec → UI inventory): the Tokens mockup still draws the old five-column table.
  Build FR3; the Multichain explorer's table is the blueprint. Use the mockup for everything around it.
- Mockups are desktop only; mobile follows the shared table's existing responsive behaviour.

## Leaf worklist

- [x] 1 `[agent]` Feed the shared table from the core fungible-tokens query, enable add-to-wallet, delete the old table
- [x] 2 `[agent]` Style the Tokens table to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6337-4418)
- [x] 3 `[agent]` Extend `AddressTokens.pw.tsx` for the new table
- [x] 4 `[human]` Regenerate and review the affected screenshot baselines
