import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('gray.600', 'gray.400'),
      active: useColorModeValue('blackAlpha.900', 'whiteAlpha.900'),
      hover: 'link_hovered',
    },
    iconPlaceholder: {
      'default': useColorModeValue('blackAlpha.100', 'whiteAlpha.300'),
    },
    bg: {
      'default': 'transparent',
      active: useColorModeValue('blue.50', 'whiteAlpha.100'),
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('blue.50', 'whiteAlpha.100'),
    },
  };
}
