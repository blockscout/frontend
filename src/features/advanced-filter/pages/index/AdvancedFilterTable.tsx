// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  Box,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterParams } from '../../types/api';
import type { TxTableColumn } from '../../types/client';
import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import FilterByColumn from '../../components/FilterByColumn';
import ItemByColumn from '../../components/ItemByColumn';

type Props = {
  items: Array<schemas['AdvancedFilterItem']>;
  columns: Array<TxTableColumn>;
  filters: AdvancedFilterParams;
  searchParams?: schemas['AdvancedFilterSearchParams'];
  handleFilterChange: <T extends keyof AdvancedFilterParams>(field: T, val: AdvancedFilterParams[T]) => void;
  isLoading?: boolean;
  resetKey?: string;
};

const AdvancedFilterTable = ({
  items,
  columns,
  filters,
  searchParams,
  handleFilterChange,
  isLoading,
  resetKey,
}: Props) => {
  const multichainContext = useMultichainContext();
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <Box maxW="100%" display="grid" overflowX="scroll" whiteSpace="nowrap">
        <TableRoot tableLayout="fixed" minWidth="950px" w="100%">
          <TableHeaderSticky>
            <TableRow>
              { multichainContext?.chain && <TableColumnHeader width="38px"/> }
              { columns.map(column => {
                return (
                  <TableColumnHeader
                    key={ column.id }
                    isNumeric={ column.isNumeric }
                    minW={ column.width }
                    w={ column.width }
                    wordBreak="break-word"
                    whiteSpace="normal"
                  >
                    { Boolean(column.name) && (
                      <chakra.span mr={ 2 } lineHeight="24px" verticalAlign="middle">
                        { column.id === 'age' ? 'Timestamp' : column.name }
                      </chakra.span>
                    ) }
                    <FilterByColumn
                      column={ column.id }
                      columnName={ column.name }
                      handleFilterChange={ handleFilterChange }
                      filters={ filters }
                      searchParams={ searchParams }
                      isLoading={ isLoading }
                    />
                    { column.id === 'age' && <TimeFormatToggle ml={ 1 } verticalAlign="middle"/> }
                  </TableColumnHeader>
                );
              }) }
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { items.slice(0, renderedItemsNum).map((item, index) => (
              <TableRow key={ item.hash + String(index) }>
                { multichainContext?.chain && (
                  <TableCell>
                    <ChainIcon data={ multichainContext.chain } isLoading={ isLoading }/>
                  </TableCell>
                ) }
                { columns.map(column => {
                  const textAlign = (() => {
                    if (column.id === 'or_and') {
                      return 'center';
                    }
                    if (column.isNumeric) {
                      return 'right';
                    }
                    return 'start';
                  })();

                  return (
                    <TableCell
                      key={ item.hash + column.id }
                      isNumeric={ column.isNumeric }
                      minW={ column.width }
                      maxW={ column.width }
                      w={ column.width }
                      wordBreak="break-word"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textAlign={ textAlign }
                    >
                      <ItemByColumn
                        item={ item }
                        column={ column.id }
                        isLoading={ isLoading }
                        chainConfig={ multichainContext?.chain?.app_config }
                      />
                    </TableCell>
                  );
                }) }
              </TableRow>
            )) }
            <TableRow ref={ cutRef }/>
          </TableBody>
        </TableRoot>
      </Box>
    </AddressHighlightProvider>
  );
};

export default AdvancedFilterTable;
