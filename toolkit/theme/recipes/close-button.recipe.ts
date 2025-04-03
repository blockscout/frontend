import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'flex',
    gap: 0,
    borderRadius: 'sm',
    overflow: 'hidden',
    _disabled: {
      opacity: 'control.disabled',
    },
    minWidth: 'auto',
  },
  variants: {
    visual: {
      plain: {
        bg: 'transparent',
        color: 'closeButton.fg',
        border: 'none',
        '&:not([data-loading-skeleton])': {
          bg: 'transparent',
        },
        _hover: {
          bg: 'transparent',
          color: 'link.primary.hover',
        },
      },
    },
    size: {
      md: { boxSize: 5 },
    },
  },
  defaultVariants: {
    size: 'md',
    visual: 'plain',
  },
});
