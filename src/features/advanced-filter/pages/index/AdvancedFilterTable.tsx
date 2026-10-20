// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterParams } from '../../types/api';
import type { TxTableColumn } from '../../types/client';
import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import { GRID_TABLE_SCROLL_BOX_HEIGHT } from 'src/shared/lists/grid-table-scroll-box-height';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import type { GridTableColumn } from 'src/toolkit/chakra/grid-table';
import {
  GridTableBody,
  GridTableCell,
  GridTableColumnHeader,
  GridTableHeader,
  GridTableRoot,
  GridTableRow,
  GridTableScrollBox,
} from 'src/toolkit/chakra/grid-table';

import FilterByColumn from '../../components/FilterByColumn';
import ItemByColumn from '../../components/ItemByColumn';

const CHAIN_COLUMN: GridTableColumn = { id: 'chain' };
// the grid primitives set their own alignment props, so passing `undefined` for other columns would wipe the numeric one
const CENTERED_HEADER_PROPS = { justifyContent: 'center' } as const;
const CENTERED_CELL_PROPS = { justifyItems: 'center' } as const;

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
  const chainData = multichainContext?.chain;
  const { cutRef, scrollContainerRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  const gridColumns = React.useMemo(
    (): ReadonlyArray<GridTableColumn> => chainData ? [ CHAIN_COLUMN, ...columns ] : columns,
    [ chainData, columns ],
  );
  const columnIndexOffset = chainData ? 1 : 0;

  return (
    <AddressHighlightProvider>
      <GridTableScrollBox ref={ scrollContainerRef } maxH={ GRID_TABLE_SCROLL_BOX_HEIGHT }>
        <GridTableRoot columns={ gridColumns }>
          <GridTableHeader>
            <GridTableRow>
              { chainData && <GridTableColumnHeader columnIndex={ 0 }/> }
              { columns.map((column, index) => (
                <GridTableColumnHeader
                  key={ column.id }
                  columnIndex={ index + columnIndexOffset }
                  { ...(column.id === 'or_and' ? CENTERED_HEADER_PROPS : {}) }
                >
                  { Boolean(column.name) && (
                    <chakra.span mr={ column.noFilter ? 0 : 2 }>
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
                  { column.id === 'age' && <TimeFormatToggle ml={ 1 }/> }
                </GridTableColumnHeader>
              )) }
            </GridTableRow>
          </GridTableHeader>
          <GridTableBody>
            { items.slice(0, renderedItemsNum).map((item, index) => (
              <GridTableRow key={ item.hash + String(index) }>
                { chainData && (
                  <GridTableCell columnIndex={ 0 }>
                    <ChainIcon data={ chainData } isLoading={ isLoading }/>
                  </GridTableCell>
                ) }
                { columns.map((column, columnIndex) => (
                  <GridTableCell
                    key={ column.id }
                    columnIndex={ columnIndex + columnIndexOffset }
                    { ...(column.id === 'or_and' ? CENTERED_CELL_PROPS : {}) }
                  >
                    <ItemByColumn
                      item={ item }
                      column={ column.id }
                      isLoading={ isLoading }
                      chainConfig={ chainData?.app_config }
                    />
                  </GridTableCell>
                )) }
              </GridTableRow>
            )) }
          </GridTableBody>
        </GridTableRoot>
        <div ref={ cutRef }/>
      </GridTableScrollBox>
    </AddressHighlightProvider>
  );
};

export default AdvancedFilterTable;
