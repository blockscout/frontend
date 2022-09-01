import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleLabel = defineStyle({
  _disabled: { opacity: 0.2 },
});

const baseStyle = definePartsStyle({
  label: baseStyleLabel,
});

const Checkbox = defineMultiStyleConfig({
  baseStyle,
});

export default Checkbox;
