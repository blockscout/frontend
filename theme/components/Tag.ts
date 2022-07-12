import type { tagAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';
import type { PartsStyleFunction } from '@chakra-ui/theme-tools';

const variantGray: PartsStyleFunction<typeof parts> = (props) => {
  return {
    container: {
      bg: mode('gray.200', 'gray.600')(props),
      color: mode('gray.600', 'gray.50')(props),
    },
  }
}

const variants = {
  gray: variantGray,
}

const Tag: ComponentStyleConfig = {
  baseStyle: {
    container: {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRadius: 'md',
    },
  },
  variants,
}

export default Tag;
