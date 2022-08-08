import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';
import React from 'react';

import type { AddressTags, AddressTag } from 'types/api/account';

import AddressTagTableItem from './AddressTagTableItem';

interface Props {
  data: AddressTags;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
}

const AddressTagTable = ({ data, onDeleteClick, onEditClick }: Props) => {
  return (
    <TableContainer width="100%">
      <Table variant="simple" minWidth="600px">
        <Thead>
          <Tr>
            <Th width="60%">Address</Th>
            <Th width="40%">Private tag</Th>
            <Th width="108px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item: AddressTag) => (
            <AddressTagTableItem
              item={ item }
              key={ item.id }
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
