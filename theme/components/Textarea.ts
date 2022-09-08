import { Textarea as TextareaComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import getOutlinedFieldStyles from '../utils/getOutlinedFieldStyles';

const variantFilledInactive = defineStyle((props) => {
  return {
    bgColor: mode('blackAlpha.50', 'whiteAlpha.50')(props),
  };
});

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
    filledInactive: variantFilledInactive,
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
