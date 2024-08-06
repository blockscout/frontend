import { Tooltip as TooltipComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode, cssVar } from '@chakra-ui/theme-tools';

import colors from 'theme/foundations/colors';

const $bg = cssVar('tooltip-bg');
const $fg = cssVar('tooltip-fg');
const $arrowBg = cssVar('popper-arrow-bg');

const variantNav = defineStyle((props) => {
  return {
    bg: mode('blue.50', colors.grayTrue[700])(props),
    color: colors.blueLight[400], //'blue.400'
    padding: '15px 12px',
    minWidth: '120px',
    borderRadius: 'base',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
    boxShadow: 'none',
    fontWeight: '500',
  };
});

const variants = {
  nav: variantNav,
};

const baseStyle = defineStyle((props) => {
  const bg = mode('gray.700', colors.grayTrue[200])(props);
  const fg = mode('white', colors.grayTrue[900])(props); //'black'
  //const { colorScheme: c } = props;

  // if (c) {
  //   return {
  //     bg: mode('gray.100', transparentize(colors.blueLight[300], 0.2))(props),
  //     color: mode('blackAlpha.800', colors.blueLight[300])(props),
  //   };
  // }
  return {
    bg: mode('blue.50', colors.grayTrue[600])(props), //$bg.reference,
    color: mode('blue.50', colors.grayTrue[50])(props), //$fg.reference,
    [$bg.variable]: `colors.${ bg }`,
    [$fg.variable]: `colors.${ fg }`,
    [$arrowBg.variable]: mode('blue.50', colors.grayTrue[600])(props), //$bg.reference,
    maxWidth: props.maxWidth || props.maxW || 'unset',
  };
});

const Tooltip = defineStyleConfig({
  variants,
  baseStyle,
});

TooltipComponent.defaultProps = { ...TooltipComponent.defaultProps, hasArrow: true };

export default Tooltip;
