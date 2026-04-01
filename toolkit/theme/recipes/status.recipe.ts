import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  className: 'chakra-status',
  slots: [ 'root', 'indicator' ],

  base: {
    root: {
      display: 'block',
      borderRadius: 'full',
      borderColor: 'bg.primary',
      bg: 'orange.400',
      forcedColorAdjust: 'none',
      flexShrink: 0,
    },
  },

  variants: {
    size: {
      xs: {
        root: {
          boxSize: '6px',
          borderWidth: '1px',
        },
      },
      sm: {
        root: {
          boxSize: '8px',
          borderWidth: '1px',
        },
      },
      md: {
        root: {
          boxSize: '10px',
          borderWidth: '1px',
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
