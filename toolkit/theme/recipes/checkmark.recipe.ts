import { defineRecipe } from '@chakra-ui/react';

// TODO @tom2drum dark mode + border color
export const recipe = defineRecipe({
  className: 'chakra-checkmark',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    color: 'white',
    borderWidth: '2px',
    borderColor: 'transparent',
    focusVisibleRing: 'outside',
    _icon: {
      boxSize: 'full',
    },
    _disabled: {
      opacity: '0.5',
    },
  },
  variants: {
    size: {
      xs: {
        boxSize: '3',
        borderRadius: '2px',
      },
      sm: {
        boxSize: '4',
        borderRadius: '2px',
      },
      md: {
        boxSize: '5',
        borderRadius: 'sm',
      },
    },

    variant: {
      solid: {
        borderColor: 'border',
        '&:is([data-state=checked], [data-state=indeterminate])': {
          bg: 'checkbox.icon.bg.checked',
          color: 'white',
          borderColor: 'checkbox.icon.bg.checked',
          _hover: {
            bg: 'checkbox.icon.bg.hover',
            borderColor: 'checkbox.icon.bg.hover',
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
