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
      color: mode('gray.600', 'whiteAlpha.700')(props),
      ...transitionProps,
    },
    thead: {
      backgroundColor: mode('blackAlpha.100', 'whiteAlpha.200')(props),
      ...transitionProps,
    },
    td: {
      borderColor: mode('blackAlpha.200', 'whiteAlpha.200')(props),
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
      px: 4,
      py: 6,
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
      py: 6,
      fontSize: 'sm',
      fontWeight: 500,
    },
  }),
};

const variants = {
  simple: variantSimple,
};

const baseStyle = definePartsStyle({
  thead: {
    backgroundColor: 'gray.50',
  },
  th: {
    textTransform: 'none',
    fontFamily: 'body',
    fontWeight: '500',
    overflow: 'hidden',
    color: 'gray.500',
    letterSpacing: 'none',
  },
  td: {
    fontSize: 'md',
    verticalAlign: 'top',
  },
  table: {
    tableLayout: 'fixed',
    borderTopLeftRadius: 'base',
    borderTopRightRadius: 'base',
    overflow: 'hidden',
    fontVariant: 'normal',
  },
});

const Table = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
});

export default Table;
