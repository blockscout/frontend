# 08 — Reset in the column selector

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 08 of #2881 |
| Blocked by | T03 |

## What to build

The column selector gets a "Reset" link that puts the current surface back to its default columns, the way
the type filter popover resets its token types. Clicking it clears the surface's entry from the column
cookie, the table returns to the FR 2 defaults at once, the selector button drops its selected state, and
one Mixpanel event is logged. Reset is disabled while the columns already match the defaults, and the
popover stays open after it. The index page (local and multichain, desktop and mobile) gets it in this
ticket; T04–T06 wire it on their surfaces when they add the selector. The advanced filter does not pass a
reset handler; its popover gains only the "Columns" title, which the icon-only button no longer shows.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/token-transfers`, hide a column, open the selector, click Reset

- [ ] `useTokenTransferColumns` returns a reset handler that removes the surface's entry from the cookie
      (other surfaces' entries are kept) and resets the visible columns to `getDefaultColumnIds(surface)`.
- [ ] Reset logs exactly one `Table columns` event: `State: 'Reset'`, `Column: 'All'`, plus `Table` and
      `Surface` as for a toggle; the `EventPayload` `State` union gains `'Reset'`.
- [ ] `ColumnsButton` takes an optional `onReset`; the desktop popover always shows a header row with the
      "Columns" title, and when `onReset` is given the row (or the mobile drawer title) carries a "Reset"
      link, disabled when the button is not `selected`. Without `onReset` no Reset is rendered.
- [ ] The index page and its multichain variant (right slot and mobile action bar) pass the hook's reset
      handler.
- [ ] Unit specs: hook reset (columns back to defaults, other surfaces kept, one event, button no longer
      customized); `ColumnsButton` Reset rendered only with `onReset`, disabled state, calls
      `onReset` on click.
- [ ] `(human)` Reset looks and behaves like the type filter popover's Reset on desktop and mobile.

## Details

Design (confirmed by Tatyana, 2026-10-02): the Reset must look exactly like the Reset in the filter popover
— the header row in `TokenTypeFilter` (secondary-colour semibold title on the left, `Button variant="link"`
`textStyle="sm"` on the right, disabled when there is nothing to reset). Reuse that markup; there is no
separate mockup. On mobile the selector is a drawer whose header already carries the "Columns" title, so
the Reset link sits in that header next to the title instead of repeating it. The popover keeps the title
without a reset handler too (developer decision, 2026-10-02): the button became icon-only in T01, so the
title is the selector's only label.

Disabled state keys off `isCustomized` (passed to the button as `selected`), not off whether a cookie entry
exists: a stored override that now equals a changed default leaves Reset disabled.

## Leaf worklist

- [x] 1 `[agent]` Hook reset handler + Mixpanel `'Reset'` state; spec
- [x] 2 `[agent]` `onReset` in `ColumnsButton` (popover and drawer) reusing the filter popover's Reset
      markup; wire it on the index page (local + multichain, desktop + mobile); spec
