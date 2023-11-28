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
      color: 'accent',
      _selected: {
        color: 'accent',
        bg: mode('#E9FFF4', '#2C2C2C')(props),
        _hover: {
          color: 'accent',
        },
      },
      _hover: {
        color: 'accent',
        bg: mode('#E9FFF4', '#2C2C2C')(props),

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
