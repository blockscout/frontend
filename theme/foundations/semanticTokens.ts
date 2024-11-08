const semanticTokens = {
  colors: {
    divider: {
      'default': 'blackAlpha.200',
      _dark: 'whiteAlpha.200',
    },
    text: {
      'default': 'black',
      _dark: 'whiteAlpha.800',
    },
    text_secondary: {
      'default': 'gray.500',
      _dark: 'gray.400',
    },
    link: {
      'default': 'purple.90',
      _dark: 'purple.30',
    },
    link_hovered: {
      'default': 'purple.300',
      _dark: 'purple.60',
    },
    icon_link_external: {
      'default': 'gray.300',
      _dark: 'gray.500',
    },
    icon_info: {
      'default': 'gray.400',
      _dark: 'gray.500',
    },
    error: {
      'default': 'red.500',
      _dark: 'red.500',
    },
    dialog_bg: {
      'default': 'white',
      _dark: 'gray.900',
    },
  },
  shadows: {
    action_bar: '0 4px 4px -4px rgb(0 0 0 / 10%), 0 2px 4px -4px rgb(0 0 0 / 6%)',
  },
};

export default semanticTokens;
