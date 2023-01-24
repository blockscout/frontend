import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import appConfig from 'configs/app/config';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressesTableItem from './AddressesTableItem';

interface Props {
  items: Array<AddressesItem>;
  totalSupply: string;
  pageStartIndex: number;
}

const AddressesTable = ({ items, totalSupply, pageStartIndex }: Props) => {
  const hasPercentage = Boolean(totalSupply && totalSupply !== '0');
  return (
    <Table variant="simple" size="sm">
      <Thead top={ 80 }>
        <Tr>
          <Th width="64px">Rank</Th>
          <Th width={ hasPercentage ? '30%' : '40%' }>Address</Th>
          <Th width="20%" pl={ 10 }>Public tag</Th>
          <Th width={ hasPercentage ? '20%' : '25%' } isNumeric>{ `Balance ${ appConfig.network.currency.symbol }` }</Th>
          { hasPercentage && <Th width="15%" isNumeric>Percentage</Th> }
          <Th width="15%" isNumeric>Txn count</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <AddressesTableItem
            key={ item.hash }
            item={ item }
            totalSupply={ totalSupply }
            index={ pageStartIndex + index }
            hasPercentage={ hasPercentage }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressesTable;
