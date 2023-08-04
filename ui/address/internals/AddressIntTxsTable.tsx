import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressIntTxsTableItem from './AddressIntTxsTableItem';

interface Props {
  data: Array<InternalTransaction>;
  currentAddress: string;
  isLoading?: boolean;
}

const AddressIntTxsTable = ({ data, currentAddress, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ 80 }>
        <Tr>
          <Th width="15%">Parent txn hash</Th>
          <Th width="15%">Type</Th>
          <Th width="10%">Block</Th>
          <Th width="20%">From</Th>
          <Th width="48px" px={ 0 }/>
          <Th width="20%">To</Th>
          <Th width="20%" isNumeric>
            Value { config.chain.currency.symbol }
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <AddressIntTxsTableItem
            key={ item.transaction_hash + '_' + index }
            { ...item }
            currentAddress={ currentAddress }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressIntTxsTable;
