import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleInterpolation } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleInterpolation = (props) => {
  return {
    fontWeight: '500',
    color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
  };
};

const sizes = {
  lg: {
    fontSize: '32px',
    lineHeight: '40px',
    letterSpacing: '-0.5px',
  },
  md: {
    fontSize: '24px',
    lineHeight: '32px',
  },
  sm: {
    fontSize: '18px',
    lineHeight: '24px',
  },
};

const Heading: ComponentStyleConfig = {
  sizes,
  baseStyle,
};

export default Heading;
