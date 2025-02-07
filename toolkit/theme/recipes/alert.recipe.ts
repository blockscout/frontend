import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'title', 'description', 'indicator', 'content' ],

  base: {
    root: {
      width: 'full',
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      borderRadius: 'base',
      color: 'alert.fg',
      _loading: {
        bgColor: 'unset',
      },
    },
    title: {
      fontWeight: '600',
    },
    description: {
      display: 'inline',
    },
    indicator: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      width: '5',
      height: '5',
      _icon: { boxSize: 'full' },
      color: 'alert.fg',
    },
    content: {
      display: 'flex',
      flex: '1',
    },
  },

  variants: {
    status: {
      info: {
        root: {
          bgColor: 'alert.bg.info',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'alert.bg.info',
          },
          color: 'alert.fg',
        },
      },
      warning: {
        root: {
          bgColor: 'alert.bg.warning',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'alert.bg.warning',
          },
          color: 'alert.fg',
        },
      },
      warning_table: {
        root: {
          bgColor: 'alert.bg.warning_table',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'alert.bg.warning_table',
          },
          color: 'alert.fg',
        },
      },
      success: {
        root: {
          bgColor: 'alert.bg.success',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'alert.bg.success',
          },
          color: 'alert.fg',
        },
      },
      error: {
        root: {
          bgColor: 'alert.bg.error',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'alert.bg.error',
          },
          color: 'alert.fg',
        },
      },
    },

    variant: {
      subtle: {
        root: {
          color: 'alert.fg',
        },
      },
    },

    inline: {
      'true': {
        root: {
          alignItems: 'flex-start',
        },
        content: {
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
      },
      'false': {
        content: {
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },

    size: {
      md: {
        root: {
          gap: '2',
          px: '3',
          py: '2',
          textStyle: 'md',
        },
        indicator: {
          boxSize: '5',
          my: '2px',
        },
      },
    },
  },

  defaultVariants: {
    status: 'info',
    size: 'md',
    inline: true,
    variant: 'subtle',
  },
});
