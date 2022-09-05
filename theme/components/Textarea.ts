import { Textarea as TextareaComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

import getOutlinedFieldStyles from '../utils/getOutlinedFieldStyles';

const sizes = {
  md: defineStyle({
    fontSize: 'md',
    lineHeight: '20px',
    h: '160px',
    borderRadius: 'base',
  }),
  lg: defineStyle({
    fontSize: 'md',
    lineHeight: '20px',
    px: '24px',
    py: '28px',
    h: '160px',
    borderRadius: 'base',
  }),
};

const Textarea = defineStyleConfig({
  sizes,
  variants: {
    outline: defineStyle(getOutlinedFieldStyles),
  },
  defaultProps: {
    variant: 'outline',
  },
});

TextareaComponent.defaultProps = {
  ...TextareaComponent.defaultProps,
  placeholder: ' ',
};

export default Textarea;
