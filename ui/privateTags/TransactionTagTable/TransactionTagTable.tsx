import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react'

import type { TPrivateTagsTransaction, TPrivateTagsTransactionItem } from '../../../data/privateTagsTransaction';

import TransactionTagTableItem from './TransactionTagTableItem';

interface Props {
  data: TPrivateTagsTransaction;
  onEditClick: (data: TPrivateTagsTransactionItem) => void;
  onDeleteClick: (data: TPrivateTagsTransactionItem) => void;
}

const AddressTagTable = ({ data, onDeleteClick, onEditClick }: Props) => {
  return (
    <TableContainer width="100%">
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
              key={ item.transaction }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default AddressTagTable;
