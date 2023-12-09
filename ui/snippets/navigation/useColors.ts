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
      active: useColorModeValue('#E9FFF4', '#2C2C2C'),
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('blue.50', 'gray.800'),
    },
  };
}
