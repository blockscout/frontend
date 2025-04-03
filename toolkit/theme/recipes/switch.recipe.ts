import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'label', 'indicator', 'control', 'thumb' ],
  className: 'chakra-switch',
  base: {
    root: {
      display: 'inline-flex',
      gap: '2.5',
      alignItems: 'center',
      position: 'relative',
      verticalAlign: 'middle',
      '--switch-diff': 'calc(var(--switch-width) - var(--switch-height))',
      '--switch-x': {
        base: 'var(--switch-diff)',
        _rtl: 'calc(var(--switch-diff) * -1)',
      },
    },

    label: {
      lineHeight: '1',
      userSelect: 'none',
      fontSize: 'sm',
      fontWeight: '400',
      _disabled: {
        opacity: '0.5',
      },
    },

    indicator: {
      position: 'absolute',
      height: 'var(--switch-height)',
      width: 'var(--switch-height)',
      fontSize: 'var(--switch-indicator-font-size)',
      flexShrink: 0,
      userSelect: 'none',
      display: 'grid',
      placeContent: 'center',
      transition: 'inset-inline-start 0.12s ease',
      insetInlineStart: 'calc(var(--switch-x) - 2px)',
      _checked: {
        insetInlineStart: '2px',
      },
    },

    control: {
      display: 'inline-flex',
      gap: '0.5rem',
      flexShrink: 0,
      justifyContent: 'flex-start',
      cursor: 'switch',
      borderRadius: 'full',
      position: 'relative',
      width: 'var(--switch-width)',
      height: 'var(--switch-height)',
      _disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
      _invalid: {
        outline: '2px solid',
        outlineColor: 'border.error',
        outlineOffset: '2px',
      },
    },

    thumb: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transitionProperty: 'translate',
      transitionDuration: 'fast',
      borderRadius: 'inherit',
      _checked: {
        translate: 'var(--switch-x) 0',
      },
    },
  },

  variants: {
    variant: {
      primary: {
        control: {
          borderRadius: 'full',
          bg: 'switch.primary.bg',
          focusVisibleRing: 'outside',
          _checked: {
            bg: 'switch.primary.bg.checked',
            _hover: {
              bg: 'switch.primary.bg.hover',
            },
          },
        },
        thumb: {
          bg: 'white',
          width: 'var(--switch-height)',
          height: 'var(--switch-height)',
          scale: '0.8',
          boxShadow: 'sm',
          _checked: {
            bg: 'white',
          },
        },
      },
    },

    size: {
      sm: {
        root: {
          '--switch-width': '26px',
          '--switch-height': 'sizes.4',
          '--switch-indicator-font-size': 'fontSizes.sm',
        },
      },
      md: {
        root: {
          '--switch-width': '34px',
          '--switch-height': 'sizes.5',
          '--switch-indicator-font-size': 'fontSizes.md',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
