import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantPrimary: SystemStyleFunction = (props) => ({
  color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
});

const variantSecondary: SystemStyleFunction = (props) => ({
  color: mode('gray.500', 'gray.400')(props),
});

const variantAlternate: SystemStyleFunction = (props) => ({
  color: mode('blue.600', 'blue.300')(props),
});

const variantInherit = {
  color: 'inherit',
};

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
  alternate: variantAlternate,
  inherit: variantInherit,
};

const defaultProps = {
  variant: 'primary',
};

const Text: ComponentStyleConfig = {
  defaultProps,
  variants,
};

export default Text;
