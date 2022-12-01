import { Link, Table, Tbody, Tr, Th, Td, Icon } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import TheadSticky from 'ui/shared/TheadSticky';

import TxsNewItemNotice from './TxsNewItemNotice';
import TxsTableItem from './TxsTableItem';

type Props = {
  txs: Array<Transaction>;
  sort: (field: 'val' | 'fee') => () => void;
  sorting?: Sort;
  top: number;
  showBlockInfo: boolean;
  showSocketInfo: boolean;
}

const TxsTable = ({ txs, sort, sorting, top, showBlockInfo, showSocketInfo }: Props) => {
  return (
    <Table variant="simple" minWidth="950px" size="xs">
      <TheadSticky top={ top }>
        <Tr>
          <Th width="54px"></Th>
          <Th width="20%">Type</Th>
          <Th width="18%">Txn hash</Th>
          <Th width="15%">Method</Th>
          { showBlockInfo && <Th width="11%">Block</Th> }
          <Th width={{ xl: '128px', base: '66px' }}>From</Th>
          <Th width={{ xl: '36px', base: '0' }}></Th>
          <Th width={{ xl: '128px', base: '66px' }}>To</Th>
          <Th width="18%" isNumeric>
            <Link onClick={ sort('val') } display="flex" justifyContent="end">
              { sorting === 'val-asc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(-90deg)"/> }
              { sorting === 'val-desc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(90deg)"/> }
              { `Value ${ appConfig.network.currency.symbol }` }
            </Link>
          </Th>
          <Th width="18%" isNumeric pr={ 5 }>
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
          <TxsNewItemNotice borderRadius={ 0 }>
            { ({ content }) => <Tr><Td colSpan={ 10 } p={ 0 }>{ content }</Td></Tr> }
          </TxsNewItemNotice>
        ) }
        { txs.map((item) => (
          <TxsTableItem
            key={ item.hash }
            tx={ item }
            showBlockInfo={ showBlockInfo }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default TxsTable;
