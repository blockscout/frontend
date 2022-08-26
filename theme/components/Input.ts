import type { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { Input as InputComponent } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { PartsStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';
import getOutlinedFieldStyles from '../utils/getOutlinedFieldStyles';

const sizes: Record<string, SystemStyleObject> = {
  sm: {
    fontSize: 'md',
    lineHeight: '24px',
    px: '8px',
    py: '12px',
    h: '40px',
    borderRadius: 'base',
  },
  md: {
    fontSize: 'md',
    lineHeight: '20px',
    px: '20px',
    py: '20px',
    h: '60px',
    borderRadius: 'base',
  },
  lg: {
    fontSize: 'md',
    lineHeight: '20px',
    px: '24px',
    py: '28px',
    h: '80px',
    borderRadius: 'base',
  },
};

const variantOutline: PartsStyleFunction<typeof parts> = (props) => {
  const transitionProps = getDefaultTransitionProps();

  return {
    field: getOutlinedFieldStyles(props),
    addon: {
      border: '2px solid',
      borderColor: 'transparent',
      bg: mode('blackAlpha.100', 'whiteAlpha.200')(props),
      color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
      ...transitionProps,
    },
  };
};

const Input: ComponentStyleConfig = {
  sizes: {
    sm: {
      field: sizes.sm,
      addon: sizes.sm,
    },
    md: {
      field: sizes.md,
      addon: sizes.md,
    },
    lg: {
      field: sizes.lg,
      addon: sizes.lg,
    },
  },
  defaultProps: {
    size: 'md',
  },
  variants: {
    outline: variantOutline,
  },
};

InputComponent.defaultProps = {
  ...InputComponent.defaultProps,
  placeholder: ' ',
};

export default Input;
