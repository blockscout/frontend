import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode, transparentize } from '@chakra-ui/theme-tools';

const baseStyle = defineStyle({
  fontSize: 'xs',
  borderRadius: 'sm',
  fontWeight: 'bold',
});

const variantSubtle = defineStyle((props) => {
  const { colorScheme: c, theme } = props;
  const darkBg = transparentize(`${ c }.200`, 0.16)(theme);

  if (c === 'gray') {
    return {
      bg: mode('blackAlpha.100', 'whiteAlpha.400')(props),
      color: mode('gray.600', 'gray.50')(props),
    };
  }

  return {
    bg: mode(`${ c }.50`, darkBg)(props),
    color: mode(`${ c }.500`, `${ c }.200`)(props),
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
