import type { ComponentStyleConfig } from '@chakra-ui/theme';

const Tag: ComponentStyleConfig = {
  baseStyle: {
    container: {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRadius: 'md',
    },
  },
  variants: {
    gray: {
      container: {
        bg: 'gray.200',
        color: 'gray.600',
      },
    },
  },
}

export default Tag;
