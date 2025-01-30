import luxColors from 'theme/foundations/lux-colors';

export default function useColors() {
  return {
    text: {
      'default': luxColors.colors.muted,
      active: luxColors.colors.foreground,
      hover: luxColors.colors.accent,
    },
    iconPlaceholder: {
      'default': luxColors.colors.muted,
    },
    bg: {
      'default': 'transparent',
      active: 'transparent',
    },
    border: {
      'default': luxColors.colors.muted3,
      active:  luxColors.colors.muted,
    },
  };
}
