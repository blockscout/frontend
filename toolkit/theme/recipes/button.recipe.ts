import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'flex',
    gap: 0,
    fontWeight: 600,
    overflow: 'hidden',
    _disabled: {
      opacity: 'control.disabled',
    },
    // FIXME have to override the Chakra UI styles for the SVG icon inside the button
    // try to find a better solution
    '& svg': {
      boxSize: 'auto',
    },
    _loading: {
      bgColor: 'unset',
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'blue.600',
        color: 'white',
        '&:not([data-loading-skeleton])': {
          bgColor: 'blue.600',
          _expanded: {
            bg: 'blue.400',
          },
        },
        _hover: {
          bg: 'blue.400',
        },
        _loading: {
          opacity: 1,
          '& .chakra-spinner': {
            borderColor: 'gray.200',
            borderBottomColor: 'spinner.track',
            borderInlineStartColor: 'spinner.track',
          },
        },
      },
      outline: {
        borderWidth: '0px',
        borderStyle: 'solid',
        bg: 'transparent',
        color: 'button.outline.fg',
        borderColor: 'button.outline.fg',
        '&:not([data-loading-skeleton])': {
          borderWidth: '2px',
        },
        _hover: {
          bg: 'transparent',
          color: 'blue.400',
          borderColor: 'blue.400',
        },
        _loading: {
          opacity: 1,
          '& .chakra-spinner': {
            borderColor: 'button.outline.fg',
            borderBottomColor: 'spinner.track',
            borderInlineStartColor: 'spinner.track',
          },
        },
      },
      dropdown: {
        borderWidth: '0px',
        borderStyle: 'solid',
        bg: 'transparent',
        color: 'button.dropdown.fg',
        borderColor: 'button.dropdown.border',
        '&:not([data-loading-skeleton])': {
          borderWidth: '2px',
        },
        _hover: {
          bg: 'transparent',
          color: 'blue.400',
          borderColor: 'blue.400',
        },
        _loading: {
          opacity: 1,
          '& .chakra-spinner': {
            borderColor: 'blue.500',
            borderBottomColor: 'spinner.track',
            borderInlineStartColor: 'spinner.track',
          },
        },
        // When the dropdown is open, the button should be active
        _expanded: {
          bg: 'transparent',
          color: 'blue.400',
          borderColor: 'blue.400',
        },
        // We have a special state for this button variant that serves as a popover trigger.
        // When any items (filters) are selected in the popover, the button should change its background and text color.
        // The last CSS selector is for redefining styles for the TabList component.
        _selected: {
          bg: 'button.dropdown.bg.selected',
          color: 'button.dropdown.fg.selected',
          borderColor: 'transparent',
          _hover: {
            bg: 'button.dropdown.bg.selected',
            color: 'button.dropdown.fg.selected',
            borderColor: 'transparent',
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
        _loading: {
          opacity: 1,
          '& .chakra-spinner': {
            borderColor: 'blue.500',
            borderBottomColor: 'spinner.track',
            borderInlineStartColor: 'spinner.track',
          },
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
      hero: {
        bg: 'button.hero.bg',
        color: 'button.hero.fg',
        '&:not([data-loading-skeleton])': {
          bg: 'button.hero.bg',
        },
        _loading: {
          opacity: 1,
          '& .chakra-spinner': {
            borderColor: 'button.hero.fg',
            borderBottomColor: 'spinner.track',
            borderInlineStartColor: 'spinner.track',
          },
        },
        _hover: {
          bg: 'button.hero.bg.hover',
          color: 'button.hero.fg.hover',
        },
        _selected: {
          bg: 'button.hero.bg.selected',
          color: 'button.hero.fg.selected',
          _hover: {
            bg: 'button.hero.bg.selected',
            color: 'button.hero.fg.selected',
          },
        },
      },
      segmented: {
        bg: 'transparent',
        color: 'button.segmented.fg',
        borderColor: 'button.segmented.border',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: 'none',
        _hover: {
          color: 'link.primary.hover',
        },
        _selected: {
          bg: 'button.segmented.border',
          color: 'button.segmented.fg.selected',
          _hover: {
            bg: 'button.segmented.border',
            color: 'button.segmented.fg.selected',
          },
        },
        _notFirst: {
          borderLeftWidth: '0',
        },
        _first: {
          borderTopLeftRadius: 'base',
          borderBottomLeftRadius: 'base',
        },
        _last: {
          borderTopRightRadius: 'base',
          borderBottomRightRadius: 'base',
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
      subtle: {
        bg: 'button.subtle.bg',
        color: 'button.subtle.fg',
        '&:not([data-loading-skeleton])': {
          bg: 'button.subtle.bg',
        },
        _hover: {
          bg: 'button.subtle.bg',
          color: 'link.primary.hover',
        },
        _disabled: {
          bg: 'button.subtle.bg',
          color: 'button.subtle.fg',
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
          color: 'link.primary.hover',
        },
        _disabled: {
          color: 'text.secondary',
        },
      },
      icon_secondary: {
        bg: 'transparent',
        color: 'button.icon_secondary.fg',
        border: 'none',
        _hover: {
          color: 'link.primary.hover',
        },
        _selected: {
          bg: 'button.icon_secondary.bg.selected',
          color: 'button.icon_secondary.fg.selected',
          _hover: {
            bg: 'button.icon_secondary.bg.selected',
            color: 'button.icon_secondary.fg.selected',
          },
        },
        _expanded: {
          color: 'link.primary.hover',
        },
      },
    },
    size: {
      '2xs': { px: 2, h: 5, minW: 5, textStyle: 'xs', borderRadius: 'sm', gap: 1 },
      xs: { px: 2, h: 6, minW: 6, textStyle: 'sm', borderRadius: 'sm', gap: 1 },
      sm: { px: 3, h: 8, minW: 8, textStyle: 'sm', borderRadius: 'base', gap: 1 },
      md: { px: 3, h: 10, minW: 10, textStyle: 'md', borderRadius: 'base', gap: 2, '& .chakra-spinner': { '--spinner-size': '20px' } },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
});
