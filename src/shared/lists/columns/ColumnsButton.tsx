// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import type { ColumnVisibility, TableColumn } from './types';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from 'src/toolkit/chakra/drawer';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

import ColumnListStatic from './ColumnListStatic';

const ColumnListContext = React.createContext<ReadonlyArray<TableColumn>>([]);

const ColumnListLoading = () => <ColumnListStatic columns={ React.useContext(ColumnListContext) }/>;

const ColumnListSortable = dynamic(() => import('./ColumnListSortable'), { ssr: false, loading: ColumnListLoading });

interface Props<TColumnId extends string> {
  readonly tableColumns: ReadonlyArray<TableColumn<TColumnId>>;
  readonly columns: ColumnVisibility<TColumnId>;
  readonly onChange: (checkedColumns: ColumnVisibility<TColumnId>) => void;
  readonly onOrderChange: (ids: Array<TColumnId>, movedId: TColumnId) => void;
  readonly selected?: boolean;
  readonly onReset?: () => void;
  readonly isLoading?: boolean;
}

const ColumnsButton = <TColumnId extends string>({
  tableColumns,
  columns,
  onChange,
  onOrderChange,
  selected,
  onReset,
  isLoading,
}: Props<TColumnId>) => {

  const isMobile = useIsMobile();

  const handleValueChange = React.useCallback((value: Array<string>) => {
    const checkedColumns: ColumnVisibility<TColumnId> = {};
    tableColumns.forEach(({ id }) => {
      checkedColumns[id] = value.includes(id);
    });
    onChange(checkedColumns);
  }, [ tableColumns, onChange ]);

  const handleMove = React.useCallback((fromIndex: number, toIndex: number) => {
    const ids = tableColumns.map(({ id }) => id);
    const [ movedId ] = ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, movedId);
    onOrderChange(ids, movedId);
  }, [ tableColumns, onOrderChange ]);

  const value = React.useMemo(() => tableColumns.filter(({ id }) => columns[id]).map(({ id }) => id), [ tableColumns, columns ]);

  const resetButton = onReset && (
    <Button
      variant="link"
      onClick={ onReset }
      disabled={ !selected }
      textStyle="sm"
    >
      Reset
    </Button>
  );

  const checkboxes = (
    <CheckboxGroup value={ value } onValueChange={ handleValueChange } gap={ 2 } w={{ base: 'full', lg: '200px' }}>
      <ColumnListContext.Provider value={ tableColumns }>
        <ColumnListSortable columns={ tableColumns } onMove={ handleMove }/>
      </ColumnListContext.Provider>
    </CheckboxGroup>
  );

  const trigger = (
    <IconButton
      variant="dropdown"
      size="md"
      aria-label="Columns"
      selected={ selected }
      loadingSkeleton={ isLoading }
    >
      <SpriteIcon name="columns"/>
    </IconButton>
  );

  if (isMobile) {
    return (
      <DrawerRoot placement="bottom">
        <DrawerTrigger>
          { trigger }
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Flex justifyContent="space-between">
                Columns
                { resetButton }
              </Flex>
            </DrawerTitle>
            <DrawerCloseTrigger/>
          </DrawerHeader>
          <DrawerBody>
            { checkboxes }
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <PopoverRoot>
      <PopoverTrigger>
        { trigger }
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Flex justifyContent="space-between" textStyle="sm" mb={ 3 }>
            <Box fontWeight={ 600 } color="text.secondary">Columns</Box>
            { resetButton }
          </Flex>
          { checkboxes }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default ColumnsButton;
