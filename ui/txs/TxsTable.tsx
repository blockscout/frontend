import React from 'react';

import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'types/api/transaction';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import IconSvg from 'ui/shared/IconSvg';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsTableItem from './TxsTableItem';

type Props = {
  txs: Array<Transaction>;
  sort: (field: TransactionsSortingField) => () => void;
  sorting?: TransactionsSortingValue;
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
  sorting,
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
              <TableColumnHeader width="18%">
                <Link onClick={ isLoading ? undefined : sort('block_number') } display="flex" alignItems="center">
                  { sorting === 'block_number-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                  { sorting === 'block_number-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                  Block
                </Link>
              </TableColumnHeader>
            ) }
            <TableColumnHeader width="224px">From/To</TableColumnHeader>
            { !config.UI.views.tx.hiddenFields?.value && (
              <TableColumnHeader width="20%" isNumeric>
                <Link onClick={ isLoading ? undefined : sort('value') } display="flex" alignItems="center" justifyContent="end">
                  { sorting === 'value-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                  { sorting === 'value-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                  { `Value ${ currencyUnits.ether }` }
                </Link>
              </TableColumnHeader>
            ) }
            { !config.UI.views.tx.hiddenFields?.tx_fee && (
              <TableColumnHeader width="20%" isNumeric pr={ 5 }>
                <Link onClick={ isLoading ? undefined : sort('fee') } display="flex" alignItems="center" justifyContent="end">
                  { sorting === 'fee-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                  { sorting === 'fee-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                  { `Fee${ feeCurrency }` }
                </Link>
              </TableColumnHeader>
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
