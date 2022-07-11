import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';

const variantPrimary: SystemStyleFunction = (props) => {
  return {
    color: mode('blue.600', 'blue.300')(props),
    _hover: {
      color: mode('blue.400', 'blue.200')(props),
    },
  }
}

const variantSecondary: SystemStyleFunction = (props) => {
  return {
    color: mode('gray.500', 'gray.500')(props),
    _hover: {
      color: mode('gray.600', 'gray.400')(props),
    },
  }
}

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
}

const defaultProps = {
  variant: 'primary',
}

const Link: ComponentStyleConfig = {
  variants,
  defaultProps,
}

export default Link;
