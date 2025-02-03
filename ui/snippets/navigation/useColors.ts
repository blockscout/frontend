import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': 'white',
      active: 'white',
      hover: 'white',
    },
    bg: {
      'default': 'transparent',
      active: 'grey.10',
      hover: 'grey.10',
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('blue.50', 'purple.40'),
    },
  };
}
