import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react'

import type { TWatchlist, TWatchlistItem } from '../../data/watchlist';

import WatchlistTableItem from './WatchListTableItem';

interface Props {
  data: TWatchlist;
  onEditClick: (data: TWatchlistItem) => void;
  onDeleteClick: (data: TWatchlistItem) => void;
}

const WatchlistTable = ({ data, onDeleteClick, onEditClick }: Props) => {
  return (
    <TableContainer width="100%">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th>Private tag</Th>
            <Th>Notification</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item) => (
            <WatchlistTableItem
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

export default WatchlistTable;
