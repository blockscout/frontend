import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { TransactionTags, TransactionTag } from 'types/api/account';

import TransactionTagTableItem from './TransactionTagTableItem';

interface Props {
  data: TransactionTags;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const AddressTagTable = ({ data, onDeleteClick, onEditClick }: Props) => {
  return (
    <Table variant="simple" minWidth="600px">
      <Thead>
        <Tr>
          <Th width="75%">Transaction</Th>
          <Th width="25%">Private tag</Th>
          <Th width="108px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <TransactionTagTableItem
            item={ item }
            key={ item.id }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressTagTable;
