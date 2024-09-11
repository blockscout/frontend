import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { TransactionTags, TransactionTag } from 'types/api/account';

import TheadSticky from 'ui/shared/TheadSticky';

import TransactionTagTableItem from './TransactionTagTableItem';

interface Props {
  data?: TransactionTags;
  isLoading: boolean;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
  top: number;
}

const AddressTagTable = ({ data, isLoading, onDeleteClick, onEditClick, top }: Props) => {
  return (
    <Table variant="simple" minWidth="600px">
      <TheadSticky top={ top }>
        <Tr>
          <Th width="75%">Transaction</Th>
          <Th width="25%">Private tag</Th>
          <Th width="108px"></Th>
        </Tr>
      </TheadSticky>
      <Tbody>
        { data?.map((item, index) => (
          <TransactionTagTableItem
            key={ item.id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressTagTable;
