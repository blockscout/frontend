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
    visual: {
      info: {
        root: { bg: 'alert.bg.info', color: 'alert.fg' },
      },
      warning: {
        root: { bg: 'alert.bg.warning', color: 'alert.fg' },
      },
      success: {
        root: { bg: 'alert.bg.success', color: 'alert.fg' },
      },
      error: {
        root: { bg: 'alert.bg.error', color: 'alert.fg' },
      },
      neutral: {
        root: { bg: 'alert.bg.neutral', color: 'alert.fg' },
      },
    },

    inline: {
      'true': {
        root: {
          alignItems: 'center',
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
          p: '3',
          textStyle: 'md',
        },
        indicator: {
          boxSize: '5',
        },
      },
    },
  },

  defaultVariants: {
    // status: 'info',
    visual: 'info',
    size: 'md',
    inline: true,
  },
});
