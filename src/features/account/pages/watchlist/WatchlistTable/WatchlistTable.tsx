// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { WatchlistAddress } from 'src/features/account/types/api';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import WatchlistTableItem from './WatchListTableItem';

interface Props {
  data?: Array<WatchlistAddress>;
  isLoading?: boolean;
  onEditClick: (data: WatchlistAddress) => void;
  onDeleteClick: (data: WatchlistAddress) => void;
  top: number;
  hasEmail: boolean;
}

const getBaseKey = (item: WatchlistAddress): string => item.address_hash;

const WatchlistTable = ({ data, isLoading, onDeleteClick, onEditClick, top, hasEmail }: Props) => {
  const keys = useUniqueKeys(data, getBaseKey);

  return (
    <TableRoot minWidth="800px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="70%">Address</TableColumnHeader>
          <TableColumnHeader width="30%">Private tag</TableColumnHeader>
          <TableColumnHeader width="160px">Email notification</TableColumnHeader>
          <TableColumnHeader width="108px"></TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data?.map((item, index) => (
          <WatchlistTableItem
            key={ keys[index] }
            item={ item }
            isLoading={ isLoading }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            hasEmail={ hasEmail }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default WatchlistTable;
