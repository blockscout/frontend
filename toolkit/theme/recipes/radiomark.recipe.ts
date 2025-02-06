import { defineRecipe } from '@chakra-ui/react';

// TODO @tom2drum dark mode + border color
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
    cursor: 'radio',
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'colorPalette.focusRing',
      outlineOffset: '2px',
    },
    _disabled: {
      opacity: '0.5',
      cursor: 'disabled',
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
        borderColor: 'border',
        _checked: {
          bg: 'radio.icon.bg.checked',
          color: 'white',
          borderColor: 'radio.icon.bg.checked',
          _hover: {
            bg: 'radio.icon.bg.hover',
            borderColor: 'radio.icon.bg.hover',
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
