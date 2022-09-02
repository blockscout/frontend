import { tagAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

import getDefaultTransitionProps from '../utils/getDefaultTransitionProps';

const variantGray = definePartsStyle((props) => {
  const transitionProps = getDefaultTransitionProps();

  return {
    container: {
      bg: mode('blackAlpha.100', 'whiteAlpha.400')(props),
      color: mode('gray.600', 'gray.50')(props),
      ...transitionProps,
    },
  };
});

const variants = {
  gray: variantGray,
};

const baseStyleContainer = defineStyle({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderRadius: 'sm',
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
});

const Tag = defineMultiStyleConfig({
  baseStyle,
  variants,
});

export default Tag;
