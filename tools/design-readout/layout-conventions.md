| What the mockup shows / the question | Convention | Unless | Code home |
| --- | --- | --- | --- |
| a list on mobile drawn as cards, or as a table narrower than its columns | a horizontally scrollable table, never a card variant | | `src/toolkit/chakra/table.tsx` |
| pagination controls anywhere on the screen | pagination sits in the `ActionBar` | the mockup puts it in the tabs row | `src/shell/page/action-bar/ActionBar.tsx`, `src/shared/pagination/` |
| a price-like cell (fiat, gas price, fee) in a table column | right-aligned, under an `isNumeric` column header | | `src/toolkit/chakra/table.tsx` |
| a row divider drawn as its own layer (a line or a "divider" icon) between table rows | the row's bottom border from the `line` table variant; no separate divider element | | `src/toolkit/chakra/table.tsx` |
