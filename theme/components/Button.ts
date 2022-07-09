import type { ComponentStyleConfig } from '@chakra-ui/theme';

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'normal',
  },
  variants: {
    primary: {
      bg: 'blue.600',
      color: 'white',
      fontWeight: 600,
      _hover: {
        bg: 'blue.400',
        _disabled: {
          bg: 'blue.600',
        },
      },
      _disabled: {
        opacity: 0.2,
      },
    },
    secondary: {
      bg: 'white',
      color: 'blue.600',
      fontWeight: 600,
      borderColor: 'blue.600',
      border: '2px solid',
      _hover: {
        color: 'blue.400',
        borderColor: 'blue.400',
      },
      _disabled: {
        opacity: 0.2,
      },
    },
    iconBlue: {
      color: 'blue.600',
      _hover: {
        color: 'blue.400',
      },
    },
  },
  sizes: {
    lg: {
      h: 12,
      minW: 'unset',
      fontSize: 'lg',
      px: 6,
    },
    md: {
      h: 10,
      minW: 'unset',
      fontSize: 'md',
      px: 4,
    },
    sm: {
      h: 8,
      minW: 'unset',
      fontSize: 'sm',
      px: 3,
    },
    xs: {
      h: 6,
      minW: 'unset',
      fontSize: 'xs',
      px: 2,
    },
  },
}

export default Button;
