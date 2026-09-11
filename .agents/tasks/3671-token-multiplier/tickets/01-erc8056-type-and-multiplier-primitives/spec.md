# 01 — ERC-8056 as a fungible type, and the multiplier primitives

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 01 of #3671 |
| Blocked by | none |

## What to build

The foundation every other ticket multiplies by. After this ticket the app knows the token model carries
`ui_multiplier`, owns the one predicate that decides whether a token is scaled, owns the one formatter that
renders a factor, and treats ERC-8056 as a fungible type where a hardcoded `'ERC-20'` check used to decide
"fungible or NFT". Search results are the visible slice: an ERC-8056 token currently renders as an NFT
collection ("Items N") because the three search-result components branch on `token_type === 'ERC-20'`; they
switch to the existing `isFungibleTokenType` predicate and show the price like any ERC-20.

No amount is scaled yet — that is T02. This ticket is the types, the predicate, the formatter, the mocks and
the search fix.

## Acceptance criteria

How to verify: `pnpm dev:preset eth_sepolia`, open `/search-results?q=IOU` (the live ERC-8056 token) and type
`IOU` into the search bar

- [ ] `package.json` pins an exact `0.0.1-beta.<sha>` of `@blockscout/api-types` in which `schemas['Token']`
      carries `ui_multiplier`, `new_ui_multiplier`, `ui_multiplier_effective_at`, the fungible transfer
      `total` carries `ui_multiplier`, and `schemas['StateChange']` carries `ui_multiplier`.
      `pnpm run lint:tsc` passes.
- [ ] A single helper in the token slice resolves a token to its multiplier or to nothing: nothing unless
      `ERC-8056` is in `config.slices.token.additionalTypes`, the token's `type` is `ERC-8056`, and the
      field is non-null. It returns the factor as a `BigNumber` already divided by `10^18` (the fixed-point
      precision is independent of the token's own `decimals`).
- [ ] A single formatter renders a factor per the spec's shared rule: six decimals, no trailing zeros, `x`
      suffix (`1x`, `1.69x`, `1.0025x`), and the app's "< 0.000001x" treatment beneath the smallest
      representable value.
- [ ] Unit specs cover both helpers: env disabled, wrong type, null field, exactly 1, trailing zeros, below
      precision.
- [ ] `toTokenModel` defaults the three new fields to `null`; the token mocks gain a `tokenInfoERC8056`
      (multiplier `1690000000000000000`, 18 decimals) and the token-transfer mocks gain an `erc8056` transfer
      whose `total.ui_multiplier` is set.
- [ ] The three search-result components use `isFungibleTokenType(token_type)` instead of comparing to
      `'ERC-20'`; the branch is not reimplemented a fourth time.
- [ ] `.env.extra` still carries the `NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES` override listing
      `ERC-7984` and `ERC-8056` (committed with the tickets).
- [ ] `(human)` Searching for the live token shows the price cell (empty, since it has no exchange rate)
      rather than "Items 1,000,000…" — in the results table, the results list, and the search-bar suggest.

## Details

**Types.** The multiplier fields are on API branch `ap-erc-8056-scaled-ui-amount` (based on `dev`, which
carries the types-package build changes the app already depends on). They are on neither `master` nor any
published version. `publish-beta-types` cuts the beta; pin the exact version it prints.

**Predicate placement.** Beside the other type predicates in `src/slices/token/utils/token-types.ts`, or a
sibling `ui-multiplier.ts` in the same folder — the token slice owns it and every other slice imports it. It
takes the token object (any shape with `type` and `ui_multiplier`), so a transfer row can later pass a
transfer-scoped factor through the same path (T03).

**Formatter.** Reuse `formatBnValue` and the `< 0.…1` idiom in `src/shared/values/entity/utils.ts` rather
than inventing a new one. The departure from the mockups' `1.00x` is deliberate (spec, Implementation
decisions).

**Search.** `SearchResultTableItem`, `SearchResultListItem` (grid template and render) and
`SearchBarSuggestToken` all carry the same `=== 'ERC-20'` pair. The search payload has no multiplier fields;
nothing to scale.

**Local env.** `.env.extra` is layered over the fetched instance config by `dev:preset` and by the demo
deploy; the raw `KEY=value` format is documented in `tools/dev-server/CONTEXT.md`.

## Skill inputs

### `publish-beta-types`

- Which API service: `core` (`@blockscout/api-types`, repo `blockscout/blockscout`, workflow
  `publish-api-types-npm-dev.yml`)
- Branch to publish from: `ap-erc-8056-scaled-ui-amount`
- `gh` access: run `check-github-cli` at the start of the leaf

## Leaf worklist

- [x] 1 `[agent]` Publish and pin the beta `@blockscout/api-types` carrying the multiplier fields; fix what
      `lint:tsc` surfaces — skill: `publish-beta-types`
- [x] 2 `[agent]` Multiplier predicate + factor formatter in the token slice, with unit specs
- [x] 3 `[agent]` `toTokenModel` defaults; `tokenInfoERC8056` and `erc8056` transfer mocks; stubs
- [x] 4 `[agent]` Search results: replace the three `'ERC-20'` branches with `isFungibleTokenType`
