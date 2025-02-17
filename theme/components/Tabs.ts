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
      fontWeight: 400,
      borderRadius: 'base',
      color: mode('purple.300', 'white')(props),
      _selected: {
        color: mode('white', 'white')(props),
        bg: mode('purple.300', 'grey.10')(props),
        _hover: {
          bg: mode('purple.200', 'grey.10')(props),
          color: mode('white', 'white')(props),
        },
      },
      _hover: {
        color: mode('white', 'black')(props),
        bg: mode('purple.200', 'white')(props),
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

const variantRadioGroup = definePartsStyle((props) => {
  return {
    tab: {
      ...Button.baseStyle,
      ...Button.variants?.radio_group(props),
      _selected: Button.variants?.radio_group(props)?.[`
      &[data-selected=true],
      &[data-selected=true][aria-selected=true]
    `],
      borderRadius: 'none',
      '&[role="tab"]': {
        _first: {
          borderTopLeftRadius: 'base',
          borderBottomLeftRadius: 'base',
        },
        _last: {
          borderTopRightRadius: 'base',
          borderBottomRightRadius: 'base',
        },
      },
    },
  };
});

const sizes = {
  sm: definePartsStyle({
    tab: Button.sizes?.sm,
  }),
  md: definePartsStyle({
    tab: Button.sizes?.sm,
  }),
};

const variants = {
  'soft-rounded': variantSoftRounded,
  outline: variantOutline,
  radio_group: variantRadioGroup,
};

const Tabs = defineMultiStyleConfig({
  sizes,
  variants,
});

export default Tabs;
