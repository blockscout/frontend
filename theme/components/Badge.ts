import type { StyleFunctionProps } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode, transparentize } from '@chakra-ui/theme-tools';

import colors from 'theme/foundations/colors';

const getTransparentColor = (color: string, opacity: number, props: StyleFunctionProps) => {
  return transparentize(color, opacity)(props.theme);
};

const baseStyle = defineStyle({
  fontSize: 'xs',
  borderRadius: 'sm',
  fontWeight: 'bold',
});

const variantSubtle = defineStyle((props) => {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    return {
      bg: mode('blackAlpha.50', getTransparentColor(colors.grayTrue[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.grayTrue[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'gray-blue') {
    return {
      bg: mode('gray.100', getTransparentColor(colors.grayBlue[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.grayBlue[300])(props),
      paddingInline: '8px',
    };
  }

  if (c === 'green') {
    return {
      bg: mode('gray.100', getTransparentColor(colors.success[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.success[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'blue') {
    return {
      bg: mode('gray.100', getTransparentColor(colors.blueLight[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.blueLight[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'yellow') {
    return {
      bg: mode('gray.100', getTransparentColor(colors.yellow[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.yellow[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'orange') {
    return {
      bg: mode('gray.100', getTransparentColor(colors.orangeDark[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.orangeDark[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'red') {
    return {
      bg: mode('blackAlpha.50', getTransparentColor(colors.error[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.error[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'purple') {
    return {
      bg: mode('blackAlpha.50', getTransparentColor(colors.violet[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.violet[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'gray-blue') {
    return {
      bg: mode('blackAlpha.50', getTransparentColor(colors.grayBlue[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.grayBlue[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'teal') {
    return {
      bg: mode('blackAlpha.50', getTransparentColor(colors.teal[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.teal[300])(props),
      paddingInline: '8px',
    };
  }
  if (c === 'cyan') {
    return {
      bg: mode('blackAlpha.50', getTransparentColor(colors.cyan[300], 0.2, props))(props),
      color: mode('blackAlpha.800', colors.cyan[300])(props),
      paddingInline: '8px',
    };
  }
  return {
    bg: mode(`${ c }.50`, `${ c }.800`)(props), //mode(`${ c }.50`, `${ c }.800`)(props),
    color: mode(`${ c }.500`, `${ c }.100`)(props),
    paddingInline: '8px',
  };
});

const variants = {
  subtle: variantSubtle,
};

const Badge = defineStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'subtle',
    colorScheme: 'gray',
  },
});

export default Badge;
