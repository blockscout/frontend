// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumnId } from '../../types/client';
import type { schemas } from '@blockscout/api-types';

import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import { GRID_TABLE_SCROLL_BOX_HEIGHT } from 'src/shared/lists/grid-table-scroll-box-height';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import type { GridTableColumn } from 'src/toolkit/chakra/grid-table';
import {
  GridTableBody,
  GridTableColumnHeader,
  GridTableHeader,
  GridTableRoot,
  GridTableRow,
  GridTableScrollBox,
} from 'src/toolkit/chakra/grid-table';

import { TOKEN_TRANSFER_COLUMNS } from '../../utils/columns';
import { getTokenTransferKey } from '../../utils/get-token-transfer-key';
import TokenTransfersTableItem from './TokenTransfersTableItem';

const CHAIN_COLUMN: GridTableColumn = { id: 'chain' };

interface Props {
  readonly columns: ReadonlyArray<TokenTransferColumnId>;
  readonly items: Array<schemas['TokenTransfer']> | undefined;
  readonly isLoading?: boolean;
  readonly resetKey?: string;
  readonly baseAddress?: string;
  readonly tokenId?: string;
  readonly instance?: schemas['TokenInstance'];
  readonly enableTimeIncrement?: boolean;
  readonly showSocketInfo?: boolean;
  readonly showSocketErrorAlert?: boolean;
  readonly socketInfoNum?: number;
}

const TokenTransfersTable = ({
  columns,
  items,
  isLoading,
  resetKey,
  baseAddress,
  tokenId,
  instance,
  enableTimeIncrement,
  showSocketInfo,
  showSocketErrorAlert,
  socketInfoNum,
}: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const { cutRef, scrollContainerRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  const getBaseKey = React.useCallback((item: schemas['TokenTransfer']) => getTokenTransferKey(item, chainData?.id), [ chainData?.id ]);
  const keys = useUniqueKeys(items, getBaseKey);

  const visibleColumns = React.useMemo(
    // Stryker disable next-line ConditionalExpression: every column id is in TOKEN_TRANSFER_COLUMNS, so find always hits; the filter narrows away undefined
    () => columns.map((id) => TOKEN_TRANSFER_COLUMNS.find((column) => column.id === id)).filter((column) => column !== undefined),
    [ columns ],
  );

  const gridColumns = React.useMemo(
    (): ReadonlyArray<GridTableColumn> => chainData ? [ CHAIN_COLUMN, ...visibleColumns ] : visibleColumns,
    [ chainData, visibleColumns ],
  );
  const columnIndexOffset = chainData ? 1 : 0;

  return (
    <AddressHighlightProvider>
      <GridTableScrollBox ref={ scrollContainerRef } maxH={ GRID_TABLE_SCROLL_BOX_HEIGHT }>
        <GridTableRoot columns={ gridColumns }>
          <GridTableHeader>
            <GridTableRow>
              { chainData && <GridTableColumnHeader columnIndex={ 0 }/> }
              { visibleColumns.map((column, index) => (
                <GridTableColumnHeader key={ column.id } columnIndex={ index + columnIndexOffset }>
                  { column.name }
                  { column.id === 'timestamp' && <TimeFormatToggle/> }
                </GridTableColumnHeader>
              )) }
            </GridTableRow>
          </GridTableHeader>
          <GridTableBody>
            { showSocketInfo && (
              <SocketNewItemsNotice.Grid
                showErrorAlert={ showSocketErrorAlert }
                num={ socketInfoNum }
                type="token_transfer"
                isLoading={ isLoading }
              />
            ) }
            { items?.slice(0, renderedItemsNum).map((item, index) => (
              <TokenTransfersTableItem
                key={ keys[index] }
                item={ item }
                columns={ visibleColumns }
                chainData={ chainData }
                isLoading={ isLoading }
                baseAddress={ baseAddress }
                tokenId={ tokenId }
                instance={ instance }
                enableTimeIncrement={ enableTimeIncrement }
              />
            )) }
          </GridTableBody>
        </GridTableRoot>
        <div ref={ cutRef }/>
      </GridTableScrollBox>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransfersTable);
