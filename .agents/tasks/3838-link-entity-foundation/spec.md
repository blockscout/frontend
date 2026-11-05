# Revise the link-entity foundation

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3838 |
| Feature branch | `issue-3838` |
| Demo | none |

## Context & goal

The entity link components (`AddressEntity`, `TxEntity`, `BlockEntity`, `TokenEntity` and the rest of
the family) share a foundation in `src/shared/entities` that was built in 2023, before most of the
features that now depend on it: multichain views, external and parent chains, chain shields, proxy
tooltips, filter links. An audit of the family (15 primary entities, about 20 thin wrappers, roughly
420 call sites) found:

- 10 of the 15 primary entities are the same template, differing only in route, icon name and text.
- External and parent-chain href building is re-implemented in the `External`, `Interchain` and
  `L1`/`L2` wrappers although the shared router already resolves chain-aware and external routes.
  Several entities route through `nextjs-routes` directly and are not chain-aware in multichain views.
- Props reach every part as one spread bag; parts then rely on presence checks in some entities and
  nullish defaults in others, so the same prop behaves differently per entity. Chain shield derivation
  exists in four variants.
- Silent behaviour: the base link discards `className`, so style props on it are lost; the token,
  NFT, ENS and clusters entities force tail truncation after the spread, so a caller's `truncation` is
  ignored; `noIcon` is inverted in the cross-chain message entity; `noCopy` defaults to true only in
  the epoch entity.
- Dead or near-dead props: `target` is never consumed; `truncationMaxSymbols`, `tailLength`,
  `marginRightShield`, `hintPostfix` and `icon.size` have one or two uses each; `contentProps` is a
  two-key escape hatch for one feature.
- Every entity is `React.memo(chakra(...))`, but inline `icon` / `link` objects at call sites defeat
  the memo, and each `chakra()` level adds a second style-resolution pass. The base has no unit tests
  and no `CONTEXT.md`.

The goal is to revise the foundation **in place**, keep the public `<XEntity>` prop surface stable
until a final codemod, migrate every entity onto it, and confirm render performance did not regress.
No visual change is intended anywhere.

## Functional requirements

1. Every entity renders pixel-identical to today; the existing Playwright screenshots pass unchanged
   and are updated only where the final call-site codemod touches a test.
2. A caller's `truncation`, `noIcon`, `noCopy`, `noLink`, `noTooltip` always win over an entity's
   default, for every entity.
3. Style props passed to an entity or to any of its exported parts (`Icon`, `Link`, `Content`,
   `Copy`, `Container`) are applied, never dropped.
4. Inside a multichain view, every entity's link leads to the chain-specific page; outside it, every
   entity's link is the current chain's page unless a `chain` prop says otherwise.
5. Passing a `chain` is the only thing a caller needs to do to get an external-explorer or
   parent-chain link, with the chain shield and hint that go with it.
6. The sub-part composition used today (`AddressEntity.Container` + `Icon` + `Link` + `Content` +
   `Copy`, as in the search results table) keeps working, with data supplied once at the root.
7. Render time of the txs list and a token's transfers list at 50 rows is no worse after the task
   than before it, measured with `tools/profiling`.
8. `src/shared/entities` has a `CONTEXT.md` describing the contract (parts, defaults, chain rule),
   and unit tests under the mutation gate cover the href resolver and the factory defaults.

## UI inventory

No new or changed screens. Affected surfaces are every page rendering an entity link; the
regression net is the existing Playwright component tests of each entity and the page tests that
embed them.

## Implementation decisions

- **Evolve in place.** The foundation stays at `src/shared/entities`; no `v2` namespace, no parallel
  implementation.
- **Parts read data from a root context.** An `Entity.Root` provides the entity data; `Icon`,
  `Content`, `Copy` and `Link` take only their own options, plus an optional data override for the
  rare case of displaying a different value than the root's (the search results do this). No prop
  bag is spread across parts.
- **No `chakra()` factory anywhere** in the family: not on entities, parts or thin wrappers.
  Entity props extend Chakra's HTML props; style props are split off once with Chakra's
  `splitCssProps` and spread onto the root `Flex`. Parts accept style props on their own root the
  same way. This matches the `src/toolkit/chakra` convention and gives one style resolution per
  level.
- **One chain rule, one resolver.** A single href resolver takes the entity route and the `chain`
  prop and applies: no chain → current chain; chain present in the multichain config → the
  chain-scoped route; otherwise → the chain's external explorer URL with its route template. A
  rollup's parent chain is passed as a `chain` mapped onto the external-chain shape (its base URL
  becomes the explorer URL). Chain shield and hint derive from the same rule. No separate
  link-target prop.
- **`defineEntity` factory** for the template entities: `route`, `icon` (name or function of the
  data), `hint`, `text`, `copyText` (or disabled), and `defaults` (truncation, icon and copy
  visibility). It yields the default component plus `Root`, `Container`, `Icon`, `Link`, `Content`,
  `Copy`. Covers Tx, Block, UserOp, Blob, Epoch, Validator, TacOperation, Flashblock and
  CrossChainMessage. Address, Token, Nft, Pool, Ens and Clusters are hand-assembled from the same
  primitives.
- **Variants stay** as `content | heading | subheading`, implemented as presets over two axes
  (icon size, content text style) and documented; no call-site change.
- **Prop surface.** `target` and `contentProps` are removed from the base (the token-filter
  tooltip-after becomes a `Content` prop). `truncation`, `tailLength` and `truncationMaxSymbols`
  collapse into one `truncation` value, done last with an `ast-grep` codemod. The `noX` booleans stay.
- **Thin wrappers.** `Interchain`, `External`, `L1`/`L2` wrappers survive the entity migration as
  one-line aliases so no call site moves, then are deleted with call sites codemodded to `chain=`.
  `AddressStringOrParam` folds into `AddressEntity` accepting a string. Tac and Zeta wrappers stay:
  they carry foreign URL templates and feature gating.
- **Performance is measured, not assumed.** A before profile is recorded before any foundation
  change and an after profile at the end, on the txs list and a token's transfers list at 50 rows;
  the after must not be worse. Further perf work (memo discipline at call sites, Tooltip cost) is
  decided from that data, not in this task.
- **Migration order.** Foundation first, verified against the Tx and Block screenshots; the
  remaining entities follow on the stable foundation; wrapper removal and the public prop codemod
  come last so screenshots stay untouched until then.

## Out of scope

- Address hover-highlight (global CSS classes, `data-hash`, forced-interactive tooltips) and the
  bech32 alternate hash: Address slice behaviour, untouched.
- Any visual or behavioural change visible to users.
- Tooltip, `Truncate` and `CopyToClipboard` primitives in the toolkit.
- Call-site memoisation or other performance work beyond confirming no regression.
- Rewriting the Tac and Zeta chain-variant wrappers beyond dropping `chakra()`.
