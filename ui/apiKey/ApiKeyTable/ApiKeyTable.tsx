import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';
import React from 'react';

import type { TApiKey, TApiKeyItem } from 'data/apiKey';

import ApiKeyTableItem from './ApiKeyTableItem';

interface Props {
  data: TApiKey;
  onEditClick: (data: TApiKeyItem) => void;
  onDeleteClick: (data: TApiKeyItem) => void;
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
              key={ item.token }
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
