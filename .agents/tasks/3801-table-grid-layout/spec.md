# Migrate horizontally scrollable tables to a CSS-grid layout

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3801 |
| Feature branch | `issue-3801` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Two tables scroll horizontally on every viewport: the token transfers table (`/token-transfers`, the
address, token and transaction tabs, and the multichain token transfers page) and the advanced filter
table. Both are built on `<table>` with `table-layout: fixed`, so every column needs a reserved pixel
width. Those widths rarely match the data: the page shows wide gaps in some columns and truncates
others, and because the scroll box is a scroll container in both axes, a page-level sticky header
cannot work inside it — the advanced filter table mounts one today and it never sticks.

The goal is a table whose columns size to their content, with explicit caps only where long values
occur, that scrolls only inside its own box and keeps its header visible while scrolling. Regular
tables keep `<table>`; only the horizontally scrollable ones change.

A throwaway prototype (PR #3785, closed unmerged) validated the approach; the issue body records what it
established and the implementation decisions below carry the parts that matter.

## Functional requirements

1. The token transfers table on all five of its surfaces and the advanced filter table render through a
   grid-based table component. Column widths derive from content; the capped columns are From / To and
   ID / Asset on token transfers, and From, To, Method and Asset on the advanced filter. Long values in a capped
   column truncate through the existing entity components.
2. On a wide viewport the columns share the free width so the table fills its container; on a narrow
   one the table overflows into its own scroll box. The page itself never scrolls horizontally.
3. The scroll box has a bounded height, so the column header stays visible at the top of the box while
   the rows scroll beneath it. The header is opaque: scrolled rows do not show through.
4. The header and cells look like the `table` recipe: the same header colors, padding and top radius,
   cell padding, row border and font; numeric columns stay right-aligned.
5. Column selector, persisted columns, lazy row rendering, unique row keys, pagination, filters, the
   multichain chain-icon column and the socket "new items" notice keep working unchanged on every
   migrated surface; the advanced filter header keeps its per-column filter controls and its time
   format toggle.
6. No column width field remains on the token transfer or advanced filter column definitions, and no
   dead scroll-container or sticky-header code remains from the `<table>` version of either surface.
7. Existing Playwright screenshots of the affected surfaces are regenerated.

## Data & API

None. No endpoint, resource, response type, env var or feature flag is added or changed.

## UI inventory

No new routes, navigation entries or links. No Figma mockups: the visual target is parity with the
current `table` recipe.

Affected surfaces:

- Token transfers table — `/token-transfers`, address page token transfers tab, token page token
  transfers tab, transaction page token transfers tab, multichain token transfers page (adds the
  chain-icon column).
- Advanced filter table — `/advanced-filter`.

Both render the same grid on mobile and desktop; there is no separate mobile list.

## Implementation decisions

- **A toolkit component next to the table primitives.** The grid table lives in the toolkit beside
  the existing table module, as presentation primitives only: a scroll box, a grid root, a column
  header cell, a cell and a full-width row. The surfaces keep composing lazy rendering, unique keys and
  socket notices themselves, as they do today.
- **Styling comes from the table slot recipe.** The primitives resolve their styles with
  `useSlotRecipe` against the existing table recipe, so header colors, padding, radius, borders and
  font have one definition. The recipe's first/last-column padding and radius are sibling selectors
  that cannot work when rows are `display: contents`, so the component applies them per column index
  instead. The grid adds only what the recipe lacks: sticky positioning, an opaque `bg.primary`
  underlay beneath the translucent header background, and `justify-items: end` on numeric cells.
- **Layout, from the prototype.** The grid is `width: max-content; min-width: 100%` with
  `grid-template-columns` built per visible column — `auto` by default, `fit-content(<max>)` for a
  capped column. Rows are `display: contents` wrappers so every cell is a direct grid child. The scroll
  box is `overflow: auto` with `contain: inline-size`, which keeps the page layout container from
  widening with the grid. Spacing is cell padding, never grid gaps, because sticky cell backgrounds do
  not cover gaps.
- **Column caps are surface data.** Each column definition may carry a max width that the surface
  turns into its `fit-content` track. Token transfers: From / To 350px, ID / Asset 240px. Advanced
  filter: From 200px, To 200px, Method 160px, Asset 240px — the developer verifies these on the running
  page. The nameless `or_and` column is capped at 65px too, not for long values but because an
  uncapped `auto` track takes an equal share of the free width.
- **Scroll box height is a prop.** The toolkit scroll box takes a max height with a default of `70vh`.
  Surfaces pass a viewport-fill value (`calc(100vh - <offset>)`) built from one app-side constant pair
  covering the top bar and action bar stack, so the value is never baked into the toolkit.
- **Header behaviour.** Header cells are sticky to the top of the scroll box, do not wrap, and show the
  `action_bar` shadow while the box is scrolled, as `TableHeaderSticky` does when stuck. The advanced
  filter header keeps its filter buttons and time toggle inline;
  the nameless `or_and` column stays center-aligned.
- **Socket notice.** The token transfers surface renders the socket "new items" notice as a grid
  full-width row spanning every column, a grid counterpart of the existing desktop notice.
- **Cleanup in the same change.** The width field leaves both column definition types, the
  scroll-everywhere branch of the shared table scroll container goes (the token transfers table was its
  only consumer), and the advanced filter drops its page-level sticky header.

## Out of scope

- Column pinning (sticky first column). It works in the grid, but no surface ships it in this task and
  the component carries no opt-in for it.
- A page-level sticky header that escapes the scroll box; that needs the header split out with scroll
  syncing.
- Migrating any regular, non-scrolling table.
- Any visual change beyond parity with the `table` recipe.
