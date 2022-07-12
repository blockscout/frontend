import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('gray.600', 'gray.300'),
      active: useColorModeValue('blue.700', 'gray.300'),
      hover: 'blue.400',
    },
    bg: {
      'default': 'transparent',
      active: useColorModeValue('blue.50', 'whiteAlpha.200'),
    },
  }
}
