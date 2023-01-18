import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
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

const Select = defineMultiStyleConfig({
  variants: {
    ...Input.variants,
    outline: variantOutline,
  },
});

export default Select;
