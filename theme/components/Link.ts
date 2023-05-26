import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';

const baseStyle = defineStyle(getDefaultTransitionProps());

const variantPrimary = defineStyle((props) => {
  return {
    color: 'link',
    _hover: {
      color: 'link_hovered',
      textDecorationStyle: props.textDecorationStyle || 'solid',
    },
  };
});

const variantSecondary = defineStyle((props) => {
  return {
    color: mode('gray.600', 'gray.500')(props),
    _hover: {
      color: mode('gray.600', 'gray.400')(props),
    },
  };
});

const variants: Record<string, SystemStyleInterpolation> = {
  primary: variantPrimary,
  secondary: variantSecondary,
};

const defaultProps = {
  variant: 'primary',
};

const Link = defineStyleConfig({
  variants,
  defaultProps,
  baseStyle,
});

export default Link;
