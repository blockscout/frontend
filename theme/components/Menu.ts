import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar('menu-bg');
const $shadow = cssVar('menu-shadow');

const baseStyleList = defineStyle({
  [$bg.variable]: '#fff',
  [$shadow.variable]: 'shadows.2xl',
  _dark: {
    [$bg.variable]: 'colors.gray.900',
    [$shadow.variable]: 'shadows.dark-lg',
  },
  borderWidth: '0',
  bg: $bg.reference,
  boxShadow: $shadow.reference,
});

const baseStyleItem = defineStyle({
  _focus: {
    [$bg.variable]: 'colors.blue.50',
    _dark: {
      [$bg.variable]: 'colors.gray.800',
    },
  },
  _hover: {
    [$bg.variable]: 'colors.blue.50',
    _dark: {
      [$bg.variable]: 'colors.gray.800',
    },
  },
  bg: $bg.reference,
});

const baseStyle = definePartsStyle({
  list: baseStyleList,
  item: baseStyleItem,
});

const Menu = defineMultiStyleConfig({
  baseStyle,
});

export default Menu;
