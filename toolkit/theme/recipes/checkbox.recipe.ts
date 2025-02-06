import { defineSlotRecipe } from '@chakra-ui/react';

import { recipe as checkmarkRecipe } from './checkmark.recipe';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'control', 'label' ],
  className: 'chakra-checkbox',
  base: {
    root: {
      display: 'inline-flex',
      gap: '2',
      alignItems: 'center',
      verticalAlign: 'top',
      position: 'relative',
    },

    control: checkmarkRecipe.base,

    label: {
      fontWeight: 'normal',
      userSelect: 'none',
      _disabled: {
        opacity: '0.5',
      },
    },
  },

  variants: {
    size: {
      xs: {
        root: { gap: '1' },
        label: { textStyle: 'xs' },
        control: checkmarkRecipe.variants?.size?.xs,
      },
      sm: {
        root: { gap: '1' },
        label: { textStyle: 'sm' },
        control: checkmarkRecipe.variants?.size?.sm,
      },
      md: {
        root: { gap: '2' },
        label: { textStyle: 'md' },
        control: checkmarkRecipe.variants?.size?.md,
      },
    },

    variant: {
      solid: {
        control: checkmarkRecipe.variants?.variant?.solid,
      },
    },
  },

  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
