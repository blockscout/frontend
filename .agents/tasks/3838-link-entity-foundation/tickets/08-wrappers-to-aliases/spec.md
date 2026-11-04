# 08 — Thin wrappers become aliases; `chakra()` leaves the family

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 08 of #3838 |
| Blocked by | T04, T05, T06, T07 |

## What to build

Every thin wrapper reduced to what it still adds on top of `chain=`, with no call site moving: the
`External` wrappers fold into their `Interchain` siblings; the `L1` wrappers pass the mapped parent
chain; `BlockEntityL2`, `BatchEntityL2`, `TxEntityTon`, `TxEntityZetaChainCC`, `TxEntityZetaChainExternal`,
`AddressEntityTacTon`, `AddressEntityZetaChain` and the marketplace revoke `AddressEntity` lose
`chakra()` and nothing else; the two interop entities are recomposed on the root-data contract. The old
`distributeEntityProps` / `getIconProps` / `getContentProps` utilities are deleted. After this ticket
the family has one href rule and no `chakra()` anywhere.

## Acceptance criteria

- [x] Every entity Playwright suite in the family passes with no baseline change; the page suites that
      embed L1 entities (rollup deposits / withdrawals / batches) pass unchanged.
- [x] `TxEntityL1`, `BlockEntityL1`, `AddressEntityL1`, `TokenEntityL1`, `BlobEntityL1` are
      `<XEntity chain={ parentChain }/>` aliases over the ticket 02 mapper and render link-only (no
      shield, no chain hint) as today.
- [x] `AddressEntityInterchain` keeps `currentAddress` → `noLink` and is otherwise `chain=`;
      `TokenEntityInterchain` keeps the shield-only-when-multichain rule; `TxEntityInterchain` is a pure
      alias. `*EntityExternal` files are gone.
- [x] `AddressEntityInterop.pw.tsx` and `TxEntityInterop.pw.tsx` pass unchanged after recomposition.
- [x] `grep -rn "chakra(" src --include='*Entity*.tsx'` returns nothing; `distributeEntityProps`,
      `getIconProps`, `getContentProps` no longer exist.
- [x] The complexity gate passes for every changed file.

## Details

Which wrappers survive and why (parent spec "Thin wrappers", plus Q03 and Q04 in `questions.md`): Tac
and Zeta carry foreign URL templates and feature gating; `AddressEntityInterchain` carries the
current-address rule; `TokenEntityInterchain` carries the multichain-only shield quirk. Everything else
is either a pure alias (deleted in ticket 09) or an icon/route override.

## Leaf worklist

- [x] 1 `[agent]` Fold `External` into `Interchain`; rewrite the `L1` wrappers over the parent-chain mapper; drop `chakra()` from every remaining wrapper
- [x] 2 `[agent]` Recompose `AddressEntityInterop` and `TxEntityInterop` on the root-data contract
- [x] 3 `[agent]` Delete the legacy utilities; run the full entity Playwright set and the affected page suites in Docker
