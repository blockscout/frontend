// SPDX-License-Identifier: LicenseRef-Blockscout

import { defineSlotRecipe, defineStyle } from '@chakra-ui/react';

import { recipe as inputRecipe } from './input.recipe';

// PrevTrigger, NextTrigger
const navTriggerStyle = defineStyle({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSize: 'var(--datepicker-nav-trigger-size)',
  color: 'icon.primary',
  cursor: 'pointer',
  _hover: {
    color: 'hover',
    bg: 'transparent',
  },
  _disabled: {
    opacity: 'control.disabled',
  },
});

export const recipe = defineSlotRecipe({
  className: 'date-picker',
  slots: [
    'root',
    'label',
    'indicatorGroup',
    'control',
    'input',
    'trigger',
    'content',
    'view',
    'viewControl',
    'viewTrigger',
    'prevTrigger',
    'nextTrigger',
    'rangeText',
    'table',
    'tableRow',
    'tableHeader',
    'tableCell',
    'tableCellTrigger',
    'monthSelect',
    'yearSelect',
    'clearTrigger',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: 'full',
      '--datepicker-indicators-offset': 'sizes.3',
      _disabled: {
        opacity: 0.5,
      },
    },

    label: {
      textStyle: 'sm',
      fontWeight: 'medium',
    },

    indicatorGroup: {
      position: 'absolute',
      insetEnd: 'var(--datepicker-indicators-offset)',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1',
    },

    control: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      width: 'full',
      position: 'relative',
    },

    input: {
      flex: '1',
      minWidth: '0',
      height: 'var(--datepicker-input-height)',
      '--input-height': 'var(--datepicker-input-height)',
      px: 'var(--datepicker-input-px)',
      textStyle: 'sm',
      borderRadius: 'base',
      outline: '0',
      appearance: 'none',
      fontWeight: '500',
      _readOnly: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    },

    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '6',
      height: '6',
      color: 'icon.primary',
      cursor: 'pointer',
      outline: 'none',
      _hover: {
        color: 'hover',
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 'control.disabled',
      },
      _readOnly: {
        cursor: 'default',
        opacity: 'control.disabled',
        _hover: {
          color: 'icon.primary',
          pointerEvents: 'none',
        },
      },
    },

    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3',
      p: '4',
      minW: '280px',
      maxW: '500px',
      bg: 'popover.bg',
      borderRadius: 'md',
      boxShadow: 'popover',
      boxShadowColor: 'colors.popover.shadow',
      color: 'text.primary',
      '--date-picker-z-index': 'zIndex.modal2',
      zIndex: 'calc(var(--date-picker-z-index) + var(--layer-index, 0))',
      outline: 'none',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'faster',
      },
    },

    view: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3',
    },

    viewControl: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2',
      height: 'var(--datepicker-nav-trigger-size)',
    },

    viewTrigger: {
      display: 'inline-flex',
      flex: '1',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1',
      py: '1',
      px: '2',
      cursor: 'pointer',
      _hover: {
        color: 'hover',
        bg: 'transparent',
      },
    },

    prevTrigger: navTriggerStyle,
    nextTrigger: navTriggerStyle,

    rangeText: {
      textStyle: 'md',
      fontWeight: '600',
    },

    table: {
      borderCollapse: 'separate',
      borderSpacing: '0 8px',
    },

    tableHeader: {
      width: 'var(--table-cell-size)',
      py: '1',
      textStyle: 'md',
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'uppercase',
      color: 'text.primary',
    },

    tableCell: {
      py: '0',
      textAlign: 'center',
    },

    tableCellTrigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'var(--table-cell-size)',
      minHeight: 'var(--table-cell-size)',
      textStyle: 'md',
      borderRadius: 'sm',
      cursor: 'pointer',
      position: 'relative',
      _hover: {
        color: 'hover',
        bg: 'transparent',
      },
      '[data-view=month] &, [data-view=year] &': {
        width: 'calc(var(--table-cell-size) * 1.75)',
      },
      _today: {
        color: 'colorPalette.fg',
        fontWeight: 'semibold',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationThickness: '2px',
      },
      '&[data-selected]': {
        bg: 'selected.option.bg',
        color: 'whiteAlpha.900',
        _hover: {
          bg: 'selected.option.bg',
          color: 'whiteAlpha.900',
        },
      },
      '&[data-in-range]': {
        bg: 'selected.option.bg',
        color: 'whiteAlpha.900',
        borderRadius: '0',
        _hover: {
          bg: 'selected.option.bg',
          color: 'whiteAlpha.900',
        },
      },
      '&[data-in-range][data-selected]': {
        bg: 'selected.option.bg',
        color: 'whiteAlpha.900',
        borderRadius: '0',
        _hover: {
          bg: 'selected.option.bg',
          color: 'whiteAlpha.900',
        },
        '&[data-range-start][data-range-end]': {
          borderRadius: 'sm',
        },
        '&[data-range-start]:not([data-range-end])': {
          borderStartRadius: 'sm',
          borderEndRadius: '0',
        },
        '&[data-range-end]:not([data-range-start])': {
          borderEndRadius: 'sm',
          borderStartRadius: '0',
        },
      },
      _disabled: {
        opacity: 'control.disabled',
        cursor: 'not-allowed',
      },
    },

    clearTrigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      textStyle: 'xs',
      color: 'icon.secondary',
      _hover: {
        color: 'hover',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    },
  },

  variants: {
    size: {
      lg: {
        root: {
          '--datepicker-input-height': '60px',
          '--datepicker-input-px': 'sizes.4',
        },
        view: {
          '--table-cell-size': 'sizes.8',
          '--datepicker-nav-trigger-size': 'sizes.8',
          '--datepicker-select-height': 'sizes.10',
        },
        input: {
          textStyle: 'md',
        },
      },
    },

    hideOutsideDays: {
      'true': {
        tableCellTrigger: {
          '&[data-outside-range]': {
            visibility: 'hidden',
          },
        },
      },
    },

    variant: {
      outline: {
        input: inputRecipe.variants?.variant.outline,
      },
    },

    floating: {
      'true': {},
    },
  },

  compoundVariants: [
    {
      size: 'lg',
      floating: true,
      css: {
        input: {
          padding: '24px 10px 8px 16px',
        },
      },
    },
  ],

  defaultVariants: {
    size: 'lg',
    variant: 'outline',
    floating: true,
  },
});
