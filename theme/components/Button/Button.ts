import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import { runIfFn } from '@chakra-ui/utils';

import config from 'configs/app';
import colors from 'theme/foundations/colors';

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props;

  const bg = `${ c }.500`;
  const color = 'white';
  const hoverBg = `${ c }.600`;
  const activeBg = hoverBg;

  if (c === 'red' || c === 'blue' || c === 'gray') { //for the Verify&Publsih button on the Verify contract page
    return {
      bg: mode('blackAlpha.200', colors.error[500])(props),
      color: mode('blackAlpha.800', 'white')(props),
      _hover: {
        bg: colors.error[600],
        color: color,
        _disabled: {
          bg,
        },
        _active: { bg: colors.error[600] },
      },
    };
  }
  return {
    bg,
    color,
    _hover: {
      bg: hoverBg,
      _disabled: {
        bg,
      },
    },
    _disabled: {
      opacity: 0.2,
    },
    // According to design there is no "active" or "pressed" state
    // It is simply should be the same as the "hover" state
    _active: { bg: activeBg },
    fontWeight: 600,
  };
});

const variantOutline = defineStyle((props) => {
  const { colorScheme: c } = props;

  const isGrayTheme = c === 'gray';

  const bg = 'transparent';

  const color = isGrayTheme ? mode('blackAlpha.800', colors.grayTrue[200])(props) : mode(`${ c }.600`, colors.grayTrue[200])(props);
  const borderColor = isGrayTheme ? mode('gray.200', colors.grayTrue[700])(props) : mode(`${ c }.600`, colors.grayTrue[700])(props);

  const selectedBg = isGrayTheme ? mode('blue.50', colors.grayTrue[700])(props) : mode(`${ c }.50`, colors.grayTrue[700])(props);
  const selectedColor = mode('blue.600', colors.grayTrue[50])(props);

  return {
    color,
    fontWeight: props.fontWeight || 600,
    borderWidth: props.borderWidth || '1px',
    borderStyle: 'solid',
    borderColor,
    bg,
    _hover: {
      color: 'white', //'link_hovered',
      borderColor: 'white', //'link_hovered',
      bg,
      span: {
        color: 'white', //'link_hovered',
      },
      _disabled: {
        color: colors.grayTrue[500],
        borderColor,
      },
    },
    _disabled: {
      color: colors.grayTrue[500],
      opacity: 1,
    },
    // According to design there is no "active" or "pressed" state
    // It is simply should be the same as the "hover" state
    _active: {
      color: 'white', //'link_hovered',
      borderColor: 'white', //'link_hovered',
      bg,
      span: {
        color: 'white', //'link_hovered',
      },
      _disabled: {
        color: 'white', //'link_hovered',
        borderColor: 'white', //'link_hovered',
      },
    },
    // We have a special state for this button variant that serves as a popover trigger.
    // When any items (filters) are selected in the popover, the button should change its background and text color.
    // The last CSS selector is for redefining styles for the TabList component.
    [`
      &[data-selected=true],
      &[data-selected=true][aria-selected=true]
    `]: {
      bg: selectedBg,
      color: selectedColor,
      borderColor: selectedBg,
    },
  };
});

