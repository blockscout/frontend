# 05 — Multichain receipt

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3856 |
| Blocked by | T02 |

## What to build

The receipt opens at `/chain/[chain_slug_or_id]/tx/[hash]/receipt` in multichain mode, on the same bare
layout and with the same card. The page wraps the receipt in the multichain provider and a socket provider
pointed at the transaction's chain, as `MultichainToken` does, so a pending receipt updates live. The card
shows that chain's logo (the existing placeholder when its config has none) and name; `Transaction
details`, the copied URL and the error redirect all stay on the same chain.

Covers the multichain half of FR1, FR6, FR12, FR13 and FR17. The multichain transaction page itself is not
changed.

## Acceptance criteria

How to verify: `pnpm dev:preset multichain`, open `/chain/<slug>/tx/<hash>/receipt` for a settled and a
fresh pending transaction on two different chains

- [ ] The page is wrapped in `MultichainProvider` and a `SocketProvider` for the routed chain
- [ ] The logo and the Chain row come from the routed chain's config, not the global one
- [ ] `Transaction details` and the redirect on error target `/chain/[chain_slug_or_id]/tx/[hash]` of the same chain, built with `route()`
- [ ] The single-chain route is unaffected and stays unavailable in multichain mode
- [ ] `(human)` A pending multichain receipt turns into its final status without a reload, and shows the right chain's logo

## Skill inputs

### `add-new-page`

- Layout: no tabs; content type `general`, without `PageTitle` — a wrapper around `TxReceipt`, on the bare layout
- Route & path params: `/chain/[chain_slug_or_id]/tx/[hash]/receipt`; `chain_slug_or_id` is the chain's slug or id, `hash` the transaction hash
- Gated or core: config-gated, the existing `multichain` feature (no new env var, skip Step 1); component `MultichainTxReceipt` under `src/features/multichain/pages/`
- Title and navigation: no page title, no navigation item (skip Step 5)
- Metadata: title `%chain_name% transaction receipt %hash%`; description — the `/chain/[chain_slug_or_id]/tx/[hash]` default description, reused
- Page-type analytics: `Chain transaction receipt`
- Server guard: reuse `base` from `getServerSideProps/multichain`
- Sitemap: dynamic route, skip
- Data: nothing new to wire — the page renders `TxReceipt`, whose queries follow the multichain context
- Field hints: none

## Leaf worklist

- [ ] 1 `[agent]` Scaffold the multichain receipt route with its providers — skill: `add-new-page`
- [ ] 2 `[agent]` Per-chain logo, chain name, same-chain links and redirect in the card, with unit tests
