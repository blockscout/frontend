import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('gray.600', 'gray.400'),
      active: useColorModeValue('orange.500', 'gray.50'),
      hover: 'link_hovered',
    },
    bg: {
      'default': 'transparent',
      active: useColorModeValue('orange.50', 'gray.800'),
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('orange.50', 'gray.800'),
    },
  };
}
