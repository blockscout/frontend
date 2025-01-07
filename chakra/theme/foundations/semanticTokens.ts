import type { ThemingConfig } from '@chakra-ui/react';

const semanticTokens: ThemingConfig['semanticTokens'] = {
  // TODO @tom2drum remove *_hover in favor of conditional selectors
  colors: {
    // NEW TOKENS
    buttons: {
      outline: {
        fg: {
          DEFAULT: { value: { base: '{colors.blue.600}', _dark: '{colors.blue.300}' } },
        },
        hover: {
          DEFAULT: { value: '{colors.blue.400}' },
        },
      },
      anchor: {
        fg: {
          DEFAULT: { value: { base: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
          selected: { value: { base: '{colors.blue.600}', _dark: '{colors.gray.50}' } },
        },
        border: {
          DEFAULT: { value: { base: '{colors.gray.200}', _dark: '{colors.gray.600}' } },
          selected: { value: { base: '{colors.blue.50}', _dark: '{colors.gray.600}' } },
        },
        hover: {
          DEFAULT: { value: '{colors.blue.400}' },
        },
      },
    },

    // OLD TOKENS
    divider: {
      DEFAULT: { value: '{colors.blackAlpha.200}' },
      _dark: { value: '{colors.whiteAlpha.200}' },
    },
    text: {
      DEFAULT: { value: '{colors.blackAlpha.800}' },
      _dark: { value: '{colors.whiteAlpha.800}' },
    },
    text_secondary: {
      DEFAULT: { value: '{colors.gray.500}' },
      _dark: { value: '{colors.gray.400}' },
    },
    link: {
      DEFAULT: { value: '{colors.blue.600}' },
      _dark: { value: '{colors.blue.300}' },
    },
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
};

export default semanticTokens;
