import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import luxColors from 'theme/foundations/lux-colors';

const baseStyle = defineStyle((props) => {
  const { emptyColor, color } = props;

  return {
    borderColor: luxColors.colors.muted2, // color || 'blue.500',
    borderBottomColor: emptyColor || luxColors.colors.muted2, // mode('blackAlpha.200', 'whiteAlpha.200')(props),
    borderLeftColor: emptyColor || luxColors.colors.muted2 // mode('blackAlpha.200', 'whiteAlpha.200')(props),
  };
});

const Spinner = defineStyleConfig({
  baseStyle,
  defaultProps: {
    size: 'md',
  },
});

export default Spinner;
