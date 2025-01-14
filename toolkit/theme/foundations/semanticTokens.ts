import type { ThemingConfig } from '@chakra-ui/react';

const semanticTokens: ThemingConfig['semanticTokens'] = {
  // TODO @tom2drum remove *_hover in favor of conditional selectors
  colors: {
    // NEW TOKENS
    button: {
      outline: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blue.600}', _dark: '{colors.blue.300}' } },
        },
      },
      dropdown: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
          selected: { value: { _light: '{colors.blue.600}', _dark: '{colors.gray.50}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.600}' } },
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.600}' } },
        },
      },
      header: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.gray.400}' } },
          selected: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
          highlighted: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
        },
        bg: {
          selected: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
          highlighted: { value: { _light: '{colors.orange.100}', _dark: '{colors.orange.900}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.gray.300}', _dark: '{colors.gray.600}' } },
        },
      },
    },
    link: {
      primary: {
        DEFAULT: { value: { _light: '{colors.blue.600}', _dark: '{colors.blue.300}' } },
        hover: { value: { _light: '{colors.blue.400}' } },
      },
      secondary: {
        DEFAULT: { value: { _light: '{colors.gray.400}', _dark: '{colors.gray.500}' } },
      },
      subtle: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.gray.400}' } },
        hover: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.gray.400}' } },
      },
      navigation: {
        fg: {
          DEFAULT: { value: { _light: '{colors.gray.600}', _dark: '{colors.gray.400}' } },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.50}' } },
          hover: { value: { _light: '{colors.link.primary.hover}' } },
          active: { value: { _light: '{colors.link.primary.hover}' } },
        },
        bg: {
          DEFAULT: { value: 'transparent' },
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        },
        border: {
          DEFAULT: { value: '{colors.border.divider}' },
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        },
      },
    },
    tooltip: {
      DEFAULT: {
        bg: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
        fg: { value: { _light: '{colors.white}', _dark: '{colors.black}' } },
      },
      navigation: {
        bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        fg: {
          DEFAULT: { value: '{colors.blue.400}' },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.50}' } },
        },
      },
    },
    popover: {
      DEFAULT: {
        bg: { value: { _light: '{colors.white}', _dark: '{colors.gray.900}' } },
        shadow: { value: { _light: '{colors.blackAlpha.200}', _dark: '{colors.whiteAlpha.300}' } },
      },
    },
    progressCircle: {
      trackColor: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
      },
    },
    skeleton: {
      bg: {
        start: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.50}' } },
        end: { value: { _light: '{colors.blackAlpha.100}', _dark: '{colors.whiteAlpha.100}' } },
      },
    },
    tabs: {
      solid: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.400}' } },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.50}' } },
        },
        bg: {
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        },
      },
      secondary: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
          selected: { value: { _light: '{colors.blue.600}', _dark: '{colors.gray.50}' } },
        },
        bg: {
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.600}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.600}' } },
        },
      },
    },
    'switch': {
      primary: {
        bg: {
          DEFAULT: { value: { _light: '{colors.gray.300}', _dark: '{colors.whiteAlpha.400}' } },
          checked: { value: { _light: '{colors.blue.500}', _dark: '{colors.blue.300}' } },
          hover: { value: { _light: '{colors.blue.600}', _dark: '{colors.blue.400}' } },
        },
      },
    },
    alert: {
      fg: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
      },
      bg: {
        info: { value: { _light: '{colors.blue.100}', _dark: '{colors.blue.900}' } },
        warning: { value: { _light: '{colors.orange.100}', _dark: '{colors.orange.800/60}' } },
        success: { value: { _light: '{colors.green.100}', _dark: '{colors.green.900}' } },
        error: { value: { _light: '{colors.red.100}', _dark: '{colors.red.900}' } },
        neutral: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
      },
    },
    input: {
      fg: {
        DEFAULT: { value: { _light: '{colors.blue.800}', _dark: '{colors.gray.50}' } },
        error: { value: '{colors.text.error}' },
      },
      bg: {
        DEFAULT: { value: { _light: '{colors.white}', _dark: '{colors.black}' } },
        readOnly: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.800}' } },
      },
      border: {
        DEFAULT: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.700}' } },
        hover: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.500}' } },
        focus: { value: '{colors.blue.400}' },
        filled: { value: { _light: '{colors.gray.300}', _dark: '{colors.gray.600}' } },
        readOnly: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.800}' } },
        error: { value: '{colors.red.500}' },
      },
    },
    field: {
      placeholder: {
        DEFAULT: { value: '{colors.gray.500}' },
        disabled: { value: '{colors.gray.500/20}' },
        error: { value: '{colors.red.500}' },
      },
    },
    text: {
      primary: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
      secondary: { value: { _light: '{colors.gray.500}', _dark: '{colors.gray.400}' } },
      error: { value: '{colors.red.500}' },
    },
    border: {
      divider: { value: { _light: '{colors.blackAlpha.200}', _dark: '{colors.whiteAlpha.200}' } },
      error: { value: '{colors.red.500}' },
    },
    global: {
      body: {
        bg: { value: { _light: '{colors.white}', _dark: '{colors.black}' } },
        fg: { value: '{colors.text.primary}' },
      },
      mark: {
        bg: { value: { _light: '{colors.green.100}', _dark: '{colors.green.800}' } },
      },
    },

    // OLD TOKENS
    // text: {
    //   DEFAULT: { value: '{colors.blackAlpha.800}' },
    //   _dark: { value: '{colors.whiteAlpha.800}' },
    // },
    text_secondary: {
      DEFAULT: { value: '{colors.gray.500}' },
      _dark: { value: '{colors.gray.400}' },
    },
    // link: {
    //   DEFAULT: { value: '{colors.blue.600}' },
    //   _dark: { value: '{colors.blue.300}' },
    // },
    link_hovered: {
      DEFAULT: { value: '{colors.blue.400}' },
    },
    icon_link_external: {
      DEFAULT: { value: '{colors.gray.300}' },
      _dark: { value: '{colors.gray.500}' },
    },
    icon_info: {
      DEFAULT: { value: '{colors.gray.400}' },
      _dark: { value: '{colors.gray.500}' },
    },
    error: {
      DEFAULT: { value: '{colors.red.500}' },
      _dark: { value: '{colors.red.500}' },
    },
    dialog_bg: {
      DEFAULT: { value: '{colors.white}' },
      _dark: { value: '{colors.gray.900}' },
    },
  },
  shadows: {
    popover: {
      DEFAULT: { value: {
        _light: '{shadows.size.2xl}',
        _dark: '0px 15px 40px 0px rgba(0, 0, 0, 0.4), 0px 5px 10px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
      } },
    },
  },
};

export default semanticTokens;