const variantRadioGroup = defineStyle((props) => {
  const outline = runIfFn(variantOutline, props);
  const bgColor = mode('blue.50', 'gray.800')(props);
  const selectedTextColor = mode('blue.700', 'gray.50')(props);

  return {
    ...outline,
    fontWeight: 500,
    cursor: 'pointer',
    bgColor: 'none',
    borderColor: bgColor,
    _hover: {
      borderColor: bgColor,
      color: 'link_hovered',
    },
    _active: {
      bgColor: 'none',
    },
    _notFirst: {
      borderLeftWidth: 0,
    },
    // We have a special state for this button variant that serves as a popover trigger.
    // When any items (filters) are selected in the popover, the button should change its background and text color.
    // The last CSS selector is for redefining styles for the TabList component.
    [`
      &[data-selected=true],
      &[data-selected=true][aria-selected=true]
    `]: {
      cursor: 'initial',
      bgColor,
      borderColor: bgColor,
      color: selectedTextColor,
      _hover: {
        color: selectedTextColor,
      },
    },
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
    color: mode(`${ c }.700`, colors.grayTrue[200])(props),
    _active: {
      color: mode(`${ c }.700`, colors.grayTrue[50])(props),
      bg: mode(`${ c }.50`, colors.grayTrue[800])(props),
    },
    _hover: {
      color: `${ c }.400`,
      _active: {
        bg: props.isActive ? activeBg : 'transparent',
        color: mode(`${ c }.700`, colors.grayTrue[50])(props),
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

// for buttons in the hero banner
const variantHero = defineStyle((props) => {
  return {
    bg: mode(
      config.UI.homepage.heroBanner?.button?._default?.background?.[0] || 'blue.600',
      config.UI.homepage.heroBanner?.button?._default?.background?.[1] || colors.white, // 'blue.600',
    )(props),
    color: mode(
      config.UI.homepage.heroBanner?.button?._default?.text_color?.[0] || 'white',
      config.UI.homepage.heroBanner?.button?._default?.text_color?.[1] || colors.grayTrue[900], //'white',
    )(props),
    _hover: {
      bg: mode(
        config.UI.homepage.heroBanner?.button?._hover?.background?.[0] || 'blue.400',
        config.UI.homepage.heroBanner?.button?._hover?.background?.[1] || colors.grayTrue[50], // 'blue.400',
      )(props),
      color: mode(
        config.UI.homepage.heroBanner?.button?._hover?.text_color?.[0] || 'white',
        config.UI.homepage.heroBanner?.button?._hover?.text_color?.[1] || colors.grayTrue[900], //'white',
      )(props),
    },
    '&[data-selected=true]': {
      bg: mode(
        config.UI.homepage.heroBanner?.button?._selected?.background?.[0] || 'blue.50',
        config.UI.homepage.heroBanner?.button?._selected?.background?.[1] || colors.white, // 'blue.50',
      )(props),
      color: mode(
        config.UI.homepage.heroBanner?.button?._selected?.text_color?.[0] || 'blackAlpha.800',
        config.UI.homepage.heroBanner?.button?._selected?.text_color?.[1] || colors.grayTrue[900], // 'blackAlpha.800',
      )(props),
    },
  };
});

// for buttons in the page header
const variantHeader = defineStyle((props) => {

  return {
    bgColor: 'transparent',
    color: mode('blackAlpha.800', colors.grayTrue[200])(props),
    borderColor: mode('gray.300', colors.grayTrue[200])(props),
    borderWidth: props.borderWidth || '2px',
    borderStyle: 'solid',
    _hover: {
      color: 'white',
      borderColor: 'white',
    },
    '&[data-selected=true]': {
      bgColor: mode('blackAlpha.50', colors.grayTrue[800])(props),
      color: mode('blackAlpha.800', colors.grayTrue[200])(props),
      borderColor: 'transparent',
      borderWidth: props.borderWidth || '0px',
    },
    '&[data-selected=true][data-warning=true]': {
      bgColor: mode('orange.100', colors.orangeDark[900])(props),
      color: mode('blackAlpha.800', colors.orangeDark[200])(props),
      borderColor: 'transparent',
      borderWidth: props.borderWidth || '0px',
    },
  };
});

const variants = {
  solid: variantSolid,
  outline: variantOutline,
  simple: variantSimple,
  ghost: variantGhost,
  subtle: variantSubtle,
  hero: variantHero,
  header: variantHeader,
  radio_group: variantRadioGroup,
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
    variant: 'solid',
    size: 'md',
    colorScheme: 'blue',
  },
});

export default Button;
