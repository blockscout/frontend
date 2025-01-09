import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'circle', 'circleTrack', 'circleRange', 'label', 'valueText' ],
  base: {
    root: {
      display: 'inline-flex',
      textStyle: 'sm',
      position: 'relative',
    },
    circle: {
      _indeterminate: {
        animation: 'spin 2s linear infinite',
      },
    },
    circleTrack: {
      '--track-color': 'colors.progressCircle.trackColor',
      stroke: 'var(--track-color)',
    },
    circleRange: {
      stroke: 'blue.500',
      transitionProperty: 'stroke-dasharray',
      transitionDuration: '0.6s',
      _indeterminate: {
        animation: 'circular-progress 1.5s linear infinite',
      },
    },
    label: {
      display: 'inline-flex',
    },
    valueText: {
      lineHeight: '1',
      fontWeight: 'medium',
      letterSpacing: 'tight',
      fontVariantNumeric: 'tabular-nums',
    },
  },

  variants: {
    size: {
      sm: {
        circle: {
          '--size': '16px',
          '--thickness': '2px',
        },
        valueText: {
          textStyle: '2xs',
        },
      },
      md: {
        circle: {
          '--size': '20px',
          '--thickness': '2px',
        },
        valueText: {
          textStyle: 'xs',
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});
