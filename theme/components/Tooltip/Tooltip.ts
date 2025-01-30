import { Tooltip as TooltipComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode, cssVar } from '@chakra-ui/theme-tools';

import luxColors from 'theme/foundations/lux-colors';

const $bg = cssVar('tooltip-bg');
const $fg = cssVar('tooltip-fg');
const $arrowBg = cssVar('popper-arrow-bg');

const variantNav = defineStyle((props) => {
  return {
    bg: luxColors.colors.level1,
    color: luxColors.colors.muted,
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

  return {
    bg: luxColors.colors.primary.main,
    color: luxColors.colors.primary.fg,
    fontSize: '20px',
    maxWidth: props.maxWidth || props.maxW || 'unset',
  };
});

const Tooltip = defineStyleConfig({
  variants,
  baseStyle,
});

TooltipComponent.defaultProps = { ...TooltipComponent.defaultProps, hasArrow: false };

export default Tooltip;
