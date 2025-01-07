import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'flex',
    borderRadius: 'base',
    fontWeight: 600,
    overflow: 'hidden',
    _disabled: {
      opacity: 0.2,
    },
  },
  variants: {
    visual: {
      solid: {
        bg: 'blue.600',
        color: 'white',
        _hover: {
          bg: 'blue.400',
        },
        _active: { bg: 'blue.400' },
      },
      outline: {
        borderWidth: '2px',
        borderStyle: 'solid',
        bg: 'transparent',
        color: 'buttons.outline.fg',
        borderColor: 'buttons.outline.fg',
        _hover: {
          bg: 'transparent',
          color: 'buttons.outline.hover',
          borderColor: 'buttons.outline.hover',
        },
      },
      anchor: {
        borderWidth: '2px',
        borderStyle: 'solid',
        bg: 'transparent',
        color: 'buttons.anchor.fg',
        borderColor: 'buttons.anchor.border',
        _hover: {
          bg: 'transparent',
          color: 'buttons.anchor.hover',
          borderColor: 'buttons.anchor.hover',
        },
        // When the dropdown is open, the button should be active
        _active: {
          bg: 'transparent',
          color: 'buttons.anchor.hover',
          borderColor: 'buttons.anchor.hover',
        },
        // We have a special state for this button variant that serves as a popover trigger.
        // When any items (filters) are selected in the popover, the button should change its background and text color.
        // The last CSS selector is for redefining styles for the TabList component.
        _selected: {
          bg: 'buttons.anchor.border.selected',
          color: 'buttons.anchor.fg.selected',
          borderColor: 'buttons.anchor.border.selected',
          _hover: {
            bg: 'buttons.anchor.border.selected',
            color: 'buttons.anchor.fg.selected',
            borderColor: 'buttons.anchor.border.selected',
          },
        },
      },
    },
    size: {
      xs: { px: 2, h: 6, fontSize: '12px' },
      sm: { px: 3, h: 8, fontSize: '14px' },
      md: { px: 4, h: 10, fontSize: '16px' },
      lg: { px: 6, h: 12, fontSize: '20px' },
    },
  },
  defaultVariants: {
    size: 'md',
    visual: 'solid',
  },
});
