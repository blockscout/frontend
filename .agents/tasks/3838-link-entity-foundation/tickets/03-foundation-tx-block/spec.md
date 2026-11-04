# 03 — Foundation: Root, parts, `defineEntity`; Tx and Block migrated

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #3838 |
| Blocked by | T01, T02 |

## What to build

The revised base in `src/shared/entities`: an `Entity.Root` that holds the entity data and resolved
link in context, parts (`Container`, `Icon`, `Link`, `Content`, `Copy`) that read from it and accept only
their own options plus an optional data override, one `splitCssProps` split per level instead of
`chakra()`, variants as presets over icon size and content text style, and the `defineEntity` factory
that yields the default component plus the parts. `TxEntity` and `BlockEntity` are rebuilt on it with
their public prop surface unchanged, so every call site, every thin wrapper around them and both
screenshot suites keep working untouched. `target` and `contentProps` leave the base; the rest of the
family still runs on `distributeEntityProps` until its own ticket.

## Acceptance criteria

- [x] `TxEntity.pw.tsx` and `BlockEntity.pw.tsx` pass with no baseline change (`pnpm test:pw --docker`).
- [x] `TxEntityL1`, `TxEntityInterchain`, `TxEntityExternal`, `BlockEntityL1`, `BlockEntityL2`,
      `BatchEntityL2`, `TxEntityTon`, `TxEntityZetaChain*`, `TxEntityInterop` and the Tx/Block blocks of
      `SearchResultTableItem` compile and render unchanged with no edit.
- [x] No `chakra()` and no `React.memo(chakra(...))` remains in `src/shared/entities`, `TxEntity.tsx` or
      `BlockEntity.tsx`; style props on the entity and on each exported part reach the DOM (a unit spec
      renders `className` and a margin prop on each part and asserts them).
- [x] A caller's `truncation`, `noIcon`, `noCopy`, `noLink`, `noTooltip` win over the factory `defaults`
      (unit spec per flag through the public component).
- [x] The link href comes from the ticket 02 resolver: inside a multichain context the Tx link is the
      chain-scoped route, outside it the current chain, with `chain=` the chain's page or explorer URL
      (unit spec).
- [x] `defineEntity` unit specs pass the mutation gate; every behaviour function in the base passes the
      complexity gate.
- [x] `src/shared/entities/CONTEXT.md` exists and states the contract — parts, root data, defaults, the
      chain rule — per `.agents/rules/docs.md`, and is listed in `.agents/AGENTS.md`.

## Details

Prop surface to keep on the public component for now: `href`, `icon`, `link`, `query`, `onClick`,
`chain`, `className`, `isLoading`, `variant`, the `noX` booleans, `truncation`, `tailLength`,
`truncationMaxSymbols` (the latter two go in ticket 09). Inside, the root maps them onto part options
once; no part receives the whole bag. The Block `tailLength` default and the Tx pending-update icon and
hint are entity options of the factory (`icon`, `hint` as functions of the data), not special cases in
the base. Props of the exported parts may change shape here — only `SearchResultTableItem` and the two
interop entities compose them, and those are adjusted in tickets 05 and 08; until then the Tx/Block parts
must still accept what those files pass.

The Sub-part contract (FR6): `Container` is `Root` + flex wrapper, so the search-results composition
`<TxEntity.Container hash=...><TxEntity.Icon/><TxEntity.Link><TxEntity.Content/></TxEntity.Link></TxEntity.Container>`
supplies data once at the root. Keep the existing `Container` prop names working for the Tx/Block
blocks of `SearchResultTableItem` until ticket 08 recomposes them.

## Leaf worklist

- [x] 1 `[agent]` Rebuild `src/shared/entities` — Root context, parts with `splitCssProps`, variant presets, `defineEntity`; keep `distributeEntityProps` exported for the entities not yet migrated
- [x] 2 `[agent]` Migrate `TxEntity` and `BlockEntity` onto the factory; run their Playwright suites in Docker
- [x] 3 `[agent]` Unit specs — factory defaults, caller-wins flags, style-prop pass-through, href resolution; mutation and complexity gates
- [x] 4 `[agent]` Write `src/shared/entities/CONTEXT.md` and register it in `.agents/AGENTS.md`
