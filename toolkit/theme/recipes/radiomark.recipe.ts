import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    verticalAlign: 'top',
    color: 'white',
    borderWidth: '2px',
    borderColor: 'transparent',
    borderRadius: 'full',
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'colorPalette.focusRing',
      outlineOffset: '2px',
    },
    _disabled: {
      cursor: 'disabled',
      opacity: 'control.disabled',
    },

    '& .dot': {
      height: '100%',
      width: '100%',
      borderRadius: 'full',
      bg: 'currentColor',
      scale: '0.4',
    },
  },

  variants: {
    variant: {
      solid: {
        borderWidth: '2px',
        borderColor: 'radio.control.border',
        _hover: {
          borderColor: 'radio.control.border.hover',
        },
        _checked: {
          bg: 'blue.500',
          color: 'white',
          borderColor: 'blue.500',
          _hover: {
            bg: 'blue.400',
            borderColor: 'blue.400',
          },
        },
        _invalid: {
          bg: 'red.500',
          borderColor: 'red.500',
        },
        _readOnly: {
          borderColor: 'radio.control.border.readOnly',
          _hover: {
            borderColor: 'radio.control.border.readOnly',
          },
          _checked: {
            bg: 'radio.control.border.readOnly',
            _hover: {
              bg: 'radio.control.border.readOnly',
            },
            '& .dot': {
              bg: 'gray.500',
            },
          },
        },
      },
    },

    size: {
      xs: {
        boxSize: '3',
      },

      sm: {
        boxSize: '4',
      },

      md: {
        boxSize: '5',
      },
    },
  },

  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
