# 02 — Entity href resolver and chain rule

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3838 |
| Blocked by | none |

## What to build

One pure module in `src/shared/entities/` that turns an entity route plus an optional `chain` into
everything the link and icon need: the `href`, whether it is external, the chain shield and the chain
hint. It implements the spec's chain rule — no chain → current chain (or the multichain context's chain
for the link); chain present in the multichain config → chain-scoped route; otherwise → the chain's
external explorer URL with its route template (`route_templates`, falling back to the app route) — and
ships a mapper from the rollup feature's parent chain onto the external-chain shape. Nothing consumes it
yet; ticket 03 wires it in. A new, unused module keeps ticket 01's baseline valid.

## Acceptance criteria

- [x] For the Tx, Address and Token routes the resolver reproduces today's href strings byte for byte in all four
      cases: no chain, current chain, multichain-config chain (`/chain/<slug>/...`), external chain with
      and without a `route_templates` entry. Fixtures come from the existing `External` / `Interchain`
      wrappers' logic.
- [x] An external chain whose explorer URL is missing resolves to "no link", matching the wrappers'
      `noLink={ !href }` today.
- [x] The parent-chain mapper yields a chain whose href is `parentChain.baseUrl` + app route and whose
      shield is suppressed, so an L1 entity renders exactly as today (link only, no shield, no chain hint).
- [x] Shield and hint derive from the same call: logo → image shield, no logo → the placeholder icon,
      hint text identical to `getChainTooltipText` output per entity prefix; `shield: false` disables both.
- [x] Unit specs sit beside the module, pass `pnpm test:mutation-testing <file>` with no surviving mutant
      on the rule's branches, and the module passes `pnpm test:code-complexity`.

## Details

Existing behaviour to reproduce, by pointer: `route()` in `src/shared/router/routes.ts` already handles
chain-scoped and external prefixes; the wrappers add the `route_templates` substitution
(`TxEntityExternal`, `AddressEntityExternal`, `TokenEntityExternal`), the multichain-membership test
(`*EntityInterchain`) and the parent-chain prefix (`*EntityL1`). The `noLink` rule for a missing explorer
URL and the "chain present → shield" derivations in `TxEntity.Icon` / `AddressEntity.Icon` are the shield
fixtures. Hint prefixes are per entity (`'Transaction on '`, `'Block on '`, `' on '` postfix for
addresses) and stay an input of the resolver, not a constant inside it.

The parent-chain mapper lives in `src/features/rollup/common/`, not in `src/shared/`, so `shared` stays
free of feature imports; the resolver only knows the external-chain shape.

## Leaf worklist

- [x] 1 `[agent]` Write the resolver module (href + external flag + shield + hint) and the parent-chain mapper
- [x] 2 `[agent]` Unit specs covering every branch of the rule; run the mutation gate and the complexity gate on the files
