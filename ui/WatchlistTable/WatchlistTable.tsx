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
      <Table variant="simple" minWidth="600px">
        <Thead>
          <Tr>
            <Th width="70%" overflow="hidden">Address</Th>
            <Th width="30%" overflow="hidden">Private tag</Th>
            <Th width="108px" overflow="hidden">Notification</Th>
            <Th width="108px" overflow="hidden"></Th>
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
