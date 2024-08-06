import type { ChakraProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

import colors from 'theme/foundations/colors';

export type Variants = 'subtle'

export function useLinkStyles(commonProps: ChakraProps, variant?: Variants) {
  const subtleLinkBg = useColorModeValue('gray.100', colors.grayTrue[800]);

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
