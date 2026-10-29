# 05 — Collapse the settings modal to two tabs: General and Custom RPC

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #2480 |
| Blocked by | T01, T03, T04 |

## What to build

The "Advanced site settings" modal is redesigned from four tabs to two. **General** (icon `gear`, heading
"General site settings" on desktop) holds every non-RPC control in one column, in this order: colour theme
picker, identicon picker, "Show {prefix} address format" switch, "Hide scam tokens", "Hide poor reputation
tokens", "Local time format". **Custom RPC** (icon `link`) is the existing RPC node tab, renamed; its content
and behaviour do not change. On desktop the tab list stays vertical on the left. On mobile the bottom sheet
no longer stacks sections: it shows the same two tabs as a horizontal `secondary` tab list under the title
(label only, no icons) with the active tab's content below, and "open on tab X" selects the tab the same way
as on desktop. The General tab is always listed; the Custom RPC tab keeps its gate (multichain off, RPC URL
configured). Every control keeps its own visibility gate and a hidden one leaves no gap. The Scam tokens
and Time format section titles and the scam description are gone. FR2, FR3, FR15.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/`, gear → Advanced settings

- [ ] Registry holds exactly two entries, ids `general` and `rpc-node`; `SettingsModalTabId` narrows to
      them; the three existing `open('rpc-node')` callers (contract result alert, contract pill, top-bar
      indicator) keep working untouched.
- [ ] `SettingsModalSections` and the scroll-into-view branch are removed; one tabs component renders
      both layouts from the registry (vertical `solid` list with icons on desktop, horizontal `secondary`
      list without icons on mobile), and `targetTab` selects the tab on both.
- [ ] General tab composes the existing control components in the spec's order; the Scam tokens, Appearance
      and Time format tab files are deleted; no control is duplicated.
- [ ] Each switch and the address-format control keep their gates; the General tab never hides as a whole;
      with only General visible the tab list is not rendered.
- [ ] `palette.svg` deleted, `clock-light.svg` identical to `main`, `name.d.ts` regenerated without `palette`.
- [ ] `registry.spec.ts` updated: General always present, Custom RPC gated as before; the old four-tab
      expectations are gone.
- [ ] `(human)` Tab switching, close, and "open on Custom RPC" from the contract page work on desktop and
      mobile.
- [ ] `(human)` General tab matches the mockup at every breakpoint.
- [ ] `(human)` Modal frame, tab list and Custom RPC tab match the mockup at every breakpoint.

## Details

- Module home stays `src/shell/top-bar/settings/modal/`.
- Desktop row layout for the two pickers: label with the current value underneath on the left, samples
  right-aligned (see the Figma frame); the existing `SettingsSampleValue` / `SettingsSample` parts carry it.
  Switches are full-width rows with the toggle on the right, as today.
- With the Custom RPC tab hidden (multichain on, or no RPC URL configured) only General remains: the
  tab list is not rendered at all, the General content fills the body on both breakpoints.
- Mobile frame labels the last switch "Date time format"; keep the existing "Local time format".
- Figma: desktop `34294-12488` (design-system file); mobile `456-47003` (mobile file). Custom RPC tab
  content stays on `24378-86455` (parent spec UI inventory, deviations listed there).
- Sprite: `clock-light.svg` and `palette.svg` were only needed by the dropped tabs. Restore `clock-light.svg`
  from `main`, delete `palette.svg`, keep the resized `link.svg` (Custom RPC tab icon), run
  `pnpm svg:build-sprite` and commit `public/icons/name.d.ts`.
- The mobile `DialogRoot adaptive` sheet and the toolkit tabs `secondary` variant are already in the
  toolkit; no new toolkit work.

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [x] 1 `[agent]` Collapse the registry to General + Custom RPC, drop the stacked-sections layout, one tabs component for both breakpoints; update unit tests
- [x] 2 `[agent]` Restore `clock-light.svg`, drop `palette.svg`, regenerate the sprite and `name.d.ts`
- [x] 3 `[agent]` Style the General tab and modal frame to mockup — [Figma desktop](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34294-12488) · [Figma mobile](https://www.figma.com/design/OjqHcLt95E6kq5ElO79EKT/%F0%9F%93%B1-Blockscout-mobile-version?node-id=456-47003)
