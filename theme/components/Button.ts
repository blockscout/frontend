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
}

const variantSecondary = {
  bg: 'white',
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
}

const variantIconBlue: SystemStyleFunction = (props) => {
  return {
    color: mode('blue.600', 'blue.300')(props),
    _hover: {
      color: mode('blue.400', 'blue.200')(props),
    },
  }
}

const variantIconBorderBlue: SystemStyleFunction = (props) => {
  return {
    color: mode('blue.600', 'blue.300')(props),
    borderColor: mode('blue.600', 'blue.300')(props),
    border: '2px solid',
    _hover: {
      color: mode('blue.400', 'blue.200')(props),
      borderColor: mode('blue.400', 'blue.200')(props),
    },
    _disabled: {
      opacity: 0.2,
    },
  }
}

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
  iconBlue: variantIconBlue,
  iconBorderBlue: variantIconBorderBlue,
}

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
}

export default Button;
