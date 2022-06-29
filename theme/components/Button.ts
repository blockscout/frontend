import type { ComponentStyleConfig } from '@chakra-ui/theme';

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'normal',
  },
  variants: {
    primary: {
      bg: 'blue.600',
      color: 'white',
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
  },
}

export default Button;
