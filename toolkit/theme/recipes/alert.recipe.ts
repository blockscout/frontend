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
      warning_table: {
        root: { bg: 'alert.bg.warning_table', color: 'alert.fg' },
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
    visual: 'neutral',
    size: 'md',
    inline: true,
  },
});
