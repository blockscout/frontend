import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';

import luxColors from 'theme/foundations/lux-colors';

const baseStyle = defineStyle(getDefaultTransitionProps());

const variantPrimary = defineStyle((props) => {
  return {
    color: luxColors.colors.muted1,

    _hover: {
      color: luxColors.colors.accent,
      //textDecorationStyle: props.textDecorationStyle || 'solid',
    },
  };
});

const variantSecondary = defineStyle((props) => {
  return {
    //color: mode('gray.600', 'gray.500')(props),
    color: luxColors.colors.secondary[2],
    _hover: {
      //color: mode('gray.600', 'gray.400')(props),
      color: luxColors.colors.secondary.main,
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
