import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'sm',
    gap: '1',
    fontWeight: '500',
    width: 'fit-content',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'normal',
    userSelect: 'none',
    _loading: {
      borderRadius: 'sm',
    },
  },
  variants: {
    variant: {
      subtle: {},
    },
    colorPalette: {
      gray: {
        bg: 'badge.gray.bg',
        color: 'badge.gray.fg',
      },
      green: {
        bg: 'badge.green.bg',
        color: 'badge.green.fg',
      },
      red: {
        bg: 'badge.red.bg',
        color: 'badge.red.fg',
      },
      purple: {
        bg: 'badge.purple.bg',
        color: 'badge.purple.fg',
      },
      orange: {
        bg: 'badge.orange.bg',
        color: 'badge.orange.fg',
      },
      blue: {
        bg: 'badge.blue.bg',
        color: 'badge.blue.fg',
      },
      yellow: {
        bg: 'badge.yellow.bg',
        color: 'badge.yellow.fg',
      },
      teal: {
        bg: 'badge.teal.bg',
        color: 'badge.teal.fg',
      },
      cyan: {
        bg: 'badge.cyan.bg',
        color: 'badge.cyan.fg',
      },
      purple_alt: {
        bg: 'badge.purple_alt.bg',
        color: 'badge.purple_alt.fg',
      },
      blue_alt: {
        bg: 'badge.blue_alt.bg',
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
