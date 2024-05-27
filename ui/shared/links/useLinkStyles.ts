import type { ChakraProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

export type Variants = 'subtle'

export function useLinkStyles(commonProps: ChakraProps, variant?: Variants) {
  const subtleLinkBg = useColorModeValue('gray.100', 'gray.700');

  switch (variant) {
    case 'subtle': {
      return {
        ...commonProps,
        px: '10px',
        py: '6px',
        bgColor: subtleLinkBg,
        borderRadius: 'base',
      };
    }

    default:{
      return commonProps;
    }
  }
}
