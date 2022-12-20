import { tagAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

import getDefaultTransitionProps from '../../utils/getDefaultTransitionProps';
import Badge from '../Badge';
const transitionProps = getDefaultTransitionProps();

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const variants = {
  subtle: definePartsStyle((props) => ({
    container: Badge.variants?.subtle(props),
  })),
};

const sizes = {
  md: definePartsStyle({
    container: {
      minH: 6,
      minW: 6,
      fontSize: 'sm',
      px: 2,
      py: '2px',
      lineHeight: 5,
    },
  }),
};

const baseStyleContainer = defineStyle({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  borderRadius: 'sm',
  ...transitionProps,
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
});

const Tag = defineMultiStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    size: 'md',
    variant: 'subtle',
    colorScheme: 'gray',
  },
});

export default Tag;
