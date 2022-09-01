import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const variantPrimary = defineStyle({
  bg: 'blue.600',
  color: 'white',
  fontWeight: 600,
  _hover: {
    bg: 'blue.400',
    _disabled: {
      bg: 'blue.600',
    },
  },
  _disabled: {
    opacity: 0.2,
  },
});

const variantSecondary = defineStyle((props) => {
  return {
    color: mode('blue.600', 'blue.300')(props),
    fontWeight: 600,
    borderColor: mode('blue.600', 'blue.300')(props),
    border: '2px solid',
    _hover: {
      color: 'blue.400',
      borderColor: 'blue.400',
    },
    _disabled: {
      opacity: 0.2,
    },
  };
});

const variantIcon = defineStyle((props) => {
  return {
    color: mode('blue.600', 'blue.300')(props),
    _hover: {
      color: mode('blue.400', 'blue.200')(props),
    },
  };
});

const variantIconBorder = defineStyle({
  color: 'blue.600',
  borderColor: 'blue.600',
  border: '2px solid',
  _hover: {
    color: 'blue.400',
    borderColor: 'blue.400',
  },
  _disabled: {
    opacity: 0.2,
  },
});

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
  icon: variantIcon,
  iconBorder: variantIconBorder,
};

const baseStyle = defineStyle({
  fontWeight: 'normal',
  borderRadius: 'base',
});

const sizes = {
  lg: defineStyle({
    h: 12,
    minW: 'unset',
    fontSize: 'lg',
    px: 6,
  }),
  md: defineStyle({
    h: 10,
    minW: 'unset',
    fontSize: 'md',
    px: 4,
  }),
  sm: defineStyle({
    h: 8,
    minW: 'unset',
    fontSize: 'sm',
    px: 3,
  }),
  xs: defineStyle({
    h: 6,
    minW: 'unset',
    fontSize: 'xs',
    px: 2,
  }),
};

const Button = defineStyleConfig({
  baseStyle,
  variants,
  sizes,
});

export default Button;
