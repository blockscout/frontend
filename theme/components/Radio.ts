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

const sizes = {
  md: definePartsStyle({
    control: { w: '4', h: '4' },
    label: { fontSize: 'md' },
  }),
  lg: definePartsStyle({
    control: { w: '5', h: '5' },
    label: { fontSize: 'md' },
  }),
  sm: definePartsStyle({
    control: { width: '3', height: '3' },
    label: { fontSize: 'sm' },
  }),
};

const Radio = defineMultiStyleConfig({
  baseStyle,
  sizes,
});

export default Radio;
