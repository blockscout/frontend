# 04 — Template entities onto `defineEntity`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3838 |
| Blocked by | T03 |

## What to build

The seven remaining template-shaped entities rebuilt as `defineEntity` declarations: UserOp, Blob,
Epoch, Validator, TacOperation, Flashblock and CrossChainMessage. Each becomes a route, an icon, a hint,
a text, a copy text and a set of `defaults`; the per-entity quirks that today live in spread order
become explicit defaults the caller can override. Their public props, wrappers (`BlobEntityL1`) and the
search-results composition keep working with no edit.

## Acceptance criteria

- [ ] `UserOpEntity.pw.tsx` passes with no baseline change; `CrossChainMessageEntity.spec.tsx` passes.
- [ ] Defaults are declared, not inferred: Epoch `noCopy` default on, CrossChainMessage `noIcon` default
      on and `truncation` default `constant`, Flashblock `truncation` default `none`, Blob icon radius —
      and a caller's explicit value wins in every case (unit spec per default through the public component).
- [ ] CrossChainMessage with no `bridgeId` renders without a link, as today.
- [ ] TacOperation in `pending` status renders the spinner in place of the icon (the factory `icon` option
      returns a React element here).
- [ ] UserOp, Blob and Flashblock links are chain-aware inside a multichain context via the resolver;
      Epoch, Validator, TacOperation and CrossChainMessage keep their current-chain routes.
- [ ] No `chakra()` remains in any of the seven files or in `BlobEntityL1`; `BlobEntityL1` and the
      `SearchResultTableItem` blocks for Blob, UserOp and TacOperation compile unchanged.
- [ ] The complexity gate passes for every changed file.

## Details

Routes and current icon names are in each entity file; carry them over by pointer, not by re-deriving.
Today several of these route through `route()` without the chain params and so are not chain-aware in
multichain views; after this ticket the resolver decides, so the UserOp / Blob / Flashblock links follow
FR4. Validator, Epoch, TacOperation and CrossChainMessage are single-chain features and get no chain
scoping — record that as a per-entity option, not as a resolver special case.

## Leaf worklist

- [ ] 1 `[agent]` Declare UserOp, Blob, Epoch, Validator, TacOperation, Flashblock, CrossChainMessage with `defineEntity`; drop `chakra()` in `BlobEntityL1`
- [ ] 2 `[agent]` Unit specs for each declared default and the pending-spinner case; run `UserOpEntity.pw.tsx` in Docker
