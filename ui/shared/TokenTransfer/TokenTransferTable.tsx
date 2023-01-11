import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import { default as Thead } from 'ui/shared/TheadSticky';
import TokenTransferTableItem from 'ui/shared/TokenTransfer/TokenTransferTableItem';
import TxsNewItemNotice from 'ui/txs/TxsNewItemNotice';

interface Props {
  data: Array<TokenTransfer>;
  baseAddress?: string;
  showTxInfo?: boolean;
  top: number;
  enableTimeIncrement?: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
}

const TokenTransferTable = ({
  data,
  baseAddress,
  showTxInfo,
  top,
  enableTimeIncrement,
  showSocketInfo,
  socketInfoAlert,
  socketInfoNum,
}: Props) => {

  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          { showTxInfo && <Th width="44px"></Th> }
          <Th width="185px">Token</Th>
          <Th width="160px">Token ID</Th>
          { showTxInfo && <Th width="25%">Txn hash</Th> }
          <Th width="25%">From</Th>
          { baseAddress && <Th width="50px" px={ 0 }/> }
          <Th width="25%">To</Th>
          <Th width="25%" isNumeric>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        { showSocketInfo && (
          <Tr>
            <Td colSpan={ 10 } p={ 0 }>
              <TxsNewItemNotice borderRadius={ 0 } pl="10px" url={ window.location.href } alert={ socketInfoAlert } num={ socketInfoNum }/>
            </Td>
          </Tr>
        ) }
        { data.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <TokenTransferTableItem { ...item } baseAddress={ baseAddress } showTxInfo={ showTxInfo } enableTimeIncrement={ enableTimeIncrement }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenTransferTable);
