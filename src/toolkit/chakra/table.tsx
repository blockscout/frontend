// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Table as ChakraTable, Icon } from '@chakra-ui/react';
import * as React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import ArrowIcon from 'src/sprite/icons/arrows/east.svg';

import { useIsSticky } from '../hooks/useIsSticky';
import { Link } from './link';

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

export interface TableColumnHeaderSortableProps<F extends string> extends TableColumnHeaderProps {
  sortField: F;
  sortValue: string;
  onSortToggle: (sortField: F) => void;
  disabled?: boolean;
  indicatorPosition?: 'left' | 'right';
  contentAfter?: React.ReactNode;
}

export const TableColumnHeaderSortable = <F extends string>(props: TableColumnHeaderSortableProps<F>) => {
  const { sortField, sortValue, onSortToggle, children, disabled, indicatorPosition = 'left', contentAfter, ...rest } = props;

  const handleSortToggle = React.useCallback(() => {
    onSortToggle(sortField);
  }, [ onSortToggle, sortField ]);

  return (
    <TableColumnHeader { ...rest }>
      <Link onClick={ disabled ? undefined : handleSortToggle } position="relative">
        { sortValue.includes(sortField) && (
          <Icon
            w={ 4 }
            h="100%"
            transform={ sortValue.toLowerCase().includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)' }
            position="absolute"
            left={ indicatorPosition === 'left' ? -5 : undefined }
            right={ indicatorPosition === 'right' ? -5 : undefined }
            top={ 0 }
          >
            <ArrowIcon/>
          </Icon>
        ) }
        { children }
      </Link>
      { contentAfter }
    </TableColumnHeader>
  );
};

export interface TableHeaderProps extends ChakraTable.HeaderProps {
  top?: number;
}

export const TableHeaderSticky = (props: TableHeaderProps) => {
  const { top, children, ...rest } = props;

  const ref = React.useRef<HTMLTableSectionElement>(null);

  const isMobile = useIsMobile();
  const isSticky = useIsSticky(ref, top || 0, !isMobile);

  return (
    <TableHeader
      ref={ ref }
      // we assume tables on mobile cannot have sticky header due to the scrollable container
      position={{ base: 'unset', lg: 'sticky' }}
      top={{ base: 0, lg: top ? `${ top }px` : 0 }}
      backgroundColor={{ _light: 'white', _dark: 'black' }}
      boxShadow={ isSticky ? 'action_bar' : 'none' }
      zIndex="1"
      { ...rest }
    >
      { children }
    </TableHeader>
  );
};

export const TableContainerScrollable = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      overflowX={{ base: 'scroll', lg: 'unset' }}
      mx={{ base: -3, lg: 0 }}
      px={{ base: 3, lg: 0 }}
      maxW={{ base: '100vw', lg: undefined }}
    >
      { children }
    </Box>
  );
};
