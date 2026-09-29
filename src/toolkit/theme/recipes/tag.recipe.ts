// SPDX-License-Identifier: LicenseRef-Blockscout

import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'label', 'startElement', 'endElement', 'closeTrigger' ],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      verticalAlign: 'top',
      maxWidth: '100%',
      userSelect: 'text',
      borderRadius: 'sm',
      focusVisibleRing: 'outside',
      _loading: {
        borderRadius: 'sm',
      },
      _disabled: {
        opacity: 'control.disabled',
        pointerEvents: 'none',
        cursor: 'not-allowed',
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
      color: 'closeButton.fg',
      focusVisibleRing: 'inside',
      focusRingWidth: '2px',
      _hover: {
        color: 'hover',
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
      lg: {
        root: {
          px: '6px',
          py: '6px',
          minH: '8',
          minW: '8',
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
        },
      },
      clickable: {
        root: {
          cursor: 'pointer',
          bgColor: 'tag.root.clickable.bg',
          color: 'tag.root.clickable.fg',
          _hover: {
            opacity: 0.76,
          },
        },
      },
      filter: {
        root: {
          bgColor: 'tag.root.filter.bg',
        },
      },
      select: {
        root: {
          cursor: 'pointer',
          bgColor: 'transparent',
          color: 'text.primary',
          border: '2px solid',
          borderColor: 'tag.root.select.border',
          _hover: {
            color: 'hover',
          },
          _selected: {
            bgColor: 'selected.control.bg',
            color: 'selected.control.text',
            borderColor: 'transparent',
            _hover: {
              color: 'selected.control.text',
            },
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
