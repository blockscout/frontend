# 09 — Final codemod: delete pure aliases, collapse the public props

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 09 of #3838 |
| Blocked by | T08 |

## What to build

The only ticket that moves call sites. `ast-grep` codemods replace every import of a pure-alias wrapper
with the entity plus `chain=` (the `L1` family, `TxEntityInterchain`), fold `AddressStringOrParam`
callers onto `AddressEntity`, and collapse `tailLength` / `truncationMaxSymbols` into the single
`truncation` value. The alias files are deleted. Playwright baselines are regenerated only for the test
files a codemod touched.

## Acceptance criteria

- [x] `TxEntityL1`, `BlockEntityL1`, `AddressEntityL1`, `TokenEntityL1`, `BlobEntityL1`,
      `AddressStringOrParam` no longer exist; every former call site passes `chain=` (parent chain via
      the ticket 02 mapper) or the plain entity. `TxEntityInterchain` stays (Q07).
- [x] `tailLength` and `truncationMaxSymbols` are gone from the entity props and from the three call sites;
      `truncation` accepts the collapsed shape under Details.
- [x] `target` and `contentProps` appear nowhere in the family or its call sites.
- [x] Every codemod is kept as a script in the session scratchpad and its `ast-grep` pattern and rewrite
      are quoted in `notes.md`, so the diff is reproducible.
- [x] Lint, type-check and the whole Playwright suite pass; baselines changed only in test files the
      codemod edited.
- [x] `(human)` Each regenerated baseline is eyeballed against its previous image and is pixel-identical
      (a changed import must not change the picture).

## Details

Collapsed `truncation` shape (Q05 in `questions.md`): the existing string union, plus
`{ type: 'dynamic'; tailLength: number }` and `{ type: 'constant'; maxSymbols: number }`. Call sites:
the two `tailLength={ 2 }` block items (home latest blocks, arbitrum latest batch) and the Celo epoch
page's `truncationMaxSymbols`.

Rollup parent chain at the call sites: import the mapped chain from the rollup feature's config helper
(ticket 02), never rebuild it inline.

## Leaf worklist

- [x] 1 `[agent]` Codemod wrapper imports → entity + `chain=`; delete the alias files
- [x] 2 `[agent]` Codemod `AddressStringOrParam` → `AddressEntity`
- [x] 3 `[agent]` Collapse `truncation`; remove `tailLength` / `truncationMaxSymbols`; purge `target` / `contentProps`
- [x] 4 `[agent]` Regenerate the touched baselines in Docker; lint, tsc, full `pnpm test:pw`
- [x] 5 `[human]` Eyeball the regenerated baselines
