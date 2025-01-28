import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {},

  variants: {
    loading: {
      'true': {
        borderRadius: 'base',
        boxShadow: 'none',
        backgroundClip: 'padding-box',
        cursor: 'default',
        color: 'transparent',
        pointerEvents: 'none',
        userSelect: 'none',
        flexShrink: '0',
        '&::before, &::after, *': {
          visibility: 'hidden',
        },
      },
      'false': {
        background: 'var(--layer-bg)',
        animation: 'fade-in var(--fade-duration, 0.1s) ease-out !important',
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
    loading: true,
  },
});
