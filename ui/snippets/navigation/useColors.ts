import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': '#3d3d3d',
      active: useColorModeValue('blue.700', 'gray.50'),
      hover: '#e61',
    },
    bg: {
      'default': 'transparent',
      active: '#fff5eb',
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('blue.50', 'gray.800'),
    },
  };
}
