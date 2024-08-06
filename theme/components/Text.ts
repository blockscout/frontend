import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import colors from 'theme/foundations/colors';

const variantPrimary = defineStyle((props) => ({
  color: mode('blackAlpha.800', colors.grayTrue[50])(props),
}));

const variantSecondary = defineStyle((props) => ({
  color: mode('gray.500', colors.grayTrue[200])(props),
}));

const variantInherit = {
  color: 'inherit',
};

const variants: Record<string, SystemStyleInterpolation> = {
  primary: variantPrimary,
  secondary: variantSecondary,
  inherit: variantInherit,
};

const defaultProps = {
  variant: 'primary',
};

const Text = defineStyleConfig({
  defaultProps,
  variants,
});

export default Text;
