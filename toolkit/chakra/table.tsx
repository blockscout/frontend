import { Table as ChakraTable } from '@chakra-ui/react';
import { throttle } from 'es-toolkit';
import * as React from 'react';

export const TableRoot = ChakraTable.Root;
export const TableBody = ChakraTable.Body;
export const TableHeader = ChakraTable.Header;
export const TableRow = ChakraTable.Row;

export interface TableCellProps extends ChakraTable.CellProps {
  isNumeric?: boolean;
}

export const TableCell = (props: TableCellProps) => {
  const { isNumeric, ...rest } = props;

  return <ChakraTable.Cell textAlign={ isNumeric ? 'right' : undefined } { ...rest }/>;
};

export interface TableColumnHeaderProps extends ChakraTable.ColumnHeaderProps {
  isNumeric?: boolean;
}

export const TableColumnHeader = (props: TableColumnHeaderProps) => {
  const { isNumeric, ...rest } = props;

  return <ChakraTable.ColumnHeader textAlign={ isNumeric ? 'right' : undefined } { ...rest }/>;
};

export interface TableHeaderProps extends ChakraTable.HeaderProps {
  top?: number;
}

export const TableHeaderSticky = (props: TableHeaderProps) => {
  const { top, children, ...rest } = props;

  const ref = React.useRef<HTMLTableSectionElement>(null);
  const [ isStuck, setIsStuck ] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    if (Number(ref.current?.getBoundingClientRect().y) <= (top || 0)) {
      setIsStuck(true);
    } else {
      setIsStuck(false);
    }
  }, [ top ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [ handleScroll ]);

  return (
    <TableHeader
      ref={ ref }
      position="sticky"
      top={ top ? `${ top }px` : 0 }
      backgroundColor={{ _light: 'white', _dark: 'black' }}
      boxShadow={ isStuck ? 'action_bar' : 'none' }
      zIndex="1"
      { ...rest }
    >
      { children }
    </TableHeader>
  );
};
