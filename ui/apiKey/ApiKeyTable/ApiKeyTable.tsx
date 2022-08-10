import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';
import React from 'react';

import type { ApiKeys, ApiKey } from 'types/api/account';

import ApiKeyTableItem from './ApiKeyTableItem';

interface Props {
  data: ApiKeys;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
  limit: number;
}

const ApiKeyTable = ({ data, onDeleteClick, onEditClick, limit }: Props) => {
  return (
    <TableContainer width="100%">
      <Table variant="simple" minWidth="600px">
        <Thead>
          <Tr>
            <Th>{ `API key token (limit ${ limit } keys)` }</Th>
            <Th width="108px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item) => (
            <ApiKeyTableItem
              item={ item }
              key={ item.api_key }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ApiKeyTable;
