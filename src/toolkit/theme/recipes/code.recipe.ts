// SPDX-License-Identifier: LicenseRef-Blockscout

import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  className: 'chakra-code',
  base: {
    fontFamily: 'mono',
    alignItems: 'center',
    display: 'inline-flex',
    borderRadius: 'sm',
  },
  variants: {
    variant: {
      subtle: {},
    },
    colorPalette: {
      gray: {
        bg: 'badge.gray.bg',
        color: 'badge.gray.fg',
      },
    },
    size: {
      sm: {
        textStyle: 'xs',
        px: 1,
        py: 0.5,
      },
    },
  },
  defaultVariants: {
    variant: 'subtle',
    colorPalette: 'gray',
    size: 'sm',
  },
});
