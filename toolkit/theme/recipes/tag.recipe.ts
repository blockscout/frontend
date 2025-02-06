import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'label', 'startElement', 'endElement', 'closeTrigger' ],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      verticalAlign: 'top',
      maxWidth: '100%',
      userSelect: 'none',
      borderRadius: 'sm',
      focusVisibleRing: 'outside',
      _loading: {
        borderRadius: 'sm',
        bgColor: 'unset',
      },
    },
    label: {
      lineClamp: '1',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontWeight: 'medium',
      display: 'inline',
    },
    closeTrigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '0',
      borderRadius: 'none',
      color: 'tag.closeTrigger.color',
      focusVisibleRing: 'inside',
      focusRingWidth: '2px',
      _hover: {
        color: 'link.primary.hover',
      },
    },
    startElement: {
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSize: 'var(--tag-element-size)',
      ms: 'var(--tag-element-offset)',
      '&:has([data-scope=avatar])': {
        boxSize: 'var(--tag-avatar-size)',
        ms: 'calc(var(--tag-element-offset) * 1.5)',
      },
      _icon: { boxSize: '100%' },
    },
    endElement: {
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSize: 'var(--tag-element-size)',
      me: 'var(--tag-element-offset)',
      _icon: { boxSize: '100%' },
      '&:has(button)': {
        ms: 'calc(var(--tag-element-offset) * -1)',
      },
    },
  },

  variants: {
    size: {
      md: {
        root: {
          px: '1',
          py: '0.5',
          minH: '6',
          gap: '1',
          '--tag-avatar-size': 'spacing.4',
          '--tag-element-size': 'spacing.3',
          '--tag-element-offset': '0px',
        },
        label: {
          textStyle: 'sm',
        },
      },
    },

    variant: {
      subtle: {
        root: {
          bgColor: 'tag.root.subtle.bg',
          color: 'tag.root.subtle.fg',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'tag.root.subtle.bg',
          },
        },
      },
      clickable: {
        root: {
          cursor: 'pointer',
          bgColor: 'tag.root.clickable.bg',
          color: 'tag.root.clickable.fg',
          '&:not([data-loading], [aria-busy=true])': {
            bgColor: 'tag.root.clickable.bg',
          },
          _hover: {
            opacity: 0.76,
          },
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'subtle',
  },
});
