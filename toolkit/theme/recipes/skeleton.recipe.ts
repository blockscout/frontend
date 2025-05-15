import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {},

  variants: {
    loading: {
      // special value to override the default behavior of the skeleton in Chakra
      // it uses "background: unset" when the loading prop is set to false
      // but it causes issues with background color of child element (e.g. button, badge, etc.)
      // so, instead of the "loading" prop, we use the "state" prop to control the skeleton (see below)
      reset: {},
    },
    state: {
      loading: {
        borderRadius: 'base',
        boxShadow: 'none',
        backgroundClip: 'padding-box',
        cursor: 'default',
        color: 'transparent',
        borderWidth: '0px',
        pointerEvents: 'none',
        userSelect: 'none',
        '&::before, &::after, *': {
          visibility: 'hidden',
        },
      },
    },
    variant: {
      pulse: {
        background: 'bg.emphasized',
        animation: 'pulse',
        animationDuration: 'var(--duration, 1.2s)',
      },
      shine: {
        '--animate-from': '100%',
        '--animate-to': '-100%',
        '--start-color': 'colors.skeleton.bg.start',
        '--end-color': 'colors.skeleton.bg.end',
        backgroundImage:
          'linear-gradient(90deg,var(--start-color) 8%,var(--end-color) 18%,var(--start-color) 33%)',
        backgroundColor: 'transparent',
        backgroundSize: '200% 100%',
        animation: 'bg-position var(--duration, 2s) linear infinite',
      },
      none: {
        animation: 'none',
      },
    },
  },

  defaultVariants: {
    variant: 'shine',
    loading: 'reset',
  },
});
