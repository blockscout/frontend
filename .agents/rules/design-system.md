---
description: Design system and styling rules for the Blockscout frontend
paths:
  - "src/**/*.tsx"
globs: "src/**/*.tsx"
alwaysApply: false
---
# Design System

## Stack

The app uses **Chakra UI v3** as its component and styling foundation.

**Documentation:** https://chakra-ui.com/llms.txt — consult this to understand what components Chakra provides and how its styling system works.

## Project configuration

The design system is layered on top of Chakra UI inside `src/toolkit/`:

| Path | Purpose |
|---|---|
| `src/toolkit/chakra/` | Custom wrappers for Chakra components — always prefer these over bare Chakra imports |
| `src/toolkit/theme/theme.ts` | Theme entry point; uses Chakra v3's `createSystem` API to merge defaults with project config |
| `src/toolkit/theme/foundations/semanticTokens.ts` | Full list of semantic color tokens (text, bg, border, icon, component-level tokens) |
| `src/toolkit/theme/foundations/colors.ts` | Raw color palette referenced by semantic tokens |
| `src/toolkit/theme/recipes/` | Component style recipes (slot recipes and simple recipes) |
| `src/toolkit/components/` | Custom business components (forms, charts, tabs, etc.) built on top of Chakra |
| `src/toolkit/hooks/` | Shared React hooks (useDisclosure, useClipboard, etc.) |

The `Provider` component at `src/toolkit/chakra/provider.tsx` wraps `ChakraProvider` with the custom theme and color mode support. It must be mounted at the app root.

## Component import priority

Always check `src/toolkit/chakra/` before importing from Chakra UI directly; if a wrapper exists there, use it.
ESLint blocks the wrapped components by name, but the list is not exhaustive — the rule applies to any
component that has a wrapper, caught or not.

## Colors

Never use raw color values (hex, RGB, HSL). Always reference a token. Three sources are valid:

1. **Semantic tokens** — context-aware, light/dark aware. Full list in `src/toolkit/theme/foundations/semanticTokens.ts`. Prefer these whenever a semantic meaning exists.

   ```tsx
   <Text color="text.secondary" />
   <Box bg="bg.secondary" borderColor="border.divider" />
   ```

   Common groups: `text.*`, `bg.*`, `border.*`, `icon.*`, `link.*`, `button.*`, `badge.*`.

2. **Project color palette** — scale and alpha colors defined in `src/toolkit/theme/foundations/colors.ts`: `gray`, `blue`, `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `purple`, `pink` (steps 50–900), `black`, `white`, `whiteAlpha.*`, `blackAlpha.*`.

   ```tsx
   <Box bg="blue.50" color="gray.700" />
   ```

3. **Brand colors** — also defined in `src/toolkit/theme/foundations/colors.ts`: `github`, `telegram`, `linkedin`, `discord`, `slack`, `twitter`, `opensea`, `facebook`, `medium`, `reddit`, `celo`, `clusters`.

   ```tsx
   <Icon color="github" />
   ```

If a raw color value is truly unavoidable (e.g. a third-party embed), leave a comment explaining why.

## Design tokens

The project customizes the following Chakra token categories in `src/toolkit/theme/`. Always use these tokens instead of raw CSS values:

| Token type | File | Example |
|---|---|---|
| Border radius | `src/toolkit/theme/foundations/borders.ts` | `borderRadius="md"` instead of `borderRadius="12px"` |
| Shadows | `src/toolkit/theme/foundations/shadows.ts` | `boxShadow="size.md"` instead of a custom `box-shadow` |
| Z-index | `src/toolkit/theme/foundations/zIndex.ts` | `zIndex="modal"` instead of a raw number |
| Font weights | `src/toolkit/theme/theme.ts` (inline) | `fontWeight="semibold"` instead of `fontWeight={600}` |
| Durations | `src/toolkit/theme/foundations/durations.ts` | Use duration tokens for CSS transitions |
| Keyframes | `src/toolkit/theme/foundations/animations.ts` | Reference named keyframes for custom animations |

Available `radii` tokens: `none`, `sm` (4px), `base` (8px), `md` (12px), `lg` (16px), `xl` (24px), `full`.

Available `shadows` tokens: `size.xs`, `size.sm`, `size.base`, `size.md`, `size.lg`, `size.xl`, `size.2xl`, `action_bar`, `dark-lg`.

## Text styles

Do not set `fontSize` or `lineHeight` directly. Apply the appropriate `textStyle` token instead — it encodes both properties together along with `fontWeight` and `fontFamily`.

```tsx
// BAD
<Text fontSize="14px" lineHeight="20px">Label</Text>

// GOOD
<Text textStyle="text.sm">Label</Text>
```

Available text styles (defined in `src/toolkit/theme/foundations/typography.ts`):

| Token | fontSize / lineHeight |
|---|---|
| `heading.xl` | 32px / 40px |
| `heading.lg` | 24px / 32px |
| `heading.md` | 18px / 24px |
| `heading.sm` | 16px / 24px |
| `heading.xs` | 14px / 20px |
| `text.xl` | 20px / 28px |
| `text.md` | 16px / 24px |
| `text.sm` | 14px / 20px |
| `text.xs` | 12px / 16px |

For a regular text block, the `text.` prefix can be omitted.

## Compound component spacing

Do not override the default spacing of **internal parts** of compound components (e.g. adding custom padding to `DialogHeader` inside a `Dialog`, or to a `MenuList` item). The root component itself may be spaced freely; its sub-parts may not.

This rule applies to all components from `src/toolkit/chakra/`.

## Duplicated style props

Before adding a style prop, check whether the same property is already set by an inherited style or a parent component. Flag and remove redundant re-declarations.

