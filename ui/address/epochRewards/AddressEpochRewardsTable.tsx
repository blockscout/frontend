import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressEpochRewardsItem } from 'types/api/address';

import { default as Thead } from 'ui/shared/TheadSticky';

import AddressEpochRewardsTableItem from './AddressEpochRewardsTableItem';

 type Props = {
   items: Array<AddressEpochRewardsItem>;
   isLoading?: boolean;
   top: number;
 };

const AddressEpochRewardsTable = ({ items, isLoading, top }: Props) => {
  return (
    <Table variant="simple" size="sm" minW="1000px" style={{ tableLayout: 'auto' }}>
      <Thead top={ top }>
        <Tr>
          <Th>Block</Th>
          <Th>Reward type</Th>
          <Th>Associated address</Th>
          <Th isNumeric>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => {
          return (
            <AddressEpochRewardsTableItem
              key={ item.block_hash + item.type + item.account.hash + item.associated_account.hash + (isLoading ? String(index) : '') }
              item={ item }
              isLoading={ isLoading }
            />
          );
        }) }
      </Tbody>
    </Table>
  );
};

export default AddressEpochRewardsTable;
