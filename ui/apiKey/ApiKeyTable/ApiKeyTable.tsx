import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { ApiKeys, ApiKey } from 'types/api/account';

import ApiKeyTableItem from './ApiKeyTableItem';

interface Props {
  data?: ApiKeys;
  isLoading?: boolean;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
  limit: number;
}

const ApiKeyTable = ({ data, isLoading, onDeleteClick, onEditClick, limit }: Props) => {
  return (
    <Table minWidth="600px">
      <Thead>
        <Tr>
          <Th>{ `API key token (limit ${ limit } keys)` }</Th>
          <Th width="108px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { data?.map((item, index) => (
          <ApiKeyTableItem
            key={ item.api_key + (isLoading ? index : '') }
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

export default ApiKeyTable;
