import { Tooltip as TooltipComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

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

const baseStyle = defineStyle({
  maxWidth: 'unset',
});

const Tooltip = defineStyleConfig({
  variants,
  baseStyle,
});

TooltipComponent.defaultProps = { ...TooltipComponent.defaultProps, hasArrow: true };

export default Tooltip;
