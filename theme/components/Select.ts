import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system';

import Input from './Input';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variantOutline = definePartsStyle((props) => {
  return {
    field: {
      ...Input.variants?.outline(props).field,
      _focusVisible: {
        borderColor: Input.variants?.outline(props).field.borderColor,
        boxShadow: 'none',
      },
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
