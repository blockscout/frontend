import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react'

import type { TPrivateTagsAddress, TPrivateTagsAddressItem } from '../../../data/privateTagsAddress';

import AddressTagTableItem from './AddressTagTableItem';

interface Props {
  data: TPrivateTagsAddress;
  onEditClick: (data: TPrivateTagsAddressItem) => void;
  onDeleteClick: (data: TPrivateTagsAddressItem) => void;
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
          { data.map((item) => (
            <AddressTagTableItem
              item={ item }
              key={ item.address }
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
