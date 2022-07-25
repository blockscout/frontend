import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react'

import type { TPublicTagItem, TPublicTags } from 'data/publicTags';

import PublicTagTableItem from './PublicTagTableItem';

interface Props {
  data: TPublicTags;
  onEditClick: (data: TPublicTagItem) => void;
  onDeleteClick: (data: TPublicTagItem) => void;
}

const PublicTagTable = ({ data, onEditClick, onDeleteClick }: Props) => {
  return (
    <TableContainer width="100%">
      <Table variant="simple" minWidth="600px">
        <Thead>
          <Tr>
            <Th width="60%">Smart contract / Address (0x...)</Th>
            <Th width="40%">Public tag</Th>
            <Th width="200px">Submission date</Th>
            <Th width="108px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item: TPublicTagItem) => (
            <PublicTagTableItem
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

export default PublicTagTable;
