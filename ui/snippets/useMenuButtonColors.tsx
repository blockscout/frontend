import { useColorModeValue } from '@chakra-ui/react';

export default function useMenuColors() {
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBorderColor = useColorModeValue('gray.300', 'gray.700');
  const themedColor = useColorModeValue('blackAlpha.800', 'gray.400');

  return { themedBackground, themedBorderColor, themedColor };
}
