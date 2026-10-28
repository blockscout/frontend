# 01 — Advanced site settings modal, trimmed popover, Scam tokens / Appearance / Time format tabs

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #2480 |
| Blocked by | none |

## What to build

The gear in the top bar opens a popover holding only the colour theme picker, the identicon picker and an
"Advanced settings" link. The link opens the "Advanced site settings" modal — an adaptive dialog: on desktop centred,
with a vertical tab list on the left (Scam tokens, Appearance, Time format; the RPC node tab arrives in T03)
and the active tab's content on the right; on mobile a full-height bottom sheet with no tab list, where the
same tab entries render as stacked sections (icon + heading + content) in tab order and "open on tab X"
scrolls to that section. Scam tokens holds the "Hide scam
tokens" / "Hide poor reputation tokens" switches with their current cookie-and-reload behaviour; Appearance
holds the theme picker, the identicon picker and, next to the identicon, the address-format picker when the
chain has more than one format; Time format holds the "Local time" switch and a new relative / absolute
selector driving the existing `timeFormat` cookie. Each tab hides when every control in it is hidden. The
open state lives app-wide, keyed by target tab, so the contract-page alert (T04) can open the modal on a given
tab later without touching the popover. FR1–5, FR15.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/`, click the gear

- [ ] Popover renders only theme, identicon and the "Advanced settings" link; scam / poor-reputation /
      address-format / local-time controls are gone from it and not duplicated — each control component is
      reused inside its tab.
- [ ] Modal uses the toolkit `DialogRoot` `adaptive` mode; tabs are the toolkit tabs with a vertical list; tab
      triggers carry icons `status/warning` (Scam tokens), `palette` (Appearance), `clock-light` (Time format).
- [ ] An app-level settings-modal context exposes open/close with a target tab id; the popover link uses it.
      On mobile the target tab scrolls its section into view instead of selecting a tab.
- [ ] One tab registry drives both layouts (tab list on desktop, stacked sections on mobile); no second list
      of tabs anywhere.
- [ ] Scam tokens tab is hidden when `hideScamTokensEnabled` is off; the address-format picker is hidden with
      fewer than two formats; a tab with no visible control is not listed.
- [ ] Time format tab: the relative / absolute selector reads and writes `timeFormat` through
      `useSettingsContext`, and the Local time switch keeps its behaviour; the CSV export dialog's use of
      `SettingsLocalTime` is unaffected.
- [ ] Unit tests cover the tab-visibility gating and the time-format selector state.
- [ ] `(human)` Modal and popover behave on desktop and mobile (bottom sheet, tab switching, close).
- [ ] `(human)` Settings popover matches the mockup at every breakpoint.
- [ ] `(human)` Settings modal frame and tab list match the desktop mockup; the stacked-sections sheet
      matches the mobile mockup.
- [ ] `(human)` Scam tokens, Appearance and Time format tabs match their mockups at every breakpoint.

## Details

- Module home: keep `src/shell/top-bar/settings/`; add a `modal/` folder beside the existing controls for the
  dialog, tab registry and per-tab content, and the open-state context. Do not relocate the module.
- The popover's `lazyMount={ false }` note about colour-theme auto-switch still applies to the theme picker.
- `palette.svg` and the adjusted `link.svg` are already in `src/sprite/icons/` but `public/icons/name.d.ts`
  is not regenerated yet — run `pnpm svg:build-sprite` and commit `name.d.ts` in this ticket.
- Copy: Scam tab description "Tokens flagged as scam are hidden from token lists and balances." (editable,
  stay on-message, Q05).
- Figma nodes: popover `19733-225343`; modal frame `24385-88460`; Scam tokens `24385-88369` (switch states
  `24377-85724`); Appearance `24441-95923`; Time format `31413-5354` (placeholder content, FR5 governs).
  Mobile sheet (separate file, all sections stacked; its Time format section is a placeholder too):
  https://www.figma.com/design/OjqHcLt95E6kq5ElO79EKT/%F0%9F%93%B1-Blockscout-mobile-version?node-id=425-66888

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Regenerate the sprite so `palette` is a typed icon name; commit `public/icons/name.d.ts`
- [ ] 2 `[agent]` Settings-modal open-state context + modal shell with vertical tab list and tab registry (Scam tokens, Appearance, Time format), adaptive dialog
- [ ] 3 `[agent]` Move the four controls into their tabs, add the relative / absolute selector, trim the popover to theme + identicon + link; unit tests
- [ ] 4 `[agent]` Style the settings popover to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=19733-225343)
- [ ] 5 `[agent]` Style the modal frame and tab list to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88460) · [mobile sheet](https://www.figma.com/design/OjqHcLt95E6kq5ElO79EKT/%F0%9F%93%B1-Blockscout-mobile-version?node-id=425-66888)
- [ ] 6 `[agent]` Style the Scam tokens tab to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88369) · [switch states](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24377-85724)
- [ ] 7 `[agent]` Style the Appearance tab to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24441-95923)
- [ ] 8 `[agent]` Style the Time format tab to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=31413-5354)
