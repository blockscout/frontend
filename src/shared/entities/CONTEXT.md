# Entities — context

The shared base of the entity links (`TxEntity`, `BlockEntity`, `AddressEntity`, …): a root context that
holds an entity's data and resolved link, the parts that read from it, and the `defineEntity` factory that
assembles the template entities from a definition.

## Where to look

| Question | Answer |
| --- | --- |
| Where does a `chain=` prop turn into an href, a shield and a hint? | `resolve-entity-link.ts`; the rollup parent chain is mapped onto its input in `src/features/rollup/common/utils/` |
| Which props does every entity accept, and which of them may a definition default? | `root.ts` (`EntityOptions`, `EntityDefaults`) |
| What do the three `variant` values change? | `variants.ts`: icon size and margin, shield offset, content text style; nothing else |

## The contract

- **Data lives at the root, once.** `Root` (and `Container`, which is `Root` plus the flex wrapper) takes
  the entity data and the public options; `Icon`, `Link`, `Content` and `Copy` read both from the context
  and take only their own options. A part may be given data fields of its own; they override the root's
  field by field, and a part without a root works from them alone.
- **A caller's option always wins over a definition's `defaults`.** Only a defined value counts as the
  caller's, so `truncation={ undefined }` keeps the default instead of unsetting it. The `icon` default is
  the one exception to whole-value replacement: it merges under the caller's `icon` bag key by key.
- **One chain rule.** No `chain` links to the current chain, or to the multichain context's chain inside a
  multichain view; a chain from the multichain config links to its chain-scoped page; any other chain links
  to its explorer and shows its shield and hint, unless it is flagged `linkOnly`, which keeps the explorer
  link and drops the shield and hint (the rollup parent chain is one). The resolver is the only place this
  rule lives; a part with its own `chain` resolves again for itself. An entity of a feature that exists on
  one chain only declares `singleChain` and so ignores the multichain context; that is a definition option,
  never a resolver branch.
- **Style props reach the DOM at every level.** Each part splits its style props off once and spreads
  them onto its own root element, after the part's defaults, so a caller's value wins.

## What an editor here must keep true

- **No `chakra()` factory on an entity, a part or a wrapper.** Each level resolves styles once with
  `splitCssProps`; a `chakra()` layer adds a second pass per element on list pages with hundreds of entities.
- **Definition functions must tolerate partial data.** A part composed without a root (an icon alone in the
  search bar, a link in a hand-built row) gets only its own override, so `route`, `icon`, `hint` and
  `text` may run on an object missing some fields. The resolver already guards the hash it substitutes.
- **A definition's `data` key list is checked for completeness by the compiler**, not at runtime, and only
  when it is written with `keysOf` from `entity-props.ts`; a plain array passes the type unchecked. A key
  left out of it is treated as an option and never reaches the data, silently.
- **A parent-chain or external link is `chain=` at the call site, never a new wrapper.** The rollup parent
  chain is exported from `src/features/rollup/common/utils/`. The `Interchain` wrappers that remain exist
  because a chain the app cannot link to, an unknown one included, must render unlinked, while a `chain` of
  `undefined` means the current chain.
