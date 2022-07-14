import type { tableAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';
import type { PartsStyleFunction } from '@chakra-ui/theme-tools';

const variantSimple: PartsStyleFunction<typeof parts> = (props) => {
  return {
    th: {
      border: 0,
      color: mode('gray.500', 'gray.50')(props),
    },
    thead: {
      backgroundColor: mode('gray.50', 'whiteAlpha.100')(props),
    },
    td: {
      borderColor: mode('gray.200', 'whiteAlpha.200')(props),
    },
  }
}

const Table: ComponentMultiStyleConfig = {
  parts: [ 'th', 'td', 'table', 'thead' ],
  baseStyle: {
    thead: {
      backgroundColor: 'gray.50',
    },
    th: {
      textTransform: 'none',
      fontFamily: 'body',
      fontWeight: 'normal',
      overflow: 'hidden',
      color: 'gray.500',
      letterSpacing: 'none',
    },
    td: {
      fontSize: 'md',
      verticalAlign: 'top',
    },
    table: {
      tableLayout: 'fixed',
      borderTopLeftRadius: 'md',
      borderTopRightRadius: 'md',
      overflow: 'hidden',
      fontVariant: 'normal',
    },
  },
  sizes: {
    md: {
      th: {
        px: 4,
        fontSize: 'sm',
      },
      td: {
        px: 4,
        py: 6,
      },
    },
  },
  variants: {
    simple: variantSimple,
  },
}

export default Table;
