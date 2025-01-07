import type { SemanticTokenDefinition } from '@chakra-ui/react/dist/types/styled-system/types';

const semanticTokens: SemanticTokenDefinition = {
  colors: {
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
