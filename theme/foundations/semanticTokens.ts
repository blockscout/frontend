import colors from './colors';

const semanticTokens = {
  colors: {
    divider: {
      'default': 'blackAlpha.200',
      _dark: colors.grayTrue[700], //'whiteAlpha.200',
    },
    text: {
      'default': colors.error[500], //'blackAlpha.800',
      _dark: colors.grayTrue[50], //'whiteAlpha.800',
    },
    text_secondary: {
      'default': 'gray.500',
      _dark: colors.grayTrue[200], //'gray.400',
    },
    link: {
      'default': 'blue.600',
      _dark: colors.warning[300], //'blue.300',
    },
    link_hovered: {
      'default': colors.warning[400], //'blue.400',
    },
    icon_link_external: {
      'default': 'gray.300',
      _dark: colors.grayTrue[200], //'gray.500',
    },
    icon_info: {
      'default': 'gray.400',
      _dark: colors.grayTrue[200], //'gray.500',
    },
    error: {
      'default': 'red.500',
      _dark: colors.error[500], //'red.500',
    },
    dialog_bg: {
      'default': 'white',
      _dark: colors.grayTrue[900], //'gray.900',
    },
  },
  shadows: {
    action_bar: '0 4px 4px -4px rgb(0 0 0 / 10%), 0 2px 4px -4px rgb(0 0 0 / 6%)',
  },
};

export default semanticTokens;
