# 07 — Ens and Clusters entities hand-assembled

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 07 of #3838 |
| Blocked by | T03 |

## What to build

`EnsEntity` and `ClustersEntity` rebuilt on the primitives: both keep their custom `Icon` (protocol
popover, cluster profile image) and get tail truncation as a declared, overridable default. Their routes
stay current-chain. The Ens block of `SearchResultTableItem` keeps working.

## Acceptance criteria

- [ ] `EnsEntity.pw.tsx` and `ClustersEntity.pw.tsx` pass with no baseline change.
- [ ] `truncation` defaults to `tail` for both and a caller's `truncation` wins (unit spec).
- [ ] No `chakra()` remains in either file; the complexity gate passes for every changed file.

## Leaf worklist

- [ ] 1 `[agent]` Rebuild `EnsEntity` and `ClustersEntity` on the primitives
- [ ] 2 `[agent]` Unit specs for the defaults; run both Playwright suites in Docker
