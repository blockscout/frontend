import { useColorModeValue } from '@chakra-ui/react';

export default function useMenuColors() {
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBorderColor = useColorModeValue('rgba(208, 208, 209, 1)', 'rgba(107, 108, 111, 1)');
  const themedColor = useColorModeValue('blackAlpha.800', 'gray.400');

  return { themedBackground, themedBorderColor, themedColor };
}
