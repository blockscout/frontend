import { tagAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from '../../utils/getDefaultTransitionProps';

const transitionProps = getDefaultTransitionProps();

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variants = {
  subtle: definePartsStyle((props) => {
    const { colorScheme: c } = props;

    const bgColor = {
      red: 'rgba(139, 1, 66, 1)',
      gray: 'rgba(255, 255, 255, 0.10)',
      green: 'rgba(6, 68, 1, 1)',
    }[c] || mode(`${ c }.100`, `${ c }.900`)(props);

    const textColor = {
      red: 'rgba(255, 143, 218, 1)',
      gray: 'white',
      green: 'rgba(50, 254, 107, 1)',
    }[c] || mode(`${ c }.800`, `${ c }.300`)(props);

    return {
      container: {
        bg: bgColor,
        color: textColor,
        fontSize: '12px',
        fontWeight: '400',
        borderRadius: 'md',
        _hover: {
          bg: mode(`${ c }.200`, `${ c }.800`)(props),
        },
      },
    };
  }),
  select: definePartsStyle((props) => ({
    container: {
      bg: mode('gray.100', 'gray.800')(props),
      color: mode('gray.500', 'whiteAlpha.800')(props),
      _hover: {
        color: 'blue.400',
        opacity: 0.76,
      },
      [`
        &[data-selected=true],
        &[data-selected=true][aria-selected=true]
      `]: {
        bg: mode('blue.500', 'blue.900')(props),
        color: 'whiteAlpha.800',
      },
    },
  })),
};

const sizes = {
  sm: definePartsStyle({
    container: {
      minH: 6,
      minW: 6,
      fontSize: 'sm',
      px: 1,
      py: '2px',
      lineHeight: 5,
    },
  }),
  md: definePartsStyle({
    container: {
      minH: 8,
      minW: 8,
      fontSize: 'sm',
      px: '6px',
      py: '6px',
      lineHeight: 5,
    },
  }),
};

const baseStyleContainer = defineStyle({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  borderRadius: 'sm',
  ...transitionProps,
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
});

const Tag = defineMultiStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    size: 'sm',
    variant: 'subtle',
    colorScheme: 'gray',
  },
});

export default Tag;
