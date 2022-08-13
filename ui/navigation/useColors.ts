import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('gray.600', 'gray.400'),
      active: useColorModeValue('blue.700', 'gray.50'),
      hover: 'blue.400',
    },
    bg: {
      'default': 'transparent',
      active: useColorModeValue('blue.50', 'gray.800'),
    },
    border: {
      'default': useColorModeValue('gray.200', 'whiteAlpha.200'),
      active: useColorModeValue('blue.50', 'gray.800'),
    },
  };
}
