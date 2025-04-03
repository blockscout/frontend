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
      bgColor: 'unset',
    },
  },
  variants: {
    variant: {
      subtle: {},
    },
    colorPalette: {
      gray: {
        bgColor: 'badge.gray.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.gray.bg',
        },
        color: 'badge.gray.fg',
      },
      green: {
        bgColor: 'badge.green.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.green.bg',
        },
        color: 'badge.green.fg',
      },
      red: {
        bgColor: 'badge.red.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.red.bg',
        },
        color: 'badge.red.fg',
      },
      purple: {
        bgColor: 'badge.purple.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.purple.bg',
        },
        color: 'badge.purple.fg',
      },
      orange: {
        bgColor: 'badge.orange.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.orange.bg',
        },
        color: 'badge.orange.fg',
      },
      blue: {
        bgColor: 'badge.blue.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.blue.bg',
        },
        color: 'badge.blue.fg',
      },
      yellow: {
        bgColor: 'badge.yellow.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.yellow.bg',
        },
        color: 'badge.yellow.fg',
      },
      teal: {
        bgColor: 'badge.teal.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.teal.bg',
        },
        color: 'badge.teal.fg',
      },
      cyan: {
        bgColor: 'badge.cyan.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.cyan.bg',
        },
        color: 'badge.cyan.fg',
      },
      purple_alt: {
        bgColor: 'badge.purple_alt.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.purple_alt.bg',
        },
        color: 'badge.purple_alt.fg',
      },
      blue_alt: {
        bgColor: 'badge.blue_alt.bg',
        '&:not([data-loading], [aria-busy=true])': {
          bgColor: 'badge.blue_alt.bg',
        },
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
