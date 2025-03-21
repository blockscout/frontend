import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'trigger', 'indicatorGroup', 'indicator', 'content', 'item', 'control', 'itemText', 'itemGroup', 'itemGroupLabel', 'label', 'valueText' ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: 'fit-content',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: 'full',
      minH: 'var(--select-trigger-height)',
      pr: 'var(--select-trigger-padding-right)',
      pl: 'var(--select-trigger-padding-left)',
      borderRadius: 'base',
      userSelect: 'none',
      textAlign: 'start',
      fontWeight: 'semibold',
      cursor: 'pointer',
      focusVisibleRing: 'none',
      _disabled: {
        opacity: 'control.disabled',
      },
    },
    indicatorGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      pos: 'absolute',
      right: '0',
      top: '0',
      bottom: '0',
      px: '0',
      pointerEvents: 'none',
      _peerHover: {
        color: 'link.primary.hover',
      },
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'inherit',
      _open: {
        color: 'link.primary.hover',
      },
    },
    content: {
      background: 'popover.bg',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 'popover',
      borderRadius: 'md',
      borderWidth: '0',
      outline: 0,
      boxShadow: 'popover',
      boxShadowColor: 'colors.popover.shadow',
      maxH: '96',
      overflowY: 'auto',
      width: 'max-content',
      minWidth: '150px',
      rowGap: '2',
      _open: {
        animationStyle: 'slide-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'slide-fade-out',
        animationDuration: 'fastest',
      },
    },
    item: {
      position: 'relative',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      cursor: 'pointer',
      justifyContent: 'flex-start',
      flex: '1',
      textAlign: 'start',
      borderRadius: 'none',
      _disabled: {
        pointerEvents: 'none',
        opacity: 'control.disabled',
      },
      _highlighted: {
        bg: 'select.item.bg.highlighted',
      },
    },
    control: {
      pos: 'relative',
    },
    itemText: {
      flex: '1',
    },
    itemGroup: {
      _first: { mt: '0' },
    },
    itemGroupLabel: {
      py: '1',
      fontWeight: 'medium',
    },
    label: {
      fontWeight: 'medium',
      userSelect: 'none',
      textStyle: 'sm',
      _disabled: {
        opacity: 'control.disabled',
      },
    },
    valueText: {
      lineClamp: '1',
      maxW: '100%',
    },
  },

  variants: {
    variant: {
      outline: {
        trigger: {
          borderWidth: '2px',
          color: 'select.trigger.outline.fg',
          bgColor: 'transparent',
          borderColor: 'select.trigger.outline.border',
          _expanded: {
            color: 'link.primary.hover',
            borderColor: 'link.primary.hover',
          },
          _hover: {
            color: 'link.primary.hover',
            borderColor: 'link.primary.hover',
          },
          _focusVisible: {
            borderColor: 'link.primary.hover',
          },
          _invalid: {
            borderColor: 'border.error',
          },
        },
      },
    },

    size: {
      sm: {
        root: {
          '--select-trigger-height': 'sizes.8',
          '--select-trigger-padding-right': 'spacing.8',
          '--select-trigger-padding-left': 'spacing.2',
        },
        content: {
          px: '0',
          py: '4',
          textStyle: 'md',
        },
        trigger: {
          textStyle: 'sm',
          gap: '1',
        },
        indicator: {
          width: '5',
          height: '5',
        },
        indicatorGroup: {
          pr: '2',
          pl: '1',
        },
        item: {
          py: '5px',
          px: '4',
        },
        itemGroup: {
          mt: '1',
        },
        itemGroupLabel: {
          py: '1',
          px: '1.5',
        },
      },
    },
  },

  defaultVariants: {
    size: 'sm',
    variant: 'outline',
  },
});
