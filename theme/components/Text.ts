import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const variantPrimary = defineStyle((props) => ({
  color: mode('rgba(17, 17, 17, 1)', 'rgba(255, 255, 255, 1)')(props),
}));

const variantSecondary = defineStyle((props) => ({
  color: mode('rgba(47, 47, 47, 1)', 'rgba(208, 208, 209, 1)')(props),
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
