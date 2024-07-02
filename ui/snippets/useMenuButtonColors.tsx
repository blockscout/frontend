import { useColorModeValue } from '@chakra-ui/react';

export default function useMenuColors() {
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBackgroundOrange = useColorModeValue('orange.100', 'orange.900');
  const themedBorderColor = useColorModeValue('brand.600', 'brand.600');
  const themedColor = useColorModeValue('blackAlpha.900', 'white');

  return { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor };
}
