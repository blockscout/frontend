import type { SystemStyleInterpolation } from '@chakra-ui/styled-system';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const variantPrimary = defineStyle(() => ({
  color: 'text',
}));

const variantSecondary = defineStyle(() => ({
  color: 'text_secondary',
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
