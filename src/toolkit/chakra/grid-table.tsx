// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps, SystemStyleObject } from '@chakra-ui/react';
import { Box, useSlotRecipe } from '@chakra-ui/react';
import * as React from 'react';

import type { GridTableColumn } from '../utils/gridTableColumns';
import { getGridTemplateColumns } from '../utils/gridTableColumns';

export type { GridTableColumn } from '../utils/gridTableColumns';

const EMPTY_COLUMNS: ReadonlyArray<GridTableColumn> = [];

const GridTableContext = React.createContext<ReadonlyArray<GridTableColumn>>(EMPTY_COLUMNS);

const GridTableScrolledContext = React.createContext(false);

const useGridTableStyles = () => {
  const recipe = useSlotRecipe({ key: 'table' });
  return React.useMemo(() => recipe({}), [ recipe ]);
};

const useColumnPosition = (columnIndex: number) => {
  const columns = React.useContext(GridTableContext);
  return {
    isFirst: columnIndex === 0,
    isLast: columnIndex === columns.length - 1,
    isNumeric: columns[columnIndex]?.isNumeric ?? false,
  };
};

const useEdgeStyles = (slot: SystemStyleObject | undefined, isFirst: boolean, isLast: boolean): Array<SystemStyleObject> => {
  return React.useMemo(() => {
    const { _first, _last, ...base } = slot ?? {};
    return [ base, isFirst ? _first : undefined, isLast ? _last : undefined ].filter((style) => style !== undefined);
  }, [ slot, isFirst, isLast ]);
};

export const GridTableScrollBox = React.forwardRef<HTMLDivElement, BoxProps>(
  function GridTableScrollBox({ maxH = '70vh', onScroll, children, ...rest }, ref) {
    const [ isScrolled, setIsScrolled ] = React.useState(false);

    const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
      setIsScrolled(event.currentTarget.scrollTop > 0);
      onScroll?.(event);
    }, [ onScroll ]);

    return (
      <GridTableScrolledContext.Provider value={ isScrolled }>
        <Box
          ref={ ref }
          overflow="auto"
          maxH={ maxH }
          mx={{ base: -3, lg: 0 }}
          px={{ base: 3, lg: 0 }}
          contain="inline-size"
          onScroll={ handleScroll }
          { ...rest }
        >
          { children }
        </Box>
      </GridTableScrolledContext.Provider>
    );
  },
);

export interface GridTableRootProps extends Omit<BoxProps, 'columns'> {
  columns: ReadonlyArray<GridTableColumn>;
}

export const GridTableRoot = ({ columns, children, ...rest }: GridTableRootProps) => {
  const styles = useGridTableStyles();
  const gridTemplateColumns = React.useMemo(() => getGridTemplateColumns(columns), [ columns ]);

  return (
    <GridTableContext.Provider value={ columns }>
      <Box
        role="table"
        css={ styles.root }
        display="grid"
        w="max-content"
        minW="100%"
        alignItems="center"
        gridTemplateColumns={ gridTemplateColumns }
        { ...rest }
      >
        { children }
      </Box>
    </GridTableContext.Provider>
  );
};

export const GridTableHeader = (props: BoxProps) => <Box role="rowgroup" display="contents" { ...props }/>;

export const GridTableBody = (props: BoxProps) => <Box role="rowgroup" display="contents" { ...props }/>;

export const GridTableRow = (props: BoxProps) => {
  const styles = useGridTableStyles();
  return <Box role="row" css={ styles.row } display="contents" { ...props }/>;
};

export interface GridTableColumnHeaderProps extends BoxProps {
  columnIndex: number;
}

export const GridTableColumnHeader = ({ columnIndex, ...rest }: GridTableColumnHeaderProps) => {
  const styles = useGridTableStyles();
  const { isFirst, isLast, isNumeric } = useColumnPosition(columnIndex);
  const isScrolled = React.useContext(GridTableScrolledContext);
  const css = useEdgeStyles(styles.columnHeader, isFirst, isLast);

  return (
    <Box
      role="columnheader"
      css={ css }
      position="sticky"
      top={ 0 }
      zIndex="docked"
      whiteSpace="nowrap"
      bg="bg.primary"
      bgImage="linear-gradient({colors.table.header.bg}, {colors.table.header.bg})"
      boxShadow={ isScrolled ? 'action_bar' : 'none' }
      clipPath="inset(0 0 -8px 0)"
      transitionProperty="box-shadow"
      transitionDuration="normal"
      textAlign={ isNumeric ? 'right' : undefined }
      { ...rest }
    />
  );
};

export interface GridTableCellProps extends BoxProps {
  columnIndex: number;
}

export const GridTableCell = ({ columnIndex, ...rest }: GridTableCellProps) => {
  const styles = useGridTableStyles();
  const { isFirst, isLast, isNumeric } = useColumnPosition(columnIndex);
  const css = useEdgeStyles(styles.cell, isFirst, isLast);

  return (
    <Box
      role="cell"
      css={ css }
      display="grid"
      // the implicit auto track would grow to the content's min-content width and push it past a capped column
      gridTemplateColumns="minmax(0, 1fr)"
      alignItems="center"
      alignSelf="stretch"
      minW={ 0 }
      justifyItems={ isNumeric ? 'end' : undefined }
      textAlign={ isNumeric ? 'right' : undefined }
      { ...rest }
    />
  );
};

export const GridTableFullWidthRow = ({ children, ...rest }: BoxProps) => {
  const styles = useGridTableStyles();
  const css = useEdgeStyles(styles.cell, true, true);

  return (
    <GridTableRow>
      <Box role="cell" css={ css } gridColumn="1 / -1" { ...rest }>
        { children }
      </Box>
    </GridTableRow>
  );
};
