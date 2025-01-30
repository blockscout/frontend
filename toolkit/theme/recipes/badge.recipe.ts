import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'sm',
    gap: '1',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  variants: {
    variant: {
      subtle: {},
    },
    colorPalette: {
      gray: {
        bg: 'badge.gray.bg',
        '--layer-bg': '{colors.badge.gray.bg}',
        color: 'badge.gray.fg',
      },
      green: {
        bg: 'badge.green.bg',
        '--layer-bg': '{colors.badge.green.bg}',
        color: 'badge.green.fg',
      },
      red: {
        bg: 'badge.red.bg',
        '--layer-bg': '{colors.badge.red.bg}',
        color: 'badge.red.fg',
      },
      purple: {
        bg: 'badge.purple.bg',
        '--layer-bg': '{colors.badge.purple.bg}',
        color: 'badge.purple.fg',
      },
      orange: {
        bg: 'badge.orange.bg',
        '--layer-bg': '{colors.badge.orange.bg}',
        color: 'badge.orange.fg',
      },
      blue: {
        bg: 'badge.blue.bg',
        '--layer-bg': '{colors.badge.blue.bg}',
        color: 'badge.blue.fg',
      },
      yellow: {
        bg: 'badge.yellow.bg',
        '--layer-bg': '{colors.badge.yellow.bg}',
        color: 'badge.yellow.fg',
      },
      teal: {
        bg: 'badge.teal.bg',
        '--layer-bg': '{colors.badge.teal.bg}',
        color: 'badge.teal.fg',
      },
      cyan: {
        bg: 'badge.cyan.bg',
        '--layer-bg': '{colors.badge.cyan.bg}',
        color: 'badge.cyan.fg',
      },
      purple_alt: {
        bg: 'badge.purple_alt.bg',
        '--layer-bg': '{colors.badge.purple_alt.bg}',
        color: 'badge.purple_alt.fg',
      },
      blue_alt: {
        bg: 'badge.blue_alt.bg',
        '--layer-bg': '{colors.badge.blue_alt.bg}',
        color: 'badge.blue_alt.fg',
      },
    },
    size: {
      md: {
        textStyle: 'sm',
        px: '1',
        py: '0.5',
        minH: '6',
      },
    },
  },
  defaultVariants: {
    variant: 'subtle',
    colorPalette: 'gray',
    size: 'md',
  },
});
