import type { tabsAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type {
  PartsStyleFunction,
} from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const variantSoftRounded: PartsStyleFunction<typeof parts> = (props) => {
  return {
    tab: {
      borderRadius: 'base',
      fontWeight: '600',
      color: mode('blue.700', 'gray.400')(props),
      _selected: {
        color: mode('blue.700', 'gray.50')(props),
        bg: mode('blue.50', 'gray.800')(props),
        _hover: {
          color: mode('blue.700', 'gray.50')(props),
        },
      },
      _hover: {
        color: 'blue.400',
      },
    },
  };
};

const Tabs: ComponentStyleConfig = {
  variants: {
    'soft-rounded': variantSoftRounded,
  },
};

export default Tabs;
