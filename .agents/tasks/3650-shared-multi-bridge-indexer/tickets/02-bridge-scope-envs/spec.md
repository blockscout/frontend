# 02 — The deployment's bridge scope arrives as env

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 02 of #3650 |
| Blocked by | none |

## What to build

A deployment can state which slice of the shared indexer it owns. Two new variables reach the app:
`NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS`, the bridge ids this deployment's cross-chain surfaces are
allowed to show, and `NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS`, the escape hatch for rows
whose counterpart chain no bridge indexes. Nothing consumes them yet — ticket 03 does — so the visible
deliverable is the startup contract: an instance with cross-chain transactions enabled and no bridge ids
**fails to boot**, because booting it against the shared instance would silently serve another
deployment's traffic with a `200`.

The names are deliberately not multichain-specific: a single-chain deployment spanning two bridges is
expected, and this way the variable needs no rename later.

## Acceptance criteria

- [ ] Both variables are documented in `docs/ENVS.md` in the cross-chain transactions feature section,
      with the `Version` column set to `upcoming`
- [ ] `NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS` is required when `NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED` is
      `true`, and rejected when it is not
- [ ] `NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS` is optional and defaults to `false`
- [ ] The envs-validator suite ends `👍 All good!` for every preset, and the negative path was exercised
      by hand: enabling the feature without bridge ids fails, a non-numeric entry fails
- [ ] Both variables are readable from app code without going through the feature's `isEnabled` branch
      (ticket 03 depends on this; see *Details*)
- [ ] `playwright/.env.pw` and the `crossChainTxs` entry of `ENVS_MAP` both carry the bridge ids
- [ ] `pnpm test` and `pnpm lint` pass

## Details

**Read the values unconditionally.** The `Feature<Payload>` union hides the payload when `isEnabled` is
`false`, and that would break Playwright: the `mockApiResponse` fixture builds its route matcher by
calling `buildUrl` in **Node** (`process.env`, from `playwright/.env.pw`) while the component under test
reads **localStorage** (`mockEnvs`). `NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED` is only ever set per-test in
localStorage, so a resolver gated on `isEnabled` would resolve no bridge ids on the Node side, the
browser would send them, and every interchain mock would stop matching. Expose the two values as a named
export of `src/features/cross-chain-txs/config.ts` read outside the `isEnabled` branch. Setting
`NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED=true` in `playwright/.env.pw` is **not** the fix — it would turn the
feature on for every visual test and churn unrelated baselines.

Bridge ids are deployment data, not constants: never hardcode one in `src/`. Today's values, for local
runs and test presets only — mainnet AMB/Omnibridge `1`, mainnet Avalanche ICTT/ICM `2`, testnet
Sepolia↔Chiado AMB `1001`.

## Skill inputs

### `add-env-var`

- **Value type of `NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS`**: JSON-encoded array of numbers, e.g.
  `[1,2]`. Read with `parseEnvJson<Array<number>>`; the validator rule applies
  `.transform(replaceQuotes).json()` before `yup.array().of(yup.number())`, per the JSON-shaped-values
  convention in `deploy/tools/envs-validator/CONTEXT.md`.
- **Value type of `NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS`**: primitive boolean, read with
  `getEnvValue(…) === 'true'`, default `false`.
- **External URL?** No, for both. Steps 4 and 5 of the skill do not apply.
- **Mode** — both default and multichain. The rule goes in the existing
  `deploy/tools/envs-validator/schemas/features/crossChainTxs.ts`, which `schema.ts` and
  `schema_multichain.ts` already both concatenate, so one edit covers both modes.
- **`docs/ENVS.md` section** — Features → the cross-chain transactions block that already holds
  `NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED`.
- **Config home** — existing feature `src/features/cross-chain-txs/config.ts`; no new feature folder and
  no `src/config/features.ts` change. See *Details* for why the read is not inside the `isEnabled` branch.
- **Test preset** — the feature already owns `deploy/tools/envs-validator/test/.env.cross_chain_txs`; add
  both variables there rather than to `.env.base`.
- **Private mode** — not applicable; neither value identifies a user or reaches a third party.

## Leaf worklist

- [x] 1 `[agent]` Add both variables — skill: `add-env-var`
- [x] 2 `[agent]` Add the bridge ids to `playwright/.env.pw` and to the `crossChainTxs` entry of
      `src/config/test-utils/env-presets.ts`
