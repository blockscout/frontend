import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'flex',
    gap: 0,
    borderRadius: 'base',
    fontWeight: 600,
    overflow: 'hidden',
    _disabled: {
      opacity: 0.2,
    },
    // FIXME have to override the Chakra UI styles for the SVG icon inside the button
    // try to find a better solution
    '& svg': {
      boxSize: 'auto',
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
        _loading: {
          '& .chakra-spinner': {
            borderColor: 'white',
            borderBottomColor: 'spinner.track',
            borderInlineStartColor: 'spinner.track',
          },
        },
      },
      outline: {
        borderWidth: '2px',
        borderStyle: 'solid',
        bg: 'transparent',
        color: 'button.outline.fg',
        borderColor: 'button.outline.fg',
        _hover: {
          bg: 'transparent',
          color: 'blue.400',
          borderColor: 'blue.400',
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
          color: 'blue.400',
          borderColor: 'blue.400',
        },
        // When the dropdown is open, the button should be active
        _active: {
          bg: 'transparent',
          color: 'blue.400',
          borderColor: 'blue.400',
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
      header: {
        bg: 'transparent',
        color: 'button.header.fg',
        borderColor: 'button.header.border',
        borderWidth: '2px',
        borderStyle: 'solid',
        _hover: {
          bg: 'transparent',
          color: 'blue.400',
          borderColor: 'blue.400',
        },
        _selected: {
          bg: 'button.header.bg.selected',
          color: 'button.header.fg.selected',
          borderColor: 'transparent',
          borderWidth: '0px',
          _hover: {
            bg: 'button.header.bg.selected',
            color: 'button.header.fg.selected',
          },
          _highlighted: {
            bg: 'button.header.bg.highlighted',
            color: 'button.header.fg.highlighted',
            borderColor: 'transparent',
            borderWidth: '0px',
            _hover: {
              bg: 'button.header.bg.highlighted',
              color: 'button.header.fg.highlighted',
            },
          },
        },
      },
      plain: {
        bg: 'transparent',
        color: 'inherit',
        border: 'none',
        _hover: {
          bg: 'transparent',
        },
      },
      link: {
        bg: 'transparent',
        color: 'link.primary',
        border: 'none',
        fontWeight: '400',
        px: 0,
        h: 'auto',
        _hover: {
          bg: 'transparent',
          color: 'link.primary.hovered',
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
