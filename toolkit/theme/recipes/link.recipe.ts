import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  variants: {
    visual: {
      primary: {
        color: 'links.primary',
        _hover: {
          textDecoration: 'none',
          color: 'links.primary.hover',
        },
      },
      secondary: {
        color: 'links.secondary',
        _hover: {
          textDecoration: 'none',
          color: 'links.primary.hover',
        },
      },
      subtle: {
        color: 'links.subtle',
        _hover: {
          color: 'links.subtle.hover',
          textDecorationColor: 'links.subtle.hover',
        },
      },
    },
  },
  defaultVariants: {
    visual: 'primary',
  },
});
