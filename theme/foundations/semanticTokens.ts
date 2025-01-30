import luxColors from './lux-colors';

const semanticTokens = {
  colors: {
    divider: {
      'default': luxColors.colors.muted4,
      _dark: luxColors.colors.muted4,
    },
    text: {
      'default': luxColors.colors.foreground,
      _dark: luxColors.colors.foreground,
    },
    text_secondary: {
      'default': luxColors.colors.muted,
      _dark: luxColors.colors.muted,
    },
    link: {
      'default': luxColors.colors.muted2,
      _dark: luxColors.colors.muted2,
    },
    link_hovered: {
      'default': luxColors.colors.foreground //'blue.400',
    },
    error: {
      'default': 'red.400',
      _dark: 'red.300',
    },
  },
  shadows: {
    action_bar: '0 4px 4px -4px rgb(0 0 0 / 10%), 0 2px 4px -4px rgb(0 0 0 / 6%)',
  },
};

export default semanticTokens;
