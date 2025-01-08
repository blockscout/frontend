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
        color: 'button.outline.fg',
        borderColor: 'button.outline.fg',
        _hover: {
          bg: 'transparent',
          color: 'button.outline.hover',
          borderColor: 'button.outline.hover',
        },
      },
      dropdown: {
        borderWidth: '2px',
        borderStyle: 'solid',
        bg: 'transparent',
        color: 'button.dropdown.fg',
        borderColor: 'button.dropdown.border',
        _hover: {
          bg: 'transparent',
          color: 'button.dropdown.hover',
          borderColor: 'button.dropdown.hover',
        },
        // When the dropdown is open, the button should be active
        _active: {
          bg: 'transparent',
          color: 'button.dropdown.hover',
          borderColor: 'button.dropdown.hover',
        },
        // We have a special state for this button variant that serves as a popover trigger.
        // When any items (filters) are selected in the popover, the button should change its background and text color.
        // The last CSS selector is for redefining styles for the TabList component.
        _selected: {
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
    size: {
      xs: { px: 2, h: 6, fontSize: '12px' },
      sm: { px: 2, h: 8, fontSize: '14px' },
      md: { px: 4, h: 10, fontSize: '16px' },
      lg: { px: 6, h: 12, fontSize: '20px' },
    },
  },
  defaultVariants: {
    size: 'md',
    visual: 'solid',
  },
});
