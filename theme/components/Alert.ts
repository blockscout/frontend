import { alertAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    borderRadius: 'md',
    px: 6,
    py: 4,
  },
});

const Alert = defineMultiStyleConfig({
  baseStyle,
});

export default Alert;
