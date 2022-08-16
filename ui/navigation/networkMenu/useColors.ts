import { useColorModeValue } from '@chakra-ui/react';

export default function useColors({ hasIcon }: {hasIcon: boolean}) {
  const iconDefaultColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const iconPlaceholderDefaultColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  return {
    text: {
      'default': useColorModeValue('gray.600', 'gray.400'),
      active: useColorModeValue('gray.700', 'whiteAlpha.900'),
      hover: useColorModeValue('blue.600', 'blue.400'),
    },
    icon: {
      'default': hasIcon ? iconDefaultColor : iconPlaceholderDefaultColor,
      active: useColorModeValue('blackAlpha.900', 'whiteAlpha.900'),
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
