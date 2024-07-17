import { Tooltip as TooltipComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode, cssVar } from '@chakra-ui/theme-tools';

const $bg = cssVar('tooltip-bg');
const $fg = cssVar('tooltip-fg');
const $arrowBg = cssVar('popper-arrow-bg');

const variantNav = defineStyle((props) => {
  return {
    bg: mode('blue.50', 'gray.800')(props),
    color: 'blue.400',
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
  const bg = mode('gray.700', 'gray.200')(props);
  const fg = mode('white', 'black')(props);

  return {
    bg: $bg.reference,
    color: $fg.reference,
    [$bg.variable]: `colors.${ bg }`,
    [$fg.variable]: `colors.${ fg }`,
    [$arrowBg.variable]: $bg.reference,
    maxWidth: props.maxWidth || props.maxW || 'calc(100vw - 8px)',
    marginX: '4px',
  };
});

const Tooltip = defineStyleConfig({
  variants,
  baseStyle,
});

TooltipComponent.defaultProps = { ...TooltipComponent.defaultProps, hasArrow: true };

export default Tooltip;
