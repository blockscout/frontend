import type { ChakraProps } from '@chakra-ui/react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

export type Variants = 'subtle';

// TODO @tom2drum remove this
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
