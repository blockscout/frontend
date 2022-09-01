import { tabsAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variantSoftRounded = definePartsStyle((props) => {
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
});

const variants = {
  'soft-rounded': variantSoftRounded,
};

const Tabs = defineMultiStyleConfig({
  variants,
});

export default Tabs;
