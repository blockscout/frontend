import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { WatchlistAddress } from 'types/api/account';

import WatchlistTableItem from './WatchListTableItem';

interface Props {
  data?: Array<WatchlistAddress>;
  isLoading?: boolean;
  onEditClick: (data: WatchlistAddress) => void;
  onDeleteClick: (data: WatchlistAddress) => void;
}

const WatchlistTable = ({ data, isLoading, onDeleteClick, onEditClick }: Props) => {
  return (
    <Table variant="simple" minWidth="600px">
      <Thead>
        <Tr>
          <Th width="70%">Address</Th>
          <Th width="30%">Private tag</Th>
          <Th width="160px">Email notification</Th>
          <Th width="108px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { data?.map((item, index) => (
          <WatchlistTableItem
            key={ item.address_hash + (isLoading ? index : '') }
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

export default WatchlistTable;
