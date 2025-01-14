import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'flex',
    gap: 0,
    borderRadius: 'sm',
    overflow: 'hidden',
    _disabled: {
      opacity: 0.2,
    },
    minWidth: 'auto',
  },
  variants: {
    visual: {
      plain: {
        bg: 'transparent',
        color: 'icon.backTo',
        border: 'none',
        _hover: {
          bg: 'transparent',
          color: 'link.primary.hover',
        },
      },
    },
    size: {
      md: { boxSize: 6, '& svg': { boxSize: 5 } },
    },
  },
  defaultVariants: {
    size: 'md',
    visual: 'plain',
  },
});
