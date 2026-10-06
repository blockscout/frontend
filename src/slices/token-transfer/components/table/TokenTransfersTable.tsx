// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumnId, TokenTransferSurface } from '../../types/client';
import type { schemas } from '@blockscout/api-types';

import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableContainerScrollable, TableHeader, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import { getAvailableColumns } from '../../utils/columns';
import { getTokenTransferKey } from '../../utils/get-token-transfer-key';
import TokenTransfersTableItem from './TokenTransfersTableItem';

interface Props {
  readonly surface: TokenTransferSurface;
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
  surface,
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

  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  const visibleColumns = React.useMemo(() => {
    const availableColumns = getAvailableColumns(surface);
    return columns
      .map((id) => availableColumns.find((column) => column.id === id))
      .filter((column) => column !== undefined);
  }, [ surface, columns ]);

  return (
    <AddressHighlightProvider>
      <TableContainerScrollable onlyMobile={ false }>

        <TableRoot minW={{ lg: '700px' }}>
          <TableHeader>
            <TableRow>
              { chainData && <TableColumnHeader width="38px"/> }
              { visibleColumns.map((column) => (
                <TableColumnHeader key={ column.id } isNumeric={ column.isNumeric } whiteSpace="nowrap" w={ column.width }>
                  { column.name }
                  { column.id === 'timestamp' && <TimeFormatToggle/> }
                </TableColumnHeader>
              )) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { showSocketInfo && (
              <SocketNewItemsNotice.Desktop
                colSpan={ visibleColumns.length + (chainData ? 1 : 0) }
                showErrorAlert={ showSocketErrorAlert }
                num={ socketInfoNum }
                type="token_transfer"
                isLoading={ isLoading }
              />
            ) }
            { items?.slice(0, renderedItemsNum).map((item, index) => (
              <TokenTransfersTableItem
                key={ getTokenTransferKey(item) + (isLoading ? index : '') + (chainData ? chainData.id : '') }
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
          </TableBody>
        </TableRoot>
        <div ref={ cutRef }/>
      </TableContainerScrollable>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransfersTable);
