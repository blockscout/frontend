# 05 — Tab hints and search sections for same-name files

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3904 |
| Blocked by | T03 |

## What to build

Files with the same name stay distinguishable outside the explorer. A tab shows the file name only, and gets
a folder hint only while another open tab has the same file name, as today. When twins are both open, their
hints are compact and differ by the raw prefix: `./…/libraries` and `…/libraries`. A search result section
shows the file name, and adds the dimmed directory only when another result section has the same file name.
Both rules hold with and without a conflict.

## Acceptance criteria

How to verify: `pnpm dev:preset robinhood`, open
`/address/0xd4EB21209C4D6093f80B5b84f5C45cc093EA14a3?tab=contract`

- [ ] Without a conflict the tab hints are unchanged; the existing `getFilePathParts` cases pass.
- [ ] Twins open together get hints in the compact form, differing by the raw prefix.
- [ ] A search section shows the dimmed directory only when another section in the current results has the
      same file name.
- [ ] Unit spec: the tab hint for twins.
- [ ] `(human)` With both `Tick.sol` twins open the two tabs can be told apart, and a search that matches
      both shows two sections that can be told apart.

## Details

- `getFilePathParts` works on display paths split by `/`; a raw `./` path has a leading `.` chunk where a
  normalized path has an empty one, and the current hint logic keys on the empty chunk.
- `CodeEditorSearchSection` renders one section; the same-name check needs the whole result list, which
  `CodeEditorSearch` holds.

## Leaf worklist

- [ ] 1 `[agent]` Compact twin hints in `getFilePathParts` and `CodeEditorTab`, with the unit spec
- [ ] 2 `[agent]` Dimmed directory for same-name sections in `CodeEditorSearch` and `CodeEditorSearchSection`
