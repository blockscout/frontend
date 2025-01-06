import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const baseStyle = defineStyle({
  fontSize: 'xs',
  borderRadius: 'sm',
  fontWeight: 'bold',
});

const variantSubtle = defineStyle((props) => {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    return {
      bg: mode('blackAlpha.50', 'whiteAlpha.100')(props),
      color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
    };
  }

  if (c === 'gray-blue') {
    return {
      bg: mode('gray.100', 'gray.800')(props),
      color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
      _hover: {
        opacity: 0.76,
      },
    };
  }

  if (c === 'black-blue') {
    return {
      bg: mode('blue.50', 'blue.800')(props),
      color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
    };
  }

  if (c === 'black-purple') {
    return {
      bg: mode('purple.100', 'purple.800')(props),
      color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
    };
  }

  return {
    bg: mode(`${ c }.50`, `${ c }.800`)(props),
    color: mode(`${ c }.500`, `${ c }.100`)(props),
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
