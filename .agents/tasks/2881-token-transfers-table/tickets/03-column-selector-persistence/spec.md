# 03 — Column selector, cookie persistence and analytics on `/token-transfers`

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 03 of #2881 |
| Blocked by | T01, T02 |

## What to build

On `/token-transfers` the user can open the shared `ColumnsButton` next to the type filter and toggle any
available column on or off; the table updates immediately, the choice survives a reload with no flash of
the default layout, and each toggle emits one Mixpanel event. A hook in the token-transfer slice resolves
a surface's effective column set: defaults from the config module, overlaid with the user's overrides read
from one new cookie that holds a JSON map of surface → overrides. The cookie is read through the app
context's server cookie string so the first render already has the user's columns. The multichain index
variant gets the same button in its right slot and mobile action bar.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/token-transfers`, toggle a column, reload

- [ ] New `NAMES` member in `src/shared/storage/cookies.ts`; value is a JSON map keyed by surface id
      holding only deviations from that surface's defaults (a column at its default is absent from the
      map).
- [ ] `useTokenTransferColumns(surface)` (name indicative) returns the ordered visible column set, the
      selectable column list, and a toggle; it seeds state from `useAppContext().cookies` so SSR and the
      first client render agree; the cookie is written on every toggle.
- [ ] Unavailable columns for a surface are neither rendered nor offered; off-by-default columns are
      offered unchecked.
- [ ] A new Mixpanel event in `src/services/mixpanel/utils.ts` (`EventTypes` + `EventPayload`) carries
      the surface, the column, and the new state; exactly one is logged per toggle.
- [ ] The button sits beside the type filter in `TokenTransfersLocal`'s action bar, and in
      `MultichainTokenTransfers`'s right slot + `MultichainTokenTransfersLocal`'s mobile action bar.
- [ ] Unit specs: override map merge/serialisation, default-change does not resurrect stale lists
      (a column newly defaulted "on" shows unless explicitly overridden), event payload.
- [ ] One extra screenshot in `TokenTransfers.pw.tsx` with the selector open, `+@mobile` tagged.
- [ ] `(human)` Toggling columns updates the table at once; after a hard reload the chosen set is
      visible on first paint; the multichain page behaves the same.

## Details

Cookie patterns: `src/slices/token/pages/address/useAddressNftQuery.ts` (SSR-safe read through the app
context string, write on change) and `src/shell/top-bar/settings/context.tsx`. Do **not** follow
`useTxsSort`'s client-only read. Mixpanel precedent: `ADDRESS_WIDGET` (commit `a2b9c418dd`).

The shared `ColumnsButton` (T01) is uncontrolled (`defaultValue`); if the hook needs a controlled
value make that change in the shared component here, keeping the advanced filter working.

Mobile presentation of the selector (popover vs drawer) is decided in the style leaf; the mockup draws a
drawer: https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3893-28801 . Because the button is
shared, the advanced filter page inherits whatever is chosen.

## Leaf worklist

- [ ] 1 `[agent]` Cookie name + override-map utils (parse / merge / serialise) + spec
- [ ] 2 `[agent]` `useTokenTransferColumns(surface)` hook, SSR-seeded; Mixpanel event registry entry +
      log on toggle; spec
- [ ] 3 `[agent]` Place `ColumnsButton` on the index surface (local + multichain, desktop + mobile
      action bar); selector-open pw case scaffold
- [ ] 4 `[human]` Style the selector (desktop popover, mobile drawer) to mockup —
      [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=3893-28801); regenerate
      baselines (index page + advanced filter)
