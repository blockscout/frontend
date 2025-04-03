import React from 'react';

import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'types/api/transaction';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsTableItem from './TxsTableItem';

type Props = {
  txs: Array<Transaction>;
  sort: TransactionsSortingValue;
  onSortToggle: (field: TransactionsSortingField) => void;
  top: number;
  showBlockInfo: boolean;
  showSocketInfo: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
};

const TxsTable = ({
  txs,
  sort,
  onSortToggle,
  top,
  showBlockInfo,
  showSocketInfo,
  socketInfoAlert,
  socketInfoNum,
  currentAddress,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(txs, !isLoading);
  const initialList = useInitialList({
    data: txs ?? [],
    idFn: (item) => item.hash,
    enabled: !isLoading,
  });

  const feeCurrency = config.UI.views.tx.hiddenFields?.fee_currency || config.chain.hasMultipleGasCurrencies ?
    '' :
    ' ' + currencyUnits.ether;

  return (
    <AddressHighlightProvider>
      <TableRoot minWidth="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="54px"></TableColumnHeader>
            <TableColumnHeader width="180px">Txn hash</TableColumnHeader>
            <TableColumnHeader width="160px">Type</TableColumnHeader>
            <TableColumnHeader width="20%">Method</TableColumnHeader>
            { showBlockInfo && (
              <TableColumnHeaderSortable
                width="18%"
                sortField="block_number"
                sortValue={ sort }
                onSortToggle={ onSortToggle }
              >
                Block
              </TableColumnHeaderSortable>
            ) }
            <TableColumnHeader width="224px">From/To</TableColumnHeader>
            { !config.UI.views.tx.hiddenFields?.value && (
              <TableColumnHeaderSortable
                width="20%"
                isNumeric
                sortField="value"
                sortValue={ sort }
                onSortToggle={ onSortToggle }
              >
                { `Value ${ currencyUnits.ether }` }
              </TableColumnHeaderSortable>
            ) }
            { !config.UI.views.tx.hiddenFields?.tx_fee && (
              <TableColumnHeaderSortable
                width="20%"
                isNumeric
                pr={ 5 }
                sortField="fee"
                sortValue={ sort }
                onSortToggle={ onSortToggle }
              >
                { `Fee${ feeCurrency }` }
              </TableColumnHeaderSortable>
            ) }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              alert={ socketInfoAlert }
              num={ socketInfoNum }
              isLoading={ isLoading }
            />
          ) }
          { txs.slice(0, renderedItemsNum).map((item, index) => (
            <TxsTableItem
              key={ item.hash + (isLoading ? index : '') }
              tx={ item }
              showBlockInfo={ showBlockInfo }
              currentAddress={ currentAddress }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isLoading }
              animation={ initialList.getAnimationProp(item) }
            />
          )) }
        </TableBody>
      </TableRoot>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxsTable);
