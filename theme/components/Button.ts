import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';

const variantPrimary = {
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
};

const variantSecondary = {
  color: 'blue.600',
  fontWeight: 600,
  borderColor: 'blue.600',
  border: '2px solid',
  _hover: {
    color: 'blue.400',
    borderColor: 'blue.400',
  },
  _disabled: {
    opacity: 0.2,
  },
};

const variantIcon: SystemStyleFunction = (props) => {
  return {
    color: mode('blue.600', 'blue.300')(props),
    _hover: {
      color: mode('blue.400', 'blue.200')(props),
    },
  };
};

const variantIconBorder = {
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
};

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
  icon: variantIcon,
  iconBorder: variantIconBorder,
};

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'normal',
  },
  variants,
  sizes: {
    lg: {
      h: 12,
      minW: 'unset',
      fontSize: 'lg',
      px: 6,
    },
    md: {
      h: 10,
      minW: 'unset',
      fontSize: 'md',
      px: 4,
    },
    sm: {
      h: 8,
      minW: 'unset',
      fontSize: 'sm',
      px: 3,
    },
    xs: {
      h: 6,
      minW: 'unset',
      fontSize: 'xs',
      px: 2,
    },
  },
};

export default Button;
