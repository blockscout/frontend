import type { inputAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { PartsStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';
import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';
import getOutlinedFieldStyles from '../utils/getOutlinedFieldStyles';

import { Input as InputComponent } from '@chakra-ui/react';

const sizes: Record<string, SystemStyleObject> = {
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
}

const variantOutline: PartsStyleFunction<typeof parts> = (props) => {
  const transitionProps = getDefaultTransitionProps();

  return {
    field: getOutlinedFieldStyles(props),
    addon: {
      border: '2px solid',
      borderColor: mode('gray.100', 'whiteAlpha.200')(props),
      bg: mode('gray.100', 'whiteAlpha.200')(props),
      ...transitionProps,
    },
  }
}

const Input: ComponentStyleConfig = {
  sizes: {
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
}

InputComponent.defaultProps = {
  ...InputComponent.defaultProps,
  placeholder: ' ',
}

export default Input;
