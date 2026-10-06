# 02 — Reverse color map and drift check

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3756 |
| Blocked by | none |

## What to build

`pnpm design:colormap` generates `tools/design-readout/colormap.json` from the theme's default colors and
semantic tokens: for each color mode, every hex (with alpha where the token has one) maps to the list of
semantic tokens that resolve to it. The file is committed; `pnpm design:colormap --check` regenerates in
memory and exits non-zero when the committed file differs, so a theme change that is not followed by a
regeneration fails CI. Runtime theme overrides from app config are ignored by construction: the
generator reads the defaults, not the merged config. A lookup module answers "which tokens does this
hex serve, in this mode, for this role" and returns all matches; a mode-detection function says
light or dark from a set of values, with the frame background as tiebreaker.

## Acceptance criteria

- [ ] Prefactor: `DEFAULT_THEME_COLORS` and the semantic tokens are importable without `src/config`
      (config-free modules the existing `colors.ts` / `semanticTokens.ts` compose from); the toolkit's
      runtime behaviour is unchanged and the existing tests still pass.
- [ ] The generator resolves token references (`{colors.blue.500}`, nested `_light` / `_dark`) down to
      hex and alpha, keyed by mode; a token with a literal hex works too; specs cover both.
- [ ] `colormap.json` is committed; `--check` fails when regeneration differs and prints the first
      differing key; wired into the lint pipeline alongside the other drift checks.
- [ ] Lookup returns every token for a hex (e.g. a hex serving `text.primary` and `white`), and a role
      filter (`text`, `background`, `border`, `icon`) narrows by token path prefix; specs cover a
      multi-hit and a role miss.
- [ ] Mode detection: majority of values resolving in one mode wins; a tie is broken by the frame
      background; a spec covers each branch, including the dark `rgba(255,255,255,0.8)` →
      `whiteAlpha.800` → `text.primary` case from the spec.

## Details

- Both `src/toolkit/theme/foundations/colors.ts` and `semanticTokens.ts` import `src/config` (the top-bar
  color overrides and the hero banner button). The generator must not load app config, so the prefactor
  splits the config-free defaults out and leaves the two existing files composing them. Keep the
  exported names the theme consumes unchanged.
- Role → token path prefix mapping lives in `config.ts` of the tool (`text.*` → text, `bg.*` →
  background, `border.*` → border, `icon.*` → icon); it is a starting point ticket 05 may refine.
- Add this check to whichever lint script runs the other drift checks; look at how
  `public/icons/name.d.ts` consistency is enforced before inventing a new place.

## Leaf worklist

- [ ] 1 `[agent]` Prefactor: config-free theme defaults modules; theme unchanged
- [ ] 2 `[agent]` Generator + committed `colormap.json` + `--check` drift gate + package scripts
- [ ] 3 `[agent]` Lookup (hex + mode + role → tokens) and mode detection with specs
