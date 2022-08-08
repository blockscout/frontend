import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';

const variantSecondary: SystemStyleFunction = (props) => ({
  color: mode('gray.500', 'gray.400')(props),
});

const Text: ComponentStyleConfig = {
  variants: {
    secondary: variantSecondary,
  },
};

export default Text;
