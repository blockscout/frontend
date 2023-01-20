import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

import Input from './Input';

const { defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

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
};

const Select = defineMultiStyleConfig({
  sizes,
  defaultProps: {
    size: 'sm',
  },
});

export default Select;
