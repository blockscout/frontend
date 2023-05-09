import { Link, Table, Tbody, Tr, Th, Td, Icon } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TheadSticky from 'ui/shared/TheadSticky';

import TxsTableItem from './TxsTableItem';

type Props = {
  txs: Array<Transaction>;
  sort: (field: 'val' | 'fee') => () => void;
  sorting?: Sort;
  top: number;
  showBlockInfo: boolean;
  showSocketInfo: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
}

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
}: Props) => {
  return (
    <Table variant="simple" minWidth="950px" size="xs">
      <TheadSticky top={ top }>
        <Tr>
          <Th width="54px"></Th>
          <Th width="22%">Txn hash</Th>
          <Th width="160px">Type</Th>
          <Th width="20%">Method</Th>
          { showBlockInfo && <Th width="18%">Block</Th> }
          <Th width={{ xl: '152px', base: '86px' }}>From</Th>
          <Th width={{ xl: currentAddress ? '48px' : '36px', base: currentAddress ? '52px' : '28px' }}></Th>
          <Th width={{ xl: '152px', base: '86px' }}>To</Th>
          <Th width="20%" isNumeric>
            <Link onClick={ sort('val') } display="flex" justifyContent="end">
              { sorting === 'val-asc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(-90deg)"/> }
              { sorting === 'val-desc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(90deg)"/> }
              { `Value ${ appConfig.network.currency.symbol }` }
            </Link>
          </Th>
          <Th width="20%" isNumeric pr={ 5 }>
            <Link onClick={ sort('fee') } display="flex" justifyContent="end">
              { sorting === 'fee-asc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(-90deg)"/> }
              { sorting === 'fee-desc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(90deg)"/> }
              { `Fee ${ appConfig.network.currency.symbol }` }
            </Link>
          </Th>
        </Tr>
      </TheadSticky>
      <Tbody>
        { showSocketInfo && (
          <SocketNewItemsNotice borderRadius={ 0 } url={ window.location.href } alert={ socketInfoAlert } num={ socketInfoNum }>
            { ({ content }) => <Tr><Td colSpan={ 10 } p={ 0 }>{ content }</Td></Tr> }
          </SocketNewItemsNotice>
        ) }
        <AnimatePresence initial={ false }>
          { txs.map((item) => (
            <TxsTableItem
              key={ item.hash }
              tx={ item }
              showBlockInfo={ showBlockInfo }
              currentAddress={ currentAddress }
              enableTimeIncrement={ enableTimeIncrement }
            />
          )) }
        </AnimatePresence>
      </Tbody>
    </Table>
  );
};

export default React.memo(TxsTable);
