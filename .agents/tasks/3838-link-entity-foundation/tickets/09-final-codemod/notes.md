# Notes — 09

## Codemods

Kept in the session scratchpad (`codemods/`); every rule is quoted here so the diff can be reproduced
from the parent commit. Driver, run from the repo root:

```bash
# run.sh <rules.yml> <file-list>
ast-grep scan -r "$1" -U $(cat "$2")
dedupe-imports.sh $(cat "$2")   # drops a repeated, textually identical one-line import
```

The file list is every file under `src/` that named one of the aliases, the alias files themselves
excluded. `pnpm lint:eslint --changed --fix` ran after the codemods and only re-sorted imports.

### 01 — L1 aliases → entity + `chain={ parentChain }`

Generated per alias (`TxEntityL1` → `TxEntity`, `BlockEntityL1` → `BlockEntity`, `AddressEntityL1` →
`AddressEntity`, `BlobEntityL1` → `BlobEntity`). Shown for `TxEntityL1`:

```yaml
id: TxEntityL1-name
language: tsx
rule:
  kind: identifier
  regex: ^TxEntityL1$
  inside: { kind: jsx_self_closing_element, field: name }
fix: TxEntity
---
id: TxEntityL1-chain-inline
language: tsx
rule:
  pattern: $LAST
  any: [ { kind: jsx_attribute }, { kind: jsx_expression } ]
  nthChild: { position: 1, reverse: true, ofRule: { any: [ { kind: jsx_attribute }, { kind: jsx_expression } ] } }
  inside: { kind: jsx_self_closing_element, has: { field: name, regex: ^TxEntityL1$ }, not: { regex: '\n' } }
fix: $LAST chain={ parentChain }
---
id: TxEntityL1-chain-multiline
language: tsx
rule:
  pattern: $LAST
  any: [ { kind: jsx_attribute }, { kind: jsx_expression } ]
  nthChild: { position: 1, reverse: true, ofRule: { any: [ { kind: jsx_attribute }, { kind: jsx_expression } ] } }
  inside: { kind: jsx_self_closing_element, has: { field: name, regex: ^TxEntityL1$ }, regex: '\n' }
fix: |-
  $LAST
  chain={ parentChain }
---
id: TxEntityL1-import
language: tsx
rule:
  pattern: import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1'
fix: |-
  import TxEntity from 'src/slices/tx/components/entity/TxEntity';
  import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';
```

`chain=` goes after the last attribute, where the wrapper put it, so it still wins over a spread. The tag is
renamed in place instead of rewriting the whole element, which keeps each call site's attribute layout.

`TokenEntityL1` had no JSX call site: `TokenValue` picked the component at runtime
(`layer === 'L1' ? TokenEntityL1 : TokenEntity`). Edited by hand to
`<TokenEntity … { ...tokenEntityProps } chain={ layer === 'L1' ? parentChain : tokenEntityProps?.chain }/>`.

The wrappers returned `null` when rollup was off; `chain={ parentChain }` cannot. Every call site renders
rollup data only (arbitrum / optimism / scroll / shibarium / zk-sync pages, `data.arbitrum` rows in tx and
block details, `layer="L1"` token values), so the case does not arise.

### 02 — `AddressStringOrParam` → `AddressEntity`

`AddressEntity` already accepted a string `address` (ticket 05), so this is a rename:

```yaml
id: AddressStringOrParam-name
language: tsx
rule:
  kind: identifier
  regex: ^AddressStringOrParam$
  inside: { kind: jsx_self_closing_element, field: name }
fix: AddressEntity
---
id: AddressStringOrParam-import
language: tsx
rule:
  pattern: import AddressStringOrParam from 'src/slices/address/components/entity/AddressStringOrParam'
fix: import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
```

The design-readout calibration entry `user-ops-table-item` named the shipped component; its three cells
now say `AddressEntity` (`pnpm design:readout --calibrate` passes).

### 03 — collapse `tailLength` / `truncationMaxSymbols` into `truncation`

```yaml
id: tail-length-attr
language: tsx
rule:
  pattern:
    context: '<X tailLength={ $N }/>'
    selector: jsx_attribute
  inside: { kind: jsx_self_closing_element, has: { field: name, regex: 'Entity' } }
fix: "truncation={{ type: 'dynamic', tailLength: $N }}"
---
id: truncation-max-symbols-object
language: tsx
rule:
  pattern:
    context: 'const x = { truncation: $T, truncationMaxSymbols: $N }'
    selector: object
fix: "{ truncation: { type: $T, maxSymbols: $N } }"
```

Run over all of `src/`: 3 changes, the two block items (home latest blocks, arbitrum latest batch) and the
Celo epoch page. Done by hand in the base: `BlockEntity`'s default `tailLength: 2` became
`truncation: { type: 'dynamic', tailLength: 2 }`. No `BlockEntity` / `Block*L2` / `BatchEntityL2` call
site passes its own `truncation="dynamic"` (checked with an ast-grep probe), so moving the tail length into
the default cannot drop it anywhere. `Content` reads the value through `toTruncationSpec`.

## Not done, and why

- **`TxEntityInterchain` stays** (Q07). It is not a pure alias: an unknown chain renders unlinked.
- **No `target` / `contentProps` to purge.** The entity-level props were already gone; the remaining
  `contentProps` in the family are the toolkit `Tooltip` / `Popover` prop, and `target` is the anchor attribute
  inside `link={{ … }}`.
- **Complexity gate red, accepted by the developer.** `TxDetails` (COG 76), `BlockDetails` (55) and
  `SearchResultTableItem` (92, touched in an earlier ticket) were over the cap before this task; the
  codemod edits attributes inside them only, which adds no COG but brings them into `--changed` scope.

## Playwright

Full suite in Docker (`pnpm test:pw --docker`): 947 passed, 17 skipped, 1 failed. **No baseline
regenerated**: the codemods edited no `*.pw.tsx` file, and every suite that embeds a codemodded call site
passed against its existing screenshots.

The one failure came from an earlier ticket, not from the codemods: `SearchBarMobile.pw.tsx` › "search by tac
operation hash" failed the same way at the parent commit. The developer traced it to the icon's corners: a
`defineEntity` `Icon` part rendered without a root (the search-bar suggestions do this for TacOperation and
Blob) never received the definition's `defaults.icon`, so `borderRadius: 'none'` fell back to the base
radius. Fixed in `define-entity.tsx` (the part falls back to `defaults.icon` when there is no root), pinned
by a spec; the search-bar and search-results suites then passed, 65/65.
