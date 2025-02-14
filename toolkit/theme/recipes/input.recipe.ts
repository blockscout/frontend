import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    width: '100%',
    minWidth: '0',
    outline: '0',
    position: 'relative',
    appearance: 'textfield',
    textAlign: 'start',
    borderRadius: 'base',
    height: 'var(--input-height)',
    minW: 'var(--input-height)',
    color: 'input.fg',
    '--focus-color': 'colors.border.error',
    '--error-color': 'colors.border.error',
    _invalid: {
      focusRingColor: 'var(--error-color)',
      borderColor: 'var(--error-color)',
    },
    _autofill: {
    //   FIXME: this is not working
    //   WebkitTextFillColor: '{colors.input.fg}',
    },
  },

  variants: {
    size: {
      sm: {
        textStyle: 'md',
        px: '2',
        '--input-height': 'sizes.8',
      },
      md: {
        textStyle: 'md',
        px: '2',
        '--input-height': 'sizes.10',
      },
      lg: {
        textStyle: 'md',
        px: '3',
        '--input-height': 'sizes.12',
      },
      xl: {
        textStyle: 'md',
        px: '4',
        '--input-height': '60px',
      },
    },

    variant: {
      outline: {
        bg: 'input.bg',
        borderWidth: '2px',
        borderColor: 'input.border',
        focusVisibleRing: 'none',
        _hover: {
          borderColor: 'input.border.hover',
        },
        _focus: {
          borderColor: 'input.border.focus',
          _hover: {
            borderColor: 'input.border.focus',
          },
        },
        _readOnly: {
          userSelect: 'all',
          pointerEvents: 'none',
          bg: 'input.bg.readOnly',
          borderColor: 'input.border.readOnly',
          _focus: {
            borderColor: 'input.border.readOnly',
          },
          _hover: {
            borderColor: 'input.border.readOnly',
          },
        },
        _disabled: {
          bg: 'input.bg.disabled',
          borderColor: 'input.border.disabled',
        },
        _invalid: {
          borderColor: 'input.border.error',
          _hover: {
            borderColor: 'input.border.error',
          },
        },
      },
    },

    floating: {
      'true': {},
    },
  },

  compoundVariants: [
    {
      size: 'xl',
      floating: true,
      css: {
        padding: '26px 10px 10px 16px',
      },
    },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'outline',
    floating: false,
  },
});
