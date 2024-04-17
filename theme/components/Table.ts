import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { useColorModeValue } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variantSimple = definePartsStyle(() => {
  const transitionProps = getDefaultTransitionProps();
  const bgColor = useColorModeValue('gray.1000', 'gray.1500');
  const color = useColorModeValue('gray.1200', 'gray.1100');
  return {
    th: {
      border: 0,
      backgroundColor: bgColor,
      color: color,
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
    letterSpacing: 'none',
    // _first: {
    //   borderTopLeftRadius: '8px',
    // },
    // _last: {
    //   borderTopRightRadius: "8px",
    // },
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
