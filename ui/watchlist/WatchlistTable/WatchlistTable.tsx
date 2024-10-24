import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import React from 'react';

import type { WatchlistAddress } from 'types/api/account';

import TheadSticky from 'ui/shared/TheadSticky';

import WatchlistTableItem from './WatchListTableItem';

interface Props {
  data?: Array<WatchlistAddress>;
  isLoading?: boolean;
  onEditClick: (data: WatchlistAddress) => void;
  onDeleteClick: (data: WatchlistAddress) => void;
  top: number;
  hasEmail: boolean;
}

const WatchlistTable = ({ data, isLoading, onDeleteClick, onEditClick, top, hasEmail }: Props) => {
  return (
    <Table minWidth="600px">
      <TheadSticky top={ top }>
        <Tr>
          <Th width="70%">Address</Th>
          <Th width="30%">Private tag</Th>
          <Th width="160px">Email notification</Th>
          <Th width="108px"></Th>
        </Tr>
      </TheadSticky>
      <Tbody>
        { data?.map((item, index) => (
          <WatchlistTableItem
            key={ item.address_hash + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            hasEmail={ hasEmail }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default WatchlistTable;
