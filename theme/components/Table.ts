import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const Table: ComponentMultiStyleConfig = {
  parts: [ 'th', 'td', 'table' ],
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
    simple: {
      th: {
        border: 0,
      },
    },
  },
}

export default Table;
