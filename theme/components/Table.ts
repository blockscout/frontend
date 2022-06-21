import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const firstLastStyle = {
  _first: { paddingLeft: 0 },
  _last: { paddingRight: 0 },
}

const Table: ComponentMultiStyleConfig = {
  parts: [ 'th', 'td', 'table' ],
  baseStyle: {
    th: {
      ...firstLastStyle,
      textTransform: 'none',
      fontWeight: 'normal',
    },
    td: {
      ...firstLastStyle,
      fontSize: 'md',
      verticalAlign: 'top',
    },
    table: {
      tableLayout: 'fixed',
    },
  },
}

export default Table;
