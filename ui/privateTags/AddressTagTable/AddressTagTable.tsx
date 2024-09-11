import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { AddressTags, AddressTag } from 'types/api/account';

import TheadSticky from 'ui/shared/TheadSticky';

import AddressTagTableItem from './AddressTagTableItem';

interface Props {
  data?: AddressTags;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading: boolean;
  top: number;
}

const AddressTagTable = ({ data, onDeleteClick, onEditClick, isLoading, top }: Props) => {
  return (
    <Table variant="simple" minWidth="600px">
      <TheadSticky top={ top }>
        <Tr>
          <Th width="60%">Address</Th>
          <Th width="40%">Private tag</Th>
          <Th width="116px"></Th>
        </Tr>
      </TheadSticky>
      <Tbody>
        { data?.map((item: AddressTag, index: number) => (
          <AddressTagTableItem
            item={ item }
            key={ item.id + (isLoading ? String(index) : '') }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressTagTable;
