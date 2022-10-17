import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const baseStyle = defineStyle((props) => {
  const { emptyColor, color } = props;

  return {
    borderColor: color || 'blue.500',
    borderBottomColor: emptyColor || mode('blackAlpha.200', 'whiteAlpha.200')(props),
    borderLeftColor: emptyColor || mode('blackAlpha.200', 'whiteAlpha.200')(props),
  };
});

const Spinner = defineStyleConfig({
  baseStyle,
  defaultProps: {
    size: 'md',
  },
});

export default Spinner;
