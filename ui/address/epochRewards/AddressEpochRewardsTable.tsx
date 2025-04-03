import React from 'react';

import type { AddressEpochRewardsItem } from 'types/api/address';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import AddressEpochRewardsTableItem from './AddressEpochRewardsTableItem';

 type Props = {
   items: Array<AddressEpochRewardsItem>;
   isLoading?: boolean;
   top: number;
 };

const AddressEpochRewardsTable = ({ items, isLoading, top }: Props) => {
  return (
    <TableRoot minW="1000px" style={{ tableLayout: 'auto' }}>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Block</TableColumnHeader>
          <TableColumnHeader>Reward type</TableColumnHeader>
          <TableColumnHeader>Associated address</TableColumnHeader>
          <TableColumnHeader isNumeric>Value</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => {
          return (
            <AddressEpochRewardsTableItem
              key={ item.block_hash + item.type + item.account.hash + item.associated_account.hash + (isLoading ? String(index) : '') }
              item={ item }
              isLoading={ isLoading }
            />
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default AddressEpochRewardsTable;
