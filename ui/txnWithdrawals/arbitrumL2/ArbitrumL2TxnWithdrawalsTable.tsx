import { Tbody, Tr, Thead, Table, Th } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';

import ArbitrumL2TxnWithdrawalsTableItem from './ArbitrumL2TxnWithdrawalsTableItem';

interface Props {
  data: Array<ArbitrumL2TxnWithdrawalsItem>;
  isLoading: boolean;
}

const ArbitrumL2TxnWithdrawalsTable = ({ data, isLoading }: Props) => {
  return (
    <Table minW="900px">
      <Thead>
        <Tr>
          <Th width="25%">Message #</Th>
          <Th width="25%">Receiver</Th>
          <Th width="25%" isNumeric>Value</Th>
          <Th width="25%">Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <ArbitrumL2TxnWithdrawalsTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsTable);
