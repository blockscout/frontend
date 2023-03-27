import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variantSimple = definePartsStyle((props) => {
  const transitionProps = getDefaultTransitionProps();

  return {
    th: {
      border: 0,
      color: mode('blackAlpha.700', 'whiteAlpha.700')(props),
      backgroundColor: mode('blackAlpha.100', 'whiteAlpha.200')(props),
      ...transitionProps,
    },
    thead: {
      ...transitionProps,
    },
    td: {
      borderColor: 'divider',
      ...transitionProps,
    },
  };
});

const sizes = {
  md: definePartsStyle({
    th: {
      px: 4,
      fontSize: 'sm',
    },
    td: {
      p: 4,
    },
  }),
  sm: definePartsStyle({
    th: {
      px: '10px',
      py: '10px',
      fontSize: 'sm',
    },
    td: {
      px: '10px',
      py: 4,
      fontSize: 'sm',
      fontWeight: 500,
    },
  }),
  xs: definePartsStyle({
    th: {
      px: '6px',
      py: '10px',
      fontSize: 'sm',
    },
    td: {
      px: '6px',
      py: 4,
      fontSize: 'sm',
      fontWeight: 500,
    },
  }),
};

const variants = {
  simple: variantSimple,
};

const baseStyle = definePartsStyle({
  th: {
    textTransform: 'none',
    fontFamily: 'body',
    fontWeight: '500',
    overflow: 'hidden',
    color: 'gray.500',
    letterSpacing: 'none',
    _first: {
      borderTopLeftRadius: '8px',
    },
    _last: {
      borderTopRightRadius: '8px',
    },
  },
  td: {
    fontSize: 'md',
    verticalAlign: 'top',
  },
  table: {
    tableLayout: 'fixed',
    borderTopLeftRadius: 'base',
    borderTopRightRadius: 'base',
    overflow: 'unset',
    fontVariant: 'normal',
    fontVariantLigatures: 'no-contextual',
  },
});

const Table = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
});

export default Table;
