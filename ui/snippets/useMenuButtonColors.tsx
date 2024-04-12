import { useColorModeValue } from '@chakra-ui/react';

export default function useMenuColors() {
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBackgroundOrange = useColorModeValue('orange.100', 'orange.900');
  const themedBorderColor = useColorModeValue('gray.300', 'gray.700');
  const themedColor = useColorModeValue('blackAlpha.800', 'gray.400');

  return { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor };
}
