import { useColorModeValue } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

export default function useMenuColors() {
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBackgroundOrange = useColorModeValue('orange.100', colors.orangeDark[300]); //'orange.900');
  const themedBorderColor = useColorModeValue('gray.300', colors.grayTrue[500]); //'gray.700');
  const themedColor = useColorModeValue('blackAlpha.800', colors.grayTrue[200]); //'gray.400');

  return { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor };
}
