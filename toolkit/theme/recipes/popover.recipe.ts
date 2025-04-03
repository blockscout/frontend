import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'content', 'header', 'body', 'footer', 'arrow', 'arrowTip' ],
  base: {
    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      textStyle: 'sm',
      '--popover-bg': 'colors.popover.bg',
      bg: 'var(--popover-bg)',
      boxShadow: 'popover',
      boxShadowColor: 'colors.popover.shadow',
      '--popover-mobile-size': 'calc(100dvw - 1rem)',
      width: {
        base: 'min(var(--popover-mobile-size), var(--popover-size))',
        lg: 'fit-content',
      },
      borderWidth: '0',
      borderRadius: 'md',
      '--popover-z-index': 'zIndex.popover',
      zIndex: 'calc(var(--popover-z-index) + var(--layer-index, 0))',
      outline: '0',
      transformOrigin: 'var(--transform-origin)',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'faster',
      },
    },
    header: {
      paddingInline: 'var(--popover-padding)',
      paddingTop: 'var(--popover-padding)',
    },
    body: {
      padding: 'var(--popover-padding)',
      flex: '1',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      paddingInline: 'var(--popover-padding)',
      paddingBottom: 'var(--popover-padding)',
    },
    arrow: {
      '--arrow-size': 'sizes.3',
      '--arrow-background': 'var(--popover-bg)',
    },
    arrowTip: {
      borderTopWidth: '1px',
      borderInlineStartWidth: '1px',
    },
  },
  variants: {
    size: {
      sm: {
        content: {
          '--popover-padding': 'spacing.4',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
