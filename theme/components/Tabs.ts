import { tabsAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

import Button from './Button/Button';

const variantSoftRounded = definePartsStyle((props) => {
  return {
    tab: {
      borderRadius: 'base',
      fontWeight: '600',
      color: mode('brand.700', 'gray.400')(props),
      _selected: {
        color: mode('brand.700', 'gray.50')(props),
        bg: mode('brand.50', 'gray.800')(props),
        _hover: {
          color: mode('brand.700', 'gray.50')(props),
        },
      },
      _hover: {
        color: 'link_hovered',
      },
      _focusVisible: {
        boxShadow: { base: 'none', lg: 'outline' },
      },
    },
  };
});

const variantOutline = definePartsStyle((props) => {
  return {
    tab: {
      ...Button.variants?.outline(props),
      ...Button.baseStyle,
      _selected: Button.variants?.outline(props)._active,
    },
  };
});

const sizes = {
  sm: definePartsStyle({
    tab: Button.sizes?.sm,
  }),
  md: definePartsStyle({
    tab: Button.sizes?.md,
  }),
};

const variants = {
  'soft-rounded': variantSoftRounded,
  outline: variantOutline,
};

const Tabs = defineMultiStyleConfig({
  sizes,
  variants,
});

export default Tabs;
