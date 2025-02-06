import { defineSlotRecipe } from '@chakra-ui/react';

import { recipe as radiomarkRecipe } from './radiomark.recipe';

export const recipe = defineSlotRecipe({
  slots: [ 'item', 'itemControl', 'label' ],
  base: {
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative',
      fontWeight: 'normal',
      _disabled: {
        cursor: 'disabled',
      },
    },

    itemControl: radiomarkRecipe.base,

    label: {
      userSelect: 'none',
      textStyle: 'md',
      _disabled: {
        opacity: '0.5',
      },
    },
  },
  variants: {
    variant: {
      solid: {
        itemControl: radiomarkRecipe.variants?.variant?.solid,
      },
    },

    size: {
      xs: {
        item: { textStyle: 'xs', gap: '1' },
        itemControl: radiomarkRecipe.variants?.size?.xs,
      },

      sm: {
        item: { textStyle: 'sm', gap: '1' },
        itemControl: radiomarkRecipe.variants?.size?.sm,
      },

      md: {
        item: { textStyle: 'md', gap: '2' },
        itemControl: radiomarkRecipe.variants?.size?.md,
      },
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
});
