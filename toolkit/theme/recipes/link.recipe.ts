import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    gap: 0,
  },
  variants: {
    visual: {
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
          textDecorationColor: 'link.subtle.hover',
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
    visual: 'primary',
  },
});
