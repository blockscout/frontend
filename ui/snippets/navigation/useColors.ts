import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('#171717', '#FAFAFA'),
      active: 'accent',
      hover: 'accent',
    },
    bg: {
      'default': 'transparent',
      active: useColorModeValue('blue.50', 'gray.800'),
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('blue.50', 'gray.800'),
    },
  };
}
