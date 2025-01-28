import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    gap: 0,
  },
  variants: {
    variant: {
      primary: {
        color: 'link.primary',
        _hover: {
          textDecoration: 'none',
          color: 'link.primary.hover',
        },
      },
      secondary: {
        color: 'link.secondary',
        _hover: {
          textDecoration: 'none',
          color: 'link.primary.hover',
        },
      },
      subtle: {
        color: 'link.subtle',
        _hover: {
          color: 'link.subtle.hover',
          textDecorationLine: 'underline',
          textDecorationColor: 'link.subtle.hover',
        },
      },
      underlaid: {
        color: 'link.primary',
        // css-var to override bg property on loaded skeleton
        '--layer-bg': '{colors.link.underlaid.bg}',
        bgColor: 'link.underlaid.bg',
        px: '8px',
        py: '6px',
        borderRadius: 'base',
        textStyle: 'sm',
        _hover: {
          color: 'link.primary.hover',
          textDecoration: 'none',
        },
        _loading: {
          bgColor: 'transparent',
        },
      },
      menu: {
        color: 'link.menu',
        _hover: {
          color: 'link.primary.hover',
          textDecoration: 'none',
        },
      },
      navigation: {
        color: 'link.navigation.fg',
        bg: 'link.navigation.bg',
        border: 'link.navigation.border',
        _hover: {
          color: 'link.navigation.fg.hover',
          textDecoration: 'none',
        },
        _selected: {
          color: 'link.navigation.fg.selected',
          bg: 'link.navigation.bg.selected',
          border: 'link.navigation.border.selected',
        },
        _active: {
          color: 'link.navigation.fg.active',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
