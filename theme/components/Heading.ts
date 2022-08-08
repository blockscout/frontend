import type { ComponentStyleConfig } from '@chakra-ui/theme';

const baseStyle = {
  fontWeight: '500',
  letterSpacing: '-0.5px',
};

// WIP
// designer promised to sync theme and page mock-ups
// so that's not the final point yet
const sizes = {
  lg: {
    fontSize: '32px',
    lineHeight: '40px',
  },
};

const Heading: ComponentStyleConfig = {
  sizes,
  baseStyle,
};

export default Heading;
