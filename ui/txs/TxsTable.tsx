import { Link, Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { FaRegCircleQuestion } from 'react-icons/fa6';

import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'types/api/transaction';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
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
}

const TxsTable = ({
  txs,
  sort,
  sorting,
  top,
  showBlockInfo,
  currentAddress,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(txs, !isLoading);

  return (
    <AddressHighlightProvider>
      <Table variant="simple" minWidth="950px" size="xs">
        <TheadSticky top={ top }>
          <Tr>
            <Th width="54px" pl={ 4 }><FaRegCircleQuestion/></Th>
            <Th width="180px">Txn hash</Th>
            <Th width="160px">Type</Th>
            <Th width="20%">Method</Th>
            { showBlockInfo && <Th width="18%">Block</Th> }
            <Th width="224px">From</Th>
            <Th width="224px">To</Th>
            { !config.UI.views.tx.hiddenFields?.value && (
              <Th width="20%" isNumeric>
                <Link
                  onClick={ sort('value') }
                  display="flex"
                  justifyContent="end"
                  color="blackAlpha.700"
                >
                  { sorting === 'value-asc' && (
                    <IconSvg
                      boxSize={ 5 }
                      name="arrows/east"
                      transform="rotate(-90deg)"
                    />
                  ) }
                  { sorting === 'value-desc' && (
                    <IconSvg
                      boxSize={ 5 }
                      name="arrows/east"
                      transform="rotate(90deg)"
                    />
                  ) }
                  { `Value ${ currencyUnits.ether }` }
                </Link>
              </Th>
            ) }
            { !config.UI.views.tx.hiddenFields?.tx_fee && (
              <Th width="20%" isNumeric pr={ 5 }>
                <Link
                  onClick={ sort('fee') }
                  display="flex"
                  justifyContent="end"
                  color="blackAlpha.700"
                >
                  { sorting === 'fee-asc' && (
                    <IconSvg
                      boxSize={ 5 }
                      name="arrows/east"
                      transform="rotate(-90deg)"
                    />
                  ) }
                  { sorting === 'fee-desc' && (
                    <IconSvg
                      boxSize={ 5 }
                      name="arrows/east"
                      transform="rotate(90deg)"
                    />
                  ) }
                  { `Fee${
                    config.UI.views.tx.hiddenFields?.fee_currency ?
                      '' :
                      ` ${ currencyUnits.ether }`
                  }` }
                </Link>
              </Th>
            ) }
          </Tr>
        </TheadSticky>
        <Tbody>
          { /* { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              alert={ socketInfoAlert }
              num={ socketInfoNum }
              isLoading={ isLoading }
            />
          ) } */ }
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
