import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { AddressTags, AddressTag } from 'types/api/account';

import AddressTagTableItem from './AddressTagTableItem';

interface Props {
  data?: AddressTags;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading: boolean;
}

const AddressTagTable = ({ data, onDeleteClick, onEditClick, isLoading }: Props) => {
  return (
    <Table variant="simple" minWidth="600px">
      <Thead>
        <Tr>
          <Th width="60%">Address</Th>
          <Th width="40%">Private tag</Th>
          <Th width="116px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { data?.map((item: AddressTag, index: number) => (
          <AddressTagTableItem
            item={ item }
            key={ item.id + (isLoading ? index : '') }
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
