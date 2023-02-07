import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import Input from './Input';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variantOutline = definePartsStyle((props) => {
  return {
    field: {
      ...Input.variants?.outline(props).field,
      borderColor: mode('gray.200', 'gray.600')(props),
      _hover: {
        borderColor: mode('gray.300', 'gray.500')(props),
      },
      _focusVisible: {
        borderColor: mode('gray.200', 'gray.600')(props),
        boxShadow: 'none',
      },
      cursor: 'pointer',
    },
  };
});

const iconSpacing = defineStyle({
  paddingInlineEnd: '8',
});

const sizes = {
  lg: {
    ...Input.sizes?.lg,
    field: {
      ...Input.sizes?.lg.field,
      ...iconSpacing,
    },
  },
  md: {
    ...Input.sizes?.md,
    field: {
      ...Input.sizes?.md.field,
      ...iconSpacing,
    },
  },
  sm: {
    ...Input.sizes?.sm,
    field: {
      ...Input.sizes?.sm.field,
      ...iconSpacing,
    },
  },
  xs: {
    ...Input.sizes?.xs,
    field: {
      ...Input.sizes?.xs.field,
      ...iconSpacing,
      fontSize: 'sm',
      lineHeight: '20px',
    },
  },
};

const Select = defineMultiStyleConfig({
  variants: {
    ...Input.variants,
    outline: variantOutline,
  },
  sizes,
  defaultProps: {
    size: 'xs',
  },
});

export default Select;
