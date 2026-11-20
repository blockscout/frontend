# 06 — Family-aware import resolution

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 06 of #3904 |
| Blocked by | T03 |

## What to build

In conflict mode a relative import link opens the file from the importing file's own family, as the Solidity
compiler resolves it: `./contracts/A.sol` importing `./libraries/Tick.sol` opens
`./contracts/libraries/Tick.sol`, not `contracts/libraries/Tick.sol`. When no such file exists, the first
file with the matching normalized path opens. Without a conflict import links behave as today.

## Acceptance criteria

How to verify: `pnpm dev:preset robinhood`, open
`/address/0xd4EB21209C4D6093f80B5b84f5C45cc093EA14a3?tab=contract`

- [ ] Import resolution receives the importing file's raw path in conflict mode and tries the same-family
      path before the normalized match.
- [ ] The fallback is the first file whose normalized path matches.
- [ ] Without a conflict the result is unchanged; the existing `getFullPathOfImportedFile` cases pass.
- [ ] Unit spec: same-family hit from a `./` file, same-family hit from a prefix-less file, fallback.
- [ ] `(human)` Cmd-clicking a relative import of a twin from a `./` file opens the `./` twin, and from its
      prefix-less counterpart opens the prefix-less twin.

## Details

- The lookup lives in `handleClick` of `CodeEditor`: it resolves a path with `getFullPathOfImportedFile` and
  finds the file by exact match. Keep the resolution, family choice included, in a pure util.
- Remapped and other non-relative imports keep the current resolution, matched on the normalized path.

## Leaf worklist

- [x] 1 `[agent]` Same-family resolution with the normalized fallback, with the unit spec
- [x] 2 `[agent]` Use it in the import-link click handler of `CodeEditor`
