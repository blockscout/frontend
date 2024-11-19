import { Link, Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'types/api/transaction';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TheadSticky from 'ui/shared/TheadSticky';

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

  const feeCurrency = config.UI.views.tx.hiddenFields?.fee_currency || config.chain.hasMultipleGasCurrencies ?
    '' :
    ' ' + currencyUnits.ether;

  return (
    <AddressHighlightProvider>
      <Table minWidth="950px">
        <TheadSticky top={ top }>
          <Tr>
            <Th width="54px"></Th>
            <Th width="180px">Txn hash</Th>
            <Th width="160px">Type</Th>
            <Th width="20%">Method</Th>
            { showBlockInfo && <Th width="18%">Block</Th> }
            <Th width="224px">From/To</Th>
            { !config.UI.views.tx.hiddenFields?.value && (
              <Th width="20%" isNumeric>
                <Link onClick={ sort('value') } display="flex" justifyContent="end">
                  { sorting === 'value-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                  { sorting === 'value-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                  { `Value ${ currencyUnits.ether }` }
                </Link>
              </Th>
            ) }
            { !config.UI.views.tx.hiddenFields?.tx_fee && (
              <Th width="20%" isNumeric pr={ 5 }>
                <Link onClick={ sort('fee') } display="flex" justifyContent="end">
                  { sorting === 'fee-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                  { sorting === 'fee-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                  { `Fee${ feeCurrency }` }
                </Link>
              </Th>
            ) }
          </Tr>
        </TheadSticky>
        <Tbody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              alert={ socketInfoAlert }
              num={ socketInfoNum }
              isLoading={ isLoading }
            />
          ) }
          <AnimatePresence initial={ false }>
            { txs.slice(0, renderedItemsNum).map((item, index) => (
              <TxsTableItem
                key={ item.hash + (isLoading ? index : '') }
                tx={ item }
                showBlockInfo={ showBlockInfo }
                currentAddress={ currentAddress }
                enableTimeIncrement={ enableTimeIncrement }
                isLoading={ isLoading }
              />
            )) }
          </AnimatePresence>
        </Tbody>
      </Table>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxsTable);
