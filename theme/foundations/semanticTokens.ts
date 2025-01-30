import luxColors from './lux-colors';

const semanticTokens = {
  colors: {
    divider: {
      'default': 'blackAlpha.200',
      _dark: 'whiteAlpha.200',
    },
    text: {
      'default': 'blackAlpha.800',
      _dark: 'whiteAlpha.800',
    },
    text_secondary: {
      'default': 'gray.500',
      _dark: 'gray.400',
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
