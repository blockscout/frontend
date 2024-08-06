import { useColorModeValue } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('gray.600', colors.grayTrue[200]),
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
