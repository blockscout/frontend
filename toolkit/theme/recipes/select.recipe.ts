import { defineSlotRecipe } from '@chakra-ui/react';

// TODO @tom2drum check sizes for select
export const recipe = defineSlotRecipe({
  slots: [ 'root', 'trigger', 'indicatorGroup', 'indicator', 'content', 'item', 'control', 'itemText', 'itemGroup', 'itemGroupLabel', 'label', 'valueText' ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: 'full',
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
        layerStyle: 'disabled',
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
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'inherit',
      _groupHover: {
        color: 'link.primary.hover',
      },
      _open: {
        color: 'link.primary.hover',
      },
    },
    content: {
      background: 'popover.bg',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 'dropdown',
      borderRadius: 'md',
      borderWidth: '0',
      outline: 0,
      boxShadow: 'popover',
      boxShadowColor: 'colors.popover.shadow',
      maxH: '96',
      overflowY: 'auto',
      width: 'max-content',
      minWidth: '150px',
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
        opacity: '0.5',
      },
      _icon: {
        width: '4',
        height: '4',
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
        layerStyle: 'disabled',
      },
    },
    valueText: {
      lineClamp: '1',
      maxW: '80%',
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
            focusVisibleRing: 'none',
          },
          _invalid: {
            borderColor: 'border.error',
          },
        },
      },
      filter: {
        trigger: {
          borderWidth: '2px',
          color: 'select.trigger.filter.fg.selected',
          bgColor: 'select.trigger.filter.border.selected',
          borderColor: 'select.trigger.filter.border.selected',
          _expanded: {
            color: 'link.primary.hover',
            borderColor: 'link.primary.hover',
          },
          _hover: {
            color: 'select.trigger.filter.fg.selected',
            borderColor: 'select.trigger.filter.border.selected',
          },
          _focusVisible: {
            borderColor: 'link.primary.hover',
            focusVisibleRing: 'none',
          },
          _placeholderShown: {
            color: 'select.trigger.filter.fg',
            borderColor: 'select.trigger.filter.border',
            bgColor: 'transparent',
            _hover: {
              color: 'link.primary.hover',
              borderColor: 'link.primary.hover',
            },
          },
        },
      },
      sort: {
        trigger: {
          borderWidth: '2px',
          borderColor: 'transparent',
          bgColor: 'transparent',
          _hover: {
            color: 'link.primary.hover',
            borderColor: 'link.primary.hover',
          },
          _open: {
            bg: 'button.dropdown.border.selected',
            color: 'button.dropdown.fg.selected',
            borderColor: 'button.dropdown.border.selected',
            _hover: {
              bg: 'button.dropdown.border.selected',
              color: 'button.dropdown.fg.selected',
              borderColor: 'button.dropdown.border.selected',
            },
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
          py: '2',
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
          py: '2',
          pr: '4',
          pl: '44px',
          _selected: {
            px: '4',
          },
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
