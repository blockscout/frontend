import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import { runIfFn } from '@chakra-ui/utils';

import luxColors from 'theme/foundations/lux-colors';

const variantPrimary = defineStyle((props) => ({
  bg: luxColors.colors.primary.main,
  color: luxColors.colors.primary.fg,
  _hover: {
    bg: luxColors.colors.primary.hover,
    _disabled: {
      opacity: 0.2,
    },
  },
  _disabled: {
    opacity: 0.2,
  },
  fontWeight: 600,
}))

const variantSecondary = defineStyle((props) => ({
  bg: luxColors.colors.secondary.main,
  color: luxColors.colors.secondary.fg,
  _hover: {
    bg: luxColors.colors.secondary.hover,
    _disabled: {
      opacity: 0.2,
    },
  },
  _disabled: {
    opacity: 0.2,
  },
  fontWeight: 600,
}))

const variantOutline = defineStyle((props) => {

  const { colorScheme: c } = props;

  const isGrayTheme = c === 'gray' || c === 'gray-dark';
  const color = isGrayTheme ? mode('blackAlpha.800', 'whiteAlpha.800')(props) : mode(`${ c }.600`, `${ c }.300`)(props);
  const borderColor = isGrayTheme ? mode('gray.200', 'gray.600')(props) : mode(`${ c }.600`, `${ c }.300`)(props);
  const activeBg = isGrayTheme ? mode('blue.50', 'gray.600')(props) : mode(`${ c }.50`, 'gray.600')(props);
  
  const activeColor = (() => {
    if (c === 'gray') {
      return mode('blue.600', 'gray.50')(props);
    }
    if (c === 'gray-dark') {
      return mode('blue.600', 'gray.50')(props);
    }
    if (c === 'blue') {
      return mode('blue.600', 'gray.50')(props);
    }
    return 'blue.600';
  })();

  return {
    color: luxColors.colors.foreground,
    fontWeight: props.fontWeight || 600,
    borderWidth: props.borderWidth || '2px',
    borderStyle: 'solid',
    borderColor: luxColors.colors.muted4,
    bg: 'transparent',
    _hover: {
      color: luxColors.colors.accent,
      borderColor: luxColors.colors.accent,
      bg: luxColors.colors.level1,
    },
    _disabled: {
      opacity: 0.2,
    },
    /*
    _active: {
      bg: activeBg,
      borderColor: activeBg,
      color: activeColor,
      _disabled: {
        color,
        borderColor,
      },
      p: {
        color: activeColor,
      },
    },
    */
  };
});

const variantSimple = defineStyle((props) => {
  const outline = runIfFn(variantOutline, props);

  return {
    color: outline.color,
    _hover: {
      color: outline._hover.color,
    },
  };
});

const variantGhost = defineStyle((props) => {
  const { colorScheme: c } = props;
  const activeBg = mode(`${ c }.50`, 'gray.800')(props);

  return {
    bg: 'transparent',
    color: mode(`${ c }.700`, 'gray.400')(props),
    _active: {
      color: mode(`${ c }.700`, 'gray.50')(props),
      bg: mode(`${ c }.50`, 'gray.800')(props),
    },
    _hover: {
      color: `${ c }.400`,
      _active: {
        bg: props.isActive ? activeBg : 'transparent',
        color: mode(`${ c }.700`, 'gray.50')(props),
      },
    },
  };
});

const variantSubtle = defineStyle((props) => {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    return {
      bg: mode('blackAlpha.200', 'whiteAlpha.200')(props),
      color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
      _hover: {
        color: 'link_hovered',
        _disabled: {
          color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
          bg: mode('blackAlpha.200', 'whiteAlpha.200')(props),
        },
      },
    };
  }

  return {
    bg: `${ c }.100`,
    color: `${ c }.600`,
    _hover: {
      color: 'link_hovered',
    },
  };
});

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
  outline: variantOutline,
  simple: variantSimple,
  ghost: variantGhost,
  subtle: variantSubtle,
};

const baseStyle = defineStyle({
  fontWeight: 600,
  borderRadius: 'base',
  overflow: 'hidden',
  _focusVisible: {
    boxShadow: { base: 'none', lg: 'outline' },
  },
});

const sizes = {
  lg: defineStyle({
    h: 12,
    minW: 'unset',
    fontSize: 'lg',
    px: 6,
  }),
  md: defineStyle({
    h: 10,
    minW: 'unset',
    fontSize: 'md',
    px: 4,
  }),
  sm: defineStyle({
    h: 8,
    minW: 'unset',
    fontSize: 'sm',
    px: 3,
  }),
  xs: defineStyle({
    h: 6,
    minW: 'unset',
    fontSize: 'xs',
    px: 2,
  }),
};

const Button = defineStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
});

export default Button;
