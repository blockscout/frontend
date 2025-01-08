import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
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
    },
  },
  defaultVariants: {
    visual: 'primary',
  },
});
