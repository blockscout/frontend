import { useColorModeValue } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

export default function useColors() {
  return {
    text: {
      'default': useColorModeValue('gray.600', colors.grayTrue[200]),
      active: useColorModeValue('blue.700', colors.grayTrue[50]),
      hover: 'white', //works only for dropdown menu items
    },
    bg: {
      'default': 'transparent',
      active: useColorModeValue('blue.50', colors.grayTrue[600]),
    },
    border: {
      'default': 'divider',
      active: useColorModeValue('blue.50', colors.grayTrue[700]), //'gray.800'
    },
  };
}
