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
      borderRadius: '16px',
      fontWeight: '600',
      color: mode('rgba(134, 135, 138, 1)', 'rgba(174, 174, 178, 1)')(props),
      _selected: {
        color: mode('rgba(17, 17, 17, 1)', 'rgba(255, 255, 255, 1)')(props),
        bg: mode('rgba(255, 255, 255, 1)', 'rgba(47, 47, 47, 1)')(props),
        _hover: {
          color: mode('gray.700', 'gray.50')(props),
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
