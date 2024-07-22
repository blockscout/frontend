const semanticTokens = {
  colors: {
    divider: {
      'default': 'blackAlpha.200',
      _dark: 'whiteAlpha.200',
    },
    text: {
      'default': 'rgba(47, 47, 47, 1)',
      _dark: 'rgba(208, 208, 209, 1)',
    },
    text_secondary: {
      'default': 'gray.500',
      _dark: 'gray.400',
    },
    link: {
      'default': 'blue.600',
      _dark: 'blue.300',
    },
    link_hovered: {
      'default': 'rgba(61, 246, 43, 1)',
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
