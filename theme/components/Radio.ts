import { radioAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleLabel = defineStyle({
  _disabled: { opacity: 0.2 },
  width: 'fit-content',
});

const baseStyleContainer = defineStyle({
  width: 'fit-content',
});

const baseStyle = definePartsStyle({
  label: baseStyleLabel,
  container: baseStyleContainer,
});

const Radio = defineMultiStyleConfig({
  baseStyle,
});

export default Radio;
