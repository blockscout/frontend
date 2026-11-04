# 05 — Address entity hand-assembled on the primitives

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 05 of #3838 |
| Blocked by | T03 |

## What to build

`AddressEntity` rebuilt from `Root` and the parts with its own `Icon` (identicon, contract, proxy, safe,
delegated, shield) and `Content` (name tooltip, proxy content), its address prop accepting a bare hash
string as well as the address object, and the token-filter tooltip delivered as a `Content` option
instead of `contentProps`. Hover-highlight and the bech32 alternate hash stay exactly as they are. The
address wrappers (`Interchain`, `External`, `L1`, `WithTokenFilter`, `StringOrParam`, `TacTon`,
`ZetaChain`, `Interop`, the marketplace revoke one) keep working with no edit; they are reshaped in
ticket 08.

## Acceptance criteria

- [x] `AddressEntity.pw.tsx` (all cases, hover and bech32 included), `AddressEntityZetaChain.pw.tsx` and
      `AddressEntityInterop.pw.tsx` pass with no baseline change.
- [x] `<AddressEntity address="0x…"/>` renders the same as `<AddressEntity address={{ hash: '0x…' }}/>`
      (unit spec); `AddressStringOrParam` still compiles as a caller of it.
- [x] `AddressEntityWithTokenFilter` passes the advanced-filter link through a `Content` option; the
      tooltip is interactive and opens even when the value is not truncated, as today.
- [x] `hintPostfix` and `icon.size` are honoured through the new icon options with no call-site change
      (`AddressEntityTacTon`, the revoke page).
- [x] The Address block of `SearchResultTableItem` composes `Container` + `Icon` + `Link` + `Content` +
      `Copy` with the address supplied once at the root, and renders as before.
- [x] No `chakra()` remains in `AddressEntity.tsx`, `AddressEntityContentProxy.tsx` or
      `AddressEntityWithTokenFilter.tsx`; the complexity gate passes for every changed file.

## Details

Out-of-scope reminders from the parent spec: the global `address-entity` classes, `data-hash`, the
forced-interactive tooltips inside the highlight context and `toBech32Address` are Address slice
behaviour and move over verbatim. The identicon size per variant and the contract-icon hint text stay as
they are in `AddressEntity.Icon` today; the shield and its hint now come from the resolver (ticket 02).

## Leaf worklist

- [x] 1 `[agent]` Rebuild `AddressEntity`, `AddressEntityContentProxy`, `AddressEntityWithTokenFilter` on the primitives; string address accepted; `contentProps` gone
- [x] 2 `[agent]` Recompose the Address block of `SearchResultTableItem` on the root-data contract
- [x] 3 `[agent]` Unit specs (string address, token-filter tooltip, caller-wins flags); run the three Playwright suites in Docker
