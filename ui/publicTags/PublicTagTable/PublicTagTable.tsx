import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';
import React from 'react';

import type { PublicTags, PublicTag } from 'types/api/account';

import PublicTagTableItem from './PublicTagTableItem';

interface Props {
  data: PublicTags;
  onEditClick: (data: PublicTag) => void;
  onDeleteClick: (data: PublicTag) => void;
}

const PublicTagTable = ({ data, onEditClick, onDeleteClick }: Props) => {
  return (
    <TableContainer width="100%">
      <Table variant="simple" minWidth="600px">
        <Thead>
          <Tr>
            <Th width="50%">Smart contract / Address (0x...)</Th>
            <Th width="25%">Public tag</Th>
            <Th width="25%">Request status</Th>
            <Th width="108px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item) => (
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
