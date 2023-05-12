import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { PublicTags, PublicTag } from 'types/api/account';

import PublicTagTableItem from './PublicTagTableItem';

interface Props {
  data?: PublicTags;
  isLoading?: boolean;
  onEditClick: (data: PublicTag) => void;
  onDeleteClick: (data: PublicTag) => void;
}

const PublicTagTable = ({ data, isLoading, onEditClick, onDeleteClick }: Props) => {
  return (
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
        { data?.map((item, index) => (
          <PublicTagTableItem
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

export default PublicTagTable;
